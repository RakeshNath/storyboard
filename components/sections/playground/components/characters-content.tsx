"use client"

import { useState } from 'react'
import { FileDown, ChevronDown, CheckCircle2, XCircle, Edit3, Users as UsersIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface CharacterData {
  name: string
  appearances: number
  scenes: number[]
  profile: string
  type?: string
  dialogues: { text: string; lineNumber: number }[]
}

interface CharactersContentProps {
  characterDetails: CharacterData[]
  characterTypes: Record<string, string>
  characterProfiles: Record<string, string>
  screenplayTitle: string
  onCharacterTypeChange: (name: string, type: string) => void
  onCharacterProfileChange: (name: string, profile: string) => void
  onCharacterRename: (oldName: string, newName: string) => void
}

export function CharactersContent({
  characterDetails,
  characterTypes,
  characterProfiles,
  screenplayTitle,
  onCharacterTypeChange,
  onCharacterProfileChange,
  onCharacterRename
}: CharactersContentProps) {
  const [showCharacterExportMenu, setShowCharacterExportMenu] = useState(false)

  return (
    <div className="p-8 pb-24 max-w-6xl mx-auto">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Characters</h2>
            <p className="text-muted-foreground mb-6">
              View all characters and their editable profiles.
            </p>
          </div>
          {characterDetails.length > 0 && (
            <Card className="px-1.5 py-1 bg-muted/30 flex-shrink-0 flex items-center">
              <div className="flex items-center leading-none">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Export Characters"
                    className="h-5 px-1 text-[10px] gap-0.5"
                    onClick={() => setShowCharacterExportMenu(!showCharacterExportMenu)}
                  >
                    <FileDown className="h-2.5 w-2.5" />
                    Export
                    <ChevronDown className="h-2 w-2" />
                  </Button>
                  
                  {showCharacterExportMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowCharacterExportMenu(false)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-popover border rounded-md shadow-md z-50">
                        <div className="p-1">
                          <div className="px-2 py-1.5 text-sm font-medium">Export Options</div>
                          <div className="my-1 h-px bg-border" />
                          
                          <button
                            onClick={() => {
                              const exportData = characterDetails.map((character) => ({
                                name: character.name,
                                type: characterTypes[character.name] || 'Not Mentioned',
                                dialogues: character.appearances,
                                scenes: character.scenes.length,
                                sceneNumbers: character.scenes,
                                profile: characterProfiles[character.name] || '',
                                dialogueLines: character.dialogues
                              }))
                              
                              const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement('a')
                              a.href = url
                              a.download = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_draft_characters.json`
                              document.body.appendChild(a)
                              a.click()
                              document.body.removeChild(a)
                              URL.revokeObjectURL(url)
                              setShowCharacterExportMenu(false)
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                          >
                            <FileDown className="h-3.5 w-3.5" />
                            JSON File (.json)
                          </button>
                          
                          <button
                            onClick={() => {
                              const text = characterDetails.map((character) => {
                                const profile = characterProfiles[character.name] || 'No profile'
                                const type = characterTypes[character.name] || 'Not Mentioned'
                                return `CHARACTER: ${character.name}\nType: ${type}\nAppearances: ${character.appearances}\nScenes: ${character.scenes.join(', ')}\nProfile: ${profile}\n\nDialogue Lines:\n${character.dialogues.map((d, i) => `  ${i + 1}. (Line ${d.lineNumber}) ${d.text}`).join('\n')}\n\n${'='.repeat(80)}\n`
                              }).join('\n')
                              
                              const blob = new Blob([text], { type: 'text/plain' })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement('a')
                              a.href = url
                              a.download = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_draft_characters.txt`
                              document.body.appendChild(a)
                              a.click()
                              document.body.removeChild(a)
                              URL.revokeObjectURL(url)
                              setShowCharacterExportMenu(false)
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                          >
                            <FileDown className="h-3.5 w-3.5" />
                            Text File (.txt)
                          </button>
                          
                          <button
                            onClick={() => {
                              const csv = [
                                ['Name', 'Type', 'Appearances', 'Scenes', 'Profile'],
                                ...characterDetails.map((character) => [
                                  character.name,
                                  characterTypes[character.name] || 'Not Mentioned',
                                  character.appearances.toString(),
                                  character.scenes.join('; '),
                                  (characterProfiles[character.name] || 'No profile').replace(/,/g, ';')
                                ])
                              ].map(row => row.join(',')).join('\n')
                              
                              const blob = new Blob([csv], { type: 'text/csv' })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement('a')
                              a.href = url
                              a.download = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_draft_characters.csv`
                              document.body.appendChild(a)
                              a.click()
                              document.body.removeChild(a)
                              URL.revokeObjectURL(url)
                              setShowCharacterExportMenu(false)
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                          >
                            <FileDown className="h-3.5 w-3.5" />
                            CSV File (.csv)
                          </button>
                          
                          <button
                            onClick={() => {
                              import('jspdf').then(({ jsPDF }) => {
                                const doc = new jsPDF()
                                const margin = 20
                                const pageWidth = doc.internal.pageSize.getWidth()
                                const pageHeight = doc.internal.pageSize.getHeight()
                                let yPosition = margin
                                
                                // Create Title Page
                                doc.setFont('times', 'bold')
                                doc.setFontSize(24)
                                
                                // Title - centered vertically and horizontally
                                const titleY = pageHeight / 2 - 50
                                const titleLines = doc.splitTextToSize(screenplayTitle.toUpperCase(), pageWidth - 2 * margin)
                                titleLines.forEach((line: string, index: number) => {
                                  const titleWidth = doc.getTextWidth(line)
                                  const titleX = (pageWidth - titleWidth) / 2
                                  doc.text(line, titleX, titleY + (index * 28))
                                })
                                
                                // Export Type - below title
                                doc.setFont('times', 'normal')
                                doc.setFontSize(16)
                                const exportTypeY = titleY + (titleLines.length * 28) + 40
                                const exportTypeText = 'Characters Export'
                                const exportTypeWidth = doc.getTextWidth(exportTypeText)
                                const exportTypeX = (pageWidth - exportTypeWidth) / 2
                                doc.text(exportTypeText, exportTypeX, exportTypeY)
                                
                                // Add new page for character content
                                doc.addPage()
                                yPosition = margin
                                
                                doc.setFontSize(10)
                                doc.setFont('helvetica', 'normal')
                                
                                characterDetails.forEach((character) => {
                                  // Check if we need a new page
                                  if (yPosition > 270) {
                                    doc.addPage()
                                    yPosition = margin
                                  }
                                  
                                  doc.setFont('helvetica', 'bold')
                                  doc.text(`${character.name}`, margin, yPosition)
                                  yPosition += 6
                                  
                                  doc.setFont('helvetica', 'normal')
                                  const type = characterTypes[character.name] || 'Not Mentioned'
                                  doc.text(`Type: ${type}`, margin + 5, yPosition)
                                  yPosition += 5
                                  doc.text(`Appearances: ${character.appearances}`, margin + 5, yPosition)
                                  yPosition += 5
                                  doc.text(`Scenes: ${character.scenes.join(', ')}`, margin + 5, yPosition)
                                  yPosition += 5
                                  
                                  const profile = characterProfiles[character.name] || 'No profile'
                                  const profileLines = doc.splitTextToSize(`Profile: ${profile}`, 170)
                                  doc.text(profileLines, margin + 5, yPosition)
                                  yPosition += profileLines.length * 5 + 5
                                })
                                
                                doc.save(`${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_draft_characters.pdf`)
                                setShowCharacterExportMenu(false)
                              })
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                          >
                            <FileDown className="h-3.5 w-3.5" />
                            PDF Document (.pdf)
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>

        {characterDetails.length === 0 ? (
          <div className="text-center py-12">
            <UsersIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No characters yet. Add dialogue to see characters here.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-1.5">
            {characterDetails.map((character) => (
              <AccordionItem key={character.name} value={character.name} className="border rounded-lg px-2.5">
                <AccordionTrigger className="hover:no-underline py-1">
                  <div className="flex items-center justify-between w-full pr-1">
                    <div className="flex items-center gap-1.5">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              {characterTypes[character.name] && characterProfiles[character.name] ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 text-yellow-500" />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{characterTypes[character.name] && characterProfiles[character.name] ? 'Profile Complete' : 'Character Profile Incomplete'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <UsersIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium text-xs uppercase tracking-wide">{character.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {character.appearances} lines
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {character.scenes.length} scenes
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-2">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-muted-foreground">
                        Edit Character Name:
                      </label>
                      <div className="flex items-center gap-2">
                        <Edit3 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <Input
                          defaultValue={character.name}
                          onBlur={(e) => {
                            const newName = e.target.value.trim().toUpperCase()
                            if (newName && newName !== character.name) {
                              onCharacterRename(character.name, newName)
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur()
                            }
                          }}
                          className="font-bold border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 focus:border-primary uppercase"
                          placeholder="Character Name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-muted-foreground">
                        Character Type:
                      </label>
                      <Select 
                        value={characterTypes[character.name] || ''} 
                        onValueChange={(value) => onCharacterTypeChange(character.name, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select character type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Protagonist">Protagonist (Main Character)</SelectItem>
                          <SelectItem value="Antagonist">Antagonist (Villain/Opposition)</SelectItem>
                          <SelectItem value="Supporting">Supporting Character</SelectItem>
                          <SelectItem value="Minor">Minor Character</SelectItem>
                          <SelectItem value="Cameo">Cameo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-muted-foreground">
                        Character Profile:
                      </label>
                      <Textarea
                        value={characterProfiles[character.name] || ''}
                        onChange={(e) => onCharacterProfileChange(character.name, e.target.value)}
                        placeholder="Add character backstory, personality traits, motivations, physical description, character arc, etc..."
                        className="min-h-[100px] w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-muted-foreground">
                        Appearances:
                      </label>
                      <p className="text-sm">{character.appearances} dialogue line{character.appearances !== 1 ? 's' : ''}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-muted-foreground">
                        Scene Numbers:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {character.scenes.map((sceneNum, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs px-2 py-0.5">
                            Scene {sceneNum}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-muted-foreground">
                        Dialogue Lines:
                      </label>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {character.dialogues.map((dialogue, idx) => (
                          <div key={idx} className="text-xs p-2 bg-muted/30 rounded">
                            <span className="text-muted-foreground">Line {dialogue.lineNumber}:</span> {dialogue.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  )
}

