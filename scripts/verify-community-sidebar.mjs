import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createClient } from '@supabase/supabase-js'

const projectRoot = process.cwd()
const envLocalPath = path.join(projectRoot, '.env.local')
const hotfixPath = path.join(projectRoot, 'supabase', 'manual', 'community_sidebar_hotfix.sql')

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}

  const raw = fs.readFileSync(filePath, 'utf8')
  return raw
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => !line.trim().startsWith('#'))
    .reduce((accumulator, line) => {
      const equalIndex = line.indexOf('=')
      if (equalIndex === -1) return accumulator

      const key = line.slice(0, equalIndex).trim()
      const value = line.slice(equalIndex + 1).trim()
      accumulator[key] = value
      return accumulator
    }, {})
}

function logSection(title) {
  console.log(`\n=== ${title} ===`)
}

async function main() {
  const env = loadEnvFile(envLocalPath)
  const supabaseUrl = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY trong .env.local')
    process.exitCode = 1
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  logSection('Kiểm Tra community_active_members')
  const membersRes = await supabase
    .from('community_active_members')
    .select('id, name, avatar_url, post_count, latest_post_at')
    .limit(5)

  if (membersRes.error) {
    console.error('Lỗi community_active_members:', membersRes.error.message)
  } else {
    console.table(membersRes.data || [])
  }

  logSection('Kiểm Tra public_profiles')
  const profilesRes = await supabase
    .from('public_profiles')
    .select('id, name, avatar_url, profile_visibility')
    .limit(5)

  if (profilesRes.error) {
    console.error('Lỗi public_profiles:', profilesRes.error.message)
  } else {
    console.table(profilesRes.data || [])
  }

  logSection('Kiểm Tra community posts')
  const postsRes = await supabase
    .from('posts')
    .select('id, title, author_id, created_at')
    .eq('status', 'approved')
    .eq('type', 'community')
    .order('created_at', { ascending: false })
    .limit(5)

  if (postsRes.error) {
    console.error('Lỗi posts:', postsRes.error.message)
  } else {
    console.table(postsRes.data || [])
  }

  const membersMissing = Boolean(membersRes.error)
  const profilesEmpty = !profilesRes.error && (profilesRes.data || []).length === 0

  logSection('Chẩn Đoán')
  if (!membersMissing && !profilesEmpty) {
    console.log('Sidebar đã có đủ dữ liệu public. Refresh app để kiểm tra UI.')
    return
  }

  console.log('Live project vẫn chưa sẵn sàng cho sidebar active members.')
  if (membersMissing) {
    console.log('- View public.community_active_members chưa tồn tại hoặc chưa vào schema cache.')
  }
  if (profilesEmpty) {
    console.log('- View public.public_profiles đang trả rỗng cho anon/authenticated.')
  }

  console.log('\nChạy SQL hotfix này trong Supabase SQL Editor:')
  console.log(hotfixPath)
}

main().catch((error) => {
  console.error('verify-community-sidebar thất bại:', error)
  process.exitCode = 1
})
