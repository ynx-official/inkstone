export const IS_DEMO_MODE = import.meta.env.MODE === 'demo'
export const IS_TINY_BACKEND = !IS_DEMO_MODE

export const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'password',
} as const

export function initialLoginCredentials(demo = IS_DEMO_MODE): { username: string; password: string } {
  return demo
    ? { ...DEMO_CREDENTIALS }
    : { username: '', password: '' }
}

const BACKEND_CACHE_ID = import.meta.env.VITE_API_CACHE_KEY || import.meta.env.VITE_API_BASE_URL || '/api'
export const CLIENT_DATABASE_NAME = IS_DEMO_MODE ? 'inkstone-demo' : IS_TINY_BACKEND ? `inkstone-tiny-v2:${BACKEND_CACHE_ID}` : 'inkstone'
export const UI_STORAGE_KEY = IS_DEMO_MODE ? 'inkstone.demo.ui' : 'inkstone.ui'
export const LOCALE_STORAGE_KEY = IS_DEMO_MODE ? 'inkstone-demo-locale' : 'inkstone-locale'
