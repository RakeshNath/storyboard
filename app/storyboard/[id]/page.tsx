"use client"

import { ScreenplayEditorPro } from "@/components/sections/playground/screenplay-editor-pro"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"

interface Storyboard {
  id: string
  title: string
  type: "screenplay" | "synopsis"
  status: "draft" | "in-progress" | "completed" | "revision"
  pages: number
  sceneCount?: number
  subsceneCount?: number
  lastModified: string
  created: string
  genre: string
}

interface ScreenplayPageProps {
  params: {
    id: string
  }
}

// Mock data - this will be replaced with actual data fetching later
const mockStoryboards: Storyboard[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "The Last Stand",
    type: "screenplay",
    status: "in-progress",
    pages: 87,
    sceneCount: 42,
    subsceneCount: 18,
    lastModified: "2 hours ago",
    created: "2024-01-15",
    genre: "Action/Drama",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    title: "Midnight Express",
    type: "screenplay",
    status: "draft",
    pages: 23,
    sceneCount: 15,
    subsceneCount: 7,
    lastModified: "1 day ago",
    created: "2024-01-20",
    genre: "Thriller/Noir",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    title: "Ocean's Edge",
    type: "synopsis",
    status: "completed",
    pages: 12,
    lastModified: "3 days ago",
    created: "2023-12-01",
    genre: "Drama/Romance",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    title: "Digital Dreams",
    type: "synopsis",
    status: "draft",
    pages: 8,
    lastModified: "5 days ago",
    created: "2024-01-25",
    genre: "Sci-Fi",
  },
]

export default function ScreenplayPage({ params }: ScreenplayPageProps) {
  const router = useRouter()
  
  // Find the screenplay by ID synchronously
  const screenplay = mockStoryboards.find(s => s.id === params.id) || null
  
  const handleBack = () => {
    router.push('/storyboard')
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Header with back button */}
      <div className="flex items-center gap-4 p-4 border-b bg-background">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Storyboards
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">
            {screenplay ? screenplay.title : "Screenplay Editor"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {screenplay ? `${screenplay.genre} • ${screenplay.pages} pages` : `ID: ${params.id}`}
          </p>
        </div>
      </div>
      
      {/* Editor content */}
      <div className="flex-1 overflow-hidden">
        <ScreenplayEditorPro title={screenplay?.title || `Screenplay ${params.id}`} />
      </div>
    </div>
  )
}
