import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {GraduationCap,Building2,School,BookOpen,Users,UserCog,FileText,ArrowRight} from 'lucide-react'
import {getUnidades,getDepartamentos,getCursos,getAlunos,getProfessores,getTccs,} from '../services/api.js'

export default function HomePage() {
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    unidades: 0,
    departamentos: 0,
    cursos: 0,
    alunos: 0,
    professores: 0,
    tccs: 0,
  })

  useEffect(() => {
    async function load() {
      try {
        const [unidades,departamentos,cursos,alunos,professores,tccs] = await Promise.all([
          getUnidades(),
          getDepartamentos(),
          getCursos(),
          getAlunos(),
          getProfessores(),
          getTccs(),
        ])

        setStats({
          unidades: unidades.data.length,
          departamentos: departamentos.data.length,
          cursos: cursos.data.length,
          alunos: alunos.data.length,
          professores: professores.data.length,
          tccs: tccs.data.length,
        })
      } 
      catch (err) {
        console.log(err)
      } 
      finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const modules = [
    {
      title: 'Unidades Acadêmicas',
      desc: 'Gerencie as unidades da universidade.',
      icon: <Building2 size={30} />,
      to: '/unidades',
    },
    {
      title: 'Departamentos',
      desc: 'Gerencie os departamentos.',
      icon: <School size={30} />,
      to: '/departamentos',
    },
    {
      title: 'Cursos',
      desc: 'Gerencie os cursos.',
      icon: <BookOpen size={30} />,
      to: '/cursos',
    },
    {
      title: 'Alunos',
      desc: 'Gerencie os alunos cadastrados.',
      icon: <Users size={30} />,
      to: '/alunos',
    },
    {
      title: 'Professores',
      desc: 'Gerencie os professores.',
      icon: <UserCog size={30} />,
      to: '/professores',
    },
    {
      title: 'TCCs',
      desc: 'Gerencie os trabalhos de conclusão.',
      icon: <FileText size={30} />,
      to: '/tccs',
    },
  ]
  const cards = [
    {
      icon: <Building2 color="#2E7D32" />,
      value: stats.unidades,
      label: 'Unidades',
    },
    {
      icon: <School color="#2E7D32" />,
      value: stats.departamentos,
      label: 'Departamentos',
    },
    {
      icon: <BookOpen color="#2E7D32" />,
      value: stats.cursos,
      label: 'Cursos',
    },
    {
      icon: <Users color="#2E7D32" />,
      value: stats.alunos,
      label: 'Alunos',
    },
    {
      icon: <UserCog color="#2E7D32" />,
      value: stats.professores,
      label: 'Professores',
    },
    {
      icon: <FileText color="#2E7D32" />,
      value: stats.tccs,
      label: 'TCCs',
    },
  ]
  return (
    <div
      style={{
        padding: 30,
        background: '#F8FAFC',
        minHeight: '100vh',
      }}
    >
      {/* HERO */}
      <div
        style={{
          background: 'linear-gradient(135deg,#E8F5E9,#C8E6C9)',
          borderRadius: 20,
          padding: 40,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: 40,
          border: '1px solid #C8E6C9'}}>
        <div>
          <div
            style={{display: 'flex',alignItems: 'center',gap: 15,marginBottom: 20}}>
            <GraduationCap size={42} color="#2E7D32"/>
            <h1 style={{margin: 0,fontSize: 34,color: '#1B4332'}}>
              Sistema de Gestão de TCCs
            </h1>
          </div>

          <p style={{color: '#52796F',fontSize: 17,maxWidth: 620, lineHeight: 1.7}}>
            Gerencie unidades acadêmicas, departamentos, cursos,
            professores, alunos e trabalhos de conclusão de curso
            em um único ambiente.
          </p>
        </div>
        <Link to="/tccs"
          style={{
            padding: '14px 24px',
            background: '#2E7D32',
            color: 'white',
            borderRadius: 10,
            textDecoration: 'none',
            fontWeight: 600,
          }}>
          Gerenciar TCCs
        </Link>
      </div>
      {/* VISÃO GERAL */}

      <div style={{ marginBottom: 45 }}>
        <h2 style={{color: '#1B4332',marginBottom: 20,fontSize: 24}}>
          Visão Geral
        </h2>
        <div
          style={{display: 'grid',gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',gap: 20,}}>
          {cards.map((card) => (
            <div
              key={card.label}
              style={{
                background: '#FFFFFF',
                borderRadius: 16,
                padding: 25,
                border: '1px solid #E2E8F0',
                boxShadow: '0 6px 16px rgba(0,0,0,.05)',
                transition: '.25s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow =
                  '0 12px 30px rgba(46,125,50,.18)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)'
                e.currentTarget.style.boxShadow =
                  '0 6px 16px rgba(0,0,0,.05)'
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: '#E8F5E9',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 18,
                }}
              >
                {card.icon}
              </div>

              <div
                style={{
                  fontSize: 34,
                  fontWeight: 700,
                  color: '#2E7D32',
                }}
              >
                {loading ? '...' : card.value}
              </div>

              <div
                style={{
                  color: '#64748B',
                  marginTop: 6,
                }}
              >
                {card.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MÓDULOS */}
      <div>
        <h2
          style={{color: '#1B4332',marginBottom: 20,fontSize: 24,}}>
          Módulos do Sistema
        </h2>
        <div style={{display: 'grid',gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',gap: 22,}}>
          {modules.map((module) => (
            <Link
              key={module.title}
              to={module.to}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div
                style={{
                  background: '#FFF',
                  borderRadius: 18,
                  border: '1px solid #E2E8F0',
                  padding: 24,
                  boxShadow: '0 6px 16px rgba(0,0,0,.05)',
                  transition: '.25s',
                  height: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow =
                    '0 15px 35px rgba(46,125,50,.18)'
                  e.currentTarget.style.borderColor = '#81C784'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow =
                    '0 6px 16px rgba(0,0,0,.05)'
                  e.currentTarget.style.borderColor = '#E2E8F0'
                }}
              >
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 16,
                    background: '#E8F5E9',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#2E7D32',
                    marginBottom: 18,
                  }}
                >
                  {module.icon}
                </div>

                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: 12,
                    color: '#1B4332',
                  }}
                >
                  {module.title}
                </h3>

                <p
                  style={{
                    color: '#64748B',
                    lineHeight: 1.6,
                    marginBottom: 24,
                    minHeight: 45,
                  }}
                >
                  {module.desc}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: '#2E7D32',
                    fontWeight: 600,
                  }}
                >
                  Acessar

                  <ArrowRight size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
            {/* RODAPÉ DA HOME */}
      <div
        style={{
          marginTop: 45,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
          gap: 20,
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid #E2E8F0',
            borderRadius: 18,
            padding: 24,
            boxShadow: '0 6px 16px rgba(0,0,0,.05)',
          }}
        >
          <h3 style={{marginTop: 0,color: '#1B4332', }}>
            📌 Sobre o Sistema
          </h3>
          <p style={{ color: '#64748B', lineHeight: 1.7}}>
            Este sistema foi desenvolvido para centralizar o gerenciamento
            das informações acadêmicas relacionadas aos Trabalhos de
            Conclusão de Curso, permitindo o cadastro e a organização de
            unidades acadêmicas, departamentos, cursos, professores,
            alunos e TCCs.
          </p>
        </div>

        <div
          style={{
            background: '#fff',
            border: '1px solid #E2E8F0',
            borderRadius: 18,
            padding: 24,
            boxShadow: '0 6px 16px rgba(0,0,0,.05)',
          }}
        >
          <h3 style={{ marginTop: 0,color: '#1B4332'}}>
            📊 Resumo do Sistema
          </h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              marginTop: 18,
            }}>
            <div style={{ display: 'flex',justifyContent: 'space-between'}}>
              <span>Total de Cadastros</span>
              <strong style={{ color: '#2E7D32' }}>
                {loading
                  ? '...'
                  : stats.unidades +
                    stats.departamentos +
                    stats.cursos +
                    stats.alunos +
                    stats.professores +
                    stats.tccs}
              </strong>
            </div>
            <div style={{display: 'flex',justifyContent: 'space-between'}}>
              <span>Última atualização</span>
              <strong style={{ color: '#2E7D32' }}>
                {new Date().toLocaleDateString('pt-BR')}
              </strong>
            </div>
            <div style={{display: 'flex',justifyContent: 'space-between',}}>
              <span>Status</span>
              <strong style={{color: '#2E7D32'}}>
                Sistema Online
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}