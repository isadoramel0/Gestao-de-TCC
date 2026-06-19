import { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import { getUnidades, createUnidade, updateUnidade, deleteUnidade } from '../../services/api'

const empty = { nome: '', sigla: '' }

export default function UnidadesPage() {
  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState(null)

  const load = () => getUnidades().then(r => setData(r.data))
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(empty); setEditId(null); setError(null); setModal(true) }
  const openEdit = (row) => {
    setForm({ nome: row.nome, sigla: row.sigla })
    setEditId(row.id)
    setError(null)
    setModal(true)
  }

  const save = async () => {
    try {
      if (editId) await updateUnidade(editId, form)
      else await createUnidade(form)
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
    await deleteUnidade(confirmId)
    setConfirmId(null)
    load()
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'sigla', label: 'Sigla' },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>Unidades Acadêmicas</h1>
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
        <Modal title={editId ? 'Editar Unidade' : 'Nova Unidade'} onClose={() => setModal(false)} onSave={save}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {error && (
              <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, whiteSpace: 'pre-line' }}>
                {error}
              </div>
            )}
            <div>
              <label>Nome</label>
              <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Instituto de Ciências Exatas" />
            </div>
            <div>
              <label>Sigla</label>
              <input value={form.sigla} onChange={e => setForm(f => ({ ...f, sigla: e.target.value }))} placeholder="Ex: ICEx" />
            </div>
          </div>
        </Modal>
      )}

      {confirmId && (
        <Modal title="Confirmar exclusão" onClose={() => setConfirmId(null)} onSave={remove}>
          <p style={{ color: 'var(--muted)' }}>Tem certeza que deseja excluir esta unidade? Esta ação não pode ser desfeita.</p>
        </Modal>
      )}
    </div>
  )
}
