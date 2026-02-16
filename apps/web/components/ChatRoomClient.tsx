'use client'

import { useEffect, useState } from "react"
import { useSocket } from "../hooks/useSocket"


export function ChatRoomClient({messages, id}: {
    messages: {message: string}[],
    id: string
}) {
    const [chats, setChats] = useState(messages)
    const {socket, loading} = useSocket()
    
    async function sendMessage (formData: FormData) {
    const inputMessage = formData.get('inputMessage')
    
    socket?.send(JSON.stringify({
        type: 'chat',
        roomId: id,
        message: inputMessage
    }))
}

    useEffect(() => {
        if(socket && !loading) {
            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }))
            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data)

                if(parsedData.type === 'chat'){
                    setChats(c => [...c, {message: parsedData.message}])
                }
            }
        }
    
      
    }, [socket, loading, id, messages])

    return <div>

        {messages.map(m => <div key={m.message}>{m.message}</div>)}
        <form action={sendMessage}>
        <input type="text" name="inputMessage" placeholder="Type here"/>
        <button type='submit'>Send</button>
        </form>
    </div>
    

}