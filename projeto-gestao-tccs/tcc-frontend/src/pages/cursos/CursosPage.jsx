import { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import { getCursos, createCurso, updateCurso, deleteCurso, getDepartamentos } from '../../services/api'

const empty = { nome: '', codigo: '', departamento: '' }

export default function CursosPage() {
  const [data, setData] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)

  const load = async () => {
    const [cursos, deps] = await Promise.all([getCursos(), getDepartamentos()])
    setData(cursos.data)
    setDepartamentos(deps.data)
  }
  useEffect(() => { load() }, [])

  const depNome = (id) => departamentos.find(d => d.id === id)?.nome ?? id

  const openAdd = () => { setForm(empty); setEditId(null); setModal(true) }
  const openEdit = (row) => {
    setForm({ nome: row.nome, codigo: row.codigo, departamento: row.departamento })
    setEditId(row.id)
    setModal(true)
  }

  /*const save = async () => {
    if (editId) await updateCurso(editId, form)
    else await createCurso(form)
    setModal(false)
    load()
  }*/
 const save = async () => {
  try {
    console.log(form)

    if (editId)
      await updateCurso(editId, form)
    else
      await createCurso(form)

    setModal(false)
    load()
  } catch (err) {
    console.log(err.response?.data)
  }
}

  const remove = async (id) => {
    if (!confirm('Confirmar exclusão?')) return
    await deleteCurso(id)
    load()
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'codigo', label: 'Código' },
    { key: 'departamento', label: 'Departamento', render: (v) => depNome(v) },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>Cursos</h1>
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
        <Modal title={editId ? 'Editar Curso' : 'Novo Curso'} onClose={() => setModal(false)} onSave={save}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label>Nome</label>
              <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
            </div>
            <div>
              <label>Código</label>
              <input value={form.codigo} onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))} />
            </div>
            <div>
              <label>Departamento</label>
              <select value={form.departamento} onChange={e => setForm(f => ({ ...f, departamento: e.target.value }))}>
                <option value="">Selecione...</option>
                {departamentos.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
