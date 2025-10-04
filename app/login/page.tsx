"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("testmail@testmail.com")
  const [password, setPassword] = useState("testmail123")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Check if we're in test environment and using test credentials
    const isTestEnvironment = process.env.NODE_ENV === 'test' || process.env.NEXT_PUBLIC_APP_ENV === 'test'
    const isTestCredentials = email === 'test@storyboard.test' && password === 'testpassword123'
    
    // Only allow test credentials in test environment
    if (isTestCredentials && !isTestEnvironment) {
      setIsLoading(false)
      alert('Test credentials are only valid in test environment')
      return
    }

    // Simulate authentication
    setTimeout(() => {
      if (typeof window !== "undefined") {
        try {
          // Use test user data if test credentials are provided
          const userData = isTestCredentials ? {
            email: 'test@storyboard.test',
            name: 'Test User',
            theme: 'minimalist',
          } : {
            email,
            name: email.split("@")[0],
            theme: "minimalist", // Set default theme for new users
          }

          localStorage.setItem("user", JSON.stringify(userData))
          setIsLoading(false)
          router.push("/dashboard")
        } catch (error) {
          // Handle localStorage errors gracefully
          console.error('Login failed:', error)
          setIsLoading(false)
          // Don't navigate on error
        }
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
                <Image
                  src="/logos/logo-minimalist.png"
                  alt="StoryBoard Logo"
                  width={160}
                  height={48}
                  className="max-w-full h-auto"
                  priority
                />
          </div>
          <CardDescription>Sign in to your storyboard writing portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
