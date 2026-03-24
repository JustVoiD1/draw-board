
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
const RecentRooms = ({ recentRooms }: {
    recentRooms: {
        slug: string;
        createdAt: string;
    }[]
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Rooms</CardTitle>
                <CardDescription>Your latest board activity</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {recentRooms.map((room) => (
                        <div
                            key={room.slug}
                            className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                        >
                            <p className="text-sm font-medium">{room.slug}</p>
                            <p className="text-xs text-muted-foreground">{room.createdAt}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default RecentRooms