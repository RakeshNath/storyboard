"use client"

import { useState, useCallback, useEffect } from 'react'
import { Editor, Element as SlateElement } from 'slate'
import { initialValue, CustomElement } from '../screenplay-types'
import { ScreenplayExportDialog } from './screenplay-export-dialog'
import { LocationExportDialog } from './location-export-dialog'
import { HelpContent } from './help-content'
import { CharactersContent } from './characters-content'
import { LocationsContent } from './locations-content'
import { SceneOutliner } from './scene-outliner'
import { EditorToolbar } from './editor-toolbar'
import { QuickHelpBar } from './quick-help-bar'
import { AutocompleteDropdown } from './autocomplete-dropdown'
import { SlateEditorContent } from './slate-editor-content'
import { useSlateElementRenderer } from './slate-element-renderer'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// Import hooks
import { useScreenplayData } from '../hooks/useScreenplayData'
import { useExportHandlers } from '../hooks/useExportHandlers'
import { useSlateEditor } from '../hooks/useSlateEditor'
import { useSlateRenderers } from '../hooks/useSlateRenderers'
import { useSceneOperations } from '../hooks/useSceneOperations'
import { useAutocomplete } from '../hooks/useAutocomplete'

interface ScreenplayEditorAggregatorProps {
  title?: string
}

export function ScreenplayEditorAggregator({ title = "Untitled Screenplay" }: ScreenplayEditorAggregatorProps) {
  // Core state
  const [value, setValue] = useState(initialValue)
  const [screenplayTitle, setScreenplayTitle] = useState('Untitled Screenplay')
  const [authorName, setAuthorName] = useState('Your Name')
  const [currentElementType, setCurrentElementType] = useState<'scene-heading' | 'action' | 'character' | 'dialogue' | 'parenthetical' | 'transition'>('action')

  // UI state
  const [showOutliner, setShowOutliner] = useState(true)
  const [showCharacters, setShowCharacters] = useState(false)
  const [showLocations, setShowLocations] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [pendingDeleteElement, setPendingDeleteElement] = useState<any>(null)

  // Export state
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [exportFormat, setExportFormat] = useState<'txt' | 'pdf' | 'fdx'>('txt')
  const [exportOptions, setExportOptions] = useState({
    sceneTitles: true,
    sceneSynopsis: false,
    sceneContent: false
  })
  const [showLocationExportDialog, setShowLocationExportDialog] = useState(false)
  const [locationExportFormat, setLocationExportFormat] = useState<'json' | 'txt' | 'csv' | 'pdf'>('json')
  const [locationExportOptions, setLocationExportOptions] = useState({
    locationDescription: false,
    sceneList: false,
    characterList: false,
    completeScenes: false
  })

  // Character and location profiles
  const [characterProfiles, setCharacterProfiles] = useState<Record<string, string>>({})
  const [characterTypes, setCharacterTypes] = useState<Record<string, string>>({})
  const [locationProfiles, setLocationProfiles] = useState<Record<string, string>>({})

  // Initialize hooks
  const { scenes, characters, characterDetails, locations } = useScreenplayData(value)
  
  const { handleExport, handleLocationExport } = useExportHandlers(
    value,
    screenplayTitle,
    authorName,
    locations,
    characterDetails,
    characterTypes,
    characterProfiles,
    locationProfiles
  )

  const { editor, handleKeyDown, handleBlur, getPlaceholderText, getPlaceholderForElement } = useSlateEditor(
    initialValue,
    setValue,
    (element) => {
      setPendingDeleteElement(element)
      setShowDeleteDialog(true)
    },
    {
      handleAutocompleteKeyDown,
      triggerAutocomplete
    }
  )

  const { renderLeaf } = useSlateRenderers()

  const { renderElement } = useSlateElementRenderer({
    editor,
    value,
    onSceneDelete: (element) => {
      setPendingDeleteElement(element)
      setShowDeleteDialog(true)
    },
    getPlaceholderForElement,
    showOutliner
  })

  const { scenes: scenesList, isReordering, navigateToScene, reorderScenes, deleteSceneHeading } = useSceneOperations(
    value,
    setValue,
    editor
  )

  const {
    autocompleteOptions,
    showAutocomplete,
    autocompleteIndex,
    autocompletePosition,
    selectAutocomplete,
    hideAutocomplete,
    handleAutocompleteKeyDown,
    triggerAutocomplete,
    setAutocompleteIndex
  } = useAutocomplete(value, currentElementType, editor)

  // Handle selection change to track current element type
  const handleSelectionChange = useCallback(() => {
    const { selection } = editor
    if (!selection) return

    try {
      const [match] = Editor.nodes(editor, {
        match: n => SlateElement.isElement(n),
        mode: 'lowest'
      })

      if (match) {
        const [node] = match
        const element = node as CustomElement
        const newType = element.type || 'action'
        if (newType !== currentElementType) {
          setCurrentElementType(newType)
        }
      }
    } catch (error) {
      // Ignore errors during selection tracking
    }
  }, [editor, currentElementType])

  // Handle value change to trigger autocomplete for scene headings
  const handleValueChange = useCallback((newValue: Descendant[]) => {
    setValue(newValue)
    
    // Trigger autocomplete for scene headings
    if (currentElementType === 'scene-heading') {
      const { selection } = editor
      if (selection) {
        try {
          const [match] = Editor.nodes(editor, {
            match: n => SlateElement.isElement(n) && n.type === 'scene-heading',
          })
          
          if (match) {
            // Get cursor position for autocomplete
            const domRange = window.getSelection()?.getRangeAt(0)
            if (domRange) {
              const rect = domRange.getBoundingClientRect()
              triggerAutocomplete({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX
              })
            }
          }
        } catch (error) {
          // Ignore errors during autocomplete triggering
        }
      }
    }
  }, [setValue, currentElementType, editor, triggerAutocomplete])

  // Delete confirmation handlers
  const handleDeleteCancel = useCallback(() => {
    setShowDeleteDialog(false)
    setPendingDeleteElement(null)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (pendingDeleteElement) {
      deleteSceneHeading(pendingDeleteElement)
    }
    setShowDeleteDialog(false)
    setPendingDeleteElement(null)
  }, [pendingDeleteElement, deleteSceneHeading])

  return (
    <div className="h-full w-full flex flex-col bg-background">
      {/* Toolbar */}
      <EditorToolbar
        showCharacters={showCharacters}
        showLocations={showLocations}
        showHelp={showHelp}
        showOutliner={showOutliner}
        currentElementType={currentElementType}
        scenesCount={scenes.length}
        charactersCount={characters.length}
        onToggleOutliner={() => {
          if (showCharacters || showLocations || showHelp) {
            setShowCharacters(false)
            setShowLocations(false)
            setShowHelp(false)
          } else {
            setShowOutliner(!showOutliner)
          }
        }}
        onShowCharacters={() => {
          setShowCharacters(!showCharacters)
          setShowLocations(false)
          setShowHelp(false)
        }}
        onShowLocations={() => {
          setShowLocations(!showLocations)
          setShowCharacters(false)
          setShowHelp(false)
        }}
        onShowHelp={() => {
          setShowHelp(!showHelp)
          setShowCharacters(false)
          setShowLocations(false)
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Scene Outliner */}
          {showOutliner && !showCharacters && !showLocations && !showHelp && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={40} className="m-2">
                <SceneOutliner
                  scenes={scenesList}
                  onSceneReorder={reorderScenes}
                  onSceneNavigate={navigateToScene}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}
        
          <ResizablePanel 
            defaultSize={showOutliner && !showCharacters && !showLocations && !showHelp ? 80 : 100} 
            minSize={60}
          >
            <div className={`h-full flex flex-col overflow-hidden ${(showCharacters || showLocations || showHelp) ? '' : 'm-2 gap-2'}`}>
              {/* Quick Help Bar and Export Panel - Only show when in editor mode */}
              {!showCharacters && !showLocations && !showHelp && (
                <div className="flex flex-wrap gap-2">
                  <QuickHelpBar currentElementType={currentElementType} />
                  
                  {/* Export Panel */}
                  <Card className="px-1.5 py-1 bg-muted/30 flex-shrink-0 flex items-center">
                    <div className="flex items-center leading-none">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Export Screenplay"
                        className="h-5 px-1 text-[10px] gap-0.5"
                        onClick={() => setShowExportDialog(true)}
                      >
                        <FileDown className="h-2.5 w-2.5" />
                        Export
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
              
              {/* Content Area */}
              {showCharacters ? (
                <CharactersContent
                  characterDetails={characterDetails}
                  characterTypes={characterTypes}
                  characterProfiles={characterProfiles}
                  screenplayTitle={screenplayTitle}
                  onCharacterTypeChange={(name, type) => setCharacterTypes(prev => ({ ...prev, [name]: type }))}
                  onCharacterProfileChange={(name, profile) => setCharacterProfiles(prev => ({ ...prev, [name]: profile }))}
                  onCharacterRename={(oldName, newName) => {
                    // This would need to be implemented in the main component
                    console.log('Character rename:', oldName, newName)
                  }}
                />
              ) : showLocations ? (
                <LocationsContent
                  locations={locations}
                  locationProfiles={locationProfiles}
                  onLocationProfileChange={(name, profile) => setLocationProfiles(prev => ({ ...prev, [name]: profile }))}
                  onLocationRename={(oldName, newName) => {
                    // This would need to be implemented in the main component
                    console.log('Location rename:', oldName, newName)
                  }}
                  onExportClick={() => setShowLocationExportDialog(true)}
                />
              ) : showHelp ? (
                <HelpContent />
              ) : (
                <SlateEditorContent
                  editor={editor}
                  value={value}
                  onValueChange={handleValueChange}
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  handleKeyDown={handleKeyDown}
                  handleBlur={handleBlur}
                  getPlaceholderText={getPlaceholderText}
                  currentElementType={currentElementType}
                  isReordering={isReordering}
                  onSelectionChange={handleSelectionChange}
                  showOutliner={showOutliner}
                />
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Autocomplete Dropdown */}
      <AutocompleteDropdown
        show={showAutocomplete}
        options={autocompleteOptions}
        selectedIndex={autocompleteIndex}
        position={autocompletePosition}
        currentElementType={currentElementType}
        onSelect={selectAutocomplete}
        onHoverIndex={setAutocompleteIndex}
      />

      {/* Delete Scene Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Scene?</DialogTitle>
            <DialogDescription>
              This scene has content. Are you sure you want to delete it? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Scene
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialogs */}
      <ScreenplayExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        exportOptions={exportOptions}
        setExportOptions={setExportOptions}
        onExport={() => handleExport(exportFormat, exportOptions)}
      />

      <LocationExportDialog
        open={showLocationExportDialog}
        onOpenChange={setShowLocationExportDialog}
        exportFormat={locationExportFormat}
        setExportFormat={setLocationExportFormat}
        exportOptions={locationExportOptions}
        setExportOptions={setLocationExportOptions}
        onExport={() => handleLocationExport(locationExportFormat, locationExportOptions)}
      />
    </div>
  )
}
