import RoomCanvas from "@/components/room-canvas"
import { BACKEND_URL } from "@/config"
import { Authenticate, getToken } from "@/lib/actions"
import axios from "axios"
import { headers } from "next/headers"

async function getRoomId(slug: string) {
    const token = await Authenticate()
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    )
    return response.data.room.id

}

export default async function page(
    { params }: { params: Promise<{ slug: string }> }
) {
    await Authenticate()
    const { slug } = await params
    const roomId = await getRoomId(slug)


    return <RoomCanvas roomId={roomId} />


}