"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { getUserTheme, updateUserTheme } from "@/lib/auth"
import Image from "next/image"

interface Theme {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    background: string
    foreground: string
    card: string
    cardForeground: string
    popover: string
    popoverForeground: string
    muted: string
    mutedForeground: string
    accent: string
    accentForeground: string
    destructive: string
    destructiveForeground: string
    border: string
    input: string
    ring: string
    sidebar: string
    sidebarForeground: string
    sidebarPrimary: string
    sidebarPrimaryForeground: string
    sidebarAccent: string
    sidebarAccentForeground: string
    sidebarBorder: string
    sidebarRing: string
  }
  textStyle: {
    heading: string
    body: string
  }
}

const themes: Theme[] = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean and modern design for professional screenwriters",
    colors: {
      primary: "oklch(0.45 0.15 264)",
      primaryForeground: "oklch(0.98 0.005 264)",
      secondary: "oklch(0.15 0.02 264)",
      secondaryForeground: "oklch(0.95 0.01 264)",
      background: "oklch(0.08 0.01 264)",
      foreground: "oklch(0.92 0.01 264)",
      card: "oklch(0.12 0.015 264)",
      cardForeground: "oklch(0.92 0.01 264)",
      popover: "oklch(0.12 0.015 264)",
      popoverForeground: "oklch(0.92 0.01 264)",
      muted: "oklch(0.18 0.02 264)",
      mutedForeground: "oklch(0.65 0.02 264)",
      accent: "oklch(0.22 0.025 264)",
      accentForeground: "oklch(0.85 0.01 264)",
      destructive: "oklch(0.55 0.22 25)",
      destructiveForeground: "oklch(0.92 0.01 264)",
      border: "oklch(0.22 0.025 264)",
      input: "oklch(0.18 0.02 264)",
      ring: "oklch(0.65 0.18 264)",
      sidebar: "oklch(0.12 0.015 264)",
      sidebarForeground: "oklch(0.92 0.01 264)",
      sidebarPrimary: "oklch(0.65 0.18 264)",
      sidebarPrimaryForeground: "oklch(0.08 0.01 264)",
      sidebarAccent: "oklch(0.18 0.02 264)",
      sidebarAccentForeground: "oklch(0.85 0.01 264)",
      sidebarBorder: "oklch(0.22 0.025 264)",
      sidebarRing: "oklch(0.65 0.18 264)",
    },
    textStyle: {
      heading: "font-bold tracking-tight",
      body: "font-normal leading-relaxed",
    },
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional Hollywood-inspired theme with warm tones",
    colors: {
      primary: "oklch(0.55 0.18 45)",
      primaryForeground: "oklch(0.98 0.005 45)",
      secondary: "oklch(0.20 0.05 45)",
      secondaryForeground: "oklch(0.95 0.02 45)",
      background: "oklch(0.20 0.02 45)",
      foreground: "oklch(0.88 0.02 45)",
      card: "oklch(0.24 0.03 45)",
      cardForeground: "oklch(0.88 0.02 45)",
      popover: "oklch(0.24 0.03 45)",
      popoverForeground: "oklch(0.88 0.02 45)",
      muted: "oklch(0.30 0.05 45)",
      mutedForeground: "oklch(0.65 0.03 45)",
      accent: "oklch(0.40 0.08 45)",
      accentForeground: "oklch(0.85 0.02 45)",
      destructive: "oklch(0.55 0.22 25)",
      destructiveForeground: "oklch(0.88 0.02 45)",
      border: "oklch(0.35 0.06 45)",
      input: "oklch(0.30 0.05 45)",
      ring: "oklch(0.65 0.15 45)",
      sidebar: "oklch(0.24 0.03 45)",
      sidebarForeground: "oklch(0.88 0.02 45)",
      sidebarPrimary: "oklch(0.65 0.15 45)",
      sidebarPrimaryForeground: "oklch(0.20 0.02 45)",
      sidebarAccent: "oklch(0.30 0.05 45)",
      sidebarAccentForeground: "oklch(0.85 0.02 45)",
      sidebarBorder: "oklch(0.35 0.06 45)",
      sidebarRing: "oklch(0.65 0.15 45)",
    },
    textStyle: {
      heading: "font-bold tracking-wide",
      body: "font-normal leading-7",
    },
  },
  {
    id: "noir",
    name: "Film Noir",
    description: "High contrast black and white theme for dramatic writing",
    colors: {
      primary: "oklch(0.95 0 0)",
      primaryForeground: "oklch(0.05 0 0)",
      secondary: "oklch(0.10 0 0)",
      secondaryForeground: "oklch(0.95 0 0)",
      background: "oklch(0.15 0 0)",
      foreground: "oklch(0.95 0 0)",
      card: "oklch(0.18 0 0)",
      cardForeground: "oklch(0.95 0 0)",
      popover: "oklch(0.18 0 0)",
      popoverForeground: "oklch(0.95 0 0)",
      muted: "oklch(0.25 0 0)",
      mutedForeground: "oklch(0.65 0 0)",
      accent: "oklch(0.30 0 0)",
      accentForeground: "oklch(0.85 0 0)",
      destructive: "oklch(0.55 0.22 25)",
      destructiveForeground: "oklch(0.95 0 0)",
      border: "oklch(0.35 0 0)",
      input: "oklch(0.25 0 0)",
      ring: "oklch(0.75 0 0)",
      sidebar: "oklch(0.18 0 0)",
      sidebarForeground: "oklch(0.95 0 0)",
      sidebarPrimary: "oklch(0.75 0 0)",
      sidebarPrimaryForeground: "oklch(0.15 0 0)",
      sidebarAccent: "oklch(0.25 0 0)",
      sidebarAccentForeground: "oklch(0.85 0 0)",
      sidebarBorder: "oklch(0.35 0 0)",
      sidebarRing: "oklch(0.75 0 0)",
    },
    textStyle: {
      heading: "font-bold tracking-wider",
      body: "font-normal leading-6",
    },
  },
  {
    id: "indie",
    name: "Indie Spirit",
    description: "Creative and vibrant theme for independent filmmakers",
    colors: {
      primary: "oklch(0.65 0.15 320)",
      primaryForeground: "oklch(0.95 0.01 320)",
      secondary: "oklch(0.45 0.08 320)",
      secondaryForeground: "oklch(0.15 0.02 320)",
      background: "oklch(0.96 0.01 320)",
      foreground: "oklch(0.2 0.01 320)",
      card: "oklch(0.98 0.005 320)",
      cardForeground: "oklch(0.2 0.01 320)",
      popover: "oklch(0.98 0.005 320)",
      popoverForeground: "oklch(0.2 0.01 320)",
      muted: "oklch(0.88 0.03 320)",
      mutedForeground: "oklch(0.45 0.02 320)",
      accent: "oklch(0.75 0.08 320)",
      accentForeground: "oklch(0.25 0.02 320)",
      destructive: "oklch(0.55 0.22 25)",
      destructiveForeground: "oklch(0.95 0.01 320)",
      border: "oklch(0.82 0.03 320)",
      input: "oklch(0.88 0.03 320)",
      ring: "oklch(0.65 0.15 320)",
      sidebar: "oklch(0.92 0.02 320)",
      sidebarForeground: "oklch(0.2 0.01 320)",
      sidebarPrimary: "oklch(0.65 0.15 320)",
      sidebarPrimaryForeground: "oklch(0.95 0.01 320)",
      sidebarAccent: "oklch(0.85 0.05 320)",
      sidebarAccentForeground: "oklch(0.25 0.02 320)",
      sidebarBorder: "oklch(0.82 0.03 320)",
      sidebarRing: "oklch(0.65 0.15 320)",
    },
    textStyle: {
      heading: "font-bold tracking-tight",
      body: "font-normal leading-relaxed",
    },
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean and distraction-free environment for focused writing",
    colors: {
      primary: "oklch(0.4 0.05 200)",
      primaryForeground: "oklch(0.98 0.005 200)",
      secondary: "oklch(0.15 0.02 200)",
      secondaryForeground: "oklch(0.15 0.02 200)",
      background: "oklch(0.98 0.005 200)",
      foreground: "oklch(0.15 0.01 200)",
      card: "oklch(0.99 0.002 200)",
      cardForeground: "oklch(0.15 0.01 200)",
      popover: "oklch(0.99 0.002 200)",
      popoverForeground: "oklch(0.15 0.01 200)",
      muted: "oklch(0.94 0.01 200)",
      mutedForeground: "oklch(0.55 0.02 200)",
      accent: "oklch(0.85 0.05 200)",
      accentForeground: "oklch(0.15 0.01 200)",
      destructive: "oklch(0.577 0.245 27.325)",
      destructiveForeground: "oklch(0.98 0.005 200)",
      border: "oklch(0.88 0.02 200)",
      input: "oklch(0.92 0.02 200)",
      ring: "oklch(0.6 0.08 200)",
      sidebar: "oklch(0.96 0.01 200)",
      sidebarForeground: "oklch(0.15 0.01 200)",
      sidebarPrimary: "oklch(0.6 0.08 200)",
      sidebarPrimaryForeground: "oklch(0.98 0.005 200)",
      sidebarAccent: "oklch(0.92 0.02 200)",
      sidebarAccentForeground: "oklch(0.25 0.02 200)",
      sidebarBorder: "oklch(0.88 0.02 200)",
      sidebarRing: "oklch(0.6 0.08 200)",
    },
    textStyle: {
      heading: "font-semibold tracking-normal",
      body: "font-normal leading-7",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Futuristic neon theme for sci-fi screenwriters",
    colors: {
      primary: "oklch(0.65 0.18 180)",
      primaryForeground: "oklch(0.95 0.01 180)",
      secondary: "oklch(0.45 0.08 180)",
      secondaryForeground: "oklch(0.15 0.02 180)",
      background: "oklch(0.96 0.01 180)",
      foreground: "oklch(0.2 0.01 180)",
      card: "oklch(0.98 0.005 180)",
      cardForeground: "oklch(0.2 0.01 180)",
      popover: "oklch(0.98 0.005 180)",
      popoverForeground: "oklch(0.2 0.01 180)",
      muted: "oklch(0.88 0.03 180)",
      mutedForeground: "oklch(0.45 0.02 180)",
      accent: "oklch(0.75 0.12 180)",
      accentForeground: "oklch(0.25 0.02 180)",
      destructive: "oklch(0.55 0.22 25)",
      destructiveForeground: "oklch(0.95 0.01 180)",
      border: "oklch(0.82 0.03 180)",
      input: "oklch(0.88 0.03 180)",
      ring: "oklch(0.65 0.18 180)",
      sidebar: "oklch(0.92 0.02 180)",
      sidebarForeground: "oklch(0.2 0.01 180)",
      sidebarPrimary: "oklch(0.55 0.12 140)",
      sidebarPrimaryForeground: "oklch(0.95 0.01 140)",
      sidebarAccent: "oklch(0.85 0.05 180)",
      sidebarAccentForeground: "oklch(0.25 0.02 180)",
      sidebarBorder: "oklch(0.82 0.03 180)",
      sidebarRing: "oklch(0.65 0.18 180)",
    },
    textStyle: {
      heading: "font-bold tracking-wide",
      body: "font-mono leading-6",
    },
  },
]

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

  // Helper function to get button styling with good contrast
  const getButtonStyling = (theme: Theme, isSelected: boolean) => {
    if (isSelected) {
      // For applied state, use accent colors which typically have better contrast
      return {
        backgroundColor: theme.colors.accent,
        color: theme.colors.accentForeground,
        borderColor: theme.colors.border,
      }
    } else {
      // For apply state, use primary colors
      return {
        backgroundColor: theme.colors.primary,
        color: theme.colors.primaryForeground,
        borderColor: theme.colors.border,
      }
    }
  }

  useEffect(() => {
    const userTheme = getUserTheme()
    setSelectedTheme(userTheme)
    // Apply the user's saved theme on mount
    applyTheme(userTheme)
  }, [])

  const applyTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId)
    if (!theme) return

    try {
      const root = document.documentElement

      // Apply comprehensive theme colors to CSS variables
      root.style.setProperty("--primary", theme.colors.primary)
    root.style.setProperty("--primary-foreground", theme.colors.primaryForeground)
    root.style.setProperty("--secondary", theme.colors.secondary)
    root.style.setProperty("--secondary-foreground", theme.colors.secondaryForeground)
    root.style.setProperty("--background", theme.colors.background)
    root.style.setProperty("--foreground", theme.colors.foreground)
    root.style.setProperty("--card", theme.colors.card)
    root.style.setProperty("--card-foreground", theme.colors.cardForeground)
    root.style.setProperty("--popover", theme.colors.popover)
    root.style.setProperty("--popover-foreground", theme.colors.popoverForeground)
    root.style.setProperty("--muted", theme.colors.muted)
    root.style.setProperty("--muted-foreground", theme.colors.mutedForeground)
    root.style.setProperty("--accent", theme.colors.accent)
    root.style.setProperty("--accent-foreground", theme.colors.accentForeground)
    root.style.setProperty("--destructive", theme.colors.destructive)
    root.style.setProperty("--destructive-foreground", theme.colors.destructiveForeground)
    root.style.setProperty("--border", theme.colors.border)
    root.style.setProperty("--input", theme.colors.input)
    root.style.setProperty("--ring", theme.colors.ring)
    root.style.setProperty("--sidebar", theme.colors.sidebar)
    root.style.setProperty("--sidebar-foreground", theme.colors.sidebarForeground)
    root.style.setProperty("--sidebar-primary", theme.colors.sidebarPrimary)
    root.style.setProperty("--sidebar-primary-foreground", theme.colors.sidebarPrimaryForeground)
    root.style.setProperty("--sidebar-accent", theme.colors.sidebarAccent)
    root.style.setProperty("--sidebar-accent-foreground", theme.colors.sidebarAccentForeground)
    root.style.setProperty("--sidebar-border", theme.colors.sidebarBorder)
    root.style.setProperty("--sidebar-ring", theme.colors.sidebarRing)

    // Save theme preference to user profile
    updateUserTheme(themeId)
    setSelectedTheme(themeId)
    setPreviewTheme(null)
    
    // Dispatch custom event for logo updates
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeId } }))
    }
    } catch (error) {
      // Handle theme application errors gracefully
      console.error('Theme application error:', error)
    }
  }

  const previewThemeColors = (themeId: string) => {
    setPreviewTheme(themeId)
  }

  const resetPreview = () => {
    setPreviewTheme(null)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Themes</h1>
        <p className="text-muted-foreground mt-2">
          Customize your writing environment with different color palettes and typography styles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.id
          const isPreviewing = previewTheme === theme.id

          return (
            <Card
              key={theme.id}
              className={cn(
                "relative cursor-pointer transition-all duration-200 hover:shadow-lg",
                isSelected && "ring-2",
                isPreviewing && "ring-2",
              )}
              style={{
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.cardForeground,
                ...(isSelected && { ringColor: theme.colors.primary }),
                ...(isPreviewing && { ringColor: theme.colors.accent }),
              }}
              onMouseEnter={() => previewThemeColors(theme.id)}
              onMouseLeave={resetPreview}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle 
                    className="text-sm"
                    style={{ color: theme.colors.foreground }}
                  >
                    {theme.name}
                  </CardTitle>
                  {isSelected && (
                    <div 
                      className="p-0.5 rounded-full"
                      style={{ 
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.primaryForeground 
                      }}
                    >
                      <Check className="h-2 w-2" />
                    </div>
                  )}
                </div>
                <p 
                  className="text-xs mt-2" 
                  style={{ color: theme.colors.mutedForeground }}
                >
                  {theme.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-2">
                {/* Logo Preview Tile */}
                <div className="flex justify-center mb-2">
                  <Image
                    src={getThemeLogo(theme)}
                    alt={`${theme.name} Logo`}
                    width={64}
                    height={32}
                    className="max-w-full h-auto transition-all duration-300"
                  />
                </div>

                {/* Color Palette Preview - All colors in one row */}
                <div>
                  <div className="flex gap-1 justify-center">
                    {Object.entries(theme.colors).map(([key, color]) => (
                      <div
                        key={key}
                        className="w-3 h-3 rounded-full border"
                        style={{ 
                          backgroundColor: color,
                          borderColor: theme.colors.border
                        }}
                        title={key}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full h-6 text-xs"
                  variant={isSelected ? "secondary" : "default"}
                  onClick={() => applyTheme(theme.id)}
                  style={getButtonStyling(theme, isSelected)}
                >
                  {isSelected ? "Applied" : "Apply"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme Customization</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Each theme includes carefully selected color palettes and typography styles optimized for long writing
            sessions. Themes are automatically saved and will persist across your sessions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
