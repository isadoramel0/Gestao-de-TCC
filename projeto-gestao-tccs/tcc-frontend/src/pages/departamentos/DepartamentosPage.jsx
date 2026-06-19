import { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import { getDepartamentos, createDepartamento, updateDepartamento, deleteDepartamento, getUnidades } from '../../services/api'

const empty = { nome: '', sigla: '', unidade_academica: '' }

export default function DepartamentosPage() {
  const [data, setData] = useState([])
  const [unidades, setUnidades] = useState([])
  const [modal, setModal] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState(null)

  const load = async () => {
    const [deps, unis] = await Promise.all([getDepartamentos(), getUnidades()])
    setData(deps.data)
    setUnidades(unis.data)
  }
  useEffect(() => { load() }, [])

  const unidadeNome = (id) => unidades.find(u => u.id === id)?.nome ?? '—'

  const openAdd = () => { setForm(empty); setEditId(null); setError(null); setModal(true) }
  const openEdit = (row) => {
    setForm({ nome: row.nome, sigla: row.sigla, unidade_academica: row.unidade_academica })
    setEditId(row.id)
    setError(null)
    setModal(true)
  }

  const save = async () => {
    try {
      if (editId) await updateDepartamento(editId, form)
      else await createDepartamento(form)
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
    await deleteDepartamento(confirmId)
    setConfirmId(null)
    load()
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'sigla', label: 'Sigla' },
    { key: 'unidade_academica', label: 'Unidade', render: (v) => unidadeNome(v) },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>Departamentos</h1>
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
        <Modal title={editId ? 'Editar Departamento' : 'Novo Departamento'} onClose={() => setModal(false)} onSave={save}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {error && (
              <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, whiteSpace: 'pre-line' }}>
                {error}
              </div>
            )}
            <div>
              <label>Nome</label>
              <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Departamento de Computação" />
            </div>
            <div>
              <label>Sigla</label>
              <input value={form.sigla} onChange={e => setForm(f => ({ ...f, sigla: e.target.value }))} placeholder="Ex: DCC" />
            </div>
            <div>
              <label>Unidade Acadêmica</label>
              <select value={form.unidade_academica} onChange={e => setForm(f => ({ ...f, unidade_academica: e.target.value }))}>
                <option value="">Selecione...</option>
                {unidades.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <Modal title="Confirmar exclusão" onClose={() => setConfirmId(null)} onSave={remove}>
          <p style={{ color: 'var(--muted)' }}>Tem certeza que deseja excluir este departamento? Esta ação não pode ser desfeita.</p>
        </Modal>
      )}
    </div>
  )
}
