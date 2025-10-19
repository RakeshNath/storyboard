"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth"

export default function LogoffPage() {
  const router = useRouter()

  useEffect(() => {
    // Perform logout
    logout()
    
    // Redirect to login page
    router.replace('/login')
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Logging out...</h1>
        <p className="text-muted-foreground">You will be redirected to the login page.</p>
      </div>
    </div>
  )
}
