import { supabase } from '../lib/supabase'
import { logError } from '../utils/logger'

/**
 * Gửi thông tin liên hệ từ trang Liên Hệ
 * @param {Object} formData 
 * @param {string} formData.name
 * @param {string} formData.email
 * @param {string} formData.subject
 * @param {string} formData.message
 * @returns {Promise<{data: any, error: any}>}
 */
export async function submitContactForm(formData) {
  if (!supabase) {
    return { data: null, error: new Error('Supabase chưa được khởi tạo') }
  }

  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }
      ])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    logError('[contactService] Lỗi gửi form liên hệ:', error)
    return { data: null, error }
  }
}
