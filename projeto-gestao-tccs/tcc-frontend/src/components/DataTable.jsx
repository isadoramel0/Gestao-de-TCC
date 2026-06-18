import { useState } from 'react'

const s = {
  wrap: { background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' },
  header: { padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  title: { fontWeight: 600, fontSize: 16 },
  search: { width: 220 },
  addBtn: { background: 'var(--accent)', color: '#fff', whiteSpace: 'nowrap' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', background: 'var(--surface2)' },
  td: { padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: 14 },
  editBtn: { background: 'var(--surface2)', color: 'var(--accent)', marginRight: 6 },
  delBtn: { background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)' },
  empty: { padding: 40, textAlign: 'center', color: 'var(--muted)' },
}

export default function DataTable({ title, columns, data, searchKey, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState('')

  const filtered = data.filter(row =>
    searchKey ? String(row[searchKey] ?? '').toLowerCase().includes(search.toLowerCase()) : true
  )

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <span style={s.title}>{title}</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {searchKey && (
            <input
              style={s.search}
              placeholder="Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          )}
          {onAdd && (
            <button style={s.addBtn} onClick={onAdd}>+ Novo</button>
          )}
        </div>
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            {columns.map(c => <th key={c.key} style={s.th}>{c.label}</th>)}
            {(onEdit || onDelete) && <th style={s.th}>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={columns.length + 1} style={s.empty}>Nenhum registro encontrado.</td></tr>
          ) : filtered.map(row => (
            <tr key={row.id}>
              {columns.map(c => (
                <td key={c.key} style={s.td}>
                  {c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td style={s.td}>
                  {onEdit && <button style={s.editBtn} onClick={() => onEdit(row)}>Editar</button>}
                  {onDelete && <button style={s.delBtn} onClick={() => onDelete(row.id)}>Excluir</button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
