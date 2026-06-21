import { useCallback, useState } from 'react'
import { getSystemNotificationHistory, revokeSystemNotification } from '../../../services/adminNotificationService'

export function useNotificationHistory(showToast) {
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState('')
  const [revokingBatchId, setRevokingBatchId] = useState('')

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true)
    const { data, error } = await getSystemNotificationHistory()

    if (error) {
      setHistory([])
      setHistoryError(error.message)
    } else {
      setHistory(data || [])
      setHistoryError('')
    }

    setHistoryLoading(false)
  }, [])

  async function handleRevoke(batchId) {
    if (!window.confirm('Thu hồi batch này sẽ ẩn toàn bộ thông báo khỏi chuông người dùng. Bạn có chắc chắn không?')) {
      return
    }

    setRevokingBatchId(batchId)
    const { error } = await revokeSystemNotification(batchId)

    if (error) {
      showToast(error.message, 'error')
    } else {
      showToast('Đã thu hồi batch thông báo.')
      await loadHistory()
    }

    setRevokingBatchId('')
  }

  return {
    history,
    historyLoading,
    historyError,
    revokingBatchId,
    loadHistory,
    handleRevoke
  }
}
