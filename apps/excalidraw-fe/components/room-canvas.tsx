'use client'
import { useEffect, useState } from "react"

import { WS_URL } from "@/config"
import Canvas from "./canvas"

export default function RoomCanvas({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMWVhOTUzYi1iNzQ2LTRjN2ItYjg0Ny1mNzQxNmYyZGFhZTEiLCJpYXQiOjE3NzExMzA5NzV9.KMl60xx9_iskRXj7ftjhCRLw45q30GCcCfSQJRUvYI4'
    // const token = document.cookie

        // console.log(document.cookie)
    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}/?token=${token}`)
        ws.onopen = () => {
            setSocket(ws)
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }))
        }
        return () => {

        }
    }, [])


    if (!socket) {
        return <div>
            Connecting...
        </div>
    }

    return <>
        <Canvas roomId={roomId} socket={socket} />

    </>
}