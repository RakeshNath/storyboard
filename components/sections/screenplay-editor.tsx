"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit3, Trash2, Users, FileText } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface Scene {
  id: string
  number: string
  title: string
  content: string
  characters: string[]
}

interface Character {
  id: string
  name: string
  description: string
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
  const [actionContent, setActionContent] = useState("")
  const [actionItems, setActionItems] = useState<Array<{id: string, content: string}>>([])
  const [dialogueItems, setDialogueItems] = useState<Array<{id: string, character: string, dialogue: string}>>([])
  const [showCharacterDropdown, setShowCharacterDropdown] = useState<string | null>(null)
  const [characterDropdownIndex, setCharacterDropdownIndex] = useState<{[key: string]: number}>({})
  const [isCharactersDialogOpen, setIsCharactersDialogOpen] = useState(false)
  const [characterList, setCharacterList] = useState<Character[]>([
    { id: "1", name: "JOHN", description: "Protagonist - A determined detective" },
    { id: "2", name: "SARAH", description: "Supporting character - John's partner" },
    { id: "3", name: "ANTAGONIST", description: "Main villain - Mysterious criminal mastermind" },
    { id: "4", name: "DETECTIVE", description: "Secondary character - Police detective" }
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

  const addActionItem = () => {
    const newAction = {
      id: Date.now().toString(),
      content: "Enter action description..."
    }
    setActionItems([...actionItems, newAction])
  }

  const updateActionItem = (id: string, content: string) => {
    setActionItems(actionItems.map(item => 
      item.id === id ? { ...item, content } : item
    ))
  }

  const deleteActionItem = (id: string) => {
    setActionItems(actionItems.filter(item => item.id !== id))
  }

  const moveActionItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...actionItems]
    const [movedItem] = newItems.splice(fromIndex, 1)
    newItems.splice(toIndex, 0, movedItem)
    setActionItems(newItems)
  }

  const addDialogueItem = () => {
    const newDialogue = {
      id: Date.now().toString(),
      character: "",
      dialogue: ""
    }
    setDialogueItems([...dialogueItems, newDialogue])
  }

  const updateDialogueItem = (id: string, field: 'character' | 'dialogue', value: string) => {
    setDialogueItems(dialogueItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const deleteDialogueItem = (id: string) => {
    setDialogueItems(dialogueItems.filter(item => item.id !== id))
  }

  const moveDialogueItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...dialogueItems]
    const [movedItem] = newItems.splice(fromIndex, 1)
    newItems.splice(toIndex, 0, movedItem)
    setDialogueItems(newItems)
  }

  const handleCharacterInput = (dialogueId: string, value: string) => {
    updateDialogueItem(dialogueId, 'character', value)
    setCharacterDropdownIndex(prev => ({ ...prev, [dialogueId]: -1 }))
    
    if (value.length > 0) {
      setShowCharacterDropdown(dialogueId)
    } else {
      setShowCharacterDropdown(null)
    }
  }

  const selectCharacter = (dialogueId: string, characterName: string) => {
    updateDialogueItem(dialogueId, 'character', characterName)
    setShowCharacterDropdown(null)
    setCharacterDropdownIndex(prev => ({ ...prev, [dialogueId]: -1 }))
  }

  const getFilteredCharacters = (searchText: string) => {
    return characters.filter(character => 
      character.toLowerCase().includes(searchText.toLowerCase())
    )
  }

  const handleCharacterKeyDown = (dialogueId: string, event: React.KeyboardEvent) => {
    const currentValue = dialogueItems.find(item => item.id === dialogueId)?.character || ""
    const currentIndex = characterDropdownIndex[dialogueId] || -1
    const filtered = getFilteredCharacters(currentValue)

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (filtered.length > 0) {
          const newIndex = currentIndex < filtered.length - 1 ? currentIndex + 1 : 0
          setCharacterDropdownIndex(prev => ({ ...prev, [dialogueId]: newIndex }))
          setShowCharacterDropdown(dialogueId)
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (filtered.length > 0) {
          const newIndex = currentIndex > 0 ? currentIndex - 1 : filtered.length - 1
          setCharacterDropdownIndex(prev => ({ ...prev, [dialogueId]: newIndex }))
          setShowCharacterDropdown(dialogueId)
        }
        break
      case 'Enter':
        event.preventDefault()
        if (currentIndex >= 0 && filtered[currentIndex]) {
          selectCharacter(dialogueId, filtered[currentIndex])
        }
        break
      case 'Escape':
        event.preventDefault()
        setCharacterDropdownIndex(prev => ({ ...prev, [dialogueId]: -1 }))
        setShowCharacterDropdown(null)
        break
    }
  }

  const updateCharacterName = (id: string, name: string) => {
    setCharacterList(characterList.map(char => 
      char.id === id ? { ...char, name: name.toUpperCase() } : char
    ))
  }

  const updateCharacterDescription = (id: string, description: string) => {
    setCharacterList(characterList.map(char => 
      char.id === id ? { ...char, description } : char
    ))
  }

  const addCharacter = () => {
    const newCharacter: Character = {
      id: Date.now().toString(),
      name: "NEW CHARACTER",
      description: "Character description..."
    }
    setCharacterList([...characterList, newCharacter])
  }

  const deleteCharacter = (id: string) => {
    setCharacterList(characterList.filter(char => char.id !== id))
  }

  const saveCharacters = () => {
    // Update the characters array used for autocomplete
    setCharacters(characterList.map(char => char.name))
    setIsCharactersDialogOpen(false)
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
              <div 
                className="relative cursor-pointer hover:scale-110 hover:shadow-lg transition-all duration-300 inline-block"
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
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
                  SCREENPLAY
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isCharactersDialogOpen} onOpenChange={setIsCharactersDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  style={{
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)'
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Characters
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Character Management</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  {/* Character List */}
                  <div className="space-y-3">
                    {characterList.map((character) => (
                      <div key={character.id} className="flex gap-3 p-3 border rounded-lg">
                        <div className="flex-1 space-y-2">
                          <Input
                            value={character.name}
                            onChange={(e) => updateCharacterName(character.id, e.target.value)}
                            placeholder="Character Name"
                            className="font-semibold"
                          />
                          <Input
                            value={character.description}
                            onChange={(e) => updateCharacterDescription(character.id, e.target.value)}
                            placeholder="Character Description"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCharacter(character.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Add Character Button */}
                  <Button
                    variant="outline"
                    onClick={addCharacter}
                    className="w-full"
                    style={{
                      borderColor: 'var(--primary)',
                      color: 'var(--primary)'
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Character
                  </Button>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCharactersDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveCharacters}
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)'
                    }}
                  >
                    Save
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
          
          <div className="flex-1 overflow-y-auto p-1 space-y-1">
            {scenes.map((scene) => (
              <Card
                key={scene.id}
                className={cn(
                  "cursor-pointer transition-colors !py-0",
                  activeScene === scene.id && "ring-2 ring-primary bg-primary/5"
                )}
                onClick={() => setActiveScene(scene.id)}
              >
                <div className="p-2">
                  <div className="flex items-center gap-0">
                    <span className="text-xs text-muted-foreground">Scene</span>
                    <Input
                      value={scene.number}
                      onChange={(e) => updateScene(scene.id, "number", e.target.value)}
                      className="w-4 h-5 text-xs text-muted-foreground p-0 border-none bg-transparent"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-xs text-muted-foreground">:</span>
                    <Input
                      value={scene.title}
                      onChange={(e) => updateScene(scene.id, "title", e.target.value)}
                      className="flex-1 h-5 text-xs text-muted-foreground p-1 border-none bg-transparent"
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
                    className="w-8 text-lg font-semibold border-none bg-transparent p-0 h-auto"
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
              
              <div className="flex-1 p-4 space-y-4">
                {/* Scene Format Dropdowns */}
                <div className="flex gap-4 items-center justify-center">
                  <select className="px-4 py-2 border rounded text-sm bg-background font-medium">
                    <option value="">FORMAT</option>
                    <option value="ext">EXT</option>
                    <option value="int">INT</option>
                  </select>
                  
                  <input 
                    type="text" 
                    placeholder="LOCATION"
                    className="px-4 py-2 border rounded text-sm bg-background font-medium w-40"
                  />
                  
                  <select className="px-4 py-2 border rounded text-sm bg-background font-medium">
                    <option value="">TIME OF SCENE</option>
                    <option value="day">DAY</option>
                    <option value="night">NIGHT</option>
                    <option value="dawn">DAWN</option>
                    <option value="dusk">DUSK</option>
                    <option value="continuous">CONTINUOUS</option>
                  </select>
                </div>

                {/* Description Text Field */}
                <div className="flex justify-center">
                  <input 
                    type="text" 
                    placeholder="Scene description..."
                    className="px-4 py-2 border rounded text-sm bg-background font-medium w-full max-w-2xl"
                  />
                </div>

                {/* Action Items */}
                {actionItems.map((actionItem, index) => (
                  <div key={actionItem.id} className="flex justify-center gap-2">
                    <div className="flex items-center gap-2 w-full max-w-2xl">
                      {/* Drag Handle */}
                      <div className="cursor-move text-muted-foreground hover:text-foreground">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                        </svg>
                      </div>
                      
                      {/* Action Input */}
                      <input
                        value={actionItem.content}
                        onChange={(e) => updateActionItem(actionItem.id, e.target.value)}
                        placeholder="Enter action description..."
                        className="flex-1 px-4 py-2 border rounded text-sm bg-background font-medium"
                      />
                      
                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteActionItem(actionItem.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Dialogue Items */}
                {dialogueItems.map((dialogueItem, index) => (
                  <div key={dialogueItem.id} className="flex justify-center gap-2">
                    <div className="flex items-center gap-2 w-full max-w-2xl">
                      {/* Drag Handle */}
                      <div className="cursor-move text-muted-foreground hover:text-foreground">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                        </svg>
                      </div>
                      
                      {/* Character Name Input */}
                      <div className="relative">
                        <input
                          value={dialogueItem.character}
                          onChange={(e) => handleCharacterInput(dialogueItem.id, e.target.value)}
                          onFocus={() => setShowCharacterDropdown(dialogueItem.id)}
                          onBlur={() => setTimeout(() => setShowCharacterDropdown(null), 200)}
                          onKeyDown={(e) => handleCharacterKeyDown(dialogueItem.id, e)}
                          placeholder="Character"
                          className="w-24 px-4 py-2 border rounded text-sm bg-background font-medium text-center"
                        />
                        {/* Character Dropdown */}
                        {showCharacterDropdown === dialogueItem.id && (
                          <div className="absolute top-full left-0 mt-1 w-32 bg-background border rounded-lg shadow-lg z-10">
                            {getFilteredCharacters(dialogueItem.character).length > 0 ? getFilteredCharacters(dialogueItem.character).map((character, index) => (
                              <button
                                key={character}
                                onClick={() => selectCharacter(dialogueItem.id, character)}
                                className={`w-full px-3 py-2 text-left text-sm first:rounded-t-lg last:rounded-b-lg ${
                                  index === (characterDropdownIndex[dialogueItem.id] || -1)
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted/50'
                                }`}
                              >
                                {character}
                              </button>
                            )) : (
                              <div className="px-3 py-2 text-sm text-muted-foreground">
                                No characters found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Dialogue Input */}
                      <input
                        value={dialogueItem.dialogue}
                        onChange={(e) => updateDialogueItem(dialogueItem.id, 'dialogue', e.target.value)}
                        placeholder="Enter dialogue..."
                        className="flex-1 px-4 py-2 border rounded text-sm bg-background font-medium"
                      />
                      
                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteDialogueItem(dialogueItem.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={addActionItem}
                    style={{
                      borderColor: 'var(--primary)',
                      color: 'var(--primary)'
                    }}
                  >
                    Add Action
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={addDialogueItem}
                    style={{
                      borderColor: 'var(--primary)',
                      color: 'var(--primary)'
                    }}
                  >
                    Add Dialogue
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    style={{
                      borderColor: 'var(--primary)',
                      color: 'var(--primary)'
                    }}
                  >
                    Add Transition
                  </Button>
                </div>

                {/* Scene Content Area */}
                <div className="flex-1 border rounded-lg p-4 bg-muted/20">
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <p>Scene content will appear here as you add actions, dialogue, and transitions...</p>
                  </div>
                </div>
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

      </div>
    </div>
  )
}
