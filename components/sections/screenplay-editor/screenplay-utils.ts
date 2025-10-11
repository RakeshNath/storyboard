import type { Scene, Character, ActionItem, DialogueItem, TransitionItem, ItemOrder } from './types'

export const getCharacterUsageCount = (characterName: string, scenes: Scene[]): number => {
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

export const getCharacterSceneCount = (characterName: string, scenes: Scene[]): number => {
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

export const getFilteredCharacters = (searchText: string, characterList: Character[]): string[] => {
  return characterList.map(char => char.name).filter(character => 
    character.toLowerCase().includes(searchText.toLowerCase())
  )
}

export const getOrderedItems = (
  itemOrder: ItemOrder[], 
  actionItems: ActionItem[], 
  dialogueItems: DialogueItem[], 
  transitionItems: TransitionItem[]
): (ActionItem | DialogueItem | TransitionItem)[] => {
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

// Scene transition options
export const transitionOptions = [
  "FADE IN",
  "FADE OUT", 
  "CUT TO",
  "DISSOLVE TO",
  "SMASH CUT TO",
  "MATCH CUT TO"
]
