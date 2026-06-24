import { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable'
import { getDepartamentos, getUnidades } from '../../services/api'

export default function DepartamentosPage() {
  const [data, setData] = useState([])
  const [unidades, setUnidades] = useState([])

  useEffect(() => {
    Promise.all([getDepartamentos(), getUnidades()]).then(([deps, unis]) => {
      setData(deps.data)
      setUnidades(unis.data)
    })
  }, [])

  const unidadeNome = (id) => unidades.find(u => u.id === id)?.nome ?? '—'

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'sigla', label: 'Sigla' },
    { key: 'unidade_academica', label: 'Unidade', render: (v) => unidadeNome(v) },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>Departamentos</h1>
      <DataTable title="Listagem" columns={columns} data={data} searchKey="nome" />
    </div>
  )
}
