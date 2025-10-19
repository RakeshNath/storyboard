import { useMemo } from 'react'
import { Descendant, Element as SlateElement, Node } from 'slate'
import { CustomElement } from '../screenplay-types'

export interface SceneData {
  id: string
  text: string
  lineNumber: number
}

export interface CharacterData {
  name: string
  appearances: number
  scenes: number[]
  profile: string
  dialogues: { text: string; lineNumber: number }[]
}

export interface LocationData {
  name: string
  scenes: number[]
  timeOfDay: Record<string, number>
  description?: string
  characters: string[]
}

export function useScreenplayData(value: Descendant[]) {
  // Extract scenes
  const scenes = useMemo<SceneData[]>(() => {
    const sceneList: SceneData[] = []
    value.forEach((node, index) => {
      if (SlateElement.isElement(node) && node.type === 'scene-heading') {
        const text = Node.string(node)
        if (text.trim()) {
          sceneList.push({
            id: `scene-${index}`,
            text: text.trim(),
            lineNumber: index
          })
        }
      }
    })
    return sceneList
  }, [value])

  // Extract characters
  const characters = useMemo(() => {
    const characterSet = new Set<string>()
    value.forEach((node) => {
      if (SlateElement.isElement(node) && node.type === 'character') {
        const name = Node.string(node).trim().toUpperCase()
        if (name) {
          characterSet.add(name)
        }
      }
    })
    return Array.from(characterSet).sort()
  }, [value])

  // Extract character details
  const characterDetails = useMemo<CharacterData[]>(() => {
    const characterMap = new Map<string, CharacterData>()
    let currentScene = 0
    
    value.forEach((node, index) => {
      if (SlateElement.isElement(node)) {
        if (node.type === 'scene-heading') {
          currentScene++
        } else if (node.type === 'character') {
          const name = Node.string(node).trim().toUpperCase()
          if (name) {
            if (!characterMap.has(name)) {
              characterMap.set(name, {
                name,
                appearances: 0,
                scenes: [],
                profile: '',
                dialogues: []
              })
            }
            const char = characterMap.get(name)!
            if (!char.scenes.includes(currentScene) && currentScene > 0) {
              char.scenes.push(currentScene)
            }
          }
        } else if (node.type === 'dialogue') {
          // Find the previous character node
          if (index > 0 && SlateElement.isElement(value[index - 1])) {
            const prevNode = value[index - 1] as CustomElement
            if (prevNode.type === 'character') {
              const name = Node.string(prevNode).trim().toUpperCase()
              const dialogueText = Node.string(node).trim()
              if (name && dialogueText) {
                const char = characterMap.get(name)
                if (char) {
                  char.appearances++
                  char.dialogues.push({
                    text: dialogueText,
                    lineNumber: index
                  })
                }
              }
            }
          }
        }
      }
    })
    
    return Array.from(characterMap.values()).sort((a, b) => b.appearances - a.appearances)
  }, [value])

  // Extract locations
  const locations = useMemo<LocationData[]>(() => {
    const locationMap = new Map<string, LocationData>()
    let currentScene = 0
    const sceneCharacters = new Map<number, Set<string>>()
    let currentSceneChars = new Set<string>()
    
    value.forEach((node, index) => {
      if (SlateElement.isElement(node)) {
        if (node.type === 'scene-heading') {
          // Save previous scene's characters
          if (currentScene > 0) {
            sceneCharacters.set(currentScene, currentSceneChars)
          }
          
          currentScene++
          currentSceneChars = new Set<string>()
          
          const text = Node.string(node).trim().toUpperCase()
          if (text) {
            // Parse location from scene heading
            // Format: INT./EXT. LOCATION - TIME
            const match = text.match(/^(INT\.|EXT\.|INT\/EXT\.|EXT\/INT\.)\s+(.+?)\s+-\s+(.+)$/i)
            if (match) {
              const location = match[2].trim()
              const timeOfDay = match[3].trim()
              
              if (!locationMap.has(location)) {
                locationMap.set(location, {
                  name: location,
                  scenes: [],
                  timeOfDay: {},
                  characters: []
                })
              }
              
              const loc = locationMap.get(location)!
              loc.scenes.push(currentScene)
              loc.timeOfDay[timeOfDay] = (loc.timeOfDay[timeOfDay] || 0) + 1
            }
          }
        } else if (node.type === 'character') {
          const name = Node.string(node).trim().toUpperCase()
          if (name) {
            currentSceneChars.add(name)
          }
        }
      }
    })
    
    // Save last scene's characters
    if (currentScene > 0) {
      sceneCharacters.set(currentScene, currentSceneChars)
    }
    
    // Add characters to locations
    const locationsArray = Array.from(locationMap.values())
    locationsArray.forEach(location => {
      const allCharacters = new Set<string>()
      location.scenes.forEach(sceneNum => {
        const chars = sceneCharacters.get(sceneNum)
        if (chars) {
          chars.forEach(char => allCharacters.add(char))
        }
      })
      location.characters = Array.from(allCharacters).sort()
    })
    
    return locationsArray.sort((a, b) => a.name.localeCompare(b.name))
  }, [value])

  return {
    scenes,
    characters,
    characterDetails,
    locations
  }
}

