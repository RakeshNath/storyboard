"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, FileText, Trash2 } from "lucide-react"
import { getFilteredCharacters } from "./screenplay-utils"
import type { ScreenplayEditorMainProps } from "./types"

export function ScreenplayEditorMain({
  currentScene,
  sceneFormat,
  sceneLocation,
  sceneTimeOfDay,
  sceneDescription,
  actionItems,
  dialogueItems,
  transitionItems,
  itemOrder,
  characters,
  characterList,
  showCharacterDropdown,
  characterDropdownIndex,
  draggedItem,
  dragOverItem,
  onSceneFormatChange,
  onSceneLocationChange,
  onSceneTimeOfDayChange,
  onSceneDescriptionChange,
  onActionAdd,
  onActionUpdate,
  onActionDelete,
  onDialogueAdd,
  onDialogueUpdate,
  onDialogueDelete,
  onTransitionAdd,
  onTransitionUpdate,
  onTransitionDelete,
  onCharacterInput,
  onCharacterBlur,
  onCharacterSelect,
  onCharacterKeyDown,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop
}: ScreenplayEditorMainProps) {
  if (!currentScene) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4" />
          <p>Select a scene to start writing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-transparent">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-muted-foreground">Scene</span>
          <Input
            value={currentScene.number}
            onChange={(e) => onSceneFormatChange(e.target.value)}
            className="w-8 text-lg font-semibold border-none bg-transparent p-0 h-auto"
            placeholder="#"
          />
          <span className="text-lg font-semibold text-muted-foreground">:</span>
          <Input
            value={currentScene.title}
            onChange={(e) => onSceneLocationChange(e.target.value)}
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
            onChange={(e) => onSceneFormatChange(e.target.value)}
            className={`px-4 py-2 border rounded text-sm bg-transparent font-medium ${!sceneFormat ? 'border-red-500' : ''}`}
          >
            <option value="">FORMAT *</option>
            <option value="ext">EXT</option>
            <option value="int">INT</option>
          </select>
          
          <input 
            type="text" 
            value={sceneLocation}
            onChange={(e) => onSceneLocationChange(e.target.value)}
            placeholder="LOCATION *"
            className={`px-4 py-2 border rounded text-sm bg-transparent font-medium w-40 ${!sceneLocation ? 'border-red-500' : ''}`}
          />
          
          <select 
            value={sceneTimeOfDay}
            onChange={(e) => onSceneTimeOfDayChange(e.target.value)}
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
            onChange={(e) => onSceneDescriptionChange(e.target.value)}
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
            onClick={onActionAdd}
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
            onClick={onDialogueAdd}
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
            onClick={onTransitionAdd}
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
        <div className="flex-1 border rounded-lg p-6 bg-muted/20 overflow-y-auto">
          {itemOrder.length === 0 && actionItems.length === 0 && dialogueItems.length === 0 && transitionItems.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>Scene content will appear here as you add actions, dialogue, and transitions...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Render items in order */}
              {itemOrder.map((item) => {
                if (item.type === 'action') {
                  const action = actionItems.find(a => a.id === item.id)
                  if (!action) return null
                  
                  return (
                    <div key={action.id} className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Textarea
                          value={action.content}
                          onChange={(e) => onActionUpdate(action.id, e.target.value)}
                          className="flex-1 min-h-[60px] font-mono text-sm"
                          placeholder="Enter action description..."
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onActionDelete(action.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                }
                
                if (item.type === 'dialogue') {
                  const dialogue = dialogueItems.find(d => d.id === item.id)
                  if (!dialogue) return null
                  
                  return (
                    <div key={dialogue.id} className="space-y-2 pl-20">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 space-y-2">
                          {/* Character Name Input with Autocomplete */}
                          <div className="relative">
                            <Input
                              value={dialogue.character}
                              onChange={(e) => onCharacterInput(dialogue.id, e.target.value)}
                              onBlur={(e) => onCharacterBlur(dialogue.id, e.target.value)}
                              onKeyDown={(e) => onCharacterKeyDown(dialogue.id, e)}
                              placeholder="CHARACTER"
                              className="font-bold uppercase text-center"
                            />
                            
                            {/* Character Autocomplete Dropdown */}
                            {showCharacterDropdown === dialogue.id && dialogue.character && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-md z-10 max-h-40 overflow-y-auto">
                                {getFilteredCharacters(dialogue.character, characterList).map((char, index) => (
                                  <button
                                    key={char.id}
                                    type="button"
                                    onClick={() => onCharacterSelect(dialogue.id, char.name)}
                                    className={`w-full text-left px-3 py-2 hover:bg-accent ${
                                      index === (characterDropdownIndex[dialogue.id] || -1) ? 'bg-accent' : ''
                                    }`}
                                  >
                                    <div className="font-bold">{char.name}</div>
                                    <div className="text-xs text-muted-foreground">{char.description}</div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Dialogue Text */}
                          <Textarea
                            value={dialogue.dialogue}
                            onChange={(e) => onDialogueUpdate(dialogue.id, 'dialogue', e.target.value)}
                            className="min-h-[80px] pl-12 font-mono text-sm"
                            placeholder="Dialogue text..."
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDialogueDelete(dialogue.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                }
                
                return null
              })}
              
              {/* Render Transitions (not in itemOrder, rendered separately at the end) */}
              {transitionItems.map((transition) => (
                <div key={transition.id} className="flex items-center justify-end gap-2 pr-20">
                  <Input
                    value={transition.content}
                    onChange={(e) => onTransitionUpdate(transition.id, e.target.value)}
                    className="w-48 text-right font-bold uppercase text-sm"
                    placeholder="CUT TO"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTransitionDelete(transition.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
