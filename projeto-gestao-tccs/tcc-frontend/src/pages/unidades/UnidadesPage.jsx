import { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable'
import { getUnidades } from '../../services/api'

export default function UnidadesPage() {
  const [data, setData] = useState([])

  useEffect(() => { getUnidades().then(r => setData(r.data)) }, [])

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'sigla', label: 'Sigla' },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>Unidades Acadêmicas</h1>
      <DataTable title="Listagem" columns={columns} data={data} searchKey="nome" />
    </div>
  )
}
