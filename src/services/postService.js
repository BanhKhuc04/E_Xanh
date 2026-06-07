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
    status: 'pending',
    image_url: imageUrl,
    // category_id: mapped if possible, null for now since form category is text
  }

  console.log('Debug: Inserting payload', payload)

  const { data, error } = await supabase
    .from('posts')
    .insert(payload)
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

export async function getPostBySlug(slug) {
  const { data, error } = await supabase
    .from('posts')
    .select(`*, profiles:author_id (name, avatar_url, bio)`)
    .eq('slug', slug)
    .single()

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

  return { data, error }
}

export async function approvePost(postId) {
  return updatePostStatus(postId, 'approved')
}

export async function rejectPost(postId, adminNote) {
  return updatePostStatus(postId, 'rejected', adminNote)
}

export async function hidePost(postId) {
  return updatePostStatus(postId, 'hidden')
}

// Dùng tạm để debug, xem bài mới nhất có vào db thật không
export async function debugListRecentPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
  
  if (error) {
    console.error('Debug: Error fetching recent posts', error)
  } else {
    console.log('Debug: 10 Recent Posts:', data)
  }
  return data
}
