import { logError } from '../utils/logger'
import { supabase } from '../lib/supabase'
import { getCurrentSession } from './authService'

export async function getVisibleDevices() {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('is_visible', true)
    .order('name')
  
  if (error) {
    logError('[E-XANH] Lỗi lấy danh sách thiết bị:', error?.message || error)
    return { data: null, error }
  }
  return { data, error: null }
}

export async function saveElectricityCheck({ summary, devices }) {
  const session = await getCurrentSession()
  if (!session?.user) {
    return { data: null, error: new Error('User not logged in') }
  }

  const { data: checkData, error: checkError } = await supabase
    .from('electricity_checks')
    .insert({
      user_id: session.user.id,
      total_kwh: summary.totalKwh,
      estimated_cost: summary.estimatedCost,
      highest_device: summary.topDevice?.name ?? '',
      saving_percent: summary.savingRange
    })
    .select()
    .single()

  if (checkError) {
    logError('[E-XANH] Lỗi lưu electricity_check:', checkError?.message || checkError)
    return { data: null, error: checkError }
  }

  const itemsPayload = devices.map(d => ({
    check_id: checkData.id,
    device_name: d.name,
    power: d.power,
    hours_per_day: d.hoursPerDay,
    days_per_month: d.daysPerMonth,
    kwh: d.kwh
  }))

  const { error: itemsError } = await supabase
    .from('electricity_check_items')
    .insert(itemsPayload)

  if (itemsError) {
    logError('[E-XANH] Lỗi lưu electricity_check_items:', itemsError?.message || itemsError)
    return { data: null, error: itemsError }
  }

  return { data: checkData, error: null }
}

export async function getMyElectricityChecks() {
  const session = await getCurrentSession()
  if (!session?.user) {
    return { data: null, error: new Error('User not logged in') }
  }

  const { data, error } = await supabase
    .from('electricity_checks')
    .select(`
      *,
      items:electricity_check_items(*)
    `)
    .eq('user_id', session.user.id)
    .order('checked_at', { ascending: false })

  if (error) {
    logError('[E-XANH] Lỗi lấy electricity_checks:', error?.message || error)
    return { data: null, error }
  }
  return { data, error: null }
}

export async function getElectricityCheckById(id) {
  const session = await getCurrentSession()
  if (!session?.user) {
    return { data: null, error: new Error('User not logged in') }
  }

  const { data, error } = await supabase
    .from('electricity_checks')
    .select(`
      *,
      items:electricity_check_items(*)
    `)
    .eq('id', id)
    .eq('user_id', session.user.id)
    .single()

  if (error) {
    logError('[E-XANH] Lỗi lấy chi tiết check:', error?.message || error)
    return { data: null, error }
  }
  return { data, error: null }
}

export async function deleteElectricityCheck(id) {
  const session = await getCurrentSession()
  if (!session?.user) {
    return { error: new Error('User not logged in') }
  }

  const { error } = await supabase
    .from('electricity_checks')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id)

  if (error) {
    logError('[E-XANH] Lỗi xóa electricity_check:', error?.message || error)
    return { error }
  }
  return { error: null }
}

export async function deleteAllElectricityChecks(userId) {
  const { error } = await supabase
    .from('electricity_checks')
    .delete()
    .eq('user_id', userId)

  if (error) {
    logError('[E-XANH] Error deleting all checks:', error.message)
    return { error }
  }
  return { error: null }
}
