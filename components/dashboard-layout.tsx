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
import { usePathname } from "next/navigation"
import { getUserTheme, updateUserTheme } from "@/lib/auth"
import { clearAppStorage } from "@/lib/storage"
import { DevCachePanel } from "./dev-cache-panel"
import { applyTheme, dispatchThemeChange } from "@/lib/theme-utils"

interface NavigationItem {
  id: string
  label: string
  icon: LucideIcon
  action?: () => void
}

interface DashboardLayoutProps {
  user: User
  navigationItems: NavigationItem[]
  activeSection?: string
  onSectionChange: (section: string) => void
}


export function DashboardLayout({ user, navigationItems, activeSection, onSectionChange }: DashboardLayoutProps) {
  const [currentTheme, setCurrentTheme] = useState<string>("minimalist")
  const pathname = usePathname()
  
  // Auto-determine active section from pathname if not provided
  const getActiveSection = () => {
    if (activeSection) return activeSection
    
    const path = pathname.replace('/', '')
    if (path === 'home' || path === '') return 'home'
    if (path === 'profile') return 'profile'
    if (path === 'themes') return 'themes'
    if (path === 'storyboard' || path === 'storyboards') return 'storyboards'
    if (path === 'playground') return 'playground'
    
    return 'home' // default
  }
  
  const currentActiveSection = getActiveSection()


  useEffect(() => {
    // Get the current theme and apply it
    const theme = getUserTheme()
    setCurrentTheme(theme)
    applyTheme(theme)

    // Listen for theme changes
    const handleThemeChange = (event: CustomEvent) => {
      const newTheme = event.detail.theme
      setCurrentTheme(newTheme)
      // Note: applyTheme is already called by the theme change dispatcher
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

  const handleNavClick = (item: NavigationItem) => {
    if (item.action) {
      item.action()
    } else {
      onSectionChange(item.id)
    }
  }

  const handleClearCache = () => {
    // Clear application storage (preserves auth)
    clearAppStorage()
    
    // Show confirmation
    alert("✅ Cache cleared! All stored content has been reset. The page will refresh in 2 seconds.")
    
    // Refresh the page after a short delay
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  const renderContent = () => {
    switch (currentActiveSection) {
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
    switch (currentActiveSection) {
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
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Left Pane */}
        <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col flex-shrink-0">
          <div className="p-6 border-b border-sidebar-border flex-shrink-0">
            <div className="flex items-center justify-center">
              <Image
                src={getThemeLogo(currentTheme)}
                alt="StoryBoard Logo"
                width={140}
                height={42}
                style={{ width: "auto", height: "auto", maxWidth: "100%" }}
                className="transition-all duration-300"
                priority
              />
            </div>
          </div>

          <div className="p-4 border-b border-sidebar-border flex-shrink-0">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = currentActiveSection === item.id

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
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-card border-b border-border p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-card-foreground">{getPageTitle()}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentActiveSection === "home" && "Overview of your storyboard writing progress"}
                  {currentActiveSection === "profile" && "Manage your account settings and preferences"}
                  {currentActiveSection === "themes" && "Customize your writing environment"}
                  {currentActiveSection === "storyboards" && "Manage your storyboard projects"}
                  {currentActiveSection === "playground" && "Your experimental space for testing new features and ideas"}
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
                <div className="text-sm text-muted-foreground">Welcome back, {user?.name || 'User'}</div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
        </div>
      </div>

      {/* Credits Pane */}
      <div className="bg-muted border-t border-border p-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-sm text-muted-foreground">StoryBoard - Professional Storyboard Writing Portal © 2024</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Built with Next.js</span>
          </div>
        </div>
      </div>

      {/* Developer Cache Panel (dev only) */}
      <DevCachePanel />
    </div>
  )
}
