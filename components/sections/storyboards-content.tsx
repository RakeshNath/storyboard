"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Plus, FileText, Calendar, Clock, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

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

const mockStoryboards: Storyboard[] = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
    title: "Ocean's Edge",
    type: "synopsis",
    status: "completed",
    pages: 12,
    lastModified: "3 days ago",
    created: "2023-12-01",
    genre: "Drama/Romance",
  },
  {
    id: "4",
    title: "Digital Dreams",
    type: "synopsis",
    status: "draft",
    pages: 8,
    lastModified: "5 days ago",
    created: "2024-01-25",
    genre: "Sci-Fi",
  },
]

const statusColors = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  revision: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
}

const typeColors = {
  screenplay: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  synopsis: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
}

export function StoryboardsContent() {
  const [storyboards, setStoryboards] = useState<Storyboard[]>(mockStoryboards)

  const handleAddNew = () => {
    // In a real app, this would open a modal or navigate to a new storyboard page
    console.log("Add new storyboard")
  }


  const handleDelete = (id: string) => {
    setStoryboards((prev) => prev.filter((s) => s.id !== id))
  }

  const StoryboardCard = ({ storyboard }: { storyboard?: Storyboard }) => {
    if (!storyboard) {
      // Add New card
      return (
        <Card className="h-64 border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:backdrop-blur-sm hover:bg-card/80 transition-all duration-500 cursor-pointer group relative overflow-hidden">
          {/* Liquid glass overlay for add new card */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-transparent to-accent/12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          {/* Flowing liquid effect for add new card */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/15 via-accent/8 to-transparent rounded-full blur-xl animate-pulse" 
                 style={{ animation: 'liquid-flow 3s ease-in-out infinite' }} />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent/15 via-primary/8 to-transparent rounded-full blur-xl animate-pulse" 
                 style={{ animation: 'liquid-flow 3s ease-in-out infinite 1.5s' }} />
          </div>
          
          {/* Glassy border effect for add new card */}
          <div className="absolute inset-0 ring-1 ring-primary/0 group-hover:ring-primary/30 transition-all duration-500 rounded-lg" />
          
          {/* Reflective shine effect for add new card */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
          
          <CardContent className="h-full flex flex-col items-center justify-center p-6 relative z-10">
            <Button
              variant="ghost"
              size="lg"
              className="h-full w-full flex flex-col gap-4 text-muted-foreground group-hover:text-primary transition-colors"
              onClick={handleAddNew}
            >
              <div className="p-4 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                <Plus className="h-8 w-8" />
              </div>
              <div className="text-center">
                <p className="font-semibold">Add New</p>
                <p className="text-sm">Create a new storyboard</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="h-64 hover:shadow-2xl hover:shadow-primary/10 hover:backdrop-blur-sm hover:bg-card/80 hover:border-primary/20 transition-all duration-500 cursor-pointer group relative overflow-hidden">
        {/* Liquid glass overlay with flowing animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Flowing liquid effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full blur-xl animate-pulse" 
               style={{ animation: 'liquid-flow 3s ease-in-out infinite' }} />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent/10 via-primary/5 to-transparent rounded-full blur-xl animate-pulse" 
               style={{ animation: 'liquid-flow 3s ease-in-out infinite 1.5s' }} />
        </div>
        
        {/* Glassy border effect */}
        <div className="absolute inset-0 ring-1 ring-primary/0 group-hover:ring-primary/30 transition-all duration-500 rounded-lg" />
        
        {/* Reflective shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
        
        <CardHeader className="pb-2 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Title */}
              <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                {storyboard.title}
              </CardTitle>
              
              {/* Type in capital letters */}
              <div className="mt-2">
                <Badge className={cn("text-xs font-bold tracking-wide", typeColors[storyboard.type])}>
                  {storyboard.type.toUpperCase()}
                </Badge>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
              onClick={() => handleDelete(storyboard.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 relative z-10">
          {/* Content block based on type */}
          {storyboard.type === "screenplay" ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" />
                <span>{storyboard.sceneCount} scenes</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" />
                <span>{storyboard.subsceneCount} subscenes</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" />
                <span>{storyboard.pages} pages</span>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="space-y-1 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Created {new Date(storyboard.created).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Modified {storyboard.lastModified}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Arrange cards in rows of 4
  const arrangeInRows = () => {
    const allItems = [null, ...storyboards] // null represents the "Add New" card
    const rows = []

    for (let i = 0; i < allItems.length; i += 4) {
      rows.push(allItems.slice(i, i + 4))
    }

    return rows
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Storyboards</h1>
        <p className="text-muted-foreground mt-2">Manage your storyboard projects and track your writing progress.</p>
      </div>

      <div className="space-y-6">
        {arrangeInRows().map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {row.map((storyboard, cardIndex) => (
              <StoryboardCard key={storyboard?.id || `add-new-${rowIndex}-${cardIndex}`} storyboard={storyboard} />
            ))}
          </div>
        ))}
      </div>

      {storyboards.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No storyboards yet</h3>
            <p className="text-muted-foreground mb-4">
              Start your storyboarding journey by creating your first storyboard.
            </p>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Storyboard
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Writing Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{storyboards.length}</div>
              <p className="text-sm text-muted-foreground">Total Storyboards</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {storyboards.filter((s) => s.type === "screenplay").length}
              </div>
              <p className="text-sm text-muted-foreground">Screenplays</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {storyboards.filter((s) => s.type === "synopsis").length}
              </div>
              <p className="text-sm text-muted-foreground">Synopses</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {storyboards.filter((s) => s.status === "completed").length}
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
