import { BACKEND_URL } from "@/config"
import axios from "axios"
import { redirect } from "next/navigation"

export async function SignUp(formData: FormData) {
    'use server'
    try {
    const email = formData.get('email')
    const name = formData.get('name')
    const username = formData.get('username')
    const password = formData.get('password')
    
    const res = await axios.post(`${BACKEND_URL}/signup`, {
            email, name, username, password
        
    })
    if(res.data.success){
        redirect('/signin')
    }
    } catch (err) {
        console.log('Error signing in')
    }
}
export default function SignUpPage () {

    return <div className='w-screen h-screen flex justify-center items-center bg-background text-foreground'>
    
                <div className='p-2 m-2 rounded-md border border-white'>
                    <form action={SignUp} className="flex flex-col gap-3 bg-background">
                <input type="text" name="name" id="name" placeholder="Name"/>
                <input type="text" name="username" id="username" placeholder="Username"/>
                <input type="text" name="email" id="email" placeholder="Email"/>
                <input type="text" name="password" id="password" placeholder="Password"/>
                <button className='bg-blue-600' type="submit">Sign up</button>
                    </form>
                </div>
            </div>
}