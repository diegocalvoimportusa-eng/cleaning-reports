import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

const client = axios.create({ baseURL: API_BASE })

// Derive API origin (backend host) and helper for asset URLs
export const API_ORIGIN = API_BASE.replace(/\/api\/?$/,'')
export function assetUrl(p) {
  if (!p) return null
  return p.startsWith('http') ? p : `${API_ORIGIN}${p}`
}

// Interceptors for auth
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const auth = {
  register: (data) => client.post('/auth/register', data),
  login: (data) => client.post('/auth/login', data)
}

export const users = {
  me: () => client.get('/users/me'),
  list: () => client.get('/users')
}

export const buildings = {
  list: () => client.get('/buildings'),
  create: (data) => client.post('/buildings', data),
  upload: (id, file) => {
    const fd = new FormData()
    fd.append('file', file)
    return client.post(`/buildings/${id}/photo`, fd)
  },
  addArea: (id, data) => client.post(`/buildings/${id}/areas`, data)
}

export const uploads = {
  single: (file, relatedType, relatedId) => {
    const fd = new FormData()
    fd.append('file', file)
    if (relatedType) fd.append('relatedType', relatedType)
    if (relatedId) fd.append('relatedId', relatedId)
    return client.post('/uploads', fd)
  }
}

export const inspections = {
  list: () => client.get('/inspections'),
  create: (data) => client.post('/inspections', data),
  get: (id) => client.get(`/inspections/${id}`),
  finalize: (id, data) => client.put(`/inspections/${id}/finalize`, data),
  upload: (id, file) => {
    const fd = new FormData()
    fd.append('file', file)
    return client.post(`/inspections/${id}/photo`, fd)
  }
}

export const tasks = {
  list: () => client.get('/tasks'),
  create: (data) => client.post('/tasks', data),
  get: (id) => client.get(`/tasks/${id}`),
  update: (id, data) => client.put(`/tasks/${id}`, data),
  complete: (id) => client.post(`/tasks/${id}/complete`)
}

export const claims = {
  list: () => client.get('/claims'),
  create: (data) => client.post('/claims', data),
  convertToTask: (id) => client.put(`/claims/${id}/convert-task`)
}

export const reports = {
  list: () => client.get('/reports'),
  generate: (data) => client.post('/reports/generate', data),
  get: (id) => client.get(`/reports/${id}`)
}

export default client
