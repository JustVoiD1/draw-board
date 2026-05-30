import{ z } from "zod"

export const SignupSchema = z.object({
    username: z.string().max(100).min(5),
    email: z.email().max(100).min(6),
    password: z.string().max(100).min(8),
    name: z.string().max(100).min(8)

})
export const SigninSchema = z.object({
    usernameOrEmail: z.string().max(100).min(5),
    password: z.string().max(100).min(8)

})

export const CreateRoomSchema = z.object({
    name: z.string().max(100).min(3)
})