const API_URL = import.meta.env.VITE_API_URL
const TIMEOUT = parseInt(import.meta.env.VITE_REQUEST_TIMEOUT || '30000')

export const USE_LOCAL_STORAGE = import.meta.env.VITE_USE_LOCAL_STORAGE === 'true'

async function request(method, path, body) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), TIMEOUT)
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  } finally {
    clearTimeout(id)
  }
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
}
