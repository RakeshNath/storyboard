"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { User } from "@/lib/auth"
import { type LucideIcon, Film, RefreshCw } from "lucide-react"
import { HomeContent } from "./sections/home-content"
import { ProfileContent } from "./sections/profile-content"
import { ThemesContent } from "./sections/themes-content"
import { StoryboardsContent } from "./sections/storyboards-content"
import { PlaygroundContent } from "./sections/playground-content"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getUserTheme } from "@/lib/auth"

interface NavigationItem {
  id: string
  label: string
  icon: LucideIcon
  action?: () => void
}

interface DashboardLayoutProps {
  user: User
  navigationItems: NavigationItem[]
  activeSection: string
  onSectionChange: (section: string) => void
}

export function DashboardLayout({ user, navigationItems, activeSection, onSectionChange }: DashboardLayoutProps) {
  const [currentTheme, setCurrentTheme] = useState<string>("minimalist")

  useEffect(() => {
    // Get the current theme
    const theme = getUserTheme()
    setCurrentTheme(theme)

    // Listen for theme changes
    const handleThemeChange = (event: CustomEvent) => {
      setCurrentTheme(event.detail.theme)
    }

    window.addEventListener('themeChanged', handleThemeChange as EventListener)
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange as EventListener)
    }
  }, [])

  // Function to get theme-specific logo source
  const getThemeLogo = (theme: string) => {
    const themeLogos = {
      professional: "/logos/logo-professional.png",
      classic: "/logos/logo-classic.png", 
      noir: "/logos/logo-filmnoir.png",
      indie: "/logos/logo-indie.png",
      minimalist: "/logos/logo-minimalist.png",
      cyberpunk: "/logos/logo-cyberpunk.png"
    }
    
    return themeLogos[theme as keyof typeof themeLogos] || "/logos/logo-minimalist.png"
  }

  // Function to get theme border color
  const getThemeBorderColor = (theme: string) => {
    const borderColors = {
      professional: "#3b82f6", // Professional blue
      dark: "#6366f1", // Classic indigo
      warm: "#f97316", // Film Noir orange
      indie: "#a855f7", // Indie Spirit purple
      minimalist: "#64748b", // Minimalist slate
      cyberpunk: "#22c55e" // Cyberpunk green
    }
    
    return borderColors[theme as keyof typeof borderColors] || "#3b82f6"
  }

  const handleNavClick = (item: NavigationItem) => {
    if (item.action) {
      item.action()
    } else {
      onSectionChange(item.id)
    }
  }

  const handleClearCache = () => {
    // Clear localStorage
    localStorage.clear()
    
    // Show confirmation
    alert("Cache cleared! The page will refresh in 2 seconds.")
    
    // Refresh the page after a short delay
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <HomeContent user={user} />
      case "profile":
        return <ProfileContent user={user} />
      case "themes":
        return <ThemesContent />
      case "storyboards":
        return <StoryboardsContent />
      case "playground":
        return <PlaygroundContent />
      default:
        return <HomeContent user={user} />
    }
  }

  const getPageTitle = () => {
    switch (activeSection) {
      case "home":
        return "Dashboard"
      case "profile":
        return "Profile Information"
      case "themes":
        return "Themes"
      case "storyboards":
        return "Storyboards"
      case "playground":
        return "Playground"
      default:
        return "Dashboard"
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Pane */}
        <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center justify-center">
              <Image
                src={getThemeLogo(currentTheme)}
                alt="StoryBoard Logo"
                width={140}
                height={42}
                className="max-w-full h-auto transition-all duration-300"
                priority
              />
            </div>
          </div>

          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id

                return (
                  <li key={item.id}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-11",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                      onClick={() => handleNavClick(item)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        {/* Main Pane */}
        <div className="flex-1 flex flex-col">
          <header className="bg-card border-b border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-card-foreground">{getPageTitle()}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeSection === "home" && "Overview of your storyboard writing progress"}
                  {activeSection === "profile" && "Manage your account settings and preferences"}
                  {activeSection === "themes" && "Customize your writing environment"}
                  {activeSection === "storyboards" && "Manage your storyboard projects"}
                  {activeSection === "playground" && "Your experimental space for testing new features and ideas"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCache}
                  className="text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Clear Cache
                </Button>
                <div className="text-sm text-muted-foreground">Welcome back, {user.name}</div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8">{renderContent()}</main>
        </div>
      </div>

      {/* Credits Pane */}
      <div className="bg-muted border-t border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-sm text-muted-foreground">StoryBoard - Professional Storyboard Writing Portal © 2024</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Built with Next.js</span>
          </div>
        </div>
      </div>
    </div>
  )
}
