"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { getUserTheme, updateUserTheme } from "@/lib/auth"
import Image from "next/image"
import { themes, applyTheme, dispatchThemeChange, type Theme } from "@/lib/theme-utils"

export function ThemesContent() {
  const [selectedTheme, setSelectedTheme] = useState("minimalist")
  const [previewTheme, setPreviewTheme] = useState<string | null>(null)

  // Function to get theme-specific logo source
  const getThemeLogo = (theme: Theme) => {
    const themeLogos = {
      professional: "/logos/logo-professional.png",
      classic: "/logos/logo-classic.png", 
      noir: "/logos/logo-filmnoir.png",
      indie: "/logos/logo-indie.png",
      minimalist: "/logos/logo-minimalist.png",
      cyberpunk: "/logos/logo-cyberpunk.png"
    }
    
    return themeLogos[theme.id as keyof typeof themeLogos] || "/logos/logo-minimalist.png"
  }

  const getButtonStyling = (theme: Theme, isSelected: boolean) => {
    if (isSelected) {
      return {
        backgroundColor: theme.colors.primary,
        color: theme.colors.primaryForeground,
        borderColor: theme.colors.primary,
      }
    }
  }

  useEffect(() => {
    const userTheme = getUserTheme()
    setSelectedTheme(userTheme)
    // Apply the user's saved theme on mount
    handleThemeChange(userTheme)
  }, [])

  const handleThemeChange = (themeId: string) => {
    // Use the shared theme application function
    applyTheme(themeId)

    // Save theme preference to user profile
    updateUserTheme(themeId)
    setSelectedTheme(themeId)
    setPreviewTheme(null)
    
    // Dispatch custom event for logo updates
    dispatchThemeChange(themeId)
  }

  const previewThemeColors = (themeId: string) => {
    setPreviewTheme(themeId)
  }

  const resetPreview = () => {
    setPreviewTheme(null)
  }

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.id
          const isPreview = previewTheme === theme.id

          return (
            <Card
              key={theme.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105",
                isSelected && "ring-2 ring-primary",
                isPreview && "ring-2 ring-blue-500"
              )}
              style={{
                backgroundColor: theme.colors.card,
                color: theme.colors.foreground,
                borderColor: isSelected ? theme.colors.primary : theme.colors.border
              }}
              onMouseEnter={() => previewThemeColors(theme.id)}
              onMouseLeave={resetPreview}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-20 h-20 flex items-center justify-center">
                    <Image
                      src={getThemeLogo(theme)}
                      alt={`${theme.name} logo`}
                      width={72}
                      height={72}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg mb-1" style={{ color: theme.colors.foreground }}>{theme.name}</CardTitle>
                <p className="text-sm" style={{ color: theme.colors.mutedForeground }}>
                  {theme.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-2">
                {/* Complete Color Palette Preview */}
                <div className="space-y-1">
                  <div className="text-xs font-medium" style={{ color: theme.colors.mutedForeground }}>
                    Complete Color Palette
                  </div>
                  
                  {/* Row 1: First 10 Colors */}
                  <div className="grid grid-cols-10 gap-1">
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.primary }}
                      title="Primary"
                    />
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.secondary }}
                      title="Secondary"
                    />
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.accent }}
                      title="Accent"
                    />
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.muted }}
                      title="Muted"
                    />
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.destructive }}
                      title="Destructive"
                    />
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.background }}
                      title="Background"
                    />
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.card }}
                      title="Card"
                    />
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.popover }}
                      title="Popover"
                    />
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.input }}
                      title="Input"
                    />
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.border }}
                      title="Border"
                    />
                  </div>
                  
                  {/* Row 2: Remaining 10 Colors */}
                  <div className="grid grid-cols-10 gap-1">
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.foreground }}
                      title="Foreground"
                    />
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.primaryForeground }}
                      title="Primary Text"
                    />
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.secondaryForeground }}
                      title="Secondary Text"
                    />
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.mutedForeground }}
                      title="Muted Text"
                    />
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.accentForeground }}
                      title="Accent Text"
                    />
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.sidebar }}
                      title="Sidebar"
                    />
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.sidebarPrimary }}
                      title="Sidebar Primary"
                    />
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.sidebarAccent }}
                      title="Sidebar Accent"
                    />
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.sidebarBorder }}
                      title="Sidebar Border"
                    />
                    <div 
                      className="h-4 rounded border border-border/30"
                      style={{ backgroundColor: theme.colors.ring }}
                      title="Ring/Focus"
                    />
                  </div>
                </div>

                <Button
                  className="w-full h-8 text-xs font-medium transition-all duration-200"
                  variant={isSelected ? "secondary" : "default"}
                  onClick={() => handleThemeChange(theme.id)}
                  style={{
                    backgroundColor: isSelected ? theme.colors.primary : theme.colors.muted,
                    color: isSelected ? theme.colors.primaryForeground : theme.colors.mutedForeground,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    borderWidth: '1px'
                  }}
                >
                  {isSelected ? "✓ Applied" : "Apply Theme"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}