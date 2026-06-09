import { supabase } from '../lib/supabase'

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

export async function uploadPostImage(file, userId) {
  const safeFileName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase()
  const timestamp = new Date().getTime()
  const path = `posts/${userId}/${timestamp}-${safeFileName}`

  const { error } = await supabase.storage
    .from('post-images')
    .upload(path, file)

  if (error) {
    return { publicUrl: null, error }
  }

  const { data: publicUrlData } = supabase.storage
    .from('post-images')
    .getPublicUrl(path)

  return { publicUrl: publicUrlData.publicUrl, error: null }
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
      console.error('Debug: Error uploading image:', uploadError)
      return { data: null, error: new Error('Lỗi tải ảnh lên: ' + uploadError.message) }
    }
    imageUrl = publicUrl
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
    console.error('Debug: Error inserting post:', {
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
    .select(`
      *, 
      profiles:author_id (name, avatar_url, role)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(3)

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
