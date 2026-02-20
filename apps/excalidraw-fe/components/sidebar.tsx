import { Button } from './ui/button'
import LogoutButton from './logout-button'
import Link from 'next/link'
import CreateRoomButton from './create-room-button'

const Sidebar = () => {
    return (
        <aside className="hidden md:block w-64 border-r border-border p-4">
            <nav className="space-y-2 flex flex-col gap-3">
                <CreateRoomButton/>
                <Link href={'/profile'}>
                    <Button variant="ghost" className="w-full justify-start">Profile</Button>
                </Link>
                <LogoutButton />
            </nav>
        </aside>
    )
}

export default Sidebar
