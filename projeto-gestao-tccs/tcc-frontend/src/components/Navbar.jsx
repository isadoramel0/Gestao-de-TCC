import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/unidades', label: 'Unidades' },
  { to: '/departamentos', label: 'Departamentos' },
  { to: '/cursos', label: 'Cursos' },
  { to: '/alunos', label: 'Alunos' },
  { to: '/professores', label: 'Professores' },
  { to: '/tccs', label: 'TCCs' },
  { to: '/dashboard', label: 'Dashboard' },
]

export default function Navbar() {
  return (
    <nav style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      height: '56px',
    }}>
      <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--accent)', marginRight: 24 }}>
        📚 Gestão de TCCs
      </span>
      {links.map(l => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.to === '/'}
          style={({ isActive }) => ({
            padding: '6px 12px',
            borderRadius: 'var(--radius)',
            fontSize: 14,
            color: isActive ? 'var(--accent)' : 'var(--muted)',
            background: isActive ? 'var(--surface2)' : 'transparent',
            fontWeight: isActive ? 600 : 400,
          })}
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  )
}
