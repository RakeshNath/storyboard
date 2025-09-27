"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/auth"
import { getUserTheme } from "@/lib/auth"
import { useState, useEffect } from "react"
import { Palette } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfileContentProps {
  user: User
}

export function ProfileContent({ user }: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentTheme, setCurrentTheme] = useState("minimalist")
  const [profile, setProfile] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email,
    dateOfBirth: user.dateOfBirth || "",
    location: user.location || "",
    phoneNumber: user.phoneNumber || "",
    subscription: user.subscription || "free",
    bio: "Passionate screenwriter with a love for compelling narratives and character development.",
    website: "https://example.com",
  })

  // Generate a system-generated 10-digit alphanumeric ID in format XXX-XXX-XXXX
  const generateUserId = (email: string) => {
    // Use email as seed for consistent ID generation
    let hash = 0
    for (let i = 0; i < email.length; i++) {
      const char = email.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    // Generate alphanumeric characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    
    // Use hash to generate consistent but unique ID
    let seed = Math.abs(hash)
    for (let i = 0; i < 10; i++) {
      result += chars[seed % chars.length]
      seed = Math.floor(seed / chars.length) || Math.abs(hash) + i
    }
    
    // Format as XXX-XXX-XXXX
    return `${result.substring(0, 3)}-${result.substring(3, 6)}-${result.substring(6, 10)}`
  }

  const userId = generateUserId(user.email)


  // Theme mapping for display
  const themeNames: { [key: string]: string } = {
    professional: "Professional",
    classic: "Classic",
    noir: "Film Noir",
    indie: "Indie Spirit",
    minimalist: "Minimalist",
    cyberpunk: "Cyberpunk"
  }

  // Get current theme on component mount and listen for theme changes
  useEffect(() => {
    const userTheme = getUserTheme()
    setCurrentTheme(userTheme)

    // Listen for theme changes from other parts of the app
    const handleThemeChange = (event: CustomEvent) => {
      setCurrentTheme(event.detail.theme)
    }

    window.addEventListener('themeChanged', handleThemeChange as EventListener)
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange as EventListener)
    }
  }, [])


  const handleSave = () => {
    // Save profile logic would go here
    setIsEditing(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profile Information</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <CardTitle>Personal Information</CardTitle>
            <div className="text-xs text-muted-foreground mt-1">
              User ID: <span className="font-mono font-medium">{userId}</span>
            </div>
          </div>
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => setProfile((prev) => ({ ...prev, firstName: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => setProfile((prev) => ({ ...prev, lastName: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={(e) => setProfile((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                disabled={!isEditing}
                placeholder="Enter your location"
              />
            </div>
            </div>
          </div>

          {/* Subscription Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Subscription</h3>
            <div className="space-y-2">
              <Label htmlFor="subscription">Current Plan</Label>
              <div className="flex items-center gap-3">
                <Select
                  value={profile.subscription}
                  onValueChange={(value) => setProfile((prev) => ({ ...prev, subscription: value }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select subscription" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                  </SelectContent>
                </Select>
                <Badge 
                  variant={profile.subscription === "free" ? "secondary" : "default"}
                  className="capitalize"
                >
                  {profile.subscription}
                </Badge>
              </div>
            </div>
          </div>

          {/* Theme Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Appearance</h3>
            <div className="space-y-2">
              <Label>Current Theme</Label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted/50">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {themeNames[currentTheme] || "Minimalist"}
                  </span>
                </div>
                <Badge variant="outline" className="capitalize">
                  {currentTheme}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Change your theme in the Themes section to update this setting.
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                disabled={!isEditing}
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={profile.website}
                onChange={(e) => setProfile((prev) => ({ ...prev, website: e.target.value }))}
                disabled={!isEditing}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
