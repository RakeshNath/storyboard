"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser, logout, type User } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Home, UserIcon, Palette, FileText, Play, LogOut } from "lucide-react"

const navigationItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "profile", label: "Profile Info", icon: UserIcon },
  { id: "themes", label: "Themes", icon: Palette },
  { id: "storyboards", label: "Storyboards", icon: FileText },
  { id: "playground", label: "Playground", icon: Play },
  { id: "logout", label: "Log Off", icon: LogOut, action: logout },
]


export default function StoryboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeSection, setActiveSection] = useState("storyboards")
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const currentUser = getUser()
        if (currentUser) {
          setUser(currentUser)
        } else {
          // Create a temporary user for testing
          const tempUser = {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            theme: 'minimalist'
          }
          setUser(tempUser)
        }
      } catch (error) {
        console.error('Auth error:', error)
        // Create a temporary user for testing
        const tempUser = {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          theme: 'minimalist'
        }
        setUser(tempUser)
      }
    }
  }, [router])

  const handleSectionChange = (section: string) => {
    if (section === "logout") {
      logout()
    } else {
      router.push(`/${section}`)
    }
  }


  return (
    <DashboardLayout
      user={user}
      navigationItems={navigationItems}
      onSectionChange={handleSectionChange}
    />
  )
}
