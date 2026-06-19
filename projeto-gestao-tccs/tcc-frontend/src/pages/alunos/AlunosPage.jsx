import { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import { getAlunos, createAluno, updateAluno, deleteAluno, getCursos } from '../../services/api'

const empty = { nome: '', matricula: '', curso: '' }

export default function AlunosPage() {
  const [data, setData] = useState([])
  const [cursos, setCursos] = useState([])
  const [modal, setModal] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState(null)

  const load = async () => {
    const [alunos, cs] = await Promise.all([getAlunos(), getCursos()])
    setData(alunos.data)
    setCursos(cs.data)
  }
  useEffect(() => { load() }, [])

  const cursoNome = (id) => cursos.find(c => c.id === id)?.nome ?? '—'

  const openAdd = () => { setForm(empty); setEditId(null); setError(null); setModal(true) }
  const openEdit = (row) => {
    setForm({ nome: row.nome, matricula: row.matricula, curso: row.curso })
    setEditId(row.id)
    setError(null)
    setModal(true)
  }

  const save = async () => {
    try {
      if (editId) await updateAluno(editId, form)
      else await createAluno(form)
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
    await deleteAluno(confirmId)
    setConfirmId(null)
    load()
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'matricula', label: 'Matrícula' },
    { key: 'curso', label: 'Curso', render: (v) => cursoNome(v) },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>Alunos</h1>
      <DataTable
        title="Listagem"
        columns={columns}
        data={data}
        searchKey="nome"
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={(id) => setConfirmId(id)}
      />

      {modal && (
        <Modal title={editId ? 'Editar Aluno' : 'Novo Aluno'} onClose={() => setModal(false)} onSave={save}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {error && (
              <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, whiteSpace: 'pre-line' }}>
                {error}
              </div>
            )}
            <div>
              <label>Nome</label>
              <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome completo do aluno" />
            </div>
            <div>
              <label>Matrícula</label>
              <input value={form.matricula} onChange={e => setForm(f => ({ ...f, matricula: e.target.value }))} placeholder="Ex: 2024001" />
            </div>
            <div>
              <label>Curso</label>
              <select value={form.curso} onChange={e => setForm(f => ({ ...f, curso: e.target.value }))}>
                <option value="">Selecione...</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <Modal title="Confirmar exclusão" onClose={() => setConfirmId(null)} onSave={remove}>
          <p style={{ color: 'var(--muted)' }}>Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.</p>
        </Modal>
      )}
    </div>
  )
}
