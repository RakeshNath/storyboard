export interface Scene {
  id: string
  number: string
  title: string
  content: string
  characters: string[]
}

export interface Character {
  id: string
  name: string
  description: string
}

export interface ActionItem {
  id: string
  content: string
}

export interface DialogueItem {
  id: string
  character: string
  dialogue: string
}

export interface TransitionItem {
  id: string
  content: string
}

export interface ItemOrder {
  type: 'action' | 'dialogue' | 'transition'
  id: string
}

export interface SceneData {
  format: string
  location: string
  timeOfDay: string
  description: string
  actions: ActionItem[]
  dialogues: DialogueItem[]
  transitions: TransitionItem[]
  itemOrder: ItemOrder[]
}

export interface ScreenplayEditorProps {
  screenplayId: string
  onBack: () => void
  onTitleChange?: (title: string) => void
  initialTitle?: string
}

export interface ScreenplayHeaderProps {
  scriptName: string
  onTitleChange: (title: string) => void
  onSave: () => void
  onCharactersClick: () => void
  onBack?: () => void
}

export interface ScreenplayScenesProps {
  scenes: Scene[]
  activeScene: string | null
  onSceneSelect: (sceneId: string) => void
  onSceneAdd: () => void
  onSceneUpdate: (id: string, field: 'number' | 'title', value: string) => void
  onSceneDelete: (id: string) => void
}

export interface ScreenplayEditorMainProps {
  currentScene: Scene | null
  sceneFormat: string
  sceneLocation: string
  sceneTimeOfDay: string
  sceneDescription: string
  actionItems: ActionItem[]
  dialogueItems: DialogueItem[]
  transitionItems: TransitionItem[]
  itemOrder: ItemOrder[]
  characters: string[]
  characterList: Character[]
  showCharacterDropdown: string | null
  characterDropdownIndex: {[key: string]: number}
  draggedItem: {type: 'action' | 'dialogue' | 'transition', id: string} | null
  dragOverItem: {type: 'action' | 'dialogue' | 'transition', id: string} | null
  onSceneFormatChange: (format: string) => void
  onSceneLocationChange: (location: string) => void
  onSceneTimeOfDayChange: (timeOfDay: string) => void
  onSceneDescriptionChange: (description: string) => void
  onActionAdd: () => void
  onActionUpdate: (id: string, content: string) => void
  onActionDelete: (id: string) => void
  onDialogueAdd: () => void
  onDialogueUpdate: (id: string, field: 'character' | 'dialogue', value: string) => void
  onDialogueDelete: (id: string) => void
  onTransitionAdd: () => void
  onTransitionUpdate: (id: string, content: string) => void
  onTransitionDelete: (id: string) => void
  onCharacterInput: (dialogueId: string, value: string) => void
  onCharacterBlur: (dialogueId: string, value: string) => void
  onCharacterSelect: (dialogueId: string, characterName: string) => void
  onCharacterKeyDown: (dialogueId: string, event: React.KeyboardEvent) => void
  onDragStart: (type: 'action' | 'dialogue' | 'transition', id: string) => void
  onDragOver: (e: React.DragEvent, type: 'action' | 'dialogue' | 'transition', id: string) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent, type: 'action' | 'dialogue' | 'transition', id: string) => void
}

export interface ScreenplayCharactersProps {
  characterList: Character[]
  newCharacterName: string
  newCharacterDescription: string
  getCharacterUsageCount: (characterName: string) => number
  getCharacterSceneCount: (characterName: string) => number
  onCharacterNameUpdate: (id: string, name: string) => void
  onCharacterDescriptionUpdate: (id: string, description: string) => void
  onCharacterAdd: () => void
  onCharacterDelete: (id: string) => void
  onNewCharacterNameChange: (name: string) => void
  onNewCharacterDescriptionChange: (description: string) => void
  onSave: () => void
  onCancel: () => void
}

export interface ScreenplayHelpProps {}

export interface ScreenplayUtils {
  getCharacterUsageCount: (characterName: string, scenes: Scene[]) => number
  getCharacterSceneCount: (characterName: string, scenes: Scene[]) => number
  getFilteredCharacters: (searchText: string, characterList: Character[]) => string[]
  getOrderedItems: (itemOrder: ItemOrder[], actionItems: ActionItem[], dialogueItems: DialogueItem[], transitionItems: TransitionItem[]) => (ActionItem | DialogueItem | TransitionItem)[]
}
