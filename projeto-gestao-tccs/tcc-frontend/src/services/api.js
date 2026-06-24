import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api`,
  headers: { 'Content-Type': 'application/json' },
})

// ── Unidades Acadêmicas ──────────────────────────────────────────
export const getUnidades = () => api.get('/unidades-academicas/')
export const getUnidade = (id) => api.get(`/unidades-academicas/${id}/`)
export const createUnidade = (data) => api.post('/unidades-academicas/', data)
export const updateUnidade = (id, data) => api.put(`/unidades-academicas/${id}/`, data)
export const deleteUnidade = (id) => api.delete(`/unidades-academicas/${id}/`)

// ── Departamentos ────────────────────────────────────────────────
export const getDepartamentos = () => api.get('/departamentos/')
export const getDepartamento = (id) => api.get(`/departamentos/${id}/`)
export const createDepartamento = (data) => api.post('/departamentos/', data)
export const updateDepartamento = (id, data) => api.put(`/departamentos/${id}/`, data)
export const deleteDepartamento = (id) => api.delete(`/departamentos/${id}/`)

// ── Cursos ───────────────────────────────────────────────────────
export const getCursos = () => api.get('/cursos/')
export const getCurso = (id) => api.get(`/cursos/${id}/`)
export const createCurso = (data) => api.post('/cursos/', data)
export const updateCurso = (id, data) => api.put(`/cursos/${id}/`, data)
export const deleteCurso = (id) => api.delete(`/cursos/${id}/`)

// ── Alunos ───────────────────────────────────────────────────────
export const getAlunos = () => api.get('/alunos/')
export const getAluno = (id) => api.get(`/alunos/${id}/`)
export const createAluno = (data) => api.post('/alunos/', data)
export const updateAluno = (id, data) => api.put(`/alunos/${id}/`, data)
export const deleteAluno = (id) => api.delete(`/alunos/${id}/`)

// ── Professores ──────────────────────────────────────────────────
export const getProfessores = () => api.get('/professores/')
export const getProfessor = (id) => api.get(`/professores/${id}/`)
export const createProfessor = (data) => api.post('/professores/', data)
export const updateProfessor = (id, data) => api.put(`/professores/${id}/`, data)
export const deleteProfessor = (id) => api.delete(`/professores/${id}/`)

// ── TCCs ─────────────────────────────────────────────────────────
export const getTccs = () => api.get('/tccs/')
export const getTcc = (id) => api.get(`/tccs/${id}/`)
export const createTcc = (data) => api.post('/tccs/', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
export const updateTcc = (id, data) => api.put(`/tccs/${id}/`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
export const deleteTcc = (id) => api.delete(`/tccs/${id}/`)
export const getEstatisticas = () => api.get('/tccs/estatisticas/')

export default api
