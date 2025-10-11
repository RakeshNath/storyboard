"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, FileText, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ScreenplayScenesProps } from "./types"

export function ScreenplayScenes({ 
  scenes, 
  activeScene, 
  onSceneSelect, 
  onSceneAdd, 
  onSceneUpdate, 
  onSceneDelete 
}: ScreenplayScenesProps) {
  return (
    <div className="w-64 border-r bg-card flex flex-col">
      <div className="p-1 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-xs">Scenes</h3>
          <Button size="sm" className="h-6 px-1.5 text-xs" onClick={onSceneAdd}>
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
              onClick={onSceneAdd}
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
                "cursor-pointer transition-colors p-3",
                activeScene === scene.id && "ring-2 ring-primary bg-primary/5"
              )}
              onClick={() => onSceneSelect(scene.id)}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold">{scene.number}</span>
                      <Input
                        value={scene.title}
                        onChange={(e) => onSceneUpdate(scene.id, { title: e.target.value })}
                        className="text-sm font-medium border-none !bg-transparent p-0 h-auto flex-1"
                        placeholder="Scene title"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {(scene.location || scene.timeOfDay) && (
                      <div className="text-xs text-muted-foreground">
                        {[scene.location, scene.timeOfDay].filter(Boolean).join(' • ')}
                      </div>
                    )}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Delete ${scene.title}`}
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
                          onClick={() => onSceneDelete(scene.id)}
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
  )
}
