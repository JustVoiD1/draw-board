import { ModeToggle } from "@/components/mode-toggle"
import { Input } from "@/components/ui/input"
import { BACKEND_URL } from "@/config"
import axios from "axios"
import { cookies } from "next/headers"
import Link from "next/link"
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
            cookieStore.set("token", res.data.token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
                maxAge: 24 * 60 * 60
            })

        }

    } catch (err) {
        console.error('Error signing in', err)
    }
    if (isSuccess) {

        // redirect('/canvas/chat-room-1')
        redirect('/dashboard')
    }


}
export default async function SignInPage() {


return (
    <div className='relative w-screen h-screen flex justify-center items-center bg-background'>
        <div className='absolute top-4 right-10'>
            <ModeToggle/>
        </div>
        
        <div className='w-full max-w-md p-8 rounded-lg border border-border bg-card shadow-2xl'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-foreground mb-2'>Welcome Back</h1>
                <p className='text-muted-foreground'>Sign in to your account</p>
            </div>
            
            <form action={SignIn} className="flex flex-col gap-4">
                <div className='flex flex-col gap-2'>
                    <label htmlFor="usernameOrEmail" className='text-sm font-medium text-foreground'>Username or Email</label>
                    <Input 
                        type="text" 
                        name="usernameOrEmail" 
                        id="usernameOrEmail" 
                        placeholder="Enter username or email"

                    />
                </div>
                
                <div className='flex flex-col gap-2'>
                    <label htmlFor="password" className='text-sm font-medium text-foreground'>Password</label>
                    <Input 
                        type="password" 
                        name="password" 
                        id="password" 
                        placeholder="Enter your password"
                    />
                </div>
                
                <button 
                    type="submit"
                    className='w-full bg-primary text-primary-foreground font-semibold py-2 rounded-md mt-4 hover:bg-primary/90 transition duration-200'
                >
                    Sign In
                </button>
            </form>
            
            <p className='text-center text-muted-foreground text-sm mt-6'>
                Don&apos;t have an account? <Link href="/signup" className='text-primary hover:underline'>Sign up</Link>
            </p>
        </div>
    </div>
)
}