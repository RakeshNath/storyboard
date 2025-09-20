"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Edit3, Trash2, Users, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface Scene {
  id: string
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
      title: "Scene 1: Opening",
      content: "FADE IN:\n\nEXT. CITY STREET - NIGHT\n\nThe city sleeps, but danger lurks in the shadows...",
      characters: ["JOHN", "SARAH"]
    },
    {
      id: "2", 
      title: "Scene 2: The Chase",
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
      title: `Scene ${scenes.length + 1}`,
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
        <div className="w-80 border-r bg-card flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Scenes</h3>
              <Button size="sm" onClick={addScene}>
                <Plus className="h-4 w-4 mr-2" />
                Add Scene
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {scenes.map((scene) => (
              <Card
                key={scene.id}
                className={cn(
                  "cursor-pointer transition-colors",
                  activeScene === scene.id && "ring-2 ring-primary bg-primary/5"
                )}
                onClick={() => setActiveScene(scene.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm">{scene.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteScene(scene.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {scene.content || "No content yet..."}
                  </p>
                  {scene.characters.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {scene.characters.slice(0, 2).map((char) => (
                        <Badge key={char} variant="outline" className="text-xs">
                          {char}
                        </Badge>
                      ))}
                      {scene.characters.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{scene.characters.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Center Panel - Main Editor */}
        <div className="flex-1 flex flex-col bg-background">
          {currentScene ? (
            <>
              <div className="p-4 border-b">
                <Input
                  value={currentScene.title}
                  onChange={(e) => updateScene(activeScene, "title", e.target.value)}
                  className="text-lg font-semibold border-none bg-transparent p-0 h-auto"
                  placeholder="Scene Title"
                />
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
        <div className="w-80 border-l bg-card flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Characters
              </h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {characters.map((character) => (
              <Card key={character} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{character}</p>
                    <p className="text-xs text-muted-foreground">
                      {scenes.filter(s => s.characters.includes(character)).length} scenes
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
