"use client"

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface LocationExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exportFormat: 'json' | 'txt' | 'csv' | 'pdf'
  setExportFormat: (format: 'json' | 'txt' | 'csv' | 'pdf') => void
  exportOptions: {
    locationDescription: boolean
    sceneList: boolean
    characterList: boolean
    completeScenes: boolean
  }
  setExportOptions: React.Dispatch<React.SetStateAction<{
    locationDescription: boolean
    sceneList: boolean
    characterList: boolean
    completeScenes: boolean
  }>>
  onExport: () => void
}

export function LocationExportDialog({
  open,
  onOpenChange,
  exportFormat,
  setExportFormat,
  exportOptions,
  setExportOptions,
  onExport
}: LocationExportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Locations</DialogTitle>
          <DialogDescription>
            Choose a file format and what to include in your export.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="location-export-format" className="text-sm font-medium">
              File Format
            </label>
            <Select value={exportFormat} onValueChange={(value: 'json' | 'txt' | 'csv' | 'pdf') => setExportFormat(value)}>
              <SelectTrigger id="location-export-format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON File (.json)</SelectItem>
                <SelectItem value="txt">Text File (.txt)</SelectItem>
                <SelectItem value="csv">CSV File (.csv)</SelectItem>
                <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Include in Export
            </label>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="export-location-description" 
                checked={exportOptions.locationDescription}
                onCheckedChange={(checked) => 
                  setExportOptions(prev => ({ ...prev, locationDescription: checked as boolean }))
                }
              />
              <label
                htmlFor="export-location-description"
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Location Description
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="export-scene-list" 
                checked={exportOptions.sceneList}
                onCheckedChange={(checked) => 
                  setExportOptions(prev => ({ ...prev, sceneList: checked as boolean }))
                }
              />
              <label
                htmlFor="export-scene-list"
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Scene List
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="export-character-list" 
                checked={exportOptions.characterList}
                onCheckedChange={(checked) => 
                  setExportOptions(prev => ({ ...prev, characterList: checked as boolean }))
                }
              />
              <label
                htmlFor="export-character-list"
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Character List
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="export-complete-scenes" 
                checked={exportOptions.completeScenes}
                onCheckedChange={(checked) => 
                  setExportOptions(prev => ({ ...prev, completeScenes: checked as boolean }))
                }
              />
              <label
                htmlFor="export-complete-scenes"
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Complete Scenes (Time of Day breakdown)
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

