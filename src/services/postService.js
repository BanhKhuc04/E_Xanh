import { logError } from '../utils/logger'
import { supabase } from '../lib/supabase'
import { validateImageFile, createSafeFileName } from '../utils/fileValidation'
import {
  compressImageToWebp,
  isCompressibleImageType,
} from '../utils/imageCompress'

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 6)
}

export async function checkRecentPostRateLimit(userId) {
  if (!userId) {
    return {
      allowed: false,
      error: new Error('Thiếu thông tin người dùng để kiểm tra tần suất đăng bài.'),
    }
  }

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000

  const { data, error } = await supabase
    .from('posts')
    .select('id, created_at')
    .eq('author_id', userId)
    .gte('created_at', oneDayAgo)
    .order('created_at', { ascending: false })

  if (error) {
    return { allowed: true, error }
  }

  const recentPosts = data || []
  const postsInLastTenMinutes = recentPosts.filter((post) => {
    const createdAt = new Date(post.created_at).getTime()
    return Number.isFinite(createdAt) && createdAt >= tenMinutesAgo
  }).length

  const postsInLastDay = recentPosts.length

  return {
    allowed: postsInLastTenMinutes < 3 && postsInLastDay < 20,
    postsInLastTenMinutes,
    postsInLastDay,
    error: null,
  }
}

export async function uploadPostImage(file, userId) {
  const validation = validateImageFile(file)
  if (!validation.valid) {
    return { publicUrl: null, error: new Error(validation.error) }
  }

  let uploadFile = file

  if (isCompressibleImageType(file)) {
    try {
      uploadFile = await compressImageToWebp(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.75,
        maxBytes: 500 * 1024,
        minQuality: 0.6,
      })
    } catch (error) {
      logError('Image compression failed, using original post image.', error)
    }
  }

  const safeFileName = createSafeFileName(uploadFile, 'post')
  const path = `posts/${userId}/${safeFileName}`

  const { error } = await supabase.storage
    .from('post-images')
    .upload(path, uploadFile, {
      cacheControl: '31536000',
      contentType: uploadFile.type || file.type,
      upsert: false,
    })

  if (error) {
    return { publicUrl: null, error }
  }

  const { data: publicUrlData } = supabase.storage
    .from('post-images')
    .getPublicUrl(path)

  return { publicUrl: publicUrlData.publicUrl, error: null }
}

export async function uploadPostInlineImage(file, userId) {
  const validation = validateImageFile(file, {
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    invalidTypeMessage: 'Ảnh trong nội dung chỉ nhận JPG, PNG hoặc WEBP.',
    sizeMessage: 'Ảnh trong nội dung không được vượt quá 5MB.',
  })
  if (!validation.valid) {
    return { publicUrl: null, error: new Error(validation.error) }
  }

  let uploadFile = file

  if (isCompressibleImageType(file)) {
    try {
      uploadFile = await compressImageToWebp(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.75,
        maxBytes: 500 * 1024,
        minQuality: 0.6,
      })
    } catch (error) {
      logError('Inline image compression failed, using original image.', error)
    }
  }

  const safeFileName = createSafeFileName(uploadFile, 'post-inline')
  const path = `posts/${userId}/inline/${safeFileName}`

  const { error } = await supabase.storage
    .from('post-images')
    .upload(path, uploadFile, {
      cacheControl: '31536000',
      contentType: uploadFile.type || file.type,
      upsert: false,
    })

  if (error) {
    return { publicUrl: null, error }
  }

  const { data } = supabase.storage
    .from('post-images')
    .getPublicUrl(path)

  return { publicUrl: data.publicUrl, error: null }
}

export async function createPost(postData) {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !sessionData.session) {
    return { data: null, error: new Error('Bạn cần đăng nhập để tạo bài viết') }
  }

  const userId = sessionData.session.user.id
  const slug = generateSlug(postData.title)

  const normalizedTypeMap = {
    'Mẹo tiết kiệm': 'tip',
    'Cộng đồng': 'community',
    'Chia sẻ cộng đồng': 'community',
    'Hỏi đáp': 'qa',
    'Review thiết bị': 'review',
    'tip': 'tip',
    'community': 'community',
    'qa': 'qa',
    'review': 'review',
  }
  
  const validType = normalizedTypeMap[postData.type] || 'community'

  let imageUrl = null

  if (postData.coverFile) {
    const { publicUrl, error: uploadError } = await uploadPostImage(postData.coverFile, userId)
    if (uploadError) {
      logError('Debug: Error uploading image:', uploadError?.message || uploadError)
      return { data: null, error: new Error('Lỗi tải ảnh lên: ' + uploadError.message) }
    }
    imageUrl = publicUrl
  } else if (postData.image_url) {
    imageUrl = postData.image_url
  }

  const payload = {
    author_id: userId,
    title: postData.title,
    slug: slug,
    description: postData.description,
    content: postData.content,
    type: validType,
    status: postData.status || 'pending',
    image_url: imageUrl,
    // category_id: mapped if possible, null for now since form category is text
  }

  const { data, error } = await supabase
    .from('posts')
    .insert([payload])
    .select()
    .single()

  if (error) {
    logError('Debug: Error inserting post:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
    })
  }

  return { data, error }
}

export async function getAllAdminPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (name)
    `)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getPendingPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(`*, profiles:author_id (name)`)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getApprovedPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(`*, profiles:author_id (name, avatar_url)`)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getTipPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(`*, profiles:author_id (name, avatar_url, bio, role)`)
    .eq('status', 'approved')
    .eq('type', 'tip')
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getPostBySlug(slug) {
  const { data, error } = await supabase
    .from('posts')
    .select(`*, profiles:author_id (name, avatar_url, bio, role)`)
    .eq('slug', slug)
    .single()

  return { data, error }
}

export async function getPostById(id) {
  const { data, error } = await supabase
    .from('posts')
    .select(`*, profiles:author_id (name, avatar_url, bio, role)`)
    .eq('id', id)
    .single()

  return { data, error }
}

export async function getCommunityPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *, 
      profiles:author_id (name, avatar_url, role)
    `)
    .eq('status', 'approved')
    .eq('type', 'community')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getRecentCommunityPosts(limitCount = 2) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *, 
      profiles:author_id (name, avatar_url, role)
    `)
    .eq('status', 'approved')
    .eq('type', 'community')
    .order('created_at', { ascending: false })
    .limit(limitCount)

  return { data, error }
}

export async function getTopActiveMembers(limitCount = 3) {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('author_id')
    .eq('status', 'approved')

  if (error) return { data: null, error }

  const counts = {}
  posts.forEach(p => {
    if (p.author_id) {
      counts[p.author_id] = (counts[p.author_id] || 0) + 1
    }
  })

  const topIds = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limitCount)
    .map(entry => entry[0])

  if (topIds.length === 0) return { data: [], error: null }

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, name, avatar_url')
    .in('id', topIds)

  if (profileError) return { data: null, error: profileError }

  const result = topIds.map(id => {
    const profile = profiles.find(p => p.id === id) || { name: 'Ẩn danh', avatar_url: null }
    return {
      id,
      name: profile.name || 'Ẩn danh',
      avatar_url: profile.avatar_url,
      approved_posts_count: counts[id]
    }
  })

  return { data: result, error: null }
}

export async function getFeaturedPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(`*, profiles:author_id (name, avatar_url, bio, role)`)
    .eq('status', 'approved')
    .eq('type', 'tip')
    .order('likes_count', { ascending: false })
    .limit(3)

  return { data, error }
}

export async function getMyPosts(userId) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}


export async function updatePostStatus(postId, status, adminNote = null) {
  const updatePayload = { status }
  
  if (adminNote !== null && status === 'rejected') {
    updatePayload.rejection_reason = adminNote
  }

  const { data, error } = await supabase
    .from('posts')
    .update(updatePayload)
    .eq('id', postId)
    .select()

  if (!error && (!data || data.length === 0)) {
    return { data: null, error: new Error('Không tìm thấy bài viết hoặc bạn không có quyền cập nhật.') }
  }

  return { data, error }
}

export async function approvePost(postId) {
  return updatePostStatus(postId, 'approved')
}

export async function rejectPost(postId, adminNote) {
  return updatePostStatus(postId, 'rejected', adminNote)
}

export async function blockPost(postId) {
  return updatePostStatus(postId, 'blocked')
}


export async function updatePost(postId, postData) {
  const normalizedTypeMap = {
    'Mẹo tiết kiệm': 'tip',
    'Cộng đồng': 'community',
    'Chia sẻ cộng đồng': 'community',
    'Hỏi đáp': 'qa',
    'Review thiết bị': 'review',
    'tip': 'tip',
    'community': 'community',
    'qa': 'qa',
    'review': 'review',
  }
  
  const payload = {
    title: postData.title,
    description: postData.description,
    content: postData.content,
  }

  if (postData.type) {
    payload.type = normalizedTypeMap[postData.type] || 'community'
  }

  if (postData.status) {
    payload.status = postData.status
  }

  // Nếu có ảnh mới upload
  if (postData.coverFile) {
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData?.session) {
      const { publicUrl, error: uploadError } = await uploadPostImage(postData.coverFile, sessionData.session.user.id)
      if (!uploadError) {
        payload.image_url = publicUrl
      }
    }
  } else if (postData.image_url !== undefined) {
    payload.image_url = postData.image_url || null
  }

  const { data, error } = await supabase
    .from('posts')
    .update(payload)
    .eq('id', postId)
    .select()

  return { data, error }
}

export async function deletePost(postId) {
  const { data, error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  return { data, error }
}
