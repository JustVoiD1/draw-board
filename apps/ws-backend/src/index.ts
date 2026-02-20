import { WebSocket, WebSocketServer } from "ws"
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config"
import { prisma } from "@repo/db"
const PORT = 8080
const wss = new WebSocketServer({ port: PORT })
console.log('ws server runnning on port: ', PORT)
interface User {
    ws: WebSocket
    rooms: string[],
    userId: string
}

let users: User[] = []



function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload

        if (typeof decoded === 'string') {
            return null
        }
        if (!decoded || !decoded.userId) {
            return null
        }

        return decoded.userId
    } catch (err) {
        console.error(err)
        return null
    }
    return null

}

wss.on('connection', function connection(ws, request) {
    const url = request.url
    if (!url) {
        return
    }

    const queryParams = new URLSearchParams(url.split('?')[1])
    const token = queryParams.get('token') ?? ""
    const userId = checkUser(token)
    if (!userId) {
        ws.close()
        return
    }

    users.push({
        userId,
        rooms: [],
        ws
    })

    ws.on('error', console.error)
    ws.on('close', function close() {
        users = users.filter(u => u.ws !== ws)
        console.log("Users: ", users.length)
    })
    ws.on('message', async function message(data) {
        // {
        //     type: 'join_room',
        //     roomId: 1
        // }
        const parsedData = JSON.parse(data as unknown as string)
        if (parsedData.type === 'join_room') {
            console.log('join message')
            const user = users.find(x => x.ws === ws);

            user?.rooms.push(parsedData.roomId)
            console.log("Users: ", users.length)
        }
        if (parsedData.type === 'leave_room') {
            console.log('leave message')
            const user = users.find(x => x.ws === ws);
            console.log(`user found`)
            if (!user) {
                return
            }
            user.rooms = user.rooms.filter(x => x !== parsedData.roomId)

        }
        if (parsedData.type === 'chat') {
            const roomId = parsedData.roomId
            const message = parsedData.message

            users.forEach((user: User) => {
                if (user.rooms.includes(roomId) && user.ws !== ws) {
                    user.ws.send(JSON.stringify({
                        type: 'chat',
                        message: message,
                        roomId: roomId
                    }))
                }
            })
            await prisma.chat.create({
                data: {
                    roomId,
                    message,
                    userId
                }
            })

        }
        if(parsedData.type === 'erase') {
            const roomId = parsedData.roomId
            const shape = parsedData.shape
            const shapeIndex = parsedData.shapeIndex

            users.forEach((user: User) => {
                if (user.rooms.includes(roomId) && user.ws !== ws) {
                    user.ws.send(JSON.stringify({
                        type: 'erase',
                        shape,
                        shapeIndex,
                        roomId
                    }))
                }
            })
            await prisma.chat.deleteMany({
                where: {
                    message: parsedData.shape,
                    roomId: parsedData.roomId
                }
            })
        }
    })

    ws.send(JSON.stringify({
        type: "connected",
    }))
})
