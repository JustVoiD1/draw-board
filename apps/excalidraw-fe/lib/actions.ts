'use server'
import { BACKEND_URL } from "@/config"
import axios from "axios"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function logout(){
    const cookieStore = await cookies()
    cookieStore.delete('token')
    redirect('/signin')

}

export async function getToken(){
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    return token
}

export async function Authenticate(){
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if(!token){
        redirect('/signin')
    }
    const response = await axios.get(`${BACKEND_URL}/me`, {
        headers: {
            'Authorization':   `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    if(!response.data.success){
        redirect('/signin')
    }
    return token;
}

export async function getRooms() : Promise<Room[]>{
    const token = await Authenticate()
    const response = await axios.get(`${BACKEND_URL}/rooms`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data.rooms 

}


export async function createRoom(formData: FormData) {
    const name = formData.get('name')
    console.log(name)
    const token = await getToken()
    const res = await axios.post(`${BACKEND_URL}/room`, {
            name
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
    revalidatePath('/dashboard')
}