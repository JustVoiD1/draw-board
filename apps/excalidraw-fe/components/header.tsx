import { Menu, Pencil, Sheet, User } from "lucide-react";
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import CreateRoomButton from "./create-room-button";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export default function Header() {


    return <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
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
                        <nav className="mt-6 space-y-2">
                            <CreateRoomButton />
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

}