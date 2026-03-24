import RoomCanvas from "@/components/room-canvas"
import { BACKEND_URL } from "@/config"
import { Authenticate } from "@/lib/actions"
import axios from "axios"

async function getRoomId(slug: string) {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
    return response.data.room.id

}

export default async function page(
    { params }: { params: Promise<{ slug: string }> }
) {
    await Authenticate()
    const { slug } = await params
    const roomId = await getRoomId(slug)
    console.log(roomId)


    return <RoomCanvas roomId={roomId} />


}