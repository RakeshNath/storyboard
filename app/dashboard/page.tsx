"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser, logout, getUserTheme, type User } from "@/lib/auth"
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

// Theme application function
const applyUserTheme = (themeId: string) => {
  const themes = {
    professional: {
      primary: "hsl(210 40% 98%)",
      primaryForeground: "hsl(222.2 84% 4.9%)",
      secondary: "hsl(210 40% 96%)",
      secondaryForeground: "hsl(222.2 84% 4.9%)",
      background: "hsl(0 0% 100%)",
      foreground: "hsl(222.2 84% 4.9%)",
      card: "hsl(0 0% 100%)",
      cardForeground: "hsl(222.2 84% 4.9%)",
      popover: "hsl(0 0% 100%)",
      popoverForeground: "hsl(222.2 84% 4.9%)",
      muted: "hsl(210 40% 96%)",
      mutedForeground: "hsl(215.4 16.3% 46.9%)",
      accent: "hsl(210 40% 96%)",
      accentForeground: "hsl(222.2 84% 4.9%)",
      destructive: "hsl(0 84.2% 60.2%)",
      destructiveForeground: "hsl(210 40% 98%)",
      border: "hsl(214.3 31.8% 91.4%)",
      input: "hsl(214.3 31.8% 91.4%)",
      ring: "hsl(222.2 84% 4.9%)",
      sidebar: "hsl(210 40% 96%)",
      sidebarForeground: "hsl(222.2 84% 4.9%)",
      sidebarPrimary: "hsl(222.2 84% 4.9%)",
      sidebarPrimaryForeground: "hsl(210 40% 98%)",
      sidebarAccent: "hsl(210 40% 94%)",
      sidebarAccentForeground: "hsl(222.2 84% 4.9%)",
      sidebarBorder: "hsl(214.3 31.8% 91.4%)",
      sidebarRing: "hsl(222.2 84% 4.9%)"
    },
    minimalist: {
      primary: "oklch(0.15 0.01 200)",
      primaryForeground: "oklch(0.95 0.01 200)",
      secondary: "oklch(0.90 0.01 200)",
      secondaryForeground: "oklch(0.20 0.01 200)",
      background: "oklch(0.98 0.005 200)",
      foreground: "oklch(0.20 0.01 200)",
      card: "oklch(0.99 0.005 200)",
      cardForeground: "oklch(0.20 0.01 200)",
      popover: "oklch(0.99 0.005 200)",
      popoverForeground: "oklch(0.20 0.01 200)",
      muted: "oklch(0.92 0.01 200)",
      mutedForeground: "oklch(0.45 0.01 200)",
      accent: "oklch(0.85 0.05 200)",
      accentForeground: "oklch(0.15 0.01 200)",
      destructive: "oklch(0.55 0.22 25)",
      destructiveForeground: "oklch(0.95 0.01 200)",
      border: "oklch(0.88 0.01 200)",
      input: "oklch(0.88 0.01 200)",
      ring: "oklch(0.15 0.01 200)",
      sidebar: "oklch(0.92 0.01 200)",
      sidebarForeground: "oklch(0.20 0.01 200)",
      sidebarPrimary: "oklch(0.15 0.01 200)",
      sidebarPrimaryForeground: "oklch(0.95 0.01 200)",
      sidebarAccent: "oklch(0.88 0.01 200)",
      sidebarAccentForeground: "oklch(0.20 0.01 200)",
      sidebarBorder: "oklch(0.85 0.01 200)",
      sidebarRing: "oklch(0.15 0.01 200)"
    },
    dark: {
      primary: "hsl(210 40% 98%)",
      primaryForeground: "hsl(222.2 84% 4.9%)",
      secondary: "hsl(217.2 32.6% 17.5%)",
      secondaryForeground: "hsl(210 40% 98%)",
      background: "hsl(222.2 84% 4.9%)",
      foreground: "hsl(210 40% 98%)",
      card: "hsl(222.2 84% 4.9%)",
      cardForeground: "hsl(210 40% 98%)",
      popover: "hsl(222.2 84% 4.9%)",
      popoverForeground: "hsl(210 40% 98%)",
      muted: "hsl(217.2 32.6% 17.5%)",
      mutedForeground: "hsl(215 20.2% 65.1%)",
      accent: "hsl(217.2 32.6% 17.5%)",
      accentForeground: "hsl(210 40% 98%)",
      destructive: "hsl(0 62.8% 30.6%)",
      destructiveForeground: "hsl(210 40% 98%)",
      border: "hsl(217.2 32.6% 17.5%)",
      input: "hsl(217.2 32.6% 17.5%)",
      ring: "hsl(212.7 26.8% 83.9%)",
      sidebar: "hsl(217.2 32.6% 17.5%)",
      sidebarForeground: "hsl(210 40% 98%)",
      sidebarPrimary: "hsl(210 40% 98%)",
      sidebarPrimaryForeground: "hsl(222.2 84% 4.9%)",
      sidebarAccent: "hsl(217.2 32.6% 20%)",
      sidebarAccentForeground: "hsl(210 40% 98%)",
      sidebarBorder: "hsl(217.2 32.6% 15%)",
      sidebarRing: "hsl(212.7 26.8% 83.9%)"
    },
    warm: {
      primary: "hsl(24 9.8% 10%)",
      primaryForeground: "hsl(0 0% 98%)",
      secondary: "hsl(60 9.1% 97.8%)",
      secondaryForeground: "hsl(24 9.8% 10%)",
      background: "hsl(0 0% 100%)",
      foreground: "hsl(24 9.8% 10%)",
      card: "hsl(0 0% 100%)",
      cardForeground: "hsl(24 9.8% 10%)",
      popover: "hsl(0 0% 100%)",
      popoverForeground: "hsl(24 9.8% 10%)",
      muted: "hsl(60 9.1% 97.8%)",
      mutedForeground: "hsl(25 5.3% 44.7%)",
      accent: "hsl(60 9.1% 97.8%)",
      accentForeground: "hsl(24 9.8% 10%)",
      destructive: "hsl(0 84.2% 60.2%)",
      destructiveForeground: "hsl(0 0% 98%)",
      border: "hsl(20 5.9% 90%)",
      input: "hsl(20 5.9% 90%)",
      ring: "hsl(24 9.8% 10%)",
      sidebar: "hsl(60 9.1% 97.8%)",
      sidebarForeground: "hsl(24 9.8% 10%)",
      sidebarPrimary: "hsl(24 9.8% 10%)",
      sidebarPrimaryForeground: "hsl(0 0% 98%)",
      sidebarAccent: "hsl(60 9.1% 95%)",
      sidebarAccentForeground: "hsl(24 9.8% 10%)",
      sidebarBorder: "hsl(20 5.9% 90%)",
      sidebarRing: "hsl(24 9.8% 10%)"
    },
    cool: {
      primary: "hsl(222.2 84% 4.9%)",
      primaryForeground: "hsl(210 40% 98%)",
      secondary: "hsl(210 40% 96%)",
      secondaryForeground: "hsl(222.2 84% 4.9%)",
      background: "hsl(0 0% 100%)",
      foreground: "hsl(222.2 84% 4.9%)",
      card: "hsl(0 0% 100%)",
      cardForeground: "hsl(222.2 84% 4.9%)",
      popover: "hsl(0 0% 100%)",
      popoverForeground: "hsl(222.2 84% 4.9%)",
      muted: "hsl(210 40% 96%)",
      mutedForeground: "hsl(215.4 16.3% 46.9%)",
      accent: "hsl(210 40% 96%)",
      accentForeground: "hsl(222.2 84% 4.9%)",
      destructive: "hsl(0 84.2% 60.2%)",
      destructiveForeground: "hsl(210 40% 98%)",
      border: "hsl(214.3 31.8% 91.4%)",
      input: "hsl(214.3 31.8% 91.4%)",
      ring: "hsl(222.2 84% 4.9%)",
      sidebar: "hsl(210 40% 96%)",
      sidebarForeground: "hsl(222.2 84% 4.9%)",
      sidebarPrimary: "hsl(222.2 84% 4.9%)",
      sidebarPrimaryForeground: "hsl(210 40% 98%)",
      sidebarAccent: "hsl(210 40% 94%)",
      sidebarAccentForeground: "hsl(222.2 84% 4.9%)",
      sidebarBorder: "hsl(214.3 31.8% 91.4%)",
      sidebarRing: "hsl(222.2 84% 4.9%)"
    },
    cyberpunk: {
      primary: "oklch(0.7 0.25 180)",
      primaryForeground: "oklch(0.08 0.05 180)",
      secondary: "oklch(0.3 0.15 180)",
      secondaryForeground: "oklch(0.85 0.1 180)",
      background: "oklch(0.08 0.05 180)",
      foreground: "oklch(0.85 0.1 180)",
      card: "oklch(0.12 0.08 180)",
      cardForeground: "oklch(0.85 0.1 180)",
      popover: "oklch(0.12 0.08 180)",
      popoverForeground: "oklch(0.85 0.1 180)",
      muted: "oklch(0.3 0.15 180)",
      mutedForeground: "oklch(0.65 0.12 180)",
      accent: "oklch(0.4 0.2 180)",
      accentForeground: "oklch(0.85 0.1 180)",
      destructive: "oklch(0.55 0.22 25)",
      destructiveForeground: "oklch(0.85 0.1 180)",
      border: "oklch(0.35 0.18 180)",
      input: "oklch(0.3 0.15 180)",
      ring: "oklch(0.75 0.3 300)",
      sidebar: "oklch(0.12 0.08 180)",
      sidebarForeground: "oklch(0.85 0.1 180)",
      sidebarPrimary: "oklch(0.75 0.3 300)",
      sidebarPrimaryForeground: "oklch(0.08 0.05 180)",
      sidebarAccent: "oklch(0.3 0.15 180)",
      sidebarAccentForeground: "oklch(0.85 0.1 180)",
      sidebarBorder: "oklch(0.35 0.18 180)",
      sidebarRing: "oklch(0.75 0.3 300)"
    }
  }

  const theme = themes[themeId as keyof typeof themes]
  if (!theme) return

  const root = document.documentElement
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value)
  })
  
  // Dispatch custom event for logo updates
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeId } }))
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeSection, setActiveSection] = useState("home")
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUser = getUser()
      if (!currentUser) {
        router.push("/login")
      } else {
        setUser(currentUser)
        // Apply user's saved theme
        const userTheme = getUserTheme()
        applyUserTheme(userTheme)
      }
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
