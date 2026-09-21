import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { pull, replay } = vi.hoisted(() => ({ pull: vi.fn(async () => {}), replay: vi.fn(async () => {}) }))
vi.mock('./runtime', () => ({ IS_TINY_BACKEND: true }))
vi.mock('./api', () => ({ CLIENT_ID: 'test-client' }))
vi.mock('./db', () => ({ createBroadcast: () => ({ post: vi.fn(), close: vi.fn() }) }))
vi.mock('../store/notes', () => ({ useNotes: { getState: () => ({ cursor: 0, pull, replayPending: replay }) }, acknowledgeOutboxBaseAdvanced: vi.fn(), acknowledgeOutboxResult: vi.fn() }))
vi.mock('../store/session', () => ({ useSession: { getState: () => ({ settings: { sync: { realtime: true, pollIntervalMs: 15000 } } }) } }))
import { SyncEngine } from './sync'

class TestEvents extends EventTarget {
  static connections: TestEvents[] = []
  readyState = 1
  onopen: (() => void) | null = null
  onerror: (() => void) | null = null
  closed = false
  constructor(readonly url: string) { super(); TestEvents.connections.push(this) }
  close() { this.closed = true; this.readyState = 2 }
}

describe('Go sync events', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('EventSource', TestEvents); TestEvents.connections = []; pull.mockClear(); Object.defineProperty(document, 'hidden', { configurable: true, value: false }) })
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals() })
  it('uses the browser event endpoint and pulls durable changes on notification', async () => {
    const engine = new SyncEngine(true, 15000)
    try {
      engine.start(); await vi.advanceTimersByTimeAsync(1000)
      const events = TestEvents.connections[0]
      expect(events?.url).toBe('/api/inkstone/sync/events')
      events.dispatchEvent(new MessageEvent('changed', { data: JSON.stringify({ cursor: 5, type: 'changed', origin: null }) }))
      await vi.advanceTimersByTimeAsync(1000)
      expect(pull).toHaveBeenCalled()
    } finally { engine.dispose() }
    expect(TestEvents.connections.every(event => event.closed)).toBe(true)
  })
})
