import { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import {
  getTccs, createTcc, updateTcc, deleteTcc,
  getAlunos, getProfessores,
} from '../../services/api'

// ── Choices espelhando o backend ────────────────────────────────
const STATUS = [
  { value: '0', label: 'Em Elaboração' },
  { value: '1', label: 'Enviado' },
  { value: '2', label: 'Aprovado' },
  { value: '3', label: 'Reprovado' },
]

const TIPOS = [
  { value: 'MONOGRAFIA', label: 'Monografia' },
  { value: 'RELATORIO_ESTAGIO', label: 'Relatório de Estágio' },
  { value: 'RELATORIO_TECNICO', label: 'Relatório Técnico' },
  { value: 'ARTIGO', label: 'Artigo' },
]

const IDIOMAS = [
  { value: 'PT', label: 'Português' },
  { value: 'EN', label: 'Inglês' },
]

const SEMESTRES = [
  '2020/1','2020/2','2021/1','2021/2','2022/1','2022/2',
  '2023/1','2023/2','2024/1','2024/2','2025/1','2025/2','2026/1',
]

const STATUS_COLORS = {
  '0': { bg: '#FEF9C3', color: '#854D0E' },
  '1': { bg: '#DBEAFE', color: '#1E40AF' },
  '2': { bg: '#DCFCE7', color: '#166534' },
  '3': { bg: '#FEE2E2', color: '#991B1B' },
}

const empty = {
  titulo: '', resumo: '', palavras_chave: '',
  tipo: '', idioma: '', status: '0',
  aluno: '', orientador: '', coorientador: '',
  presidente: '', primeiro_membro: '', segundo_membro: '',
  semestre_letivo_defesa: '',
  arquivo: null,
}

// ── Componente de aba ───────────────────────────────────────────
const tabStyle = (active) => ({
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: active ? 600 : 400,
  color: active ? 'var(--accent)' : 'var(--muted)',
  background: active ? 'var(--surface2)' : 'transparent',
  border: 'none',
  borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
  borderRadius: 0,
  cursor: 'pointer',
  transition: 'all 0.15s',
})

// ── Modal maior para TCC ────────────────────────────────────────
function TCCModal({ title, onClose, onSave, children }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, width: '100%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
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

// ── Campo helper ────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div>
    <label>{label}</label>
    {children}
  </div>
)

const Select = ({ value, onChange, options, placeholder = 'Selecione...' }) => (
  <select value={value} onChange={onChange}>
    <option value="">{placeholder}</option>
    {options.map(o => <option key={o.value ?? o.id} value={o.value ?? o.id}>{o.label ?? o.nome}</option>)}
  </select>
)

// ── Página principal ────────────────────────────────────────────
export default function TCCsPage() {
  const [data, setData] = useState([])
  const [alunos, setAlunos] = useState([])
  const [professores, setProfessores] = useState([])
  const [modal, setModal] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState(0)

  const load = async () => {
    const [tccs, al, pr] = await Promise.all([getTccs(), getAlunos(), getProfessores()])
    setData(tccs.data)
    setAlunos(al.data)
    setProfessores(pr.data)
  }
  useEffect(() => { load() }, [])

  // helpers de lookup
  const alunoNome = (id) => alunos.find(a => a.id === id)?.nome ?? '—'
  const profNome  = (id) => professores.find(p => p.id === id)?.nome ?? '—'
  const statusLabel = (v) => STATUS.find(s => s.value === v)?.label ?? v
  const tipoLabel   = (v) => TIPOS.find(t => t.value === v)?.label ?? v

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  const setFile = (e) => setForm(f => ({ ...f, arquivo: e.target.files[0] ?? null }))

  const openAdd = () => { setForm(empty); setEditId(null); setError(null); setTab(0); setModal(true) }
  const openEdit = (row) => {
    setForm({
      titulo: row.titulo, resumo: row.resumo, palavras_chave: row.palavras_chave,
      tipo: row.tipo, idioma: row.idioma, status: row.status,
      aluno: row.aluno, orientador: row.orientador,
      coorientador: row.coorientador ?? '',
      presidente: row.presidente, primeiro_membro: row.primeiro_membro,
      segundo_membro: row.segundo_membro,
      semestre_letivo_defesa: row.semestre_letivo_defesa ?? '',
      arquivo: null,
    })
    setEditId(row.id)
    setError(null)
    setTab(0)
    setModal(true)
  }

  const save = async () => {
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'arquivo') {
          if (v) fd.append(k, v)
        } else if (v !== '' && v !== null) {
          fd.append(k, v)
        }
      })
      if (editId) await updateTcc(editId, fd)
      else await createTcc(fd)
      setModal(false)
      load()
    } catch (err) {
      const d = err.response?.data
      if (d) {
        const msgs = Object.entries(d).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n')
        setError(msgs)
      }
    }
  }

  const remove = async () => {
    await deleteTcc(confirmId)
    setConfirmId(null)
    load()
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'titulo', label: 'Título' },
    { key: 'tipo', label: 'Tipo', render: (v) => tipoLabel(v) },
    { key: 'aluno', label: 'Aluno', render: (v) => alunoNome(v) },
    { key: 'orientador', label: 'Orientador', render: (v) => profNome(v) },
    {
      key: 'status', label: 'Status',
      render: (v) => {
        const c = STATUS_COLORS[v] ?? {}
        return (
          <span style={{ background: c.bg, color: c.color, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
            {statusLabel(v)}
          </span>
        )
      }
    },
  ]

  const profOpts = professores.map(p => ({ value: p.id, label: p.nome }))
  const semOpts  = SEMESTRES.map(s => ({ value: s, label: s }))

  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>TCCs</h1>
      <DataTable
        title="Listagem"
        columns={columns}
        data={data}
        searchKey="titulo"
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={(id) => setConfirmId(id)}
      />

      {/* ── Modal de criação/edição ── */}
      {modal && (
        <TCCModal title={editId ? 'Editar TCC' : 'Novo TCC'} onClose={() => setModal(false)} onSave={save}>

          {/* Abas */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
            {['Informações', 'Participantes', 'Banca'].map((t, i) => (
              <button key={i} style={tabStyle(tab === i)} onClick={() => setTab(i)}>{t}</button>
            ))}
          </div>

          {error && (
            <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, whiteSpace: 'pre-line' }}>
              {error}
            </div>
          )}

          {/* Aba 0 — Informações */}
          {tab === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Título">
                <input value={form.titulo} onChange={set('titulo')} placeholder="Título do TCC" />
              </Field>
              <Field label="Resumo">
                <textarea value={form.resumo} onChange={set('resumo')} rows={4} placeholder="Resumo do trabalho..." style={{ resize: 'vertical' }} />
              </Field>
              <Field label="Palavras-chave">
                <input value={form.palavras_chave} onChange={set('palavras_chave')} placeholder="Ex: machine learning, redes neurais" />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Tipo">
                  <Select value={form.tipo} onChange={set('tipo')} options={TIPOS} />
                </Field>
                <Field label="Idioma">
                  <Select value={form.idioma} onChange={set('idioma')} options={IDIOMAS} />
                </Field>
                <Field label="Status">
                  <Select value={form.status} onChange={set('status')} options={STATUS} />
                </Field>
                <Field label="Semestre de Defesa">
                  <Select value={form.semestre_letivo_defesa} onChange={set('semestre_letivo_defesa')} options={semOpts} placeholder="Nenhum" />
                </Field>
              </div>
              <Field label="Arquivo (PDF)">
                <input type="file" accept=".pdf" onChange={setFile} style={{ padding: '8px 0', border: 'none', borderRadius: 0 }} />
              </Field>
            </div>
          )}

          {/* Aba 1 — Participantes */}
          {tab === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Aluno">
                <Select
                  value={form.aluno}
                  onChange={set('aluno')}
                  options={alunos.map(a => ({ value: a.id, label: a.nome }))}
                />
              </Field>
              <Field label="Orientador">
                <Select value={form.orientador} onChange={set('orientador')} options={profOpts} />
              </Field>
              <Field label="Coorientador (opcional)">
                <Select value={form.coorientador} onChange={set('coorientador')} options={profOpts} placeholder="Nenhum" />
              </Field>
            </div>
          )}

          {/* Aba 2 — Banca */}
          {tab === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Presidente da Banca">
                <Select value={form.presidente} onChange={set('presidente')} options={profOpts} />
              </Field>
              <Field label="1º Membro">
                <Select value={form.primeiro_membro} onChange={set('primeiro_membro')} options={profOpts} />
              </Field>
              <Field label="2º Membro">
                <Select value={form.segundo_membro} onChange={set('segundo_membro')} options={profOpts} />
              </Field>
            </div>
          )}
        </TCCModal>
      )}

      {/* ── Modal de confirmação de exclusão ── */}
      {confirmId && (
        <Modal title="Confirmar exclusão" onClose={() => setConfirmId(null)} onSave={remove}>
          <p style={{ color: 'var(--muted)' }}>Tem certeza que deseja excluir este TCC? Esta ação não pode ser desfeita.</p>
        </Modal>
      )}
    </div>
  )
}
