import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[E-XANH] Thiếu biến môi trường Supabase.\n' +
      'Hãy tạo file .env.local từ .env.example và điền VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY.\n' +
      'Xem README.md phần "Nâng cấp Supabase backend" để biết chi tiết.',
  )
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null
