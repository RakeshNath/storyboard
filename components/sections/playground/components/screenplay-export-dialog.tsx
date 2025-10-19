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

interface ScreenplayExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exportFormat: 'txt' | 'pdf' | 'fdx'
  setExportFormat: (format: 'txt' | 'pdf' | 'fdx') => void
  exportOptions: {
    sceneTitles: boolean
    sceneSynopsis: boolean
    sceneContent: boolean
  }
  setExportOptions: React.Dispatch<React.SetStateAction<{
    sceneTitles: boolean
    sceneSynopsis: boolean
    sceneContent: boolean
  }>>
  onExport: () => void
}

export function ScreenplayExportDialog({
  open,
  onOpenChange,
  exportFormat,
  setExportFormat,
  exportOptions,
  setExportOptions,
  onExport
}: ScreenplayExportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Screenplay</DialogTitle>
          <DialogDescription>
            Choose a file format and what to include in your export.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="export-format" className="text-sm font-medium">
              File Format
            </label>
            <Select value={exportFormat} onValueChange={(value: 'txt' | 'pdf' | 'fdx') => setExportFormat(value)}>
              <SelectTrigger id="export-format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="txt">Text File (.txt)</SelectItem>
                <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
                <SelectItem value="fdx" disabled>Final Draft (.fdx) - Coming Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Include in Export
            </label>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="export-scene-titles" 
                checked={exportOptions.sceneTitles}
                disabled
              />
              <label
                htmlFor="export-scene-titles"
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Scene Titles (required)
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="export-scene-synopsis" 
                checked={exportOptions.sceneSynopsis}
                onCheckedChange={(checked) => 
                  setExportOptions(prev => ({ ...prev, sceneSynopsis: checked as boolean }))
                }
              />
              <label
                htmlFor="export-scene-synopsis"
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Scene Synopsis
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="export-scene-content" 
                checked={exportOptions.sceneContent}
                onCheckedChange={(checked) => 
                  setExportOptions(prev => ({ ...prev, sceneContent: checked as boolean }))
                }
              />
              <label
                htmlFor="export-scene-content"
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Scene Content (dialogue, action, etc.)
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

