import { BACKEND_URL } from "@/config"
import axios from "axios"

export async function getExistingShapes(roomId: string) {
    try {
        const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`)
        const messages = response.data.messages
        // console.log(messages)
        const shapes = messages.map((x: MessageType) => {
            const messageData = JSON.parse(x.message)
            // console.log(messageData)
            return messageData as Shape
        })

        return shapes

    } catch (err) {
        console.error('Error gettting existing shapes: ', err)
    }

}