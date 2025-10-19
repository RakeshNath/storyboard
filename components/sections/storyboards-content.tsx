"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, FileText, Calendar, Clock, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScreenplayEditor } from "./screenplay-editor"
import { SynopsisEditor } from "./synopsis-editor"
import { getStoryboardBorderColor } from "@/lib/theme-utils"
import { getUserTheme } from "@/lib/auth"

// Generate a unique ID for storyboards
const generateUniqueId = (): string => {
  // Use crypto.randomUUID if available, otherwise fallback to custom implementation
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  
  // Fallback: timestamp + random string
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 15)
  return `${timestamp}-${randomStr}`
}

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

const statusColors = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  revision: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
}

const getTypeColors = (type: "screenplay" | "synopsis") => {
  const typeStyles = {
    screenplay: {
      background: 'var(--primary)',
      color: 'var(--primary-foreground)'
    },
    synopsis: {
      background: 'var(--accent)',
      color: 'var(--accent-foreground)'
    }
  }
  return typeStyles[type]
}

interface StoryboardCardProps {
  storyboard?: Storyboard | null
  onDelete: (id: string) => void
  onCreateDialogOpen: boolean
  onCreateDialogChange: (open: boolean) => void
  newStoryboardName: string
  setNewStoryboardName: (name: string) => void
  newStoryboardType: "screenplay" | "synopsis"
  setNewStoryboardType: (type: "screenplay" | "synopsis") => void
  onCreateStoryboard: () => void
  onDialogClose: () => void
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTypeChange: (value: "screenplay" | "synopsis") => void
  onScreenplayClick: (id: string) => void
  onSynopsisClick: (id: string) => void
  borderColorClass: string
}

const StoryboardCard = ({ 
  storyboard, 
  onDelete, 
  onCreateDialogOpen, 
  onCreateDialogChange, 
  newStoryboardName, 
  setNewStoryboardName, 
  newStoryboardType, 
  setNewStoryboardType, 
  onCreateStoryboard, 
  onDialogClose,
  onNameChange,
  onTypeChange,
  onScreenplayClick,
  onSynopsisClick,
  borderColorClass
}: StoryboardCardProps) => {
  if (!storyboard) {
    // Add New card
    return (
      <Card className={`h-64 border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-card/90 cursor-pointer group relative overflow-hidden card-hover-float-add ${borderColorClass}`}>
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute top-4 left-4 w-2 h-2 bg-primary/60 rounded-full" style={{ animation: 'particle-bounce 2s ease-in-out infinite', animationDelay: '0s' }} />
          <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-accent/60 rounded-full" style={{ animation: 'particle-bounce 2.5s ease-in-out infinite', animationDelay: '0.5s' }} />
          <div className="absolute bottom-6 left-8 w-1 h-1 bg-primary/40 rounded-full" style={{ animation: 'particle-bounce 3s ease-in-out infinite', animationDelay: '1s' }} />
          <div className="absolute bottom-4 right-4 w-2.5 h-2.5 bg-accent/50 rounded-full" style={{ animation: 'particle-bounce 2.2s ease-in-out infinite', animationDelay: '1.5s' }} />
        </div>
        
        {/* Glowing border effect */}
        <div className="absolute inset-0 ring-2 ring-primary/0 group-hover:ring-primary/40 transition-all duration-500 rounded-lg shadow-[0_0_0_1px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)]" />
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none" style={{ animation: 'shimmer 1s ease-out infinite' }} />
        
        <CardContent className="h-full flex flex-col items-center justify-center p-6 relative z-10">
          <Dialog open={onCreateDialogOpen} onOpenChange={onCreateDialogChange}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className="h-full w-full flex flex-col gap-4 text-muted-foreground group-hover:text-primary transition-all duration-300 ease-out"
              >
                <div className="p-4 rounded-full bg-muted group-hover:bg-primary/10 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300 ease-out">
                  <Plus className="h-8 w-8 group-hover:rotate-90 transition-transform duration-300 ease-out" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">Add New</p>
                  <p className="text-sm">Create a new storyboard</p>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Storyboard</DialogTitle>
                <DialogDescription>
                  Enter the details for your new storyboard. You can change the name and type later.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="storyboard-name">Storyboard Name</Label>
                  <Input
                    id="storyboard-name"
                    placeholder="Enter storyboard name"
                    value={newStoryboardName}
                    onChange={onNameChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid gap-3">
                  <Label>Storyboard Type</Label>
                  <RadioGroup
                    value={newStoryboardType}
                    onValueChange={onTypeChange}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="screenplay" id="screenplay" />
                      <Label htmlFor="screenplay" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Screenplay
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="synopsis" id="synopsis" />
                      <Label htmlFor="synopsis" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Synopsis
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={onDialogClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={onCreateStoryboard}
                  disabled={!newStoryboardName.trim()}
                >
                  Create Storyboard
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    )
  }

  const handleCardClick = () => {
    if (storyboard.type === "screenplay") {
      onScreenplayClick(storyboard.id)
    } else if (storyboard.type === "synopsis") {
      onSynopsisClick(storyboard.id)
    }
  }

  return (
    <Card 
      className={cn(
        "h-64 hover:bg-card/90 hover:border-primary/30 group relative overflow-hidden card-hover-float",
        borderColorClass,
        storyboard.type === "screenplay" ? "cursor-pointer" : "cursor-default"
      )}
      onClick={handleCardClick}
    >
      {/* Dynamic background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
      
      {/* Floating orbs effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute top-6 left-6 w-3 h-3 bg-primary/50 rounded-full blur-sm" style={{ animation: 'orb-pulse 3s ease-in-out infinite', animationDelay: '0s' }} />
        <div className="absolute top-12 right-8 w-2 h-2 bg-accent/60 rounded-full blur-sm" style={{ animation: 'orb-pulse 4s ease-in-out infinite', animationDelay: '1s' }} />
        <div className="absolute bottom-8 left-10 w-2.5 h-2.5 bg-primary/40 rounded-full blur-sm" style={{ animation: 'orb-pulse 3.5s ease-in-out infinite', animationDelay: '2s' }} />
        <div className="absolute bottom-6 right-6 w-1.5 h-1.5 bg-accent/50 rounded-full blur-sm" style={{ animation: 'orb-pulse 2.5s ease-in-out infinite', animationDelay: '0.5s' }} />
      </div>
      
      {/* Enhanced glowing border */}
      <div className="absolute inset-0 ring-2 ring-primary/0 group-hover:ring-primary/50 transition-all duration-500 rounded-lg shadow-[0_0_0_1px_rgba(255,255,255,0.15)] group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.25)]" />
      
      {/* Enhanced shimmer sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none" style={{ animation: 'shimmer 1.2s ease-out infinite' }} />
      
      {/* Subtle inner glow */}
      <div className="absolute inset-2 rounded-lg bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <CardTitle className="text-lg truncate group-hover:text-primary group-hover:scale-105 transition-all duration-300 ease-out">
              {storyboard.title}
            </CardTitle>
            
            {/* Type in capital letters - Parallelogram Design */}
            <div className="mt-2">
              <div 
                className="relative cursor-pointer group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300 ease-out inline-block"
                style={{
                  background: getTypeColors(storyboard.type).background,
                  color: getTypeColors(storyboard.type).color,
                  transform: 'skew(-15deg)',
                  transformOrigin: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  border: 'none',
                  borderRadius: '0',
                  padding: '2px 12px',
                  fontSize: '10px',
                  fontWeight: '600',
                  letterSpacing: '0.05em'
                }}
              >
                <span 
                  className="inline-block"
                  style={{ transform: 'skew(15deg)' }}
                >
                  {storyboard.type.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-70 group-hover:opacity-100 group-hover:scale-110 group-hover:bg-destructive/10 group-hover:text-destructive transition-all duration-300 ease-out embossed-button"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Storyboard</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete <strong>"{storyboard.title}"</strong>? 
                  This action cannot be undone and will permanently remove the storyboard and all its content.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(storyboard.id)
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-1 relative z-10">
        {/* Content block based on type */}
        {storyboard.type === "screenplay" ? (
          <div className="flex gap-2 justify-center">
              {/* Scene Block */}
              <div className="flex flex-col items-center space-y-1 group-hover:scale-110 transition-all duration-300 ease-out">
                <div 
                  className="w-12 h-12 rounded-md p-1 text-center flex items-center justify-center relative overflow-hidden embossed-block transition-all duration-300 ease-out"
                  style={{ 
                    background: 'var(--accent)',
                    border: '1px solid var(--accent)',
                    boxShadow: `
                      inset 2px 2px 4px color-mix(in oklch, var(--accent) 30%, transparent),
                      inset -2px -2px 4px color-mix(in oklch, var(--accent) 10%, transparent),
                      0 1px 2px color-mix(in oklch, var(--accent) 20%, transparent)
                    `
                  }}
                >
                  <div className="text-sm font-bold relative z-10" style={{ color: 'var(--accent-foreground)', textShadow: '0 1px 2px color-mix(in oklch, var(--accent) 30%, transparent)' }}>
                    {storyboard.sceneCount}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  SCENES
                </div>
              </div>
              
              {/* Subscene Block */}
              <div className="flex flex-col items-center space-y-1 group-hover:scale-110 transition-all duration-300 ease-out">
                <div 
                  className="w-12 h-12 rounded-md p-1 text-center flex items-center justify-center relative overflow-hidden embossed-block transition-all duration-300 ease-out"
                  style={{ 
                    background: 'var(--accent)',
                    border: '1px solid var(--accent)',
                    boxShadow: `
                      inset 2px 2px 4px color-mix(in oklch, var(--accent) 30%, transparent),
                      inset -2px -2px 4px color-mix(in oklch, var(--accent) 10%, transparent),
                      0 1px 2px color-mix(in oklch, var(--accent) 20%, transparent)
                    `
                  }}
                >
                  <div className="text-sm font-bold relative z-10" style={{ color: 'var(--accent-foreground)', textShadow: '0 1px 2px color-mix(in oklch, var(--accent) 30%, transparent)' }}>
                    {storyboard.subsceneCount}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  SUBSCENES
                </div>
              </div>
            </div>
        ) : (
          <div className="flex gap-2 justify-center">
              {/* Pages Block */}
              <div className="flex flex-col items-center space-y-1 group-hover:scale-110 transition-all duration-300 ease-out">
                <div 
                  className="w-12 h-12 rounded-md p-1 text-center flex items-center justify-center relative overflow-hidden embossed-block transition-all duration-300 ease-out"
                  style={{ 
                    background: 'var(--accent)',
                    border: '1px solid var(--accent)',
                    boxShadow: `
                      inset 2px 2px 4px color-mix(in oklch, var(--accent) 30%, transparent),
                      inset -2px -2px 4px color-mix(in oklch, var(--accent) 10%, transparent),
                      0 1px 2px color-mix(in oklch, var(--accent) 20%, transparent)
                    `
                  }}
                >
                  <div className="text-sm font-bold relative z-10" style={{ color: 'var(--accent-foreground)', textShadow: '0 1px 2px color-mix(in oklch, var(--accent) 30%, transparent)' }}>
                    {storyboard.pages}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  PAGES
                </div>
              </div>
            </div>
        )}

        {/* Genre */}
        {storyboard.genre && (
          <div className="text-xs text-muted-foreground text-center font-medium">
            {storyboard.genre}
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


export function StoryboardsContent() {
  const router = useRouter()
  const [storyboards, setStoryboards] = useState<Storyboard[]>(mockStoryboards)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newStoryboardName, setNewStoryboardName] = useState("")
  const [newStoryboardType, setNewStoryboardType] = useState<"screenplay" | "synopsis">("screenplay")
  const [editingScreenplayId, setEditingScreenplayId] = useState<string | null>(null)
  const [editingSynopsisId, setEditingSynopsisId] = useState<string | null>(null)
  
  // Get current theme for border styling
  const currentTheme = getUserTheme()
  const borderColorClass = getStoryboardBorderColor(currentTheme)



  const handleDelete = useCallback((id: string) => {
    console.log('Deleting storyboard with id:', id)
    setStoryboards((prev) => {
      const filtered = prev.filter((s) => s.id !== id)
      console.log('Storyboards after deletion:', filtered)
      return filtered
    })
  }, [])

  const handleCreateStoryboard = useCallback(() => {
    if (!newStoryboardName.trim()) return

    const uniqueId = generateUniqueId()
    const newStoryboard: Storyboard = {
      id: uniqueId,
      title: newStoryboardName.trim(),
      type: newStoryboardType,
      status: "draft",
      pages: 0,
      sceneCount: newStoryboardType === "screenplay" ? 0 : undefined,
      subsceneCount: newStoryboardType === "screenplay" ? 0 : undefined,
      lastModified: "Just now",
      created: new Date().toISOString(),
      genre: "Drama",
    }

    setStoryboards([newStoryboard, ...storyboards])
    setNewStoryboardName("")
    setNewStoryboardType("screenplay")
    setIsCreateDialogOpen(false)
    
    // Auto-navigate to the new screenplay if it's a screenplay
    if (newStoryboardType === "screenplay") {
      router.push(`/storyboard/${uniqueId}`)
    }
  }, [newStoryboardName, newStoryboardType, storyboards, router])

  const handleDialogClose = useCallback(() => {
    setIsCreateDialogOpen(false)
    setNewStoryboardName("")
    setNewStoryboardType("screenplay")
  }, [])

  const handleDialogChange = useCallback((open: boolean) => {
    setIsCreateDialogOpen(open)
  }, [])

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStoryboardName(e.target.value)
  }, [])

  const handleTypeChange = useCallback((value: "screenplay" | "synopsis") => {
    setNewStoryboardType(value)
  }, [])

  const handleScreenplayClick = useCallback((id: string) => {
    router.push(`/storyboard/${id}`)
  }, [router])

  const handleSynopsisClick = useCallback((id: string) => {
    setEditingSynopsisId(id)
  }, [])

  const handleBackFromEditor = useCallback(() => {
    setEditingScreenplayId(null)
    setEditingSynopsisId(null)
  }, [])


  // Arrange cards in rows of 5
  const arrangeInRows = () => {
    const allItems = [null, ...storyboards] // null represents the "Add New" card
    const rows = []

    for (let i = 0; i < allItems.length; i += 5) {
      rows.push(allItems.slice(i, i + 5))
    }

    return rows
  }

  // Show synopsis editor if editing (keeping synopsis editor for now)
  if (editingSynopsisId) {
    const synopsis = storyboards.find(s => s.id === editingSynopsisId)
    return <SynopsisEditor synopsisId={editingSynopsisId} synopsisTitle={synopsis?.title || "Synopsis"} onBack={handleBackFromEditor} />
  }

  return (
    <div className="space-y-8">

      <div className="space-y-6">
        {arrangeInRows().map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {row.map((storyboard, cardIndex) => (
              <StoryboardCard 
                key={storyboard?.id || `add-new-${rowIndex}-${cardIndex}`} 
                storyboard={storyboard}
                onDelete={handleDelete}
                onCreateDialogOpen={isCreateDialogOpen}
                onCreateDialogChange={handleDialogChange}
                newStoryboardName={newStoryboardName}
                setNewStoryboardName={setNewStoryboardName}
                newStoryboardType={newStoryboardType}
                setNewStoryboardType={setNewStoryboardType}
                onCreateStoryboard={handleCreateStoryboard}
                onDialogClose={handleDialogClose}
                onNameChange={handleNameChange}
                onTypeChange={handleTypeChange}
                onScreenplayClick={handleScreenplayClick}
                onSynopsisClick={handleSynopsisClick}
                borderColorClass={borderColorClass}
              />
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
            <Button onClick={() => setIsCreateDialogOpen(true)}>
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
