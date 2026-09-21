import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadEnv } from 'vite'
import config from '../vite.config'

afterEach(() => vi.unstubAllEnvs())

describe('frontend build environments', () => {
  it('loads the local Go target from development env and rewrites browser routes', async () => {
    const resolved = await config({ command: 'serve', mode: 'development' })
    const proxy = resolved.server?.proxy
    const notes = proxy?.['/api/inkstone']
    const files = proxy?.['/api/files/']
    expect(notes).toMatchObject({ target: 'http://127.0.0.1:8081' })
    expect(typeof notes === 'object' && notes.rewrite?.('/api/inkstone/notes?q=test')).toBe('/inkstone/notes?q=test')
    expect(typeof files === 'object' && files.rewrite?.('/api/files/one')).toBe('/inkstone/files/one')
  })

  it('honors a process override when loading the proxy target', async () => {
    vi.stubEnv('INKSTONE_API_TARGET', 'http://127.0.0.1:19081')
    const resolved = await config({ command: 'serve', mode: 'development' })
    expect(resolved.server?.proxy?.['/api/inkstone']).toMatchObject({ target: 'http://127.0.0.1:19081' })
    expect(resolved.define?.['import.meta.env.VITE_API_CACHE_KEY']).toBe(JSON.stringify('http://127.0.0.1:19081'))
  })

  it('builds a static production frontend using the configured API prefix', async () => {
    vi.stubEnv('VITE_API_BASE_URL', undefined)
    const env = loadEnv('production', process.cwd(), '')
    expect(env.VITE_API_BASE_URL).toBe('https://go.mrsunshine.cn/prod-api/')
    const resolved = await config({ command: 'build', mode: 'production' })
    expect(resolved.build?.outDir).toBe('dist/client')
    expect(resolved.plugins?.flat(Infinity).filter(Boolean).map(plugin => (plugin as { name: string }).name).some(name => /cloudflare|wrangler/.test(name))).toBe(false)
  })

  it('keeps the standalone demo separate from Go and production output', async () => {
    const resolved = await config({ command: 'build', mode: 'demo' })
    expect(resolved.build?.outDir).toBe('dist/demo')
    expect(resolved.server?.proxy).toBeUndefined()
  })
})
