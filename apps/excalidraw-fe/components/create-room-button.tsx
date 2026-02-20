'use client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { createRoom } from "@/lib/actions"


export default function CreateRoomButton() {
    return (
        <Dialog>
            <form action={createRoom}>
                <DialogTrigger asChild>
                    <Button variant="outline">Create Room</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Create Room</DialogTitle>
                        <DialogDescription>
                            give a unique name to the room, no spaces allowed
                        </DialogDescription>
                    </DialogHeader>
                    <input id="name-1" name="name" type="text" />
                    <Button type="submit">Create</Button>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
