import { useState } from 'react'

export default function PromptModal({ isOpen, title, message, placeholder, onClose, onSubmit }) {
  const [value, setValue] = useState('')

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      setValue('')
    }
  }

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: 'var(--color-surface, #fff)', color: 'var(--color-text, #333)', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '1.25rem' }}>{title}</h3>
        {message && <p style={{ marginBottom: '16px', fontSize: '0.95rem', color: 'var(--color-text-muted, #666)' }}>{message}</p>}
        <textarea 
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border, #e0e0e0)', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}
          placeholder={placeholder}
          value={value}
          onChange={e => setValue(e.target.value)}
          autoFocus
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
          <button 
            type="button" 
            className="btn btn--outline" 
            onClick={() => { setValue(''); onClose() }}
          >
            Hủy
          </button>
          <button 
            type="button" 
            className="btn btn--primary" 
            onClick={() => { onSubmit(value); setValue(''); }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  )
}
