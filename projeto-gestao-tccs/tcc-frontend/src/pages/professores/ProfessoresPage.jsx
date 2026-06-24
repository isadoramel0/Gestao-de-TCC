import { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable'
import { getProfessores, getDepartamentos } from '../../services/api'

export default function ProfessoresPage() {
  const [data, setData] = useState([])
  const [departamentos, setDepartamentos] = useState([])

  useEffect(() => {
    Promise.all([getProfessores(), getDepartamentos()]).then(([profs, deps]) => {
      setData(profs.data)
      setDepartamentos(deps.data)
    })
  }, [])

  const depNome = (id) => departamentos.find(d => d.id === id)?.nome ?? '—'

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'departamento', label: 'Departamento', render: (v) => depNome(v) },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>Professores</h1>
      <DataTable title="Listagem" columns={columns} data={data} searchKey="nome" />
    </div>
  )
}
