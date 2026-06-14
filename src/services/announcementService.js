import { supabase } from '../lib/supabase'
import { getCurrentSession } from './authService'

function normalizeNullableValue(value) {
  if (value === '' || value === undefined) return null
  return value
}

export function filterActiveAnnouncements(announcements = []) {
  const now = Date.now()

  return announcements.filter((announcement) => {
    const startsAt = announcement.start_at ? new Date(announcement.start_at).getTime() : null
    const endsAt = announcement.end_at ? new Date(announcement.end_at).getTime() : null

    if (!announcement.is_active) return false
    if (Number.isFinite(startsAt) && startsAt > now) return false
    if (Number.isFinite(endsAt) && endsAt < now) return false
    return true
  })
}

export async function fetchWebsiteAnnouncements({ activeOnly = false } = {}) {
  let query = supabase
    .from('website_announcements')
    .select('*')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    return { data: [], error }
  }

  return {
    data: activeOnly ? filterActiveAnnouncements(data || []) : data || [],
    error: null,
  }
}

export async function createWebsiteAnnouncement(payload) {
  const session = await getCurrentSession()

  const { data, error } = await supabase
    .from('website_announcements')
    .insert([
      {
        ...payload,
        cta_label: normalizeNullableValue(payload.cta_label),
        cta_url: normalizeNullableValue(payload.cta_url),
        start_at: normalizeNullableValue(payload.start_at),
        end_at: normalizeNullableValue(payload.end_at),
        created_by: session?.user?.id || null,
      },
    ])
    .select()
    .single()

  return { data, error }
}

export async function updateWebsiteAnnouncement(id, payload) {
  const { data, error } = await supabase
    .from('website_announcements')
    .update({
      ...payload,
      cta_label: normalizeNullableValue(payload.cta_label),
      cta_url: normalizeNullableValue(payload.cta_url),
      start_at: normalizeNullableValue(payload.start_at),
      end_at: normalizeNullableValue(payload.end_at),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

export async function deleteWebsiteAnnouncement(id) {
  const { error } = await supabase
    .from('website_announcements')
    .delete()
    .eq('id', id)

  return { error }
}
