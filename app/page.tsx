"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      try {
        // Check if user is logged in
        const user = localStorage.getItem("user")
        if (user) {
          // Try to parse user data to validate it's valid JSON
          JSON.parse(user)
          router.push("/dashboard")
        } else {
          router.push("/login")
        }
      } catch (error) {
        // If user data is invalid JSON, redirect to login
        router.push("/login")
      }
      setIsLoading(false)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div 
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"
          role="status"
          aria-label="Loading"
        ></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
