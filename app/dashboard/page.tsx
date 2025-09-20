"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser, logout, type User } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Home, UserIcon, Palette, FileText, LogOut } from "lucide-react"

const navigationItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "profile", label: "Profile Info", icon: UserIcon },
  { id: "themes", label: "Themes", icon: Palette },
  { id: "storyboards", label: "Storyboards", icon: FileText },
  { id: "logout", label: "Log Off", icon: LogOut, action: logout },
]

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeSection, setActiveSection] = useState("home")
  const router = useRouter()

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser) {
      router.push("/login")
    } else {
      setUser(currentUser)
    }
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout
      user={user}
      navigationItems={navigationItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    />
  )
}
