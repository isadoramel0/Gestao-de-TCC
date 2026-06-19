import { useEffect, useState, useRef } from 'react'
import { getEstatisticas } from '../../services/api'
import { TrendingUp, Award, BookOpen, Users, Globe, Calendar, BarChart2, RefreshCw } from 'lucide-react'

const G = {
  dark:'#1B4332',main:'#2E7D32',mid:'#52796F',
  light:'#81C784',bg:'#E8F5E9',bgMid:'#C8E6C9',
  white:'#FFFFFF',page:'#F0F4F1',border:'#E2E8F0',
  muted:'#64748B',text:'#1E293B',
}
const shadow = { sm:'0 2px 8px rgba(0,0,0,.06)', md:'0 6px 16px rgba(0,0,0,.08)', hover:'0 14px 32px rgba(46,125,50,.18)' }

const STATUS_CFG = {
  'Em Elaboração': { color:'#854D0E', bg:'#FEF9C3', bar:'#F59E0B' },
  'Enviado':       { color:'#1E40AF', bg:'#DBEAFE', bar:'#3B82F6' },
  'Aprovado':      { color:'#166534', bg:'#DCFCE7', bar:'#22C55E' },
  'Reprovado':     { color:'#991B1B', bg:'#FEE2E2', bar:'#EF4444' },
}
const PALETTE = ['#2E7D32','#1E88E5','#FB8C00','#E53935','#8E24AA','#00ACC1','#F4511E','#6D4C41','#43A047','#00897B']

// ── Utilitários ────────────────────────────────────────────────
const card = (extra={}) => ({
  background:G.white, borderRadius:16,
  border:`1px solid ${G.border}`, boxShadow:shadow.md,
  padding:24, ...extra,
})

function useAnimatedValue(target, duration=900) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!target) return
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now()-start)/duration, 1)
      const ease = 1 - Math.pow(1-p, 3)
      setVal(Math.round(ease * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target])
  return val
}

// ── Stat Card com animação ──────────────────────────────────────
function StatCard({ label, value, icon, accent, sub }) {
  const animated = useAnimatedValue(value)
  return (
    <div style={{ ...card(), display:'flex', flexDirection:'column', gap:8,
      borderLeft:`4px solid ${accent}`,
      transition:'transform .2s, box-shadow .2s',
    }}
      onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=shadow.hover }}
      onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=shadow.md }}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <span style={{ fontSize:13, color:G.muted, fontWeight:500 }}>{label}</span>
        <div style={{ width:36, height:36, borderRadius:10, background:G.bg, display:'flex', alignItems:'center', justifyContent:'center', color:accent }}>
          {icon}
        </div>
      </div>
      <span style={{ fontSize:38, fontWeight:800, color:accent, lineHeight:1 }}>{animated}</span>
      {sub && <span style={{ fontSize:12, color:G.muted }}>{sub}</span>}
    </div>
  )
}

// ── Donut Chart SVG ─────────────────────────────────────────────
function DonutChart({ title, data, icon }) {
  const [hovered, setHovered] = useState(null)
  if (!data) return null
  const entries = Object.entries(data)
  const total = entries.reduce((s,[,v])=>s+v,0)
  const R=58, cx=75, cy=75, stroke=22, circumference=2*Math.PI*R
  let offset=0
  const slices = entries.map(([label,value],i) => {
    const pct = value/total
    const dasharray = pct * circumference
    const dashoffset = -offset * circumference
    offset += pct
    return { label, value, pct, dasharray, dashoffset, color:PALETTE[i%PALETTE.length] }
  })

  const active = hovered !== null ? slices[hovered] : null

  return (
    <div style={card()}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
        <span style={{ color:G.main }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:G.dark }}>{title}</h3>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flexShrink:0 }}>
          <svg width={150} height={150} viewBox="0 0 150 150">
            {slices.map((s,i) => (
              <circle key={i} cx={cx} cy={cy} r={R}
                fill="none" stroke={s.color} strokeWidth={hovered===i ? stroke+4 : stroke}
                strokeDasharray={`${s.dasharray} ${circumference}`}
                strokeDashoffset={s.dashoffset}
                style={{ transition:'stroke-width .2s', cursor:'pointer' }}
                onMouseEnter={()=>setHovered(i)}
                onMouseLeave={()=>setHovered(null)}
              />
            ))}
            <circle cx={cx} cy={cy} r={R-stroke/2-2} fill={G.white}/>
            {active ? (
              <>
                <text x={cx} y={cy-8} textAnchor="middle" fontSize={20} fontWeight={800} fill={active.color}>{active.value}</text>
                <text x={cx} y={cy+8} textAnchor="middle" fontSize={10} fill={G.muted}>{(active.pct*100).toFixed(0)}%</text>
                <text x={cx} y={cy+22} textAnchor="middle" fontSize={9} fill={G.muted} style={{ maxWidth:80 }}>
                  {active.label.length > 12 ? active.label.slice(0,12)+'…' : active.label}
                </text>
              </>
            ) : (
              <>
                <text x={cx} y={cy-4} textAnchor="middle" fontSize={24} fontWeight={800} fill={G.dark}>{total}</text>
                <text x={cx} y={cy+14} textAnchor="middle" fontSize={11} fill={G.muted}>total</text>
              </>
            )}
          </svg>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:7, flex:1, minWidth:120 }}>
          {slices.map((s,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', opacity:hovered!==null&&hovered!==i?.5:1, transition:'opacity .15s' }}
              onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}>
              <div style={{ width:10, height:10, borderRadius:3, background:s.color, flexShrink:0 }}/>
              <span style={{ fontSize:13, color:G.text, flex:1 }}>{s.label}</span>
              <span style={{ fontSize:13, fontWeight:700, color:s.color }}>{s.value}</span>
              <span style={{ fontSize:11, color:G.muted, width:32, textAlign:'right' }}>{(s.pct*100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Gráfico de barras horizontal ────────────────────────────────
function HBarChart({ title, data, icon, limit=10 }) {
  const [hovered, setHovered] = useState(null)
  if (!data) return null
  const entries = Object.entries(data).sort((a,b)=>b[1]-a[1]).slice(0,limit)
  const max = Math.max(...entries.map(([,v])=>v), 1)
  return (
    <div style={card()}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
        <span style={{ color:G.main }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:G.dark }}>{title}</h3>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {entries.map(([label,value],i) => (
          <div key={label} style={{ display:'flex', alignItems:'center', gap:10 }}
            onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}>
            <span style={{ fontSize:12, color:hovered===i?G.main:G.muted, width:130, flexShrink:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', transition:'color .15s', fontWeight:hovered===i?600:400 }} title={label}>{label}</span>
            <div style={{ flex:1, background:G.bg, borderRadius:8, height:28, overflow:'hidden', position:'relative' }}>
              <div style={{
                width:`${(value/max)*100}%`, height:'100%',
                background:hovered===i ? G.main : PALETTE[i%PALETTE.length],
                borderRadius:8, transition:'width .7s cubic-bezier(.4,0,.2,1), background .15s',
                display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:8,
              }}>
                <span style={{ fontSize:12, color:'#fff', fontWeight:700 }}>{value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Gráfico de linha (semestres) ────────────────────────────────
function LineChart({ title, data, icon }) {
  if (!data) return null
  const entries = Object.entries(data)
  const values = entries.map(([,v])=>v)
  const max = Math.max(...values, 1)
  const min = 0
  const W=520, H=160, padL=32, padR=16, padT=16, padB=32
  const plotW = W-padL-padR, plotH = H-padT-padB
  const xs = entries.map((_,i) => padL + (i/(entries.length-1))*plotW)
  const ys = values.map(v => padT + plotH - ((v-min)/(max-min))*plotH)
  const polyline = xs.map((x,i)=>`${x},${ys[i]}`).join(' ')
  const area = `${padL},${padT+plotH} ${polyline} ${padL+(entries.length-1)/(entries.length-1)*plotW},${padT+plotH}`
  const [hov, setHov] = useState(null)

  return (
    <div style={card()}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
        <span style={{ color:G.main }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:G.dark }}>{title}</h3>
        <span style={{ marginLeft:'auto', fontSize:12, color:G.muted }}>por semestre letivo</span>
      </div>
      <div style={{ overflowX:'auto' }}>
        <svg width={W} height={H} style={{ display:'block' }}>
          {/* Grid */}
          {[0,.25,.5,.75,1].map(p => {
            const y = padT + plotH*(1-p)
            return <line key={p} x1={padL} y1={y} x2={W-padR} y2={y} stroke={G.border} strokeWidth={1} strokeDasharray="4 4"/>
          })}
          {/* Area */}
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={G.main} stopOpacity=".25"/>
              <stop offset="100%" stopColor={G.main} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <polygon points={area} fill="url(#areaGrad)"/>
          {/* Line */}
          <polyline points={polyline} fill="none" stroke={G.main} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"/>
          {/* Points */}
          {xs.map((x,i) => (
            <g key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)} style={{ cursor:'pointer' }}>
              <circle cx={x} cy={ys[i]} r={hov===i?7:4} fill={hov===i?G.main:G.white} stroke={G.main} strokeWidth={2.5} style={{ transition:'r .15s' }}/>
              {hov===i && (
                <>
                  <rect x={x-28} y={ys[i]-34} width={56} height={22} rx={6} fill={G.dark}/>
                  <text x={x} y={ys[i]-19} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">{values[i]} TCCs</text>
                </>
              )}
              <text x={x} y={H-6} textAnchor="middle" fontSize={9} fill={G.muted} transform={`rotate(-35,${x},${H-6})`}>{entries[i][0]}</text>
            </g>
          ))}
          {/* Y axis labels */}
          {[0,.5,1].map(p => (
            <text key={p} x={padL-4} y={padT+plotH*(1-p)+4} textAnchor="end" fontSize={10} fill={G.muted}>{Math.round(min+(max-min)*p)}</text>
          ))}
        </svg>
      </div>
    </div>
  )
}

// ── Ranking com medalhas ────────────────────────────────────────
function RankingCard({ title, data, icon, limit=6 }) {
  if (!data) return null
  const entries = Object.entries(data).sort((a,b)=>b[1]-a[1]).slice(0,limit)
  const max = entries[0]?.[1] ?? 1
  const medals = ['🥇','🥈','🥉']

  return (
    <div style={card()}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
        <span style={{ color:G.main }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:G.dark }}>{title}</h3>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
        {entries.map(([label,value],i) => (
          <div key={label} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:i<entries.length-1?`1px solid ${G.border}`:'none' }}>
            <span style={{ fontSize:18, width:28, textAlign:'center', flexShrink:0 }}>{medals[i] ?? `${i+1}`}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, color:G.text, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={label}>{label}</div>
              <div style={{ marginTop:5, height:5, background:G.bg, borderRadius:4, overflow:'hidden' }}>
                <div style={{ width:`${(value/max)*100}%`, height:'100%', background:i===0?'#F59E0B':i===1?'#94A3B8':i===2?'#CD7C2F':G.main, borderRadius:4, transition:'width .7s' }}/>
              </div>
            </div>
            <span style={{ fontSize:14, fontWeight:700, color:G.main, flexShrink:0 }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Status breakdown horizontal ─────────────────────────────────
function StatusBreakdown({ data }) {
  if (!data) return null
  const total = Object.values(data).reduce((a,b)=>a+b,0)
  return (
    <div style={card({ padding:'20px 24px' })}>
      <h3 style={{ margin:'0 0 16px', fontSize:15, fontWeight:700, color:G.dark }}>Distribuição por Status</h3>
      {/* Barra empilhada */}
      <div style={{ display:'flex', height:16, borderRadius:8, overflow:'hidden', marginBottom:16, gap:2 }}>
        {Object.entries(data).map(([label,value]) => {
          const cfg = STATUS_CFG[label] ?? { bar: G.main }
          return (
            <div key={label} title={`${label}: ${value}`} style={{ flex:value, background:cfg.bar, transition:'flex .7s', cursor:'default' }}/>
          )
        })}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12 }}>
        {Object.entries(data).map(([label,value]) => {
          const cfg = STATUS_CFG[label] ?? { bg:G.bg, color:G.main, bar:G.main }
          return (
            <div key={label} style={{ background:cfg.bg, borderRadius:10, padding:'12px 14px' }}>
              <div style={{ fontSize:22, fontWeight:800, color:cfg.color }}>{value}</div>
              <div style={{ fontSize:12, color:cfg.color, marginTop:2, opacity:.8 }}>{label}</div>
              <div style={{ fontSize:11, color:cfg.color, opacity:.6, marginTop:2 }}>{((value/total)*100).toFixed(0)}% do total</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Página ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = () => {
    setLoading(true); setError(false)
    getEstatisticas()
      .then(r => setStats(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  if (loading) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:360, gap:16, background:G.page }}>
      <div style={{ width:48, height:48, border:`4px solid ${G.bg}`, borderTop:`4px solid ${G.main}`, borderRadius:'50%', animation:'spin 1s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <span style={{ color:G.muted, fontSize:14 }}>Carregando estatísticas...</span>
    </div>
  )

  if (error || !stats) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:360, gap:16, background:G.page }}>
      <span style={{ fontSize:36 }}>⚠️</span>
      <span style={{ color:'#B91C1C', fontSize:15, fontWeight:600 }}>Erro ao carregar estatísticas</span>
      <button onClick={load} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px', background:G.main, color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontSize:14, fontWeight:600 }}>
        <RefreshCw size={16}/> Tentar novamente
      </button>
    </div>
  )

  return (
    <div style={{ padding:'30px 32px', background:G.page, minHeight:'100vh', fontFamily:'Segoe UI,system-ui,sans-serif', display:'flex', flexDirection:'column', gap:24 }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h1 style={{ margin:0, fontSize:26, fontWeight:800, color:G.dark }}>Dashboard</h1>
          <p style={{ margin:'4px 0 0', fontSize:14, color:G.muted }}>Visão geral dos Trabalhos de Conclusão de Curso</p>
        </div>
        <button onClick={load} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 16px', background:G.bg, color:G.main, border:`1px solid ${G.light}`, borderRadius:10, cursor:'pointer', fontSize:13, fontWeight:600 }}>
          <RefreshCw size={15}/> Atualizar
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16 }}>
        <StatCard label="Total de TCCs"  value={stats.total_geral}                    icon={<BarChart2 size={18}/>} accent={G.main}   sub="trabalhos cadastrados"/>
        <StatCard label="Em Elaboração"  value={stats.por_status?.['Em Elaboração']}  icon={<TrendingUp size={18}/>} accent="#F59E0B" sub="em andamento"/>
        <StatCard label="Enviados"       value={stats.por_status?.['Enviado']}        icon={<BookOpen size={18}/>}   accent="#3B82F6" sub="aguardando avaliação"/>
        <StatCard label="Aprovados"      value={stats.por_status?.['Aprovado']}       icon={<Award size={18}/>}      accent="#22C55E" sub="concluídos com sucesso"/>
        <StatCard label="Reprovados"     value={stats.por_status?.['Reprovado']}      icon={<Users size={18}/>}      accent="#EF4444" sub="necessitam revisão"/>
      </div>

      {/* Status breakdown */}
      <StatusBreakdown data={stats.por_status}/>

      {/* Linha temporal */}
      <LineChart title="Evolução por Semestre" data={stats.por_semestre} icon={<Calendar size={16}/>}/>

      {/* Donuts */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:20 }}>
        <DonutChart title="Por Tipo de Trabalho" data={stats.por_tipo}   icon={<BookOpen size={16}/>}/>
        <DonutChart title="Por Idioma"           data={stats.por_idioma} icon={<Globe size={16}/>}/>
      </div>

      {/* Barras horizontais */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:20 }}>
        <HBarChart title="TCCs por Curso"              data={stats.por_curso}            icon={<BookOpen size={16}/>}/>
        <HBarChart title="TCCs por Departamento"       data={stats.por_departamento}     icon={<BarChart2 size={16}/>}/>
        <HBarChart title="TCCs por Unidade Acadêmica"  data={stats.por_unidade_academica} icon={<Award size={16}/>}/>
      </div>

      {/* Rankings */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:20 }}>
        <RankingCard title="Top Orientadores"   data={stats.por_orientador}   icon={<Users size={16}/>} limit={7}/>
        <RankingCard title="Top Coorientadores" data={stats.por_coorientador} icon={<Users size={16}/>} limit={7}/>
      </div>

    </div>
  )
}
