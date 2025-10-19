"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/auth"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const currentUser = getUser()
        if (currentUser) {
          // Redirect to home page
          router.replace('/home')
        } else {
          // Redirect to login if no user found
          router.replace('/login')
        }
      } catch (error) {
        console.error('Auth error:', error)
        router.replace('/login')
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Redirecting...</h1>
        <p className="text-muted-foreground">You will be redirected to the home page.</p>
      </div>
    </div>
  )
}