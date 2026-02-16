'use server'

import { redirect } from "next/navigation"

export async function joinRoom (formData: FormData) {
    const roomId = formData.get("roomId")
    redirect(`/room/${roomId}`)
    console.log('Joined: ', roomId )
  }