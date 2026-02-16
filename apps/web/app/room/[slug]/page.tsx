import axios from "axios"
import { ChatRoom } from "../../../components/ChatRoom"
import { BACKEND_URL } from "../../../config"
async function getRoomId(slug: string) {
  const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
  console.log(response.data)
  return response.data.room.id

}
const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const roomId = await getRoomId(slug)


  return (
    <div style={{
      height: '100dvh',
      width: '100dvw',
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2
    }}>
      <ChatRoom id={roomId} />

    </div>
  )
}

export default page 
