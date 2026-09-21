import { describe, expect, it } from 'vitest'
import { backendPath, backendFileUrl, decodeTinyResponse } from './backend'

describe('Tiny backend transport', () => {
  it('uses the configured production base without losing the prod-api prefix', () => {
    expect(backendPath('/api/notes?id=1', true, 'https://go.mrsunshine.cn/prod-api/')).toBe('https://go.mrsunshine.cn/prod-api/inkstone/notes?id=1')
    expect(backendFileUrl('/api/files/object-id', true, 'https://go.mrsunshine.cn/prod-api/')).toBe('https://go.mrsunshine.cn/prod-api/inkstone/files/object-id')
    expect(backendFileUrl('https://images.example/image.png', true, 'https://go.mrsunshine.cn/prod-api/')).toBe('https://images.example/image.png')
    expect(() => backendPath('/api/notes', true, 'https://name:secret@other.example/')).toThrow()
  })
  it('maps only local API paths and leaves the demo protocol alone', () => {
    expect(backendPath('/api/notes?q=a%20b', true)).toBe('/api/inkstone/notes?q=a%20b')
    expect(backendPath('/api/notes', false)).toBe('/api/notes')
    expect(() => backendPath('https://other.example/api/notes', true)).toThrow()
  })
  it('unwraps successful responses and rejects business errors sent with HTTP 200', () => {
    expect(decodeTinyResponse({ code: 0, msg: 'success', data: { id: 'one' } }, 200)).toEqual({ data: { id: 'one' }, error: null })
    expect(decodeTinyResponse({ code: 1, msg: 'rejected' }, 200).error).toEqual({ status: 400, code: 'bad_request', message: 'rejected', details: undefined })
  })
  it('preserves authentication and version conflicts with recovery details', () => {
    expect(decodeTinyResponse({ code: 401, msg: 'expired' }, 401).error?.status).toBe(401)
    const note = { id: 'one', rev: 3 }
    expect(decodeTinyResponse({ code: 1, msg: 'conflict', details: { note } }, 409).error).toEqual({ status: 409, code: 'conflict', message: 'conflict', details: { note } })
  })
  it('rejects malformed or unexpected responses rather than treating them as saved', () => {
    for (const body of [null, {}, { code: '0', data: {} }, '<html>']) {
      expect(decodeTinyResponse(body, 200).error?.status).toBe(502)
    }
  })
})
