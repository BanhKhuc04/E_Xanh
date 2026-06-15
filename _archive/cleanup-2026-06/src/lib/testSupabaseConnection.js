import { supabase } from './supabase'

/**
 * Test kết nối Supabase bằng cách query bảng categories.
 * Chỉ dùng để debug — không gọi trong production UI.
 *
 * Cách sử dụng:
 *   import { testSupabaseConnection } from './lib/testSupabaseConnection'
 *   testSupabaseConnection()
 */
export async function testSupabaseConnection() {
  if (!supabase) {
    console.error('[E-XANH] Supabase client chưa được khởi tạo. Kiểm tra .env.local.')
    return
  }

  console.log('[E-XANH] Đang test kết nối Supabase...')

  const { data, error } = await supabase.from('categories').select('*').limit(5)

  if (error) {
    console.error('[E-XANH] Lỗi kết nối Supabase:', error.message)
  } else {
    console.log('[E-XANH] Kết nối thành công! Dữ liệu categories:', data)
  }
}
