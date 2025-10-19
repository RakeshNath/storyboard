"use client"

import { FileDown, CheckCircle2, XCircle, Edit3, MapPin as MapPinIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface LocationData {
  name: string
  scenes: number[]
  timeOfDay: Record<string, number>
  description?: string
  characters: string[]
}

interface LocationsContentProps {
  locations: LocationData[]
  locationProfiles: Record<string, string>
  onLocationProfileChange: (name: string, profile: string) => void
  onLocationRename: (oldName: string, newName: string) => void
  onExportClick: () => void
}

export function LocationsContent({
  locations,
  locationProfiles,
  onLocationProfileChange,
  onLocationRename,
  onExportClick
}: LocationsContentProps) {
  return (
    <div className="p-8 pb-24 max-w-6xl mx-auto">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Locations</h2>
            <p className="text-muted-foreground mb-6">
              View all locations and their editable details.
            </p>
          </div>
          {locations.length > 0 && (
            <Card className="px-1.5 py-1 bg-muted/30 flex-shrink-0 flex items-center">
              <div className="flex items-center leading-none">
                <Button
                  variant="ghost"
                  size="sm"
                  title="Export Locations"
                  className="h-5 px-1 text-[10px] gap-0.5"
                  onClick={onExportClick}
                >
                  <FileDown className="h-2.5 w-2.5" />
                  Export
                </Button>
              </div>
            </Card>
          )}
        </div>

        {locations.length === 0 ? (
          <div className="text-center py-12">
            <MapPinIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No locations yet. Add scene headings to see locations here.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-1.5">
            {locations.map((location) => (
              <AccordionItem key={location.name} value={location.name} className="border rounded-lg px-2.5">
                <AccordionTrigger className="hover:no-underline py-1">
                  <div className="flex items-center justify-between w-full pr-1">
                    <div className="flex items-center gap-1.5">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              {location.description ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 text-yellow-500" />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{location.description ? 'Profile Complete' : 'Location Profile Incomplete'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <MapPinIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium text-xs uppercase tracking-wide">{location.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {Object.entries(location.timeOfDay).sort(([a], [b]) => a.localeCompare(b)).map(([time, count]) => (
                        <div key={time} className="flex items-center h-5 rounded-full overflow-hidden border border-border">
                          <span className="px-2 py-0.5 bg-primary/10 text-[10px] font-medium">
                            {count} {time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-2">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-muted-foreground">
                        Edit Location Name:
                      </label>
                      <div className="flex items-center gap-2">
                        <Edit3 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <Input
                          defaultValue={location.name}
                          onBlur={(e) => {
                            const newName = e.target.value.trim().toUpperCase()
                            if (newName && newName !== location.name) {
                              onLocationRename(location.name, newName)
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur()
                            }
                          }}
                          className="font-bold border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 focus:border-primary uppercase"
                          placeholder="Location Name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-muted-foreground">
                        Location Description:
                      </label>
                      <Textarea
                        value={locationProfiles[location.name] || ''}
                        onChange={(e) => onLocationProfileChange(location.name, e.target.value)}
                        placeholder="Add location description, atmosphere, important details, visual elements, etc..."
                        className="min-h-[100px] w-full"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                        Scene Numbers:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {location.scenes.map((sceneNum, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs px-2 py-0.5">
                            Scene {sceneNum}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                        Characters:
                      </label>
                      {location.characters.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {location.characters.map((character, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5">
                              {character}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No characters yet</p>
                      )}
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

