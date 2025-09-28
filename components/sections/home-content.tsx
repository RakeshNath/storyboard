import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "@/lib/auth"
import { Film, FileText, Clock, Star } from "lucide-react"

interface HomeContentProps {
  user: User
}

export function HomeContent({ user }: HomeContentProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-balance">Welcome, {user.name}</h1>
        <p className="text-muted-foreground mt-2 text-pretty">
          Ready to craft your next masterpiece? Your creative workspace awaits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card role="article">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Storyboards</h3>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>

        <Card role="article">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Pages Written</h3>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+23 this week</p>
          </CardContent>
        </Card>

        <Card role="article">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Hours Spent</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>

        <Card role="article">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Completed</h3>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">First draft finished</p>
          </CardContent>
        </Card>
      </div>

      <Card role="article">
        <CardHeader>
          <h2 className="leading-none font-semibold">Recent Activity</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Updated "The Last Stand" storyboard</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Created new storyboard "Midnight Express"</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Completed first draft of "Ocean's Edge"</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
