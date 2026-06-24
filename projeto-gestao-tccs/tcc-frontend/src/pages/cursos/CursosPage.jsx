import { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable'
import { getCursos } from '../../services/api'

export default function CursosPage() {
  const [data, setData] = useState([])

  useEffect(() => { getCursos().then(r => setData(r.data)) }, [])

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'sigla', label: 'Sigla' },
    { key: 'codigo', label: 'Código' },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>Cursos</h1>
      <DataTable title="Listagem" columns={columns} data={data} searchKey="nome" />
    </div>
  )
}
