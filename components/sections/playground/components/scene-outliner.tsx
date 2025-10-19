"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface Scene {
  id: string
  text: string
  lineNumber: number
}

interface SceneOutlinerProps {
  scenes: Scene[]
  onSceneReorder: (fromIndex: number, toIndex: number) => void
  onSceneNavigate: (lineNumber: number) => void
}

export function SceneOutliner({
  scenes,
  onSceneReorder,
  onSceneNavigate
}: SceneOutlinerProps) {
  const [draggedSceneIndex, setDraggedSceneIndex] = useState<number | null>(null)
  const [dragOverSceneIndex, setDragOverSceneIndex] = useState<number | null>(null)

  return (
    <Card className="h-full p-0 overflow-hidden flex flex-col border">
      <div className="p-3 border-b bg-muted/30 flex items-center justify-between flex-shrink-0">
        <h3 className="font-semibold text-sm">Scene Outliner</h3>
        <p className="text-xs text-muted-foreground">{scenes.length} scene{scenes.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-1.5 space-y-0.5">
            {scenes.length === 0 ? (
              <p className="text-sm text-muted-foreground p-2">
                No scenes yet. Type a scene heading to get started.
              </p>
            ) : (
              scenes.map((scene, index) => (
                <button
                  key={scene.id}
                  draggable
                  onDragStart={() => {
                    setDraggedSceneIndex(index)
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragOverSceneIndex(index)
                  }}
                  onDragLeave={() => {
                    setDragOverSceneIndex(null)
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    if (draggedSceneIndex !== null && draggedSceneIndex !== index) {
                      onSceneReorder(draggedSceneIndex, index)
                    }
                    setDraggedSceneIndex(null)
                    setDragOverSceneIndex(null)
                  }}
                  onDragEnd={() => {
                    setDraggedSceneIndex(null)
                    setDragOverSceneIndex(null)
                  }}
                  onClick={() => onSceneNavigate(scene.lineNumber)}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded hover:bg-accent text-sm transition-all duration-200 cursor-move",
                    draggedSceneIndex === index && "opacity-50 scale-95",
                    dragOverSceneIndex === index && draggedSceneIndex !== index && "border-2 border-primary bg-primary/10"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="text-xs text-foreground truncate uppercase font-semibold leading-tight">
                        {scene.text.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  )
}

