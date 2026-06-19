import { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import { getProfessores, createProfessor, updateProfessor, deleteProfessor, getDepartamentos } from '../../services/api'

const empty = { nome: '', departamento: '' }

export default function ProfessoresPage() {
  const [data, setData] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [modal, setModal] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState(null)

  const load = async () => {
    const [profs, deps] = await Promise.all([getProfessores(), getDepartamentos()])
    setData(profs.data)
    setDepartamentos(deps.data)
  }
  useEffect(() => { load() }, [])

  const depNome = (id) => departamentos.find(d => d.id === id)?.nome ?? '—'

  const openAdd = () => { setForm(empty); setEditId(null); setError(null); setModal(true) }
  const openEdit = (row) => {
    setForm({ nome: row.nome, departamento: row.departamento })
    setEditId(row.id)
    setError(null)
    setModal(true)
  }

  const save = async () => {
    try {
      if (editId) await updateProfessor(editId, form)
      else await createProfessor(form)
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
    await deleteProfessor(confirmId)
    setConfirmId(null)
    load()
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'departamento', label: 'Departamento', render: (v) => depNome(v) },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>Professores</h1>
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
        <Modal title={editId ? 'Editar Professor' : 'Novo Professor'} onClose={() => setModal(false)} onSave={save}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {error && (
              <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, whiteSpace: 'pre-line' }}>
                {error}
              </div>
            )}
            <div>
              <label>Nome</label>
              <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome completo do professor" />
            </div>
            <div>
              <label>Departamento</label>
              <select value={form.departamento} onChange={e => setForm(f => ({ ...f, departamento: e.target.value }))}>
                <option value="">Selecione...</option>
                {departamentos.map(d => <option key={d.id} value={d.id}>{d.nome} ({d.sigla})</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <Modal title="Confirmar exclusão" onClose={() => setConfirmId(null)} onSave={remove}>
          <p style={{ color: 'var(--muted)' }}>Tem certeza que deseja excluir este professor? Esta ação não pode ser desfeita.</p>
        </Modal>
      )}
    </div>
  )
}
