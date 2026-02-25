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
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { joinRoom } from "@/lib/actions"

export default function JoinRoomButton() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="bg-primary text-background dark:text-foreground ">Join Room</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form action={joinRoom}>
                    <DialogHeader>
                        <DialogTitle>Join a Room</DialogTitle>
                        <DialogDescription>
                            Enter the room name to join
                        </DialogDescription>
                    </DialogHeader>
                    <Field>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="your-room-name" />
                    </Field>
                    <DialogFooter>

                            <DialogClose asChild>
                                <Button variant="outline" type="button">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button variant="default" type="submit">Join</Button>
                            </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}