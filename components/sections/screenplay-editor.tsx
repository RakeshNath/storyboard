"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit3, Trash2, Users, FileText, HelpCircle } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  onTitleChange?: (title: string) => void
  initialTitle?: string
}

export function ScreenplayEditor({ screenplayId, onBack, onTitleChange, initialTitle }: ScreenplayEditorProps) {
  const [scriptName, setScriptName] = useState(initialTitle || "Untitled Screenplay")
  const [scenes, setScenes] = useState<Scene[]>([])
  const [activeScene, setActiveScene] = useState<string | null>(null)
  const [characters, setCharacters] = useState([
    "JOHN", "SARAH", "ANTAGONIST", "DETECTIVE"
  ])
  const [actionItems, setActionItems] = useState<Array<{id: string, content: string}>>([])
  const [dialogueItems, setDialogueItems] = useState<Array<{id: string, character: string, dialogue: string}>>([])
  const [transitionItems, setTransitionItems] = useState<Array<{id: string, content: string}>>([])
  const [itemOrder, setItemOrder] = useState<Array<{type: 'action' | 'dialogue' | 'transition', id: string}>>([])
  const [characterList, setCharacterList] = useState<Character[]>([
    { id: "1", name: "JOHN", description: "Main protagonist" },
    { id: "2", name: "SARAH", description: "Supporting character" },
    { id: "3", name: "ANTAGONIST", description: "Main villain" },
    { id: "4", name: "DETECTIVE", description: "Law enforcement" }
  ])
  const [sceneFormat, setSceneFormat] = useState("")
  const [sceneLocation, setSceneLocation] = useState("")
  const [sceneTimeOfDay, setSceneTimeOfDay] = useState("")
  const [sceneDescription, setSceneDescription] = useState("")
  const [showCharacterDropdown, setShowCharacterDropdown] = useState<string | null>(null)
  const [characterDropdownIndex, setCharacterDropdownIndex] = useState<{[key: string]: number}>({})
  const [isCharactersDialogOpen, setIsCharactersDialogOpen] = useState(false)
  const [newCharacterName, setNewCharacterName] = useState("")
  const [newCharacterDescription, setNewCharacterDescription] = useState("")
  const [draggedItem, setDraggedItem] = useState<{type: 'action' | 'dialogue' | 'transition', id: string} | null>(null)
  const [dragOverItem, setDragOverItem] = useState<{type: 'action' | 'dialogue' | 'transition', id: string} | null>(null)
  
  // Scene transition options
  const transitionOptions = [
    "FADE IN",
    "FADE OUT", 
    "CUT TO",
    "DISSOLVE TO",
    "SMASH CUT TO",
    "MATCH CUT TO"
  ]

  const currentScene = scenes.find(scene => scene.id === activeScene)

  // Load storyboard title on mount
  useEffect(() => {
    if (initialTitle) {
      setScriptName(initialTitle)
    }
  }, [initialTitle])

  // Handle title changes and notify parent
  const handleTitleChange = (newTitle: string) => {
    setScriptName(newTitle)
    if (onTitleChange) {
      onTitleChange(newTitle)
    }
  }

  // Load scene data when active scene changes
  useEffect(() => {
    if (currentScene) {
      try {
        const sceneData = JSON.parse(currentScene.content || '{}')
        setSceneFormat(sceneData.format || "")
        setSceneLocation(sceneData.location || "")
        setSceneTimeOfDay(sceneData.timeOfDay || "")
        setSceneDescription(sceneData.description || "")
        setActionItems(sceneData.actions || [])
        setDialogueItems(sceneData.dialogues || [])
        setTransitionItems(sceneData.transitions || [])
        setItemOrder(sceneData.itemOrder || [])
      } catch (error) {
        console.error("Error parsing scene content:", error)
        setSceneFormat("")
        setSceneLocation("")
        setSceneTimeOfDay("")
        setSceneDescription("")
        setActionItems([])
        setDialogueItems([])
        setTransitionItems([])
        setItemOrder([])
      }
    } else {
      setSceneFormat("")
      setSceneLocation("")
      setSceneTimeOfDay("")
      setSceneDescription("")
      setActionItems([])
      setDialogueItems([])
      setTransitionItems([])
      setItemOrder([])
    }
  }, [activeScene])

  // Auto-save when content changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentScene) {
        saveSceneData()
      }
    }, 1000)
    
    return () => clearTimeout(timeoutId)
  }, [sceneFormat, sceneLocation, sceneTimeOfDay, sceneDescription, actionItems, dialogueItems, transitionItems, itemOrder, currentScene])

  const addActionItem = () => {
    const newAction = {
      id: Date.now().toString(),
      content: "Enter action description..."
    }
    setActionItems([...actionItems, newAction])
    setItemOrder([...itemOrder, { type: 'action', id: newAction.id }])
  }

  const updateActionItem = (id: string, content: string) => {
    setActionItems(actionItems.map(item => 
      item.id === id ? { ...item, content } : item
    ))
  }

  const deleteActionItem = (id: string) => {
    setActionItems(actionItems.filter(item => item.id !== id))
    setItemOrder(itemOrder.filter(item => !(item.type === 'action' && item.id === id)))
  }

  const addDialogueItem = () => {
    const newDialogue = {
      id: Date.now().toString(),
      character: "",
      dialogue: ""
    }
    setDialogueItems([...dialogueItems, newDialogue])
    setItemOrder([...itemOrder, { type: 'dialogue', id: newDialogue.id }])
  }

  const updateDialogueItem = (id: string, field: 'character' | 'dialogue', value: string) => {
    setDialogueItems(dialogueItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const deleteDialogueItem = (id: string) => {
    setDialogueItems(dialogueItems.filter(item => item.id !== id))
    setItemOrder(itemOrder.filter(item => !(item.type === 'dialogue' && item.id === id)))
  }

  const addTransitionItem = () => {
    const newTransition = {
      id: Date.now().toString(),
      content: "CUT TO"
    }
    setTransitionItems([...transitionItems, newTransition])
  }

  const updateTransitionItem = (id: string, content: string) => {
    setTransitionItems(transitionItems.map(item => 
      item.id === id ? { ...item, content } : item
    ))
  }

  const deleteTransitionItem = (id: string) => {
    setTransitionItems(transitionItems.filter(item => item.id !== id))
  }

  const saveSceneData = () => {
    if (!currentScene) return
    
    const sceneData = {
      format: sceneFormat,
      location: sceneLocation,
      timeOfDay: sceneTimeOfDay,
      description: sceneDescription,
      actions: actionItems,
      dialogues: dialogueItems,
      transitions: transitionItems,
      itemOrder: itemOrder
    }

    const updatedScenes = scenes.map(scene => 
      scene.id === activeScene 
        ? { ...scene, content: JSON.stringify(sceneData) }
        : scene
    )
    setScenes(updatedScenes)
  }

  const addScene = () => {
    const newSceneNumber = (scenes.length + 1).toString()
    const newScene: Scene = {
      id: Date.now().toString(),
      number: newSceneNumber,
      title: "",
      content: JSON.stringify({
        format: "",
        location: "",
        timeOfDay: "",
        description: "",
        actions: [],
        dialogues: [],
        transitions: []
      }),
      characters: []
    }
    setScenes([...scenes, newScene])
    // Set the new scene as active if it's the first scene
    if (scenes.length === 0) {
      setActiveScene(newScene.id)
    }
  }

  const updateScene = (id: string, field: 'number' | 'title', value: string) => {
    setScenes(scenes.map(scene => 
      scene.id === id ? { ...scene, [field]: value } : scene
    ))
  }

  const deleteScene = (id: string) => {
    const updatedScenes = scenes.filter(scene => scene.id !== id)
    setScenes(updatedScenes)
    
    if (activeScene === id) {
      if (updatedScenes.length > 0) {
        setActiveScene(updatedScenes[0].id)
      } else {
        setActiveScene(null)
      }
    }
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

  const handleCharacterBlur = (dialogueId: string, value: string) => {
    const upperValue = value.toUpperCase().trim()
    if (upperValue && !characterList.some(char => char.name === upperValue)) {
      // Add new character
      const newCharacter = {
        id: Date.now().toString(),
        name: upperValue,
        description: "New character"
      }
      setCharacterList([...characterList, newCharacter])
      
      // Update the characters array for autocomplete (keeping in sync)
      setCharacters(prev => [...prev, upperValue])
    }
  }

  const selectCharacter = (dialogueId: string, characterName: string) => {
    updateDialogueItem(dialogueId, 'character', characterName)
    setShowCharacterDropdown(null)
    setCharacterDropdownIndex(prev => ({ ...prev, [dialogueId]: -1 }))
  }

  const getFilteredCharacters = (searchText: string) => {
    return characterList.map(char => char.name).filter(character => 
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
          const nextIndex = Math.min(currentIndex + 1, filtered.length - 1)
          setCharacterDropdownIndex(prev => ({ ...prev, [dialogueId]: nextIndex }))
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (filtered.length > 0) {
          const prevIndex = Math.max(currentIndex - 1, -1)
          setCharacterDropdownIndex(prev => ({ ...prev, [dialogueId]: prevIndex }))
        }
        break
      case 'Enter':
        event.preventDefault()
        if (currentIndex >= 0 && currentIndex < filtered.length) {
          selectCharacter(dialogueId, filtered[currentIndex])
        }
        break
      case 'Escape':
        setShowCharacterDropdown(null)
        setCharacterDropdownIndex(prev => ({ ...prev, [dialogueId]: -1 }))
        break
    }
  }

  const updateCharacterName = (id: string, newName: string) => {
    const oldCharacter = characterList.find(char => char.id === id)
    setCharacterList(characterList.map(char => 
      char.id === id ? { ...char, name: newName } : char
    ))
    
    // Update characters array for autocomplete
    if (oldCharacter) {
      setCharacters(prev => prev.map(char => char === oldCharacter.name ? newName : char))
    }
  }

  const updateCharacterDescription = (id: string, description: string) => {
    setCharacterList(characterList.map(char => 
      char.id === id ? { ...char, description } : char
    ))
  }

  const addCharacter = () => {
    if (newCharacterName.trim()) {
      const newCharacter = {
        id: Date.now().toString(),
        name: newCharacterName.trim().toUpperCase(),
        description: newCharacterDescription.trim()
      }
      setCharacterList([...characterList, newCharacter])
      setCharacters([...characters, newCharacter.name])
      setNewCharacterName("")
      setNewCharacterDescription("")
    }
  }

  const deleteCharacter = (id: string) => {
    const characterToDelete = characterList.find(char => char.id === id)
    if (characterToDelete) {
      // Remove from characterList
      setCharacterList(characterList.filter(char => char.id !== id))
      // Remove from characters array for autocomplete
      setCharacters(prev => prev.filter(char => char !== characterToDelete.name))
    }
  }

  const saveCharacters = () => {
    // Update the characters array used for autocomplete
    setCharacters(characterList.map(char => char.name))
    setIsCharactersDialogOpen(false)
  }

  const getCharacterUsageCount = (characterName: string) => {
    // Count dialogues across all scenes
    let totalDialogueCount = 0
    scenes.forEach(scene => {
      try {
        const sceneData = JSON.parse(scene.content || '{}')
        if (sceneData.dialogues) {
          totalDialogueCount += sceneData.dialogues.filter((item: any) => item.character === characterName).length
        }
      } catch (error) {
        console.error("Error parsing scene content:", error)
      }
    })
    return totalDialogueCount
  }

  const getCharacterSceneCount = (characterName: string) => {
    // Count scenes where character has dialogue
    let sceneCount = 0
    scenes.forEach(scene => {
      try {
        const sceneData = JSON.parse(scene.content || '{}')
        if (sceneData.dialogues) {
          const hasDialogueInScene = sceneData.dialogues.some((item: any) => item.character === characterName)
          if (hasDialogueInScene) {
            sceneCount++
          }
        }
      } catch (error) {
        console.error("Error parsing scene content:", error)
      }
    })
    return sceneCount
  }

  const getOrderedItems = () => {
    const orderedItems = itemOrder.map(orderItem => {
      if (orderItem.type === 'action') {
        return actionItems.find(item => item.id === orderItem.id) || null
      } else if (orderItem.type === 'dialogue') {
        return dialogueItems.find(item => item.id === orderItem.id) || null
      }
      return null
    }).filter((item): item is NonNullable<typeof item> => item !== null)

    // Append all transitions at the end
    return [...orderedItems, ...transitionItems]
  }

  const handleDragStart = (type: 'action' | 'dialogue' | 'transition', id: string) => {
    if (type === 'transition') return
    setDraggedItem({ type, id })
  }

  const handleDragOver = (e: React.DragEvent, type: 'action' | 'dialogue' | 'transition', id: string) => {
    e.preventDefault()
    if (type === 'transition') return
    setDragOverItem({ type, id })
  }

  const handleDragLeave = () => {
    setDragOverItem(null)
  }

  const handleDrop = (e: React.DragEvent, type: 'action' | 'dialogue' | 'transition', id: string) => {
    e.preventDefault()
    if (!draggedItem || type === 'transition') return
    
    // Reorder itemOrder array
    const newOrder = [...itemOrder]
    const draggedIndex = newOrder.findIndex(item => item.id === draggedItem.id)
    const dropIndex = newOrder.findIndex(item => item.id === id)
    
    if (draggedIndex !== -1 && dropIndex !== -1) {
      const [draggedItemOrder] = newOrder.splice(draggedIndex, 1)
      newOrder.splice(dropIndex, 0, draggedItemOrder)
      setItemOrder(newOrder)
    }
    
    setDraggedItem(null)
    setDragOverItem(null)
  }

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              ← Back
            </Button>
            <div className="flex items-center gap-2">
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
              <Input
                value={scriptName}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-xl font-bold border-none !bg-transparent p-0 h-auto"
                placeholder="Screenplay Title"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="default"
              onClick={saveSceneData}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)'
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              Save
            </Button>
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
                          <div className="flex items-center gap-2">
                            <Input
                              value={character.name}
                              onChange={(e) => updateCharacterName(character.id, e.target.value)}
                              placeholder="Character Name"
                              className="font-semibold flex-1"
                            />
                            {/* Character Counters */}
                            <div className="flex items-center">
                              {/* Combined Counter Tile */}
                              <div 
                                className="flex w-16 h-8 rounded-lg border-2 overflow-hidden"
                                style={{
                                  borderColor: 'var(--primary)'
                                }}
                              >
                                {/* Dialogue Counter */}
                                <div 
                                  className="flex flex-col items-center justify-center flex-1 border-r text-xs font-bold"
                                  style={{
                                    backgroundColor: 'var(--primary)',
                                    color: 'var(--primary-foreground)',
                                    borderRightColor: 'var(--primary-foreground)'
                                  }}
                                  title="Number of dialogue lines"
                                >
                                  <span className="text-sm font-bold">{getCharacterUsageCount(character.name)}</span>
                                  <span className="text-[6px] leading-none">DIAL</span>
                                </div>
                                {/* Scene Counter */}
                                <div 
                                  className="flex flex-col items-center justify-center flex-1 text-xs font-bold"
                                  style={{
                                    backgroundColor: 'var(--accent)',
                                    color: 'var(--accent-foreground)'
                                  }}
                                  title="Number of scenes with dialogue"
                                >
                                  <span className="text-sm font-bold">{getCharacterSceneCount(character.name)}</span>
                                  <span className="text-[6px] leading-none">SCENE</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Input
                            value={character.description}
                            onChange={(e) => updateCharacterDescription(character.id, e.target.value)}
                            placeholder="Character description..."
                            className="text-sm"
                          />
                        </div>
                        
                        {/* Delete Button */}
                        <div className="flex items-start">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteCharacter(character.id)}
                                disabled={getCharacterUsageCount(character.name) > 0 || getCharacterSceneCount(character.name) > 0}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {getCharacterUsageCount(character.name) > 0 || getCharacterSceneCount(character.name) > 0 
                                  ? "Remove character from all scenes to delete" 
                                  : "Delete character"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Character */}
                  <div className="flex gap-2">
                    <Input
                      value={newCharacterName}
                      onChange={(e) => setNewCharacterName(e.target.value)}
                      placeholder="New character name..."
                      className="flex-1"
                    />
                    <Input
                      value={newCharacterDescription}
                      onChange={(e) => setNewCharacterDescription(e.target.value)}
                      placeholder="Description..."
                      className="flex-1"
                    />
                    <Button onClick={addCharacter} disabled={!newCharacterName.trim()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsCharactersDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={saveCharacters}>
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="script" className="flex-1 flex flex-col">
        <div className="relative border-b">
          <TabsList className="relative bg-transparent h-10 p-0 border-0 grid-cols-3">
            <TabsTrigger 
              value="script" 
              className="relative bg-muted/50 border border-b-0 border-border rounded-t-lg rounded-b-none px-4 py-2 data-[state=active]:bg-background data-[state=active]:border-b-background data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <FileText className="h-4 w-4 mr-2" />
              Script
            </TabsTrigger>
            <TabsTrigger 
              value="characters"
              className="relative bg-muted/50 border border-b-0 border-border rounded-t-lg rounded-b-none px-4 py-2 data-[state=active]:bg-background data-[state=active]:border-b-background data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <Users className="h-4 w-4 mr-2" />
              Characters
            </TabsTrigger>
            <TabsTrigger 
              value="help"
              className="relative bg-muted/50 border border-b-0 border-border rounded-t-lg rounded-b-none px-4 py-2 data-[state=active]:bg-background data-[state=active]:border-b-background data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="script" className="flex-1 border border-t-0 rounded-t-none rounded-lg bg-background m-0 flex flex-col">
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
                {scenes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">No scenes yet</p>
                    <Button 
                      size="sm" 
                      onClick={addScene}
                      className="h-8 px-3 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Scene
                    </Button>
                  </div>
                ) : (
                  scenes.map((scene) => (
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
                            className="w-4 h-5 text-xs text-muted-foreground p-0 border-none !bg-transparent"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-xs text-muted-foreground">:</span>
                          <Input
                            value={scene.title}
                            onChange={(e) => updateScene(scene.id, "title", e.target.value)}
                            className="flex-1 h-5 text-xs text-muted-foreground p-1 border-none !bg-transparent"
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
                  ))
                )}
              </div>
            </div>

            {/* Center Panel - Main Editor */}
            <div className="flex-1 flex flex-col bg-transparent">
              {scenes.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground max-w-md">
                    <FileText className="h-16 w-16 mx-auto mb-6 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">Start Your Screenplay</h3>
                    <p className="text-sm mb-6">Create your first scene to begin writing your screenplay. You can add actions, dialogue, and transitions to build your story.</p>
                    <Button 
                      onClick={addScene}
                      size="lg"
                      className="h-12 px-8"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Your First Scene
                    </Button>
                  </div>
                </div>
              ) : currentScene ? (
                <>
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-muted-foreground">Scene</span>
                      <Input
                        value={currentScene.number}
                        onChange={(e) => activeScene && updateScene(activeScene, "number", e.target.value)}
                        className="w-8 text-lg font-semibold border-none bg-transparent p-0 h-auto"
                        placeholder="#"
                      />
                      <span className="text-lg font-semibold text-muted-foreground">:</span>
                      <Input
                        value={currentScene.title}
                        onChange={(e) => activeScene && updateScene(activeScene, "title", e.target.value)}
                        className="flex-1 text-lg font-semibold border-none bg-transparent p-0 h-auto"
                        placeholder="Scene Title"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 space-y-4">
                    {/* Scene Format Dropdowns */}
                    <div className="flex gap-4 items-center justify-center">
                      <select 
                        value={sceneFormat}
                        onChange={(e) => setSceneFormat(e.target.value)}
                        className={`px-4 py-2 border rounded text-sm bg-transparent font-medium ${!sceneFormat ? 'border-red-500' : ''}`}
                      >
                        <option value="">FORMAT *</option>
                        <option value="ext">EXT</option>
                        <option value="int">INT</option>
                      </select>
                      
                      <input 
                        type="text" 
                        value={sceneLocation}
                        onChange={(e) => setSceneLocation(e.target.value)}
                        placeholder="LOCATION *"
                        className={`px-4 py-2 border rounded text-sm bg-transparent font-medium w-40 ${!sceneLocation ? 'border-red-500' : ''}`}
                      />
                      
                      <select 
                        value={sceneTimeOfDay}
                        onChange={(e) => setSceneTimeOfDay(e.target.value)}
                        className={`px-4 py-2 border rounded text-sm bg-transparent font-medium ${!sceneTimeOfDay ? 'border-red-500' : ''}`}
                      >
                        <option value="">TIME OF SCENE *</option>
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
                        value={sceneDescription}
                        onChange={(e) => setSceneDescription(e.target.value)}
                        placeholder="Scene description..."
                        className="px-4 py-2 border rounded text-sm bg-transparent font-medium w-full max-w-4xl transition-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                        style={{ 
                          minHeight: '40px',
                          lineHeight: '1.5'
                        }}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 items-center justify-center">
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
                        onClick={addTransitionItem}
                        disabled={transitionItems.length > 0}
                        style={{
                          borderColor: transitionItems.length > 0 ? 'var(--muted)' : 'var(--primary)',
                          color: transitionItems.length > 0 ? 'var(--muted)' : 'var(--primary)',
                          opacity: transitionItems.length > 0 ? 0.5 : 1,
                          cursor: transitionItems.length > 0 ? 'not-allowed' : 'pointer'
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
          </div>        </TabsContent>
        
        <TabsContent value="characters" className="flex-1 border border-t-0 rounded-t-none rounded-lg bg-background p-6 m-0">
          <div className="h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2">Characters Tab</h1>
                <p className="text-muted-foreground text-lg">Character management will be moved here from the header button once it's fully functional.</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="help" className="flex-1 border border-t-0 rounded-t-none rounded-lg bg-background p-6 m-0">
          <div className="h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2">Screenplay Writing Guide</h1>
                <p className="text-muted-foreground text-lg">Learn how to write professional screenplays using this editor</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}