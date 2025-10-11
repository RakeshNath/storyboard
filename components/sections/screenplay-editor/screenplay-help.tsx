"use client"

import { HelpCircle } from "lucide-react"
import type { ScreenplayHelpProps } from "./types"

export function ScreenplayHelp({}: ScreenplayHelpProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Screenplay Writing Guide</h1>
          <p className="text-muted-foreground text-lg">Learn how to write professional screenplays using this editor</p>
        </div>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>Welcome to the Screenplay Editor! This tool helps you create professional screenplays with proper formatting and structure.</p>
              <p>Start by creating your first scene using the "Add Scene" button in the left panel. Each scene represents a location and time in your story.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Scene Structure</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>Each scene should include:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Format:</strong> INT (interior) or EXT (exterior)</li>
                <li><strong>Location:</strong> Where the scene takes place</li>
                <li><strong>Time of Day:</strong> DAY, NIGHT, DAWN, DUSK, or CONTINUOUS</li>
                <li><strong>Description:</strong> Brief description of the scene</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Content Types</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="text-lg font-medium mb-2">Action</h3>
                <p>Describe what happens in the scene. Use present tense and be specific about character actions and movements.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Dialogue</h3>
                <p>Character speech. Select or type character names, then write their dialogue. Character names are automatically capitalized.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Transitions</h3>
                <p>Scene transitions like CUT TO, FADE IN, FADE OUT, etc. Only one transition per scene is allowed.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Character Management</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>Use the Characters button in the header to manage your cast:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Add new characters with names and descriptions</li>
                <li>View dialogue and scene counts for each character</li>
                <li>Characters with dialogue cannot be deleted</li>
                <li>Character names are automatically suggested when writing dialogue</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Tips for Success</h2>
            <div className="space-y-4 text-muted-foreground">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Keep action descriptions concise and visual</li>
                <li>Use character names consistently throughout</li>
                <li>Save your work regularly using the Save button</li>
                <li>Organize scenes logically to tell your story</li>
                <li>Use transitions sparingly and appropriately</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
