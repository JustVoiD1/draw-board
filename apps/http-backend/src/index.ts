import express from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config"
import { CreateRoomSchema, SigninSchema, SignupSchema } from "@repo/common/types"
import { authMiddleware } from "./middleware";
import { prisma } from "@repo/db"
import { hashPassword, comparePassword } from "@repo/backend-common/config"
import cors from "cors"
const port = 4000
const app = express()
app.use(express.json())
app.use(cors())

app.get(`/health`, async (req, res) => {
    const users = await prisma.user.findMany()

    res.json({
        success: true,
        status: 'ok'
    })
})
app.get(`/me`, authMiddleware, async (req, res) => {
    return res.json({
        success: true,
        message: "Authenticated"

    })
})
app.get('/account', authMiddleware, async (req, res) => {
    const userId = req.userId
    const userDetails = await prisma.user.findFirst({
        where: {
            id: userId
        }, omit: {
            id: true,
            password: true
        }
    })
    if (!userDetails) {
        return res.status(404).json({
            success: false,
            error: 'No such user'
        })
    }
    const joinedAt = new Date(userDetails.joinedAt)
    const formmatDate = (date: Date) => date.toLocaleDateString('en-GB').replace(/(\d{4})$/, (year) => year.slice(-2));
    const totalRooms = await prisma.room.count({
        where: {
            adminId: userId
        }
    })

    const recentRooms = await prisma.room.findMany({
        where: {
            adminId: userId, // optional: only this user's rooms
        },
        orderBy: {
            createdAt: "desc", // newest first
        },
        take: 3, // only 3 rooms
        select: {
            id: true,
            slug: true,
            createdAt: true,
        },
    });


    return res.json({
        success: true,
        user: {
            ...userDetails,
            joinedAt: formmatDate(joinedAt),
            totalRooms,
            recentRooms: recentRooms.map(room => ({
                id: room.id,
                slug: room.slug,
                createdAt: formmatDate(new Date(room.createdAt))
            }))
        }
    })
})


app.post('/signup', async (req, res) => {
    const data = SignupSchema.safeParse(req.body)
    if (!data.success) {
        return res.status(403).json({
            success: false,
            error: "Invalid format"
        })
    }
    try {
        const { username, password, email, name } = data.data
        const existingUser = await prisma.user.findFirst({
            where: {
                username
            }
        })
        if (existingUser) {
            return res.status(402).json({
                success: false,
                error: 'User already exists.'
            })
        }
        const hashedPassword = await hashPassword(password)
        const user = await prisma.user.create({
            data: {
                username, password: hashedPassword, email, name
            }
        })

        return res.json({
            success: true,
            message: "Signed up successfully",
            user: {
                username: user.username,
                name: user.name
            }
        })

    } catch (err) {
        console.error(err)
        return res.status(403).json({
            success: false,
            error: "SIgnup failed"
        })
    }

})

app.post('/signin', async (req, res) => {
    const data = SigninSchema.safeParse(req.body)
    console.log(data.data)
    if (!data.success) {
        return res.json({
            error: "Invalid format",
            success: false

        })
    }
    try {

        const { usernameOrEmail, password } = data.data

        const user = await prisma.user.findFirst({
            where: {
                OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
            }
        })
        if (!user) {
            return res.status(404).json({
                error: 'No such user found',
                success: false
            })
        }
        const isPasswordVerified = await comparePassword(password, user.password)
        if (!isPasswordVerified) {
            res.status(403).json({
                success: false,
                error: "Invalid Credentials"
            })
            return
        }

        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET)
        res.json({
            message: 'Signed in Successfuly',
            token,
            success: true
        })

    } catch (err) {
        console.error(`Signin error: ${err}`)
        res.json({
            success: false,
            error: "Signin Failed"
        })
    }


})

app.post('/room', authMiddleware, async (req, res) => {
    try {
        const parsedData = CreateRoomSchema.safeParse(req.body)
        if (!parsedData.success) {
            return res.json({
                success: false,
                message: "Incorrect Schema"
            })
        }
        const userId = req.userId
        if (!userId) {
            return res.json({
                success: false,
                error: "Missing user id"
            })
        }
        const existingRoom = await prisma.room.findFirst({
            where: {
                slug: parsedData.data.name
            }
        })
        if (existingRoom) {
            return res.status(402).json({
                success: false,
                error: "Room already exists"
            })
        }

        // db call
        const room = await prisma.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        })

        res.json({
            message: "Room created successfully",
            roomId: room.id,
            success: true
        })
    } catch (err) {

        console.error("Room creation error: ", err)
        res.status(500).json({
            success: false,
            error: "Room creation error"
        })
    }

})

app.get('/rooms', authMiddleware, async (req, res) => {
    const userId = req.userId
    try {
        const rooms = await prisma.room.findMany({
            where: {
                adminId: userId
            }
        })
        res.json({
            success: true,
            rooms: rooms.map((r) => ({
                slug: r.slug,
                createdAt: r.createdAt

            }))
        })

    } catch (err) {
        console.error('Error fetching rooms', err)
        res.status(500).json({
            success: false,
            error: 'Rooms fetching error'
        })
    }
})

app.get(`/chats/:roomId`, async (req, res) => {
    const roomId = Number(req.params.roomId)
    try {
        console.log("roomId: ", roomId)
        const messages = await prisma.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50,
        })
        res.json({
            status: true,
            roomId: roomId,
            messages: messages
        })

    } catch (err) {
        console.error(err)
        res.json({
            success: false,
            roomId: roomId,
            messages: []
        })
    }

})
app.get(`/room/:slug`, async (req, res) => {
    const slug = req.params.slug
    const room = await prisma.room.findFirst({
        where: {
            slug
        }

    })
    res.json({
        status: true,
        room
    })
})

app.listen(port, () => {
    console.log(`app listening to port ${port}`)
})