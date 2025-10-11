"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus, Trash2 } from "lucide-react"
import type { ScreenplayCharactersProps } from "./types"

export function ScreenplayCharacters({
  characterList,
  newCharacterName,
  newCharacterDescription,
  getCharacterUsageCount,
  getCharacterSceneCount,
  onCharacterNameUpdate,
  onCharacterDescriptionUpdate,
  onCharacterAdd,
  onCharacterDelete,
  onNewCharacterNameChange,
  onNewCharacterDescriptionChange,
  onSave,
  onCancel
}: ScreenplayCharactersProps) {
  return (
    <div className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Character Management</h2>
      </div>
      
      <div className="space-y-4">
        {/* Character List */}
        <div className="space-y-3">
          {characterList.map((character) => (
            <div key={character.id} className="flex gap-3 p-3 border rounded-lg">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    value={character.name}
                    onChange={(e) => onCharacterNameUpdate(character.id, e.target.value)}
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
                  onChange={(e) => onCharacterDescriptionUpdate(character.id, e.target.value)}
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
                      onClick={() => onCharacterDelete(character.id)}
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
            onChange={(e) => onNewCharacterNameChange(e.target.value)}
            placeholder="Character Name"
            className="flex-1"
          />
          <Input
            value={newCharacterDescription}
            onChange={(e) => onNewCharacterDescriptionChange(e.target.value)}
            placeholder="Character Description"
            className="flex-1"
          />
          <Button onClick={onCharacterAdd} disabled={!newCharacterName.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Character
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
