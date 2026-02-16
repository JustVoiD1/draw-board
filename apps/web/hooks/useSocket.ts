import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket() {
    const [loading, setLoading] = useState(true)
    const [socket, setSocket] = useState<WebSocket>()
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMWVhOTUzYi1iNzQ2LTRjN2ItYjg0Ny1mNzQxNmYyZGFhZTEiLCJpYXQiOjE3NzExMzA5NzV9.KMl60xx9_iskRXj7ftjhCRLw45q30GCcCfSQJRUvYI4'

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=${token}`)
        ws.onopen = () => {
            setLoading(false)
            setSocket(ws)
        }
        return () => ws.close()
    }, [token])

    return {
        socket,
        loading
    }
}