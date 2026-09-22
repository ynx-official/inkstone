import { IS_TINY_BACKEND } from './runtime'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export function backendPath(path: string, tiny = IS_TINY_BACKEND, base = API_BASE): string {
  if (!path.startsWith('/api/')) throw new Error('API path must be local')
  if (!tiny) return path
  if (!base.startsWith('/') || base.startsWith('//')) {
    const url = new URL(base)
    if (url.username || url.password || url.search || url.hash || !['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid API base URL')
  }
  const backendRoute = path === '/api/auth/login' ? path.slice(4) : `/inkstone/${path.slice(5)}`
  return `${base.replace(/\/+$/, '')}${backendRoute}`
}

export function backendFileUrl(url: string, tiny = IS_TINY_BACKEND, base = API_BASE): string {
  return url.startsWith('/api/files/') ? backendPath(url, tiny, base) : url
}

interface BackendError { status: number; code: string; message: string; details?: unknown }

export function decodeTinyResponse(body: unknown, status: number): { data?: unknown; error: BackendError | null } {
  if (!body || typeof body !== 'object' || !('code' in body) || typeof body.code !== 'number') {
    return { error: { status: 502, code: 'invalid_response', message: 'Invalid server response' } }
  }
  const value = body as { code: number; msg?: string; data?: unknown; details?: unknown }
  if (value.code === 0 && status >= 200 && status < 300) return { data: value.data, error: null }
  const effectiveStatus = status >= 400 ? status : ([401, 403, 409, 500].includes(value.code) ? value.code : 400)
  const codes: Record<number, string> = { 400: 'bad_request', 401: 'unauthorized', 403: 'forbidden', 404: 'not_found', 409: 'conflict', 429: 'rate_limited' }
  return { error: { status: effectiveStatus, code: codes[effectiveStatus] ?? 'unknown', message: value.msg || 'Request failed', details: value.details } }
}
