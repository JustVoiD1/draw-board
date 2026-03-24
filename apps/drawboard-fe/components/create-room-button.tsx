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
import { createRoom } from "@/lib/actions"

export default function CreateRoomButton() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="bg-green-600 text-background dark:text-foreground hover:bg-green-200 hover:dark:bg-green-900">Create Room</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form action={createRoom}>
                    <DialogHeader>
                        <DialogTitle>Create Room</DialogTitle>
                        <DialogDescription>
                            Give a unique name without spaces
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
                                <Button variant="default" type="submit">Create</Button>
                            </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}