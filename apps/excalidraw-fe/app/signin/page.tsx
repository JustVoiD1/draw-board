import { BACKEND_URL } from "@/config"
import axios from "axios"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function SignIn(formData: FormData) {
    'use server'
    let isSuccess = false
    try {
        const usernameOrEmail = formData.get('usernameOrEmail')
        const password = formData.get('password')
        const res = await axios.post(`${BACKEND_URL}/signin`, {
            usernameOrEmail,
            password

        })
        console.log(usernameOrEmail, password)
        if (res.data.success) {
            isSuccess = true
            const cookieStore = await cookies()
            // ✅ Store token in HTTP-only cookie
            cookieStore.set("token", res.data.token, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                path: "/",
            })
            
        }

    } catch (err) {
        console.error('Error signing in', err)
    }
    if (isSuccess) {
        
        redirect('/canvas/chat-room-1')
    }


}
export default function SignInPage() {


    return <div className='w-screen h-screen flex justify-center items-center bg-background text-foreground'>

        <div className='p-2 m-2 rounded-md border border-white'>
            <form action={SignIn} className="flex flex-col gap-3 bg-background">
                <input type="text" name="usernameOrEmail" id="usernameOrEmail" placeholder="Username / Email" />
                <input type="password" name="password" id="password" placeholder="Password" />
                <button className='bg-blue-600' type="submit">Sign in</button>
            </form>
        </div>
    </div>
}