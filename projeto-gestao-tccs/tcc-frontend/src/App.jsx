import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import UnidadesPage from './pages/unidades/UnidadesPage'
import DepartamentosPage from './pages/departamentos/DepartamentosPage'
import CursosPage from './pages/cursos/CursosPage'

// Placeholders para as partes dos outros integrantes
const Placeholder = ({ name }) => (
  <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
    <div style={{ fontSize: 40, marginBottom: 12 }}>🚧</div>
    <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>{name}</div>
    <div style={{ marginTop: 8 }}>Em desenvolvimento pelo outro integrante.</div>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Integrante 1 */}
          <Route path="/unidades" element={<UnidadesPage />} />
          <Route path="/departamentos" element={<DepartamentosPage />} />
          <Route path="/cursos" element={<CursosPage />} />

          {/* Integrante 2 */}
          <Route path="/alunos" element={<Placeholder name="Alunos" />} />
          <Route path="/professores" element={<Placeholder name="Professores" />} />

          {/* Integrante 3 */}
          <Route path="/tccs" element={<Placeholder name="TCCs" />} />
          <Route path="/dashboard" element={<Placeholder name="Dashboard" />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
