"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Edit3, Trash2, Users, FileText } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface Scene {
  id: string
  number: string
  title: string
  content: string
  characters: string[]
}

interface ScreenplayEditorProps {
  screenplayId: string
  onBack: () => void
}

export function ScreenplayEditor({ screenplayId, onBack }: ScreenplayEditorProps) {
  const [scriptName, setScriptName] = useState("The Last Stand")
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: "1",
      number: "1",
      title: "Opening",
      content: "FADE IN:\n\nEXT. CITY STREET - NIGHT\n\nThe city sleeps, but danger lurks in the shadows...",
      characters: ["JOHN", "SARAH"]
    },
    {
      id: "2", 
      number: "2",
      title: "The Chase",
      content: "The chase begins. John runs through the alley, Sarah close behind...",
      characters: ["JOHN", "SARAH", "ANTAGONIST"]
    }
  ])
  const [activeScene, setActiveScene] = useState("1")
  const [characters, setCharacters] = useState([
    "JOHN", "SARAH", "ANTAGONIST", "DETECTIVE"
  ])

  const addScene = () => {
    const newScene: Scene = {
      id: (scenes.length + 1).toString(),
      number: (scenes.length + 1).toString(),
      title: "New Scene",
      content: "",
      characters: []
    }
    setScenes([...scenes, newScene])
    setActiveScene(newScene.id)
  }

  const deleteScene = (sceneId: string) => {
    const updatedScenes = scenes.filter(s => s.id !== sceneId)
    setScenes(updatedScenes)
    if (activeScene === sceneId && updatedScenes.length > 0) {
      setActiveScene(updatedScenes[0].id)
    }
  }

  const updateScene = (sceneId: string, field: keyof Scene, value: any) => {
    setScenes(scenes.map(scene => 
      scene.id === sceneId ? { ...scene, [field]: value } : scene
    ))
  }

  const currentScene = scenes.find(s => s.id === activeScene)

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              ← Back
            </Button>
            <div className="flex items-center gap-2">
              <Input
                value={scriptName}
                onChange={(e) => setScriptName(e.target.value)}
                className="text-xl font-bold border-none bg-transparent p-0 h-auto"
                placeholder="Screenplay Title"
              />
              <Badge variant="secondary" className="text-xs">
                SCREENPLAY
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button size="sm">
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Scenes */}
        <div className="w-64 border-r bg-card flex flex-col">
          <div className="p-1 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xs">Scenes</h3>
              <Button size="sm" className="h-6 px-1.5 text-xs" onClick={addScene}>
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-1 space-y-0.5">
            {scenes.map((scene) => (
              <Card
                key={scene.id}
                className={cn(
                  "cursor-pointer transition-colors",
                  activeScene === scene.id && "ring-2 ring-primary bg-primary/5"
                )}
                onClick={() => setActiveScene(scene.id)}
              >
                <div className="p-1">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs text-muted-foreground">Scene</span>
                    <Input
                      value={scene.number}
                      onChange={(e) => updateScene(scene.id, "number", e.target.value)}
                      className="w-8 h-6 text-xs p-1 border-none bg-transparent"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-xs text-muted-foreground">:</span>
                    <Input
                      value={scene.title}
                      onChange={(e) => updateScene(scene.id, "title", e.target.value)}
                      className="flex-1 h-6 text-xs p-1 border-none bg-transparent"
                      placeholder="Scene title"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Scene</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete <strong>Scene {scene.number}: {scene.title}</strong>? 
                            This action cannot be undone and will permanently remove the scene and all its content.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteScene(scene.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Center Panel - Main Editor */}
        <div className="flex-1 flex flex-col bg-background">
          {currentScene ? (
            <>
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-muted-foreground">Scene</span>
                  <Input
                    value={currentScene.number}
                    onChange={(e) => updateScene(activeScene, "number", e.target.value)}
                    className="w-16 text-lg font-semibold border-none bg-transparent p-0 h-auto"
                    placeholder="#"
                  />
                  <span className="text-lg font-semibold text-muted-foreground">:</span>
                  <Input
                    value={currentScene.title}
                    onChange={(e) => updateScene(activeScene, "title", e.target.value)}
                    className="flex-1 text-lg font-semibold border-none bg-transparent p-0 h-auto"
                    placeholder="Scene Title"
                  />
                </div>
              </div>
              
              <div className="flex-1 p-4">
                <Textarea
                  value={currentScene.content}
                  onChange={(e) => updateScene(activeScene, "content", e.target.value)}
                  placeholder="Write your scene here... Use proper screenplay format:

FADE IN:

EXT. LOCATION - TIME

Character names in CAPS, dialogue below.

FADE OUT."
                  className="h-full resize-none border-none bg-transparent text-sm font-mono leading-relaxed"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>Select a scene to start writing</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Characters */}
        <div className="w-64 border-l bg-card flex flex-col">
          <div className="p-2 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Users className="h-3 w-3" />
                Characters
              </h3>
              <Button size="sm" className="h-7 px-2">
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {characters.map((character) => (
              <div key={character} className="flex items-center justify-between p-1.5 rounded border bg-card hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs truncate">{character}</p>
                  <p className="text-xs text-muted-foreground">
                    {scenes.filter(s => s.characters.includes(character)).length} scenes
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                  <Edit3 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
