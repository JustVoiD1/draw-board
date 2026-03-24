import { Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card'
import { Separator } from '../ui/separator'
import { Label } from '../ui/label'
import { AtSign, Calendar, Camera, Mail, PenSquare, User } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import LogoutButton from '../logout-button'


const AccountDetails = ({ profile }: {
    profile: {
        name: string;
        username: string;
        email: string;
        joinedAt: string;
        bio: string
    }
}) => {

    return (
        <Card className="md:col-span-1">
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your account details</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="relative grid h-16 w-16 place-items-center rounded-full border border-border bg-muted text-lg font-semibold">
                        {profile.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        <button
                            type="button"
                            className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border border-border bg-background"
                            aria-label="Change profile photo"
                        >
                            <Camera className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <div>
                        <p className="text-base font-semibold">{profile.name}</p>
                        <p className="text-sm text-muted-foreground">@{profile.username}</p>
                    </div>
                </div>

                <Separator />

                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="gap-1.5">
                            <User className="h-4 w-4" />
                            Full name
                        </Label>
                        <Input id="name" value={profile.name} readOnly />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="username" className="gap-1.5">
                            <AtSign className="h-4 w-4" />
                            Username
                        </Label>
                        <Input id="username" value={profile.username} readOnly />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="gap-1.5">
                            <Mail className="h-4 w-4" />
                            Email
                        </Label>
                        <Input id="email" value={profile.email} readOnly />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="joined" className="gap-1.5">
                            <Calendar className="h-4 w-4" />
                            Joined
                        </Label>
                        <Input id="joined" value={profile.joinedAt} readOnly />
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between">
                <Button variant="outline" className="gap-1.5">
                    <PenSquare className="h-4 w-4" />
                    Edit Profile
                </Button>
                <LogoutButton />
            </CardFooter>
        </Card>
    )
}

export default AccountDetails