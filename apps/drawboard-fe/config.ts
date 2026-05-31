const isServer = typeof window === 'undefined';

// HTTP Backend Routing
const BACKEND_URL = isServer
  ? (process.env.SERVER_HTTP_URL || process.env.NEXT_PUBLIC_BACKEND_URL)
  : process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) { 
  throw new Error('Backend URL missing'); 
}

// WebSocket Routing
const WS_URL = isServer
  ? (process.env.SERVER_WS_URL || process.env.NEXT_PUBLIC_WS_URL)
  : process.env.NEXT_PUBLIC_WS_URL;

if (!WS_URL) { 
  throw new Error('Websocket server URL missing'); 
}

export { BACKEND_URL, WS_URL };
