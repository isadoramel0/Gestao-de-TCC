import { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import { getDepartamentos, createDepartamento, updateDepartamento, deleteDepartamento, getUnidades } from '../../services/api'

const empty = { nome: '', sigla: '', unidade_academica: '' }

export default function DepartamentosPage() {
  const [data, setData] = useState([])
  const [unidades, setUnidades] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)

  const load = async () => {
    const [deps, unis] = await Promise.all([getDepartamentos(), getUnidades()])
    setData(deps.data)
    setUnidades(unis.data)
  }
  useEffect(() => { load() }, [])

  const unidadeNome = (id) => unidades.find(u => u.id === id)?.nome ?? id

  const openAdd = () => { setForm(empty); setEditId(null); setModal(true) }
  const openEdit = (row) => {
    setForm({ nome: row.nome, sigla: row.sigla, unidade_academica: row.unidade_academica })
    setEditId(row.id)
    setModal(true)
  }

  const save = async () => {
    if (editId) await updateDepartamento(editId, form)
    else await createDepartamento(form)
    setModal(false)
    load()
  }

  const remove = async (id) => {
    if (!confirm('Confirmar exclusão?')) return
    await deleteDepartamento(id)
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
        onDelete={remove}
      />

      {modal && (
        <Modal title={editId ? 'Editar Departamento' : 'Novo Departamento'} onClose={() => setModal(false)} onSave={save}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label>Nome</label>
              <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
            </div>
            <div>
              <label>Sigla</label>
              <input value={form.sigla} onChange={e => setForm(f => ({ ...f, sigla: e.target.value }))} />
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
    </div>
  )
}
