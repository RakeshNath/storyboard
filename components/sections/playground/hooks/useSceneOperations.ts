import { useCallback, useState } from 'react'
import { Descendant, Element as SlateElement, Node, Editor, Transforms, Range } from 'slate'
import { CustomElement } from '../screenplay-types'

export interface SceneData {
  id: string
  text: string
  lineNumber: number
}

export function useSceneOperations(
  value: Descendant[],
  setValue: (value: Descendant[]) => void,
  editor: Editor
) {
  const [isReordering, setIsReordering] = useState(false)

  // Extract scenes from value
  const getScenes = useCallback((): SceneData[] => {
    const scenes: SceneData[] = []
    value.forEach((node, index) => {
      if (SlateElement.isElement(node) && node.type === 'scene-heading') {
        const text = Node.string(node)
        if (text.trim()) {
          scenes.push({
            id: `scene-${index}`,
            text: text.trim(),
            lineNumber: index
          })
        }
      }
    })
    return scenes
  }, [value])

  // Navigate to a specific scene
  const navigateToScene = useCallback((lineNumber: number) => {
    try {
      const path = [lineNumber]
      const range: Range = {
        anchor: { path, offset: 0 },
        focus: { path, offset: 0 }
      }
      
      Transforms.select(editor, range)
      editor.selection = range
      editor.onChange()
    } catch (error) {
      console.error('Error navigating to scene:', error)
    }
  }, [editor])

  // Reorder scenes
  const reorderScenes = useCallback(async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return

    setIsReordering(true)
    
    try {
      // Get all scene elements with their positions
      const scenes: { element: CustomElement; path: number[] }[] = []
      value.forEach((node, index) => {
        if (SlateElement.isElement(node) && node.type === 'scene-heading') {
          scenes.push({ element: node as CustomElement, path: [index] })
        }
      })

      if (fromIndex >= scenes.length || toIndex >= scenes.length) {
        console.error('Invalid scene indices for reordering')
        return
      }

      // Create new value array
      const newValue = [...value]
      
      // Find the actual scene heading elements in the value array
      const sceneElements: { element: CustomElement; originalIndex: number }[] = []
      value.forEach((node, index) => {
        if (SlateElement.isElement(node) && node.type === 'scene-heading') {
          sceneElements.push({ element: node as CustomElement, originalIndex: index })
        }
      })

      // Get the scenes to move (including all content between scenes)
      const fromScene = sceneElements[fromIndex]
      const toScene = sceneElements[toIndex]
      
      if (!fromScene || !toScene) {
        console.error('Scene not found for reordering')
        return
      }

      // Find the next scene or end of document
      const nextSceneIndex = sceneElements[fromIndex + 1]?.originalIndex ?? value.length
      const sceneEndIndex = nextSceneIndex
      
      // Extract the scene content (scene heading + all content until next scene)
      const sceneContent = newValue.splice(fromScene.originalIndex, sceneEndIndex - fromScene.originalIndex)
      
      // Insert at new position
      const insertIndex = toIndex < fromIndex ? toScene.originalIndex : toScene.originalIndex - sceneContent.length
      newValue.splice(insertIndex, 0, ...sceneContent)

      // Update the value
      setValue(newValue)
      
      console.log(`Scene ${fromIndex + 1} moved to position ${toIndex + 1}`)
    } catch (error) {
      console.error('Error reordering scenes:', error)
    } finally {
      setIsReordering(false)
    }
  }, [value, setValue])

  // Delete scene heading and its content
  const deleteSceneHeading = useCallback((element: CustomElement) => {
    try {
      // Find the path of the element to delete
      const path = Editor.findPath(editor, element)
      
      // Find the next scene heading or end of document
      let deleteEndIndex = path[0] + 1
      
      // Look for the next scene heading
      for (let i = path[0] + 1; i < value.length; i++) {
        const node = value[i]
        if (SlateElement.isElement(node) && node.type === 'scene-heading') {
          deleteEndIndex = i
          break
        }
        deleteEndIndex = i + 1
      }
      
      // Delete the scene content
      const pathsToDelete = []
      for (let i = path[0]; i < deleteEndIndex; i++) {
        pathsToDelete.push([i])
      }
      
      // Delete in reverse order to maintain correct indices
      for (let i = pathsToDelete.length - 1; i >= 0; i--) {
        Transforms.removeNodes(editor, { at: pathsToDelete[i] })
      }
      
      console.log('Scene deleted successfully')
    } catch (error) {
      console.error('Error deleting scene:', error)
    }
  }, [editor, value])

  return {
    scenes: getScenes(),
    isReordering,
    navigateToScene,
    reorderScenes,
    deleteSceneHeading
  }
}
