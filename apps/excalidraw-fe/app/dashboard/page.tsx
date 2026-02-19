"use client"

import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search } from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!

type Room = {
  slug: string
  createdAt: string
}

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/signin")
      return
    }

    axios.get(`${BACKEND_URL}/rooms`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setRooms(res.data.rooms))
      .catch(() => setError("Failed to load rooms"))
      .finally(() => setLoading(false))
  }, [router])

  const filteredRooms = useMemo(() => {
    return rooms.filter(room =>
      room.slug.toLowerCase().includes(query.toLowerCase())
    )
  }, [rooms, query])

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[80vh] flex items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Your Rooms</h1>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search room..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Empty state */}
      {filteredRooms.length === 0 ? (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">
            {rooms.length === 0
              ? "No rooms created yet"
              : "No rooms match your search"}
          </p>
          <Button onClick={() => router.push("/create-room")}>
            Create Room
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map(room => (
            <Card
              key={room.slug}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => router.push(`/canvas/${room.slug}`)}
            >
              <CardHeader>
                <CardTitle>{room.slug}</CardTitle>
                <CardDescription>
                  Created {new Date(room.createdAt).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Join Room</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
