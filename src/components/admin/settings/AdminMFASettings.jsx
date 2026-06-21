import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

export default function AdminMFASettings() {
  const [factors, setFactors] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [factorId, setFactorId] = useState(null)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    loadFactors()
  }, [])

  async function loadFactors() {
    setLoading(true)
    const { data, error } = await supabase.auth.mfa.listFactors()
    if (!error && data?.totp) {
      setFactors(data.totp.filter(f => f.status === 'verified'))
    }
    setLoading(false)
  }

  async function handleEnroll() {
    setEnrolling(true)
    setErrorMsg('')
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
    })

    if (error) {
      setErrorMsg('Lỗi thiết lập 2FA: ' + error.message)
      setEnrolling(false)
      return
    }

    setFactorId(data.id)
    setQrCodeUrl(data.totp.uri)
    setEnrolling(false)
  }

  async function handleVerify() {
    setErrorMsg('')
    setSuccessMsg('')
    if (!otpCode || otpCode.length < 6) {
      setErrorMsg('Vui lòng nhập đúng mã 6 số.')
      return
    }

    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId,
    })

    if (challengeError) {
      setErrorMsg('Lỗi tạo challenge: ' + challengeError.message)
      return
    }

    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code: otpCode,
    })

    if (error) {
      setErrorMsg('Mã không hợp lệ. Vui lòng thử lại.')
      return
    }

    setSuccessMsg('Thiết lập 2FA thành công!')
    setFactorId(null)
    setQrCodeUrl('')
    setOtpCode('')
    loadFactors()
  }

  async function handleUnenroll(id) {
    const confirm = window.confirm('Bạn có chắc chắn muốn gỡ bỏ 2FA không?')
    if (!confirm) return
    const { error } = await supabase.auth.mfa.unenroll({ factorId: id })
    if (error) {
      console.error('[AdminMFA] Lỗi khi gỡ 2FA:', error)
      setErrorMsg('Không thể gỡ 2FA lúc này. Vui lòng thử lại.')
      setTimeout(() => setErrorMsg(''), 5000)
    } else {
      loadFactors()
    }
  }

  if (loading) {
    return <p className="st-card__helper">Đang kiểm tra trạng thái 2FA...</p>
  }

  return (
    <div style={{ marginTop: '16px' }}>
      {factors.length > 0 ? (
        <div>
          <p style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓ Xác minh 2 bước đã được bật</p>
          <button type="button" className="btn btn--outline" onClick={() => handleUnenroll(factors[0].id)} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            Tắt 2FA
          </button>
        </div>
      ) : (
        <div>
          {!factorId ? (
            <button type="button" className="btn btn--primary" onClick={handleEnroll} disabled={enrolling}>
              {enrolling ? 'Đang tạo mã...' : 'Bật 2FA ngay'}
            </button>
          ) : (
            <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <p>1. Quét mã QR này bằng ứng dụng Authenticator (Google Authenticator, Authy...)</p>
              <div style={{ margin: '16px 0' }}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`} alt="QR Code" />
              </div>
              <p>2. Nhập mã 6 số từ ứng dụng để xác nhận:</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <input
                  type="text"
                  className="st-card__input"
                  placeholder="Ví dụ: 123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  style={{ width: '150px' }}
                />
                <button type="button" className="btn btn--primary" onClick={handleVerify}>
                  Xác nhận
                </button>
              </div>
              {errorMsg && <p style={{ color: 'var(--color-danger)', marginTop: '8px' }}>{errorMsg}</p>}
            </div>
          )}
          {successMsg && <p style={{ color: 'var(--color-success)', marginTop: '8px' }}>{successMsg}</p>}
        </div>
      )}
    </div>
  )
}
