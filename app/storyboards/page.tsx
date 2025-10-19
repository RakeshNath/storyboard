"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function StoryboardsPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the existing storyboard page
    router.replace('/storyboard')
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Redirecting...</h1>
        <p className="text-muted-foreground">You will be redirected to the storyboard page.</p>
      </div>
    </div>
  )
}
