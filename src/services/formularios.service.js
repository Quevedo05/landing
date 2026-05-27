import { api, USE_LOCAL_STORAGE } from './api.js'

export async function getFormulariosActivos() {
  if (USE_LOCAL_STORAGE) {
    const str = localStorage.getItem('sc_formularios')
    return str ? JSON.parse(str) : []
  }
  const data = await api.get('/formularios/publicos/activos')
  return data.formularios || []
}
