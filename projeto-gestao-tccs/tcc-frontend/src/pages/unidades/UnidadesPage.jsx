import { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import { getUnidades, createUnidade, updateUnidade, deleteUnidade } from '../../services/api'

const empty = { nome: '', sigla: '' }

export default function UnidadesPage() {
  const [data, setData] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)

  const load = () => getUnidades().then(r => setData(r.data))
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(empty); setEditId(null); setModal(true) }
  const openEdit = (row) => { setForm({ nome: row.nome, sigla: row.sigla }); setEditId(row.id); setModal(true) }

  const save = async () => {
    if (editId) await updateUnidade(editId, form)
    else await createUnidade(form)
    setModal(false)
    load()
  }

  const remove = async (id) => {
    if (!confirm('Confirmar exclusão?')) return
    await deleteUnidade(id)
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
        onDelete={remove}
      />

      {modal && (
        <Modal title={editId ? 'Editar Unidade' : 'Nova Unidade'} onClose={() => setModal(false)} onSave={save}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label>Nome</label>
              <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
            </div>
            <div>
              <label>Sigla</label>
              <input value={form.sigla} onChange={e => setForm(f => ({ ...f, sigla: e.target.value }))} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
