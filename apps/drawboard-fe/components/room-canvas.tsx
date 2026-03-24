'use client'
import { useEffect, useState } from "react"

import { WS_URL } from "@/config"
import Canvas from "./canvas"
import { getToken } from "@/lib/actions"
import { Loader2 } from "lucide-react"

export default function RoomCanvas({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMWVhOTUzYi1iNzQ2LTRjN2ItYjg0Ny1mNzQxNmYyZGFhZTEiLCJpYXQiOjE3NzExMzA5NzV9.KMl60xx9_iskRXj7ftjhCRLw45q30GCcCfSQJRUvYI4'
    // const token = document.cookie

    // console.log(document.cookie)
    useEffect(() => {
        const connectSocket = async () => {
            const token = await getToken()
            const ws = new WebSocket(`${WS_URL}/?token=${token}`)
            ws.onopen = () => {
                setSocket(ws)
                ws.send(JSON.stringify({
                    type: "join_room",
                    roomId
                }))
            }

        }


        connectSocket()

        return () => {
            if (socket?.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: "leave_room",
                    roomId
                }))
                socket.close()
            }

        }
    }, [roomId])


    if (!socket) {
        return <div className="h-screen w-screen flex justify-center items-center gap-2">
            <h1 className="text-xl text-muted-foreground">Connecting...</h1> <Loader2 className="text-primary animate-spin" />
        </div>
    }

    if (socket.readyState === WebSocket.CLOSED) {
        return <div className="h-screen w-screen flex justify-center items-center">
            <span className="text-destructive">Websocket connection closed</span>
        </div>
    }

    return <>
        <Canvas roomId={roomId} socket={socket} />

    </>
}