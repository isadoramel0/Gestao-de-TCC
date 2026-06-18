const overlay = {
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 999,
}
const box = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  padding: 28,
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
}

export default function Modal({ title, onClose, onSave, children }) {
  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={box}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: 16 }}>{title}</span>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--muted)', fontSize: 20 }}>×</button>
        </div>
        {children}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'var(--surface2)', color: 'var(--text)' }}>Cancelar</button>
          <button onClick={onSave} style={{ background: 'var(--accent)', color: '#fff' }}>Salvar</button>
        </div>
      </div>
    </div>
  )
}
