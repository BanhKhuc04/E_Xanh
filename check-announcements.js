import { evaluateAnnouncementVisibility } from './src/utils/announcementTime.js'

const announcement = {
  id: '84c8bbb4-91dc-4741-bf5b-29744ce8f52b',
  is_active: true,
  start_at: '2026-06-15T19:44:00+00:00',
  end_at: '2026-06-19T19:44:00+00:00'
}

const nowMs = Date.now()
const result = evaluateAnnouncementVisibility(announcement, nowMs)

console.log('Current time Ms:', nowMs)
console.log('Visibility:', result)
