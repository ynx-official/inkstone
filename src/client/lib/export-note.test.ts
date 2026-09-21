import { afterEach, expect, it, vi } from 'vitest'

vi.mock('./markdown/renderer', () => ({ renderMarkdown: () => ({ html: '<img src="https://go.mrsunshine.cn/prod-api/inkstone/files/one"><img src="https://other.example/photo.png">' }) }))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.resetModules()
})

it('embeds private production images with session credentials without fetching external images', async () => {
  vi.stubEnv('VITE_BACKEND', 'tiny')
  vi.stubEnv('VITE_API_BASE_URL', 'https://go.mrsunshine.cn/prod-api/')
  const fetchImage = vi.fn().mockResolvedValue({ ok: true, blob: async () => new Blob(['image'], { type: 'image/png' }) })
  vi.stubGlobal('fetch', fetchImage)
  const createObjectURL = vi.fn().mockReturnValue('blob:export')
  vi.stubGlobal('URL', Object.assign(class extends URL {}, { createObjectURL, revokeObjectURL: vi.fn() }))
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  const { exportNoteAsHtml } = await import('./export-note')
  await exportNoteAsHtml({ title: 'Example', content: 'image' }, 'zh-CN')
  expect(fetchImage).toHaveBeenCalledExactlyOnceWith('https://go.mrsunshine.cn/prod-api/inkstone/files/one', { credentials: 'include' })
  const exported = await new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.readAsText(createObjectURL.mock.calls[0][0])
  })
  expect(exported).toContain('data:image/png;base64,aW1hZ2U=')
  expect(exported).toContain('https://other.example/photo.png')
})
