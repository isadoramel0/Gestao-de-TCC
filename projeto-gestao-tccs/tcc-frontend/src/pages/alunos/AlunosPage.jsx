import { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable'
import { getAlunos, getCursos } from '../../services/api'

export default function AlunosPage() {
  const [data, setData] = useState([])
  const [cursos, setCursos] = useState([])

  useEffect(() => {
    Promise.all([getAlunos(), getCursos()]).then(([alunos, cs]) => {
      setData(alunos.data)
      setCursos(cs.data)
    })
  }, [])

  const cursoNome = (id) => cursos.find(c => c.id === id)?.nome ?? '—'

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'matricula', label: 'Matrícula' },
    { key: 'curso', label: 'Curso', render: (v) => cursoNome(v) },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>Alunos</h1>
      <DataTable title="Listagem" columns={columns} data={data} searchKey="nome" />
    </div>
  )
}
