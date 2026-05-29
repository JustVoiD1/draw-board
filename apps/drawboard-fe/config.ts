// const isServer = typeof window === "undefined"

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL

if (!BACKEND_URL) {
    throw new Error('Backend url missing')
}
const WS_URL = process.env.WS_URL || process.env.NEXT_PUBLIC_WS_URL

if (!WS_URL) {
    throw new Error('websocket server url missing')
}


export {BACKEND_URL, WS_URL}