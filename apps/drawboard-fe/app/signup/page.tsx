import { ModeToggle } from "@/components/mode-toggle"
import { BACKEND_URL } from "@/config"
import axios from "axios"
import Link from "next/link"
import { redirect } from "next/navigation"

export async function SignUp(formData: FormData) {
    'use server'
    let isSuccess = false
    try {
        const email = formData.get('email')
        const name = formData.get('name')
        const username = formData.get('username')
        const password = formData.get('password')

        const res = await axios.post(`${BACKEND_URL}/signup`, {
            email, name, username, password

        })
        if (res.data.success) {
            isSuccess = true
        }
    } catch (err) {
        console.log('Error signing up')
    }
    if (isSuccess)
        redirect('/signin')

}
export default function SignUpPage() {

    return (
        <div className='w-screen h-screen flex justify-center items-center bg-background'>
            <div className='absolute top-4 right-10'>
                <ModeToggle />
            </div>
            <div className='w-full max-w-md p-8 rounded-lg border border-border bg-card shadow-2xl'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-foreground mb-2'>Create Account</h1>
                    <p className='text-muted-foreground'>Sign up to get started</p>
                </div>

                <form action={SignUp} className="flex flex-col gap-4">
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="name" className='text-sm font-medium text-foreground'>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Enter your full name"
                            className='px-4 py-2 rounded-md bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring focus:ring-1'
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="username" className='text-sm font-medium text-foreground'>Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Choose a username"
                            className='px-4 py-2 rounded-md bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring focus:ring-1'
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="email" className='text-sm font-medium text-foreground'>Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            className='px-4 py-2 rounded-md bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring focus:ring-1'
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="password" className='text-sm font-medium text-foreground'>Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Create a password"
                            className='px-4 py-2 rounded-md bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring focus:ring-1'
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className='w-full bg-primary text-primary-foreground font-semibold py-2 rounded-md mt-4 hover:bg-primary/90 transition duration-200'
                    >
                        Sign Up
                    </button>
                </form>

                <p className='text-center text-muted-foreground text-sm mt-6'>
                    Already have an account? <Link href="/signin" className='text-primary hover:underline'>Sign in</Link>
                </p>
            </div>
        </div>
    )
}