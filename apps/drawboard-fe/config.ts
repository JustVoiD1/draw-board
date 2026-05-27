const isServer = typeof window === "undefined"

export const BACKEND_URL = isServer
    ? process.env.INTERNAL_BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL
    : process.env.NEXT_PUBLIC_BACKEND_URL

if (!BACKEND_URL) {
    throw new Error('Backend url missing')
}

export const WS_URL = isServer
    ? process.env.INTERNAL_WS_URL ?? process.env.NEXT_PUBLIC_WS_URL
    : process.env.NEXT_PUBLIC_WS_URL

if (!WS_URL) {
    throw new Error('websocket server url missing')
}