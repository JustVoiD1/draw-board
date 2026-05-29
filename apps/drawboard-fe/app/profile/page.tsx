
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AccountDetails from "@/components/profile/account-details"
import RecentRooms from "@/components/profile/recent-rooms"
import Header from "@/components/profile/header"
import { getAccountDetails } from "@/lib/actions"


// const profile = {
//   name: "Aarav Sharma",
//   username: "aarav_draws",
//   email: "aarav@example.com",
//   joinedAt: "Feb 14, 2026",
//   bio: "I sketch UI flows and product ideas on DrawBoard.",
// }

const stats = [
  { label: "Rooms", value: "12" },
]

const recentRooms = [
  { slug: "sprint-planning", createdAt: "2 hours ago" },
  { slug: "mobile-wireframes", createdAt: "Yesterday" },
  { slug: "product-roadmap", createdAt: "3 days ago" },
]

export default async function ProfilePage() {

    const profile = await getAccountDetails()

    const recentRooms = profile.recenRooms;
    const totalRooms = profile.totalRooms

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto grid w-full max-w-6xl gap-4 p-4 md:grid-cols-3">
        <AccountDetails profile={profile}/>

        <div className="space-y-4 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{profile.bio}</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-1">
              <Card key={"totalRooms"}>
                <CardHeader>
                  <CardDescription>{'totalRooms'}</CardDescription>
                  <CardTitle className="text-2xl">{profile.totalRooms}</CardTitle>
                </CardHeader>
              </Card>
            
          </div>

         <RecentRooms recentRooms={profile.recentRooms} /> 
        </div>
      </main>
    </div>
  )
}