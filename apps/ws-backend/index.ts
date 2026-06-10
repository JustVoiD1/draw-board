import { WebSocket, WebSocketServer } from "ws"
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config"
import { prisma } from "@repo/db"
import http from "http"

const PORT = 8080

const server = http.createServer((req, res) => {
    if (req.url === "/" || req.url === "/health") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("WebSocket server is active and hot!");
        return;
    }
    res.writeHead(404);
    res.end();
});

const wss = new WebSocketServer({ server })
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
        // console.log("Users: ", users.length)
    })
    ws.on('message', async function message(data) {
        // {
        //     type: 'join_room',
        //     roomId: 1
        // }
        const parsedData = JSON.parse(data as unknown as string)
        if (parsedData.type === 'join_room') {
            // console.log('join message')
            const user = users.find(x => x.ws === ws);

            user?.rooms.push(parsedData.roomId)
            // console.log("Users: ", users.length)
        }
        if (parsedData.type === 'leave_room') {
            // console.log('leave message')
            const user = users.find(x => x.ws === ws);
            // console.log(`user found`)
            if (!user) {
                return
            }
            user.rooms = user.rooms.filter(x => x !== parsedData.roomId)

        }
        if (parsedData.type === 'sync_canvas') {
            const roomId = parsedData.roomId
            const shapes = parsedData.shapes // This is the full Array of Shapes

            // 1. Broadcast the new state to all OTHER users currently inside the same room
            users.forEach((user: User) => {
                if (user.rooms.includes(roomId) && user.ws !== ws) {
                    user.ws.send(JSON.stringify({
                        type: 'sync_canvas',
                        shapes: shapes,
                        roomId: roomId
                    }))
                }
            })

            try {
                // 2. Clear old state inside the Database for this room
                await prisma.chat.deleteMany({
                    where: { roomId: roomId }
                })

                // 3. Atomically write the new shape bundle to your Prisma history
                // (Maps shapes into a continuous chat records structure)
                if (shapes.length > 0) {
                    const chatPayloads = shapes.map((shape: any) => ({
                        roomId: roomId,
                        userId: userId,
                        message: typeof shape === 'string' ? shape : JSON.stringify(shape)
                    }))

                    await prisma.chat.createMany({
                        data: chatPayloads
                    })
                }
            } catch (error) {
                console.error("Failed to sync canvas shapes array to DB:", error)
            }
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
        if (parsedData.type === 'erase') {
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

        if (parsedData.type === 'update_shape') {
            //     type: "update_shape",
            //     shapeIndex: this.selectedElement,
            //     updatedShape: JSON.stringify(updatedShape),
            //     oldShape: JSON.stringify(this.selectedShape),
            //     roomId: this.roomId

            const roomId = parsedData.roomId
            const oldShape = parsedData.oldShape
            const updatedShape = parsedData.updatedShape
            const shapeIndex = parsedData.shapeIndex

            users.forEach((user: User) => {
                if (user.rooms.includes(roomId) && user.ws !== ws) {
                    user.ws.send(JSON.stringify({
                        type: 'update_shape',
                        shapeIndex,
                        updatedShape,
                        oldShape,
                        roomId
                    }))
                }
            })
            await prisma.chat.updateMany({
                where: {
                    message: parsedData.oldShape,
                    roomId: parsedData.roomId
                },
                data: {
                    message: parsedData.updatedShape,
                    roomId: parsedData.roomId
                }
            })


        }
    })

    ws.send(JSON.stringify({
        type: "connected",
    }))
})

server.listen(PORT, () => {
    console.log(`Base HTTP gateway listening on port ${PORT}`);
});
