
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Sidebar from "./sidebar"
import MainContent from "./main-content"
import { Menu, Pencil, User } from "lucide-react"
import { getRooms } from "@/lib/actions"
import Link from "next/link"
import  CreateRoomButton  from "./create-room-button"
import JoinRoomButton from "./join-room-button"

const DashboardPage = async () => {
    const rooms = await getRooms()


    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
                <div className="flex items-center justify-between px-4 py-3">
                    {/* hamburger menu */}
                    <div className="flex items-center gap-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetHeader>
                                <SheetTitle><div className="flex items-center space-x-2">
                                    <Pencil className="h-6 w-6 text-slate-900 dark:text-white" />
                                    <span className="text-xl font-bold text-slate-900 dark:text-white">DrawBoard</span>
                                </div></SheetTitle>
                            </SheetHeader>
                            <SheetContent side="left" className="w-64">
                                <nav className="mt-10 space-y-2 flex flex-col gap-3 px-2 ">
                                    <CreateRoomButton/>
                                    <JoinRoomButton/>
                                    <Link href='/profile' >
                                        <Button variant="ghost" className="w-full justify-start">Profile</Button>
                                    </Link>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header >

            <div className="flex">
                {/* Sidebar */}
                <Sidebar />

                {/* Main */}

                <MainContent rooms={rooms} />
            </div>
        </div >
    )
}

export default DashboardPage