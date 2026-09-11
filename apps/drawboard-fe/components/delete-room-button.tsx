'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { deleteRoom } from '@/lib/actions'

export default function DeleteRoomButton({
    slug,
    onDeleted,
}: {
    slug: string
    onDeleted?: () => void
}) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)

        const result = await deleteRoom(slug)

        if (!result.success) {
            alert(result.error)
            setLoading(false)
            return
        }

        setLoading(false)
        setOpen(false)

        onDeleted?.()
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <Button
            className='cursor-pointer'
                variant="destructive"
                onClick={() => setOpen(true)}
                disabled={loading}
            >
                <Trash2 />
            </Button>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete room?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-foreground">
                            {slug}
                        </span>
                        ?
                        <br />
                        This will permanently delete the room and
                        all of its chats. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-destructive cursor-pointer text-destructive-foreground hover:bg-destructive/90"
                    >
                        {loading ? 'Deleting...' : 'Delete Room'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}