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
}

export function ScreenplayEditor({ screenplayId, onBack }: ScreenplayEditorProps) {
  const [scriptName, setScriptName] = useState("The Last Stand")
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: "1",
      number: "1",
      title: "Opening",
      content: JSON.stringify({
        format: "",
        location: "",
        timeOfDay: "",
        description: "",
        actions: [],
        dialogues: [],
        transitions: []
      }),
      characters: ["JOHN", "SARAH"]
    },
    {
      id: "2", 
      number: "2",
      title: "The Chase",
      content: JSON.stringify({
        format: "",
        location: "",
        timeOfDay: "",
        description: "",
        actions: [],
        dialogues: [],
        transitions: []
      }),
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
  const [transitionItems, setTransitionItems] = useState<Array<{id: string, content: string}>>([])
  const [itemOrder, setItemOrder] = useState<Array<{type: 'action' | 'dialogue' | 'transition', id: string}>>([])
  const [sceneFormat, setSceneFormat] = useState("")
  const [sceneLocation, setSceneLocation] = useState("")
  const [sceneTimeOfDay, setSceneTimeOfDay] = useState("")
  const [sceneDescription, setSceneDescription] = useState("")
  const [showCharacterDropdown, setShowCharacterDropdown] = useState<string | null>(null)
  const [characterDropdownIndex, setCharacterDropdownIndex] = useState<{[key: string]: number}>({})
  const [isCharactersDialogOpen, setIsCharactersDialogOpen] = useState(false)
  const [draggedItem, setDraggedItem] = useState<{type: 'action' | 'dialogue' | 'transition', id: string} | null>(null)
  const [dragOverItem, setDragOverItem] = useState<{type: 'action' | 'dialogue' | 'transition', id: string} | null>(null)
  
  // Scene transition options
  const transitionOptions = [
    "FADE IN",
    "FADE OUT", 
    "FADE TO BLACK",
    "CUT TO",
    "DISSOLVE TO",
    "WIPE TO",
    "SMASH CUT TO",
    "MATCH CUT TO",
    "MONTAGE",
    "INTERCUT WITH",
    "BACK TO",
    "CONTINUOUS",
    "LATER",
    "SAME TIME",
    "SERIES OF SHOTS",
    "END MONTAGE",
    "END INTERCUT"
  ]
  const [characterList, setCharacterList] = useState<Character[]>([
    { id: "1", name: "JOHN", description: "Protagonist - A determined detective" },
    { id: "2", name: "SARAH", description: "Supporting character - John's partner" },
    { id: "3", name: "ANTAGONIST", description: "Main villain - Mysterious criminal mastermind" },
    { id: "4", name: "DETECTIVE", description: "Secondary character - Police detective" }
  ])

  // Load scene data when active scene changes
  useEffect(() => {
    const currentScene = scenes.find(s => s.id === activeScene)
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
        // Handle legacy scenes that might not have JSON content
        setSceneFormat("")
        setSceneLocation("")
        setSceneTimeOfDay("")
        setSceneDescription(currentScene.content || "")
        setActionItems([])
        setDialogueItems([])
        setTransitionItems([])
        setItemOrder([])
      }
    }
  }, [activeScene, scenes])

  const addScene = () => {
    const newScene: Scene = {
      id: (scenes.length + 1).toString(),
      number: (scenes.length + 1).toString(),
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

  const saveSceneData = () => {
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
    const newContent = JSON.stringify(sceneData)
    
    // Only update if content has actually changed
    const currentScene = scenes.find(s => s.id === activeScene)
    if (currentScene && currentScene.content !== newContent) {
      updateScene(activeScene, 'content', newContent)
    }
  }

  // Auto-save when scene data changes (debounced)
  useEffect(() => {
    if (activeScene) {
      const timeoutId = setTimeout(() => {
        saveSceneData()
      }, 500) // 500ms debounce
      
      return () => clearTimeout(timeoutId)
    }
  }, [sceneFormat, sceneLocation, sceneTimeOfDay, sceneDescription, actionItems, dialogueItems, transitionItems, itemOrder])

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
    setItemOrder([...itemOrder, { type: 'dialogue', id: newDialogue.id }])
  }

  const addTransitionItem = () => {
    const newTransition = {
      id: Date.now().toString(),
      content: "CUT TO"
    }
    setTransitionItems([...transitionItems, newTransition])
    // Transitions are not added to itemOrder since they always appear at the end
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

  const updateTransitionItem = (id: string, content: string) => {
    setTransitionItems(transitionItems.map(item => 
      item.id === id ? { ...item, content } : item
    ))
  }

  const deleteTransitionItem = (id: string) => {
    setTransitionItems(transitionItems.filter(item => item.id !== id))
    // Transitions are not in itemOrder, so no need to remove from it
  }

  // Drag and Drop Functions (transitions cannot be reordered)
  const handleDragStart = (type: 'action' | 'dialogue' | 'transition', id: string) => {
    // Prevent transitions from being dragged
    if (type === 'transition') {
      return
    }
    setDraggedItem({ type, id })
  }

  const handleDragOver = (e: React.DragEvent, type: 'action' | 'dialogue' | 'transition', id: string) => {
    // Prevent dropping on transitions
    if (type === 'transition') {
      return
    }
    e.preventDefault()
    setDragOverItem({ type, id })
  }

  const handleDragLeave = () => {
    setDragOverItem(null)
  }

  const handleDrop = (type: 'action' | 'dialogue' | 'transition', targetId: string) => {
    // Prevent dropping on transitions
    if (type === 'transition') {
      setDraggedItem(null)
      setDragOverItem(null)
      return
    }
    
    if (!draggedItem) {
      setDraggedItem(null)
      setDragOverItem(null)
      return
    }

    const draggedOrderIndex = itemOrder.findIndex(item => item.type === draggedItem.type && item.id === draggedItem.id)
    const targetOrderIndex = itemOrder.findIndex(item => item.type === type && item.id === targetId)
    
    if (draggedOrderIndex !== -1 && targetOrderIndex !== -1 && draggedOrderIndex !== targetOrderIndex) {
      const newOrder = [...itemOrder]
      const [movedItem] = newOrder.splice(draggedOrderIndex, 1)
      newOrder.splice(targetOrderIndex, 0, movedItem)
      setItemOrder(newOrder)
    }

    setDraggedItem(null)
    setDragOverItem(null)
  }

  const moveDialogueItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...dialogueItems]
    const [movedItem] = newItems.splice(fromIndex, 1)
    newItems.splice(toIndex, 0, movedItem)
    setDialogueItems(newItems)
  }

  // Helper function to get items in order (transitions always at end)
  const getOrderedItems = () => {
    // Get non-transition items in order
    const nonTransitionItems = itemOrder
      .filter(orderItem => orderItem.type !== 'transition')
      .map(orderItem => {
        if (orderItem.type === 'action') {
          const action = actionItems.find(item => item.id === orderItem.id)
          return action ? { ...action, type: 'action' as const } : null
        } else if (orderItem.type === 'dialogue') {
          const dialogue = dialogueItems.find(item => item.id === orderItem.id)
          return dialogue ? { ...dialogue, type: 'dialogue' as const } : null
        }
        return null
      }).filter((item): item is NonNullable<typeof item> => item !== null)
    
    // Get all transition items (always at the end)
    const transitionItems_ordered = transitionItems.map(transition => ({ 
      ...transition, 
      type: 'transition' as const 
    }))
    
    // Combine: non-transitions first, then transitions
    return [...nonTransitionItems, ...transitionItems_ordered]
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
    if (value.trim().length > 0) {
      const upperValue = value.trim().toUpperCase()
      
      // Check if character already exists in characterList
      const existingCharacter = characterList.find(char => char.name === upperValue)
      
      if (!existingCharacter) {
        // Add new character to characterList
        const newCharacter: Character = {
          id: Date.now().toString(),
          name: upperValue,
          description: "New character"
        }
        setCharacterList([...characterList, newCharacter])
        
        // Update the characters array for autocomplete (keeping in sync)
        setCharacters(prev => [...prev, upperValue])
      }
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
    const oldCharacter = characterList.find(char => char.id === id)
    const newName = name.toUpperCase()
    
    // Update characterList
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
    const newCharacter: Character = {
      id: Date.now().toString(),
      name: "NEW CHARACTER",
      description: "Character description..."
    }
    setCharacterList([...characterList, newCharacter])
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
        // Handle legacy scenes or parsing errors
      }
    })
    return totalDialogueCount
  }

  const getCharacterSceneCount = (characterName: string) => {
    // Count scenes where character has dialogue across all scenes
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
        // Handle legacy scenes or parsing errors
      }
    })
    return sceneCount
  }

  const currentScene = scenes.find(s => s.id === activeScene)

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
                onChange={(e) => setScriptName(e.target.value)}
                className="text-xl font-bold border-none !bg-transparent p-0 h-auto"
                placeholder="Screenplay Title"
              />
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
                                  title="Number of scenes"
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
                            placeholder="Character Description"
                          />
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCharacter(character.id)}
                              disabled={getCharacterUsageCount(character.name) > 0 || getCharacterSceneCount(character.name) > 0}
                              className="text-destructive hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {getCharacterUsageCount(character.name) > 0 || getCharacterSceneCount(character.name) > 0
                              ? "Remove character from all scenes to delete"
                              : "Delete character"}
                          </TooltipContent>
                        </Tooltip>
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
            ))}
          </div>
        </div>

        {/* Center Panel - Main Editor */}
        <div className="flex-1 flex flex-col bg-transparent">
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

              {/* Tabs Container */}
              <Tabs defaultValue="script" className="flex-1 flex flex-col">
                <div className="relative border-b">
                  <TabsList className="relative bg-transparent h-10 p-0 border-0 grid-cols-2">
                    <TabsTrigger 
                      value="script" 
                      className="relative bg-muted/50 border border-b-0 border-border rounded-t-lg rounded-b-none px-4 py-2 data-[state=active]:bg-background data-[state=active]:border-b-background data-[state=active]:z-10 data-[state=active]:shadow-none"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Script
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
                
                <TabsContent value="script" className="flex-1 border border-t-0 rounded-t-none rounded-lg bg-background p-4 m-0">
                  <div className="space-y-4">
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

                {/* Ordered Items (Actions, Dialogues, Transitions) */}
                {getOrderedItems().map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`flex justify-center gap-2 ${draggedItem?.id === item.id ? 'opacity-50' : ''} ${dragOverItem?.id === item.id && dragOverItem?.type === item.type ? 'border-t-2 border-primary' : ''}`}
                    draggable={item.type !== 'transition'}
                    onDragStart={() => handleDragStart(item.type, item.id)}
                    onDragOver={(e) => handleDragOver(e, item.type, item.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(item.type, item.id)}
                  >
                    <div className="flex items-center gap-2 w-full max-w-4xl">
                      {/* Drag Handle - Only for actions and dialogues */}
                      {item.type !== 'transition' && (
                        <div className="cursor-move text-muted-foreground hover:text-foreground">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                          </svg>
                        </div>
                      )}
                      
                      {/* Render based on item type */}
                      {item.type === 'action' && 'content' in item && (
                        <>
                          {/* Action Input */}
                          <input
                            value={item.content}
                            onChange={(e) => updateActionItem(item.id, e.target.value)}
                            placeholder="Enter action description..."
                            className="flex-1 px-4 py-2 border rounded text-sm bg-transparent font-medium"
                          />
                          
                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteActionItem(item.id)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {item.type === 'dialogue' && 'character' in item && 'dialogue' in item && (
                        <>
                          {/* Character Name Input */}
                          <div className="relative">
                            <input
                              value={item.character}
                              onChange={(e) => handleCharacterInput(item.id, e.target.value)}
                              onFocus={() => setShowCharacterDropdown(item.id)}
                              onBlur={() => {
                                setTimeout(() => setShowCharacterDropdown(null), 200)
                                handleCharacterBlur(item.id, item.character)
                              }}
                              onKeyDown={(e) => handleCharacterKeyDown(item.id, e)}
                              placeholder="type character name"
                              className="w-24 px-2 py-2 border rounded text-sm bg-transparent font-medium"
                            />
                            
                            {/* Character Dropdown */}
                            {showCharacterDropdown === item.id && (
                              <div className="absolute top-full left-0 mt-1 w-32 bg-background border rounded-lg shadow-lg z-10 max-h-32 overflow-y-auto">
                                {getFilteredCharacters(item.character).length > 0 ? (
                                  getFilteredCharacters(item.character).map((character, index) => (
                                    <button
                                      key={character}
                                      onClick={() => selectCharacter(item.id, character)}
                                      className={`w-full px-2 py-1 text-left text-xs first:rounded-t-lg last:rounded-b-lg ${
                                        index === (characterDropdownIndex[item.id] || -1)
                                          ? 'bg-primary text-primary-foreground'
                                          : 'hover:bg-muted/50'
                                      }`}
                                    >
                                      {character}
                                    </button>
                                  ))
                                ) : (
                                  <div className="px-2 py-1 text-xs text-muted-foreground">
                                    No characters found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Dialogue Input */}
                          <input
                            value={item.dialogue}
                            onChange={(e) => updateDialogueItem(item.id, 'dialogue', e.target.value)}
                            placeholder="Enter dialogue..."
                            className="flex-1 px-4 py-2 border rounded text-sm bg-transparent font-medium"
                          />
                          
                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteDialogueItem(item.id)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {item.type === 'transition' && 'content' in item && (
                        <>
                          {/* Transition Dropdown */}
                          <select
                            value={item.content}
                            onChange={(e) => updateTransitionItem(item.id, e.target.value)}
                            className="flex-1 px-4 py-2 border rounded text-sm bg-transparent font-medium"
                          >
                            {transitionOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          
                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTransitionItem(item.id)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
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
                    onClick={addTransitionItem}
                    disabled={transitionItems.length > 0}
                    style={{
                      borderColor: transitionItems.length > 0 ? 'var(--muted-foreground)' : 'var(--primary)',
                      color: transitionItems.length > 0 ? 'var(--muted-foreground)' : 'var(--primary)',
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
                </TabsContent>
                
                <TabsContent value="help" className="flex-1 border border-t-0 rounded-t-none rounded-lg bg-background p-6 m-0">
                  <div className="h-full overflow-y-auto">
                    <div className="max-w-4xl mx-auto space-y-6">
                      <div className="text-center mb-8">
                        <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h1 className="text-3xl font-bold mb-2">Screenplay Writing Guide</h1>
                        <p className="text-muted-foreground text-lg">Learn how to write professional screenplays using this editor</p>
                      </div>

                      {/* Getting Started */}
                      <div className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                          Getting Started
                        </h2>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">
                            Select a scene from the left panel to start writing. Each scene requires FORMAT, LOCATION, and TIME OF DAY to be set.
                          </p>
                          <div className="bg-background p-3 rounded border-l-4 border-primary">
                            <p className="text-sm"><strong>Tip:</strong> Use the drag handles to reorder actions and dialogues within a scene.</p>
                          </div>
                        </div>
                      </div>

                      {/* Scene Structure */}
                      <div className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                          Scene Structure
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <h3 className="font-medium">Format</h3>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                              <li>• <strong>EXT</strong> - Exterior scenes</li>
                              <li>• <strong>INT</strong> - Interior scenes</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-medium">Location</h3>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                              <li>• Be specific and descriptive</li>
                              <li>• Use proper names when possible</li>
                              <li>• Keep it concise</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-medium">Time of Day</h3>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                              <li>• DAY, NIGHT, DAWN, DUSK</li>
                              <li>• CONTINUOUS for same time</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Content Types */}
                      <div className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                          Content Types
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                            <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">Actions</h3>
                            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                              <li>• Describe what happens visually</li>
                              <li>• Use present tense</li>
                              <li>• Be concise and clear</li>
                              <li>• Focus on what can be seen</li>
                            </ul>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Dialogue</h3>
                            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                              <li>• Type @ to autocomplete characters</li>
                              <li>• Use character names in CAPS</li>
                              <li>• Keep dialogue natural</li>
                              <li>• Show, don't tell</li>
                            </ul>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
                            <h3 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Transitions</h3>
                            <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                              <li>• Only one per scene</li>
                              <li>• Common: CUT TO, FADE IN, etc.</li>
                              <li>• Use sparingly</li>
                              <li>• Always at scene end</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Character Management */}
                      <div className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                          Character Management
                        </h2>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">
                            Use the "Characters" button in the header to manage your character list. Characters are automatically added when you type new names in dialogue.
                          </p>
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <h4 className="font-medium mb-2">Character Features</h4>
                              <ul className="text-sm space-y-1 text-muted-foreground">
                                <li>• Auto-complete with @ symbol</li>
                                <li>• Usage counters for dialogue and scenes</li>
                                <li>• Cannot delete active characters</li>
                                <li>• Editable descriptions</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Best Practices</h4>
                              <ul className="text-sm space-y-1 text-muted-foreground">
                                <li>• Use consistent character names</li>
                                <li>• Keep names in ALL CAPS</li>
                                <li>• Add descriptions for clarity</li>
                                <li>• Remove unused characters</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Formatting Tips */}
                      <div className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</span>
                          Formatting Tips
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                            <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Screenplay Format</h3>
                            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                              <li>• 12pt Courier font (industry standard)</li>
                              <li>• 1 inch margins all around</li>
                              <li>• Scene headings in CAPS</li>
                              <li>• Character names in CAPS</li>
                            </ul>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 p-4 rounded-lg">
                            <h3 className="font-medium text-orange-800 dark:text-orange-200 mb-2">Writing Style</h3>
                            <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                              <li>• Present tense for actions</li>
                              <li>• Active voice preferred</li>
                              <li>• Avoid camera directions</li>
                              <li>• Show character emotions</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="text-center pt-8 border-t">
                        <p className="text-sm text-muted-foreground">
                          Need more help? The editor auto-saves your work as you type, and you can always drag and drop to reorder content.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
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
