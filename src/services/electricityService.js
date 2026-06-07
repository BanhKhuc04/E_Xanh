import { supabase } from '../lib/supabase'
import { getCurrentSession } from './authService'

export async function getVisibleDevices() {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('is_visible', true)
    .order('name')
  
  if (error) {
    console.error('[E-XANH] Lỗi lấy danh sách thiết bị:', error)
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
    console.error('[E-XANH] Lỗi lưu electricity_check:', checkError)
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
    console.error('[E-XANH] Lỗi lưu electricity_check_items:', itemsError)
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
    console.error('[E-XANH] Lỗi lấy electricity_checks:', error)
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
    .single()

  if (error) {
    console.error('[E-XANH] Lỗi lấy chi tiết check:', error)
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
    console.error('[E-XANH] Lỗi xóa electricity_check:', error)
    return { error }
  }
  return { error: null }
}
