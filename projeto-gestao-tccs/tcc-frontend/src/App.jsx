import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import UnidadesPage from './pages/unidades/UnidadesPage'
import DepartamentosPage from './pages/departamentos/DepartamentosPage'
import CursosPage from './pages/cursos/CursosPage'
import AlunosPage from './pages/alunos/AlunosPage'
import ProfessoresPage from './pages/professores/ProfessoresPage'
import TCCsPage from './pages/tccs/TCCsPage'
import DashboardPage from './pages/dashboard/DashboardPage'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/unidades"    element={<UnidadesPage />} />
          <Route path="/departamentos" element={<DepartamentosPage />} />
          <Route path="/cursos"      element={<CursosPage />} />
          <Route path="/alunos"      element={<AlunosPage />} />
          <Route path="/professores" element={<ProfessoresPage />} />
          <Route path="/tccs"        element={<TCCsPage />} />
          <Route path="/dashboard"   element={<DashboardPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
