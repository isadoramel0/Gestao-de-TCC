import { useEffect, useState } from 'react'
import {
  getTccs, createTcc, updateTcc, deleteTcc,
  getAlunos, getProfessores,
} from '../../services/api'
import {
  FileText, X, ChevronRight, Upload,
  User, Users, BookOpen, Calendar, Globe, Tag
} from 'lucide-react'

const G = {
  dark:'#1B4332',main:'#2E7D32',mid:'#52796F',
  light:'#81C784',bg:'#E8F5E9',bgMid:'#C8E6C9',
  white:'#FFFFFF',page:'#F0F4F1',border:'#E2E8F0',
  muted:'#64748B',text:'#1E293B',
}
const shadow = { sm:'0 2px 8px rgba(0,0,0,.06)', md:'0 6px 16px rgba(0,0,0,.08)', hover:'0 14px 32px rgba(46,125,50,.18)' }

const STATUS = [
  { value:'0', label:'Em Elaboração', bg:'#FEF9C3', color:'#854D0E' },
  { value:'1', label:'Enviado',       bg:'#DBEAFE', color:'#1E40AF' },
  { value:'2', label:'Aprovado',      bg:'#DCFCE7', color:'#166534' },
  { value:'3', label:'Reprovado',     bg:'#FEE2E2', color:'#991B1B' },
]
const TIPOS = [
  { value:'MONOGRAFIA',label:'Monografia' },
  { value:'RELATORIO_ESTAGIO',label:'Relatório de Estágio' },
  { value:'RELATORIO_TECNICO',label:'Relatório Técnico' },
  { value:'ARTIGO',label:'Artigo' },
]
const IDIOMAS = [{ value:'PT',label:'Português' },{ value:'EN',label:'Inglês' }]
const SEMESTRES = ['2020/1','2020/2','2021/1','2021/2','2022/1','2022/2','2023/1','2023/2','2024/1','2024/2','2025/1','2025/2','2026/1']

const empty = {
  titulo:'',resumo:'',palavras_chave:'',tipo:'',idioma:'',status:'0',
  aluno:'',orientador:'',coorientador:'',
  presidente:'',primeiro_membro:'',segundo_membro:'',
  semestre_letivo_defesa:'',arquivo:null,
}

const StatusBadge = ({ value }) => {
  const s = STATUS.find(x => x.value === value) ?? STATUS[0]
  return <span style={{ background:s.bg,color:s.color,padding:'3px 10px',borderRadius:20,fontSize:12,fontWeight:600,whiteSpace:'nowrap' }}>{s.label}</span>
}

const Field = ({ label, icon, children }) => (
  <div>
    <label style={{ display:'flex',alignItems:'center',gap:6,fontSize:13,color:G.muted,marginBottom:5 }}>
      {icon && <span style={{ color:G.main }}>{icon}</span>}{label}
    </label>
    {children}
  </div>
)

const inp = { width:'100%',padding:'9px 12px',border:`1px solid ${G.border}`,borderRadius:8,fontSize:14,color:G.text,background:G.white,outline:'none',boxSizing:'border-box',fontFamily:'inherit' }

const GSelect = ({ value, onChange, options, placeholder='Selecione...' }) => (
  <select value={value} onChange={onChange} style={inp}>
    <option value="">{placeholder}</option>
    {options.map(o => <option key={o.value??o.id} value={o.value??o.id}>{o.label??o.nome}</option>)}
  </select>
)

function TCCModal({ title, onClose, onSave, error, tab, setTab, children }) {
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:999 }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:G.white,borderRadius:16,border:`1px solid ${G.border}`,boxShadow:shadow.hover,width:'100%',maxWidth:640,maxHeight:'92vh',overflowY:'auto',display:'flex',flexDirection:'column',fontFamily:'Segoe UI,system-ui,sans-serif' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 24px',borderBottom:`1px solid ${G.border}`,background:`linear-gradient(135deg,${G.bg},${G.bgMid})`,borderRadius:'16px 16px 0 0' }}>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <FileText size={20} color={G.main}/>
            <span style={{ fontWeight:700,fontSize:16,color:G.dark }}>{title}</span>
          </div>
          <button onClick={onClose} style={{ background:'transparent',border:'none',cursor:'pointer',color:G.muted }}><X size={20}/></button>
        </div>
        <div style={{ display:'flex',borderBottom:`1px solid ${G.border}`,padding:'0 24px' }}>
          {['Informações','Participantes','Banca'].map((t,i) => (
            <button key={i} onClick={() => setTab(i)} style={{ padding:'10px 18px',fontSize:13,fontWeight:tab===i?700:400,color:tab===i?G.main:G.muted,background:'transparent',border:'none',borderBottom:tab===i?`2px solid ${G.main}`:'2px solid transparent',cursor:'pointer' }}>{t}</button>
          ))}
        </div>
        <div style={{ padding:'20px 24px',display:'flex',flexDirection:'column',gap:14 }}>
          {error && <div style={{ background:'#FEF2F2',color:'#B91C1C',border:'1px solid #FECACA',padding:'10px 14px',borderRadius:8,fontSize:13,whiteSpace:'pre-line' }}>{error}</div>}
          {children}
        </div>
        <div style={{ display:'flex',gap:10,justifyContent:'flex-end',padding:'16px 24px',borderTop:`1px solid ${G.border}` }}>
          <button onClick={onClose} style={{ padding:'9px 20px',borderRadius:8,border:`1px solid ${G.border}`,background:G.white,color:G.muted,cursor:'pointer',fontSize:14 }}>Cancelar</button>
          <button onClick={onSave} style={{ padding:'9px 20px',borderRadius:8,border:'none',background:G.main,color:'#fff',cursor:'pointer',fontSize:14,fontWeight:600,boxShadow:'0 4px 12px rgba(46,125,50,.3)' }}>Salvar</button>
        </div>
      </div>
    </div>
  )
}

function DetailPanel({ tcc, alunos, professores, onClose, onEdit, onDelete }) {
  if (!tcc) return null
  const alunoNome = id => alunos.find(a => a.id===id)?.nome ?? '—'
  const profNome  = id => professores.find(p => p.id===id)?.nome ?? '—'
  const tipoLabel = v => TIPOS.find(t => t.value===v)?.label ?? v
  const Detail = ({ icon, label, value }) => (
    <div style={{ display:'flex',gap:10,padding:'10px 0',borderBottom:`1px solid ${G.border}` }}>
      <span style={{ color:G.main,flexShrink:0,marginTop:2 }}>{icon}</span>
      <div>
        <div style={{ fontSize:11,color:G.muted,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:2 }}>{label}</div>
        <div style={{ fontSize:14,color:G.text,fontWeight:500 }}>{value||'—'}</div>
      </div>
    </div>
  )
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.4)',display:'flex',justifyContent:'flex-end',zIndex:998 }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ width:420,height:'100%',background:G.white,boxShadow:'-8px 0 32px rgba(0,0,0,.12)',overflowY:'auto',display:'flex',flexDirection:'column',fontFamily:'Segoe UI,system-ui,sans-serif' }}>
        <div style={{ padding:'20px 24px',borderBottom:`1px solid ${G.border}`,background:`linear-gradient(135deg,${G.bg},${G.bgMid})` }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
            <FileText size={28} color={G.main}/>
            <button onClick={onClose} style={{ background:'transparent',border:'none',cursor:'pointer',color:G.muted }}><X size={20}/></button>
          </div>
          <h2 style={{ margin:'12px 0 8px',fontSize:17,fontWeight:700,color:G.dark,lineHeight:1.4 }}>{tcc.titulo}</h2>
          <StatusBadge value={tcc.status}/>
        </div>
        <div style={{ padding:'16px 24px',flex:1 }}>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:12,color:G.muted,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8 }}>Resumo</div>
            <p style={{ fontSize:14,color:G.text,lineHeight:1.7,margin:0 }}>{tcc.resumo||'—'}</p>
          </div>
          {tcc.palavras_chave && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:12,color:G.muted,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8 }}>Palavras-chave</div>
              <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
                {tcc.palavras_chave.split(',').map(p => (
                  <span key={p} style={{ background:G.bg,color:G.main,padding:'3px 10px',borderRadius:20,fontSize:12,fontWeight:500 }}>{p.trim()}</span>
                ))}
              </div>
            </div>
          )}
          <Detail icon={<BookOpen size={16}/>}  label="Tipo"               value={tipoLabel(tcc.tipo)}/>
          <Detail icon={<Globe size={16}/>}      label="Idioma"            value={tcc.idioma==='PT'?'Português':'Inglês'}/>
          <Detail icon={<Calendar size={16}/>}   label="Semestre de Defesa" value={tcc.semestre_letivo_defesa}/>
          <Detail icon={<User size={16}/>}       label="Aluno"             value={alunoNome(tcc.aluno)}/>
          <Detail icon={<Users size={16}/>}      label="Orientador"        value={profNome(tcc.orientador)}/>
          {tcc.coorientador && <Detail icon={<Users size={16}/>} label="Coorientador" value={profNome(tcc.coorientador)}/>}
          <Detail icon={<Tag size={16}/>}        label="Presidente da Banca" value={profNome(tcc.presidente)}/>
          <Detail icon={<Tag size={16}/>}        label="1º Membro"         value={profNome(tcc.primeiro_membro)}/>
          <Detail icon={<Tag size={16}/>}        label="2º Membro"         value={profNome(tcc.segundo_membro)}/>
          {tcc.arquivo && (
            <div style={{ marginTop:16 }}>
              <a href={`http://localhost:8000${tcc.arquivo}`} target="_blank" rel="noreferrer" style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'9px 16px',background:G.bg,color:G.main,border:`1px solid ${G.light}`,borderRadius:8,fontSize:14,fontWeight:600,textDecoration:'none' }}>
                <Upload size={16}/> Ver Arquivo PDF
              </a>
            </div>
          )}
        </div>
        <div style={{ padding:'16px 24px',borderTop:`1px solid ${G.border}`,display:'flex',gap:10 }}>
          <button onClick={() => onEdit(tcc)} style={{ flex:1,padding:'10px',borderRadius:8,border:`1px solid ${G.light}`,background:G.bg,color:G.main,cursor:'pointer',fontWeight:600,fontSize:14 }}>Editar</button>
          <button onClick={() => { onDelete(tcc.id); onClose() }} style={{ flex:1,padding:'10px',borderRadius:8,border:'1px solid #FECACA',background:'#FEF2F2',color:'#B91C1C',cursor:'pointer',fontWeight:600,fontSize:14 }}>Excluir</button>
        </div>
      </div>
    </div>
  )
}

export default function TCCsPage() {
  const [data,setData]=useState([])
  const [alunos,setAlunos]=useState([])
  const [professores,setProfessores]=useState([])
  const [modal,setModal]=useState(false)
  const [detail,setDetail]=useState(null)
  const [confirmId,setConfirmId]=useState(null)
  const [form,setForm]=useState(empty)
  const [editId,setEditId]=useState(null)
  const [error,setError]=useState(null)
  const [tab,setTab]=useState(0)
  const [search,setSearch]=useState('')
  const [filterStatus,setFilterStatus]=useState('')

  const load = async () => {
    const [tccs,al,pr]=await Promise.all([getTccs(),getAlunos(),getProfessores()])
    setData(tccs.data); setAlunos(al.data); setProfessores(pr.data)
  }
  useEffect(()=>{ load() },[])

  const alunoNome = id => alunos.find(a=>a.id===id)?.nome??'—'
  const profNome  = id => professores.find(p=>p.id===id)?.nome??'—'
  const tipoLabel = v => TIPOS.find(t=>t.value===v)?.label??v
  const set = key => e => setForm(f=>({...f,[key]:e.target.value}))
  const setFile = e => setForm(f=>({...f,arquivo:e.target.files[0]??null}))

  const openAdd = () => { setForm(empty);setEditId(null);setError(null);setTab(0);setModal(true) }
  const openEdit = row => {
    setForm({ titulo:row.titulo,resumo:row.resumo,palavras_chave:row.palavras_chave,tipo:row.tipo,idioma:row.idioma,status:row.status,aluno:row.aluno,orientador:row.orientador,coorientador:row.coorientador??'',presidente:row.presidente,primeiro_membro:row.primeiro_membro,segundo_membro:row.segundo_membro,semestre_letivo_defesa:row.semestre_letivo_defesa??'',arquivo:null })
    setEditId(row.id);setError(null);setTab(0);setModal(true)
  }

  const save = async () => {
    try {
      const fd=new FormData()
      Object.entries(form).forEach(([k,v])=>{ if(k==='arquivo'){if(v)fd.append(k,v)} else if(v!==''&&v!==null)fd.append(k,v) })
      if(editId) await updateTcc(editId,fd); else await createTcc(fd)
      setModal(false); load()
    } catch(err) {
      const d=err.response?.data
      if(d){ const msgs=Object.entries(d).map(([k,v])=>`${k}: ${Array.isArray(v)?v.join(', '):v}`).join('\n'); setError(msgs) }
    }
  }

  const remove = async id => { await deleteTcc(id); setConfirmId(null); load() }

  const profOpts = professores.map(p=>({value:p.id,label:p.nome}))
  const semOpts  = SEMESTRES.map(s=>({value:s,label:s}))
  const filtered = data.filter(t => t.titulo.toLowerCase().includes(search.toLowerCase()) && (filterStatus===''||t.status===filterStatus))

  return (
    <div style={{ padding:'30px 32px',background:G.page,minHeight:'100vh',fontFamily:'Segoe UI,system-ui,sans-serif' }}>

      {/* Header */}
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24 }}>
        <div>
          <h1 style={{ margin:0,fontSize:26,fontWeight:700,color:G.dark }}>TCCs</h1>
          <p style={{ margin:'4px 0 0',fontSize:14,color:G.muted }}>{data.length} trabalho{data.length!==1?'s':''} cadastrado{data.length!==1?'s':''}</p>
        </div>
        <button onClick={openAdd} style={{ display:'flex',alignItems:'center',gap:8,padding:'10px 20px',background:G.main,color:'#fff',border:'none',borderRadius:10,cursor:'pointer',fontWeight:600,fontSize:14,boxShadow:'0 4px 12px rgba(46,125,50,.3)' }}>
          <FileText size={16}/> Novo TCC
        </button>
      </div>

      {/* Filtros */}
      <div style={{ background:G.white,border:`1px solid ${G.border}`,borderRadius:12,padding:'14px 18px',display:'flex',gap:12,alignItems:'center',marginBottom:20,boxShadow:shadow.sm }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por título..."
          style={{ flex:1,padding:'8px 12px',border:`1px solid ${G.border}`,borderRadius:8,fontSize:14,outline:'none',color:G.text }} />
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
          style={{ padding:'8px 12px',border:`1px solid ${G.border}`,borderRadius:8,fontSize:14,color:G.text,background:G.white,outline:'none' }}>
          <option value="">Todos os status</option>
          {STATUS.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        {(search||filterStatus) && (
          <button onClick={()=>{setSearch('');setFilterStatus('')}} style={{ padding:'8px 14px',background:'#FEF2F2',color:'#B91C1C',border:'1px solid #FECACA',borderRadius:8,cursor:'pointer',fontSize:13 }}>Limpar</button>
        )}
      </div>

      {/* Tabela */}
      <div style={{ background:G.white,borderRadius:12,border:`1px solid ${G.border}`,boxShadow:shadow.sm,overflow:'hidden' }}>
        <table style={{ width:'100%',borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:G.bg }}>
              {['ID','Título','Tipo','Aluno','Orientador','Status',''].map(h=>(
                <th key={h} style={{ padding:'12px 16px',textAlign:'left',fontSize:12,fontWeight:700,color:G.mid,textTransform:'uppercase',letterSpacing:'.05em',borderBottom:`1px solid ${G.bgMid}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length===0 ? (
              <tr><td colSpan={7} style={{ padding:48,textAlign:'center',color:G.muted }}>Nenhum TCC encontrado.</td></tr>
            ) : filtered.map((row,i)=>(
              <tr key={row.id} style={{ borderBottom:i<filtered.length-1?`1px solid ${G.border}`:'none',transition:'background .12s' }}
                onMouseEnter={e=>e.currentTarget.style.background=G.bg}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <td style={{ padding:'13px 16px',fontSize:13,color:G.muted }}>{row.id}</td>
                <td style={{ padding:'13px 16px',fontSize:14,color:G.text,fontWeight:500,maxWidth:220 }}>
                  <div style={{ overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{row.titulo}</div>
                </td>
                <td style={{ padding:'13px 16px',fontSize:13,color:G.muted }}>{tipoLabel(row.tipo)}</td>
                <td style={{ padding:'13px 16px',fontSize:13,color:G.text }}>{alunoNome(row.aluno)}</td>
                <td style={{ padding:'13px 16px',fontSize:13,color:G.text }}>{profNome(row.orientador)}</td>
                <td style={{ padding:'13px 16px' }}><StatusBadge value={row.status}/></td>
                <td style={{ padding:'13px 16px' }}>
                  <button onClick={()=>setDetail(row)} style={{ display:'flex',alignItems:'center',gap:4,padding:'6px 12px',background:G.bg,color:G.main,border:`1px solid ${G.light}`,borderRadius:8,cursor:'pointer',fontSize:13,fontWeight:600 }}>
                    Ver <ChevronRight size={14}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <TCCModal title={editId?'Editar TCC':'Novo TCC'} onClose={()=>setModal(false)} onSave={save} error={error} tab={tab} setTab={setTab}>
          {tab===0 && (
            <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
              <Field label="Título" icon={<FileText size={14}/>}>
                <input value={form.titulo} onChange={set('titulo')} placeholder="Título do TCC" style={inp}/>
              </Field>
              <Field label="Resumo" icon={<BookOpen size={14}/>}>
                <textarea value={form.resumo} onChange={set('resumo')} placeholder="Resumo do trabalho..." rows={4} style={{...inp,resize:'vertical'}}/>
              </Field>
              <Field label="Palavras-chave" icon={<Tag size={14}/>}>
                <input value={form.palavras_chave} onChange={set('palavras_chave')} placeholder="Ex: machine learning, redes neurais" style={inp}/>
              </Field>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
                <Field label="Tipo"><GSelect value={form.tipo} onChange={set('tipo')} options={TIPOS}/></Field>
                <Field label="Idioma" icon={<Globe size={14}/>}><GSelect value={form.idioma} onChange={set('idioma')} options={IDIOMAS}/></Field>
                <Field label="Status"><GSelect value={form.status} onChange={set('status')} options={STATUS}/></Field>
                <Field label="Semestre de Defesa" icon={<Calendar size={14}/>}><GSelect value={form.semestre_letivo_defesa} onChange={set('semestre_letivo_defesa')} options={semOpts} placeholder="Nenhum"/></Field>
              </div>
              <Field label="Arquivo PDF" icon={<Upload size={14}/>}>
                <div style={{ border:`2px dashed ${G.light}`,borderRadius:8,padding:'14px 16px',background:G.bg,display:'flex',alignItems:'center',gap:10 }}>
                  <Upload size={18} color={G.main}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,color:G.text,fontWeight:500 }}>{form.arquivo?form.arquivo.name:'Selecione um arquivo PDF'}</div>
                    <div style={{ fontSize:12,color:G.muted,marginTop:2 }}>Apenas arquivos .pdf</div>
                  </div>
                  <label style={{ padding:'7px 14px',background:G.main,color:'#fff',borderRadius:7,fontSize:13,fontWeight:600,cursor:'pointer' }}>
                    Escolher<input type="file" accept=".pdf" onChange={setFile} style={{ display:'none' }}/>
                  </label>
                </div>
              </Field>
            </div>
          )}
          {tab===1 && (
            <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
              <Field label="Aluno" icon={<User size={14}/>}><GSelect value={form.aluno} onChange={set('aluno')} options={alunos.map(a=>({value:a.id,label:a.nome}))}/></Field>
              <Field label="Orientador" icon={<Users size={14}/>}><GSelect value={form.orientador} onChange={set('orientador')} options={profOpts}/></Field>
              <Field label="Coorientador (opcional)" icon={<Users size={14}/>}><GSelect value={form.coorientador} onChange={set('coorientador')} options={profOpts} placeholder="Nenhum"/></Field>
            </div>
          )}
          {tab===2 && (
            <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
              <div style={{ padding:'12px 16px',background:G.bg,borderRadius:8,fontSize:13,color:G.mid }}>Defina os membros da banca examinadora do TCC.</div>
              <Field label="Presidente da Banca" icon={<User size={14}/>}><GSelect value={form.presidente} onChange={set('presidente')} options={profOpts}/></Field>
              <Field label="1º Membro" icon={<User size={14}/>}><GSelect value={form.primeiro_membro} onChange={set('primeiro_membro')} options={profOpts}/></Field>
              <Field label="2º Membro" icon={<User size={14}/>}><GSelect value={form.segundo_membro} onChange={set('segundo_membro')} options={profOpts}/></Field>
            </div>
          )}
        </TCCModal>
      )}

      {/* Painel de detalhes */}
      {detail && (
        <DetailPanel tcc={detail} alunos={alunos} professores={professores}
          onClose={()=>setDetail(null)}
          onEdit={row=>{ setDetail(null); openEdit(row) }}
          onDelete={id=>setConfirmId(id)}
        />
      )}

      {/* Confirmação de exclusão */}
      {confirmId && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000 }}>
          <div style={{ background:G.white,borderRadius:16,padding:28,width:360,boxShadow:shadow.hover,fontFamily:'Segoe UI,system-ui,sans-serif' }}>
            <h3 style={{ margin:'0 0 10px',color:G.dark }}>Confirmar exclusão</h3>
            <p style={{ color:G.muted,fontSize:14,lineHeight:1.6,marginBottom:20 }}>Tem certeza que deseja excluir este TCC? Esta ação não pode ser desfeita.</p>
            <div style={{ display:'flex',gap:10 }}>
              <button onClick={()=>setConfirmId(null)} style={{ flex:1,padding:'10px',borderRadius:8,border:`1px solid ${G.border}`,background:G.white,color:G.muted,cursor:'pointer',fontSize:14 }}>Cancelar</button>
              <button onClick={()=>remove(confirmId)} style={{ flex:1,padding:'10px',borderRadius:8,border:'none',background:'#DC2626',color:'#fff',cursor:'pointer',fontWeight:600,fontSize:14 }}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
