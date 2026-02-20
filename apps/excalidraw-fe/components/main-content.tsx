'use client'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Input } from './ui/input'
import LogoutButton from './logout-button'
import { Button } from './ui/button'
import { CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Card } from './ui/card'
import Link from 'next/link'
import CreateRoomButton from './create-room-button'

const MainContent = ({
    rooms
}: {
    rooms: Room[]
}) => {

    const [query, setQuery] = useState("")
    const filteredRooms = useMemo(() => {
        return rooms.filter(room =>
            room.slug.toLowerCase().includes(query.toLowerCase())
        )
    }, [rooms, query])
      
    return (
        <main className="flex-1 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search room..."
                        className="pl-9"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="md:hidden">
                    <LogoutButton />
                </div>
            </div>

            {filteredRooms.length === 0 ? (
                <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                    <p className="text-muted-foreground">
                        {rooms.length === 0
                            ? "No rooms created yet"
                            : "No rooms match your search"}
                    </p>
                    <CreateRoomButton/>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredRooms.map(room => (
                        <Card
                            key={room.slug as string}
                            className="cursor-pointer hover:shadow-lg transition"

                        >
                            <CardHeader>
                                <CardTitle>{room.slug}</CardTitle>
                                <CardDescription>
                                    Created {new Date(room.createdAt).toLocaleString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href={`/canvas/${room.slug}`}>
                                <Button className="w-full">Join Room</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    )
}

export default MainContent