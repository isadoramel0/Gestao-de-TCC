import { useEffect, useState } from 'react'
import { getEstatisticas } from '../../services/api'

// ── Paleta de cores ─────────────────────────────────────────────
const COLORS = ['#43A047', '#1E88E5', '#FB8C00', '#E53935', '#8E24AA', '#00ACC1', '#F4511E', '#6D4C41']

// ── Card simples ────────────────────────────────────────────────
function StatCard({ label, value, color = 'var(--accent)' }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 32, fontWeight: 700, color }}>{value ?? 0}</span>
    </div>
  )
}

// ── Gráfico de barras horizontal ────────────────────────────────
function BarChart({ title, data }) {
  if (!data || Object.keys(data).length === 0) return null
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const max = Math.max(...entries.map(([, v]) => v), 1)

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
      <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 600 }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {entries.map(([label, value], i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', width: 160, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={label}>
              {label}
            </span>
            <div style={{ flex: 1, background: 'var(--surface2)', borderRadius: 6, height: 22, overflow: 'hidden' }}>
              <div style={{
                width: `${(value / max) * 100}%`,
                height: '100%',
                background: COLORS[i % COLORS.length],
                borderRadius: 6,
                transition: 'width 0.6s ease',
                display: 'flex', alignItems: 'center', paddingLeft: 8,
              }}>
                <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{value > 0 ? value : ''}</span>
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', width: 24, textAlign: 'right' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Gráfico de rosca (donut) ────────────────────────────────────
function DonutChart({ title, data }) {
  if (!data || Object.keys(data).length === 0) return null
  const entries = Object.entries(data)
  const total = entries.reduce((s, [, v]) => s + v, 0)
  if (total === 0) return null

  const R = 60, cx = 80, cy = 80, stroke = 28
  let cumulative = 0

  const slices = entries.map(([label, value], i) => {
    const pct = value / total
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2
    cumulative += pct
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2
    const x1 = cx + R * Math.cos(startAngle)
    const y1 = cy + R * Math.sin(startAngle)
    const x2 = cx + R * Math.cos(endAngle)
    const y2 = cy + R * Math.sin(endAngle)
    const large = pct > 0.5 ? 1 : 0
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`
    return { label, value, pct, d, color: COLORS[i % COLORS.length] }
  })

  // versão com stroke ao invés de pie fill para visual de rosca
  let offset = 0
  const circumference = 2 * Math.PI * R
  const strokeSlices = entries.map(([label, value], i) => {
    const pct = value / total
    const dasharray = pct * circumference
    const dashoffset = -offset * circumference
    offset += pct
    return { label, value, pct, dasharray, dashoffset, color: COLORS[i % COLORS.length] }
  })

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
      <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 600 }}>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <svg width={160} height={160} viewBox="0 0 160 160">
          {strokeSlices.map((s, i) => (
            <circle key={i}
              cx={cx} cy={cy} r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeDasharray={`${s.dasharray} ${circumference}`}
              strokeDashoffset={s.dashoffset}
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          ))}
          <circle cx={cx} cy={cy} r={R - stroke / 2 - 2} fill="var(--surface)" />
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize={22} fontWeight={700} fill="var(--text)">{total}</text>
          <text x={cx} y={cy + 14} textAnchor="middle" fontSize={11} fill="var(--muted)">total</text>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          {strokeSlices.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--text)', flex: 1 }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)' }}>{s.value}</span>
              <span style={{ fontSize: 11, color: 'var(--muted)', width: 36, textAlign: 'right' }}>
                {(s.pct * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Ranking simples ─────────────────────────────────────────────
function RankingCard({ title, data, emptyMsg = 'Sem dados' }) {
  if (!data || Object.keys(data).length === 0)
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>{title}</h3>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>{emptyMsg}</p>
      </div>
    )

  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {entries.map(([label, value], i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < entries.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: i === 0 ? '#F59E0B' : i === 1 ? '#94A3B8' : i === 2 ? '#CD7C2F' : 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: i < 3 ? '#fff' : 'var(--muted)', flexShrink: 0 }}>
              {i + 1}
            </span>
            <span style={{ flex: 1, fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={label}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Página principal ────────────────────────────────────────────
export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    getEstatisticas()
      .then(r => setStats(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--muted)', fontSize: 15 }}>
      Carregando dados...
    </div>
  )

  if (error || !stats) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--danger)', fontSize: 15 }}>
      Erro ao carregar estatísticas. Verifique se o backend está rodando.
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Dashboard</h1>

      {/* ── Cards de totais ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
        <StatCard label="Total de TCCs" value={stats.total_geral} color="var(--accent)" />
        <StatCard label="Em Elaboração" value={stats.por_status?.['Em Elaboração']} color="#64748B" />
        <StatCard label="Enviados"       value={stats.por_status?.['Enviado']}       color="#1E88E5" />
        <StatCard label="Aprovados"      value={stats.por_status?.['Aprovado']}      color="#43A047" />
        <StatCard label="Reprovados"     value={stats.por_status?.['Reprovado']}     color="#E53935" />
      </div>

      {/* ── Linha 1: status + tipo ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        <DonutChart title="TCCs por Status" data={stats.por_status} />
        <DonutChart title="TCCs por Tipo"   data={stats.por_tipo} />
      </div>

      {/* ── Linha 2: idioma + semestre ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        <DonutChart title="TCCs por Idioma"   data={stats.por_idioma} />
        <BarChart   title="TCCs por Semestre" data={stats.por_semestre} />
      </div>

      {/* ── Linha 3: rankings ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <RankingCard title="Top Orientadores"       data={stats.por_orientador}    emptyMsg="Nenhum TCC cadastrado ainda." />
        <RankingCard title="Top Coorientadores"     data={stats.por_coorientador}  emptyMsg="Nenhum coorientador cadastrado." />
        <RankingCard title="TCCs por Curso"         data={stats.por_curso}         emptyMsg="Nenhum TCC cadastrado ainda." />
        <RankingCard title="TCCs por Departamento"  data={stats.por_departamento}  emptyMsg="Nenhum TCC cadastrado ainda." />
        <RankingCard title="TCCs por Unidade Acadêmica" data={stats.por_unidade_academica} emptyMsg="Nenhum TCC cadastrado ainda." />
      </div>
    </div>
  )
}
