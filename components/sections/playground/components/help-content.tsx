"use client"

import { Separator } from '@/components/ui/separator'
import { keyboardShortcuts } from '../screenplay-types'

export function HelpContent() {
  return (
    <div className="p-8 pb-16 max-w-5xl mx-auto">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-4">How to Write a Screenplay from Scratch</h2>
          <p className="text-muted-foreground mb-6">
            A complete beginner's guide to professional screenplay writing. This editor helps you format your screenplay automatically using industry-standard formatting.
          </p>
        </div>

        {/* What is a Screenplay */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">What is a Screenplay?</h3>
          <div className="p-5 bg-muted/30 rounded-lg space-y-3">
            <p className="text-sm">
              A screenplay (also called a script) is the written blueprint for a film or TV show. It describes everything that will appear on screen: what characters say, what they do, where scenes take place, and how the story unfolds.
            </p>
            <p className="text-sm text-muted-foreground">
              Unlike a novel, a screenplay is meant to be visual and concise. You're writing what the <strong>audience will see and hear</strong>, not what characters think or feel internally. Every page of a properly formatted screenplay equals approximately one minute of screen time.
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Step 1: Scene Headings */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Step 1: Start with a Scene Heading</h3>
          <div className="p-5 bg-muted/30 rounded-lg space-y-3">
            <p className="text-sm font-semibold">What is a Scene Heading?</p>
            <p className="text-sm">
              A scene heading (also called a "slug line") tells us <strong>where</strong> and <strong>when</strong> the scene takes place. It's always in ALL CAPS and appears at the start of every new scene.
            </p>
            <div className="mt-3 p-3 bg-background rounded border-l-4 border-primary">
              <p className="text-sm font-mono font-bold">Format: INT./EXT. LOCATION - TIME OF DAY</p>
            </div>
            <div className="space-y-2 mt-3">
              <p className="text-sm"><strong>INT.</strong> = Interior (indoors)</p>
              <p className="text-sm"><strong>EXT.</strong> = Exterior (outdoors)</p>
              <p className="text-sm"><strong>INT./EXT.</strong> = Scene moves between interior and exterior</p>
            </div>
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm font-semibold mb-2">Examples:</p>
              <div className="space-y-1 font-mono text-xs">
                <p>INT. COFFEE SHOP - DAY</p>
                <p>EXT. CITY STREET - NIGHT</p>
                <p>INT. BEDROOM - MORNING</p>
                <p>INT./EXT. CAR - SUNSET</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm font-semibold">🎬 How to Create:</p>
              <p className="text-sm mt-2">1. Type "INT. " or "EXT. " in an action line - it auto-converts to a scene heading!</p>
              <p className="text-sm">2. Press Tab to move through: Scene Type → Location → Time of Day</p>
              <p className="text-sm">3. Press Enter when done to start writing action</p>
            </div>
          </div>
        </div>

        {/* Step 2: Action Lines */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Step 2: Write Action Lines</h3>
          <div className="p-5 bg-muted/30 rounded-lg space-y-3">
            <p className="text-sm font-semibold">What are Action Lines?</p>
            <p className="text-sm">
              Action lines describe what's happening on screen - what we SEE and HEAR. This includes character movements, facial expressions, sounds, and anything visual. Write in <strong>present tense</strong>, as if it's happening right now.
            </p>
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm font-semibold mb-2">Example:</p>
              <div className="space-y-2 text-sm font-mono">
                <p>Sarah enters the dimly lit room, her eyes darting nervously.</p>
                <p>She approaches the desk and picks up a dusty photograph.</p>
                <p>Her hands tremble as she recognizes the face.</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-sm font-semibold">💡 Tips:</p>
              <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                <li>Keep paragraphs short (2-4 lines max) for better pacing</li>
                <li>Write what we SEE, not what characters think or feel</li>
                <li>Use active, vivid language to create visual images</li>
                <li>Don't describe camera angles (unless absolutely necessary)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 3: Character Names and Dialogue */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Step 3: Add Character Dialogue</h3>
          <div className="p-5 bg-muted/30 rounded-lg space-y-3">
            <p className="text-sm font-semibold">How to Write Dialogue</p>
            <p className="text-sm">
              When a character speaks, first write their name in ALL CAPS (centered), then their dialogue on the next line.
            </p>
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm font-semibold mb-2">Example:</p>
              <div className="space-y-2 text-sm font-mono text-center">
                <p className="font-bold">SARAH</p>
                <p>I've been looking for this for years.</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm font-semibold">🎬 How to Create:</p>
              <p className="text-sm mt-2">1. From an action line, press Tab - it converts to a character name</p>
              <p className="text-sm">2. Type the character's name (it will auto-capitalize)</p>
              <p className="text-sm">3. Press Enter to move to dialogue</p>
              <p className="text-sm">4. Type what the character says</p>
            </div>
          </div>
        </div>

        {/* Step 4: Parentheticals */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Step 4: Use Parentheticals (Optional)</h3>
          <div className="p-5 bg-muted/30 rounded-lg space-y-3">
            <p className="text-sm font-semibold">What are Parentheticals?</p>
            <p className="text-sm">
              Parentheticals (also called "wrylies") are brief directions that tell the actor <strong>how</strong> to deliver a line. They appear in parentheses below the character name, before the dialogue.
            </p>
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm font-semibold mb-2">Example:</p>
              <div className="space-y-1 text-sm font-mono text-center">
                <p className="font-bold">SARAH</p>
                <p className="italic">(whispering)</p>
                <p>We need to get out of here.</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm font-semibold">🎬 How to Create:</p>
              <p className="text-sm mt-2">While in dialogue, press Tab → adds a parenthetical</p>
              <p className="text-sm">Press Enter to return to dialogue</p>
            </div>
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-sm font-semibold">💡 When to Use:</p>
              <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                <li>When tone isn't clear from dialogue: (sarcastic), (angry), (crying)</li>
                <li>For physical actions during speech: (stands up), (looks away)</li>
                <li>Use sparingly - trust your actors to interpret the lines!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 5: Transitions */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Step 5: Add Transitions Between Scenes</h3>
          <div className="p-5 bg-muted/30 rounded-lg space-y-3">
            <p className="text-sm font-semibold">What are Transitions?</p>
            <p className="text-sm">
              Transitions tell us how one scene ends and the next begins. They're written in ALL CAPS and appear on the right side of the page. Most modern screenplays use them sparingly.
            </p>
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm font-semibold mb-2">Common Transitions:</p>
              <div className="space-y-1 text-sm font-mono">
                <p>CUT TO:</p>
                <p>FADE OUT.</p>
                <p>DISSOLVE TO:</p>
                <p>SMASH CUT TO:</p>
                <p>MATCH CUT TO:</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm font-semibold">🎬 How to Create:</p>
              <p className="text-sm mt-2">From a parenthetical, press Tab → creates a transition</p>
              <p className="text-sm">Type the transition (e.g., "CUT TO:")</p>
              <p className="text-sm">Press Enter to start a new action line</p>
            </div>
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-sm font-semibold">💡 Pro Tip:</p>
              <p className="text-sm mt-2">
                Modern screenplays rarely use transitions. The default "CUT TO:" is assumed between every scene. Only use them for special effects like FADE OUT, DISSOLVE, or SMASH CUT.
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Complete Workflow Example */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Complete Workflow: Writing Your First Scene</h3>
          <div className="p-5 bg-muted/30 rounded-lg space-y-4">
            <p className="text-sm font-semibold">Follow these steps to write a complete scene:</p>
            
            <div className="space-y-3">
              <div className="p-3 bg-background rounded border-l-4 border-blue-500">
                <p className="text-sm font-semibold">1️⃣ Create Scene Heading</p>
                <p className="text-xs text-muted-foreground mt-1">Type "INT. " - editor auto-converts to scene heading</p>
                <p className="text-xs text-muted-foreground">Press Tab to add location, Tab again for time</p>
                <p className="text-xs font-mono mt-2">Example: INT. DETECTIVE'S OFFICE - NIGHT</p>
              </div>

              <div className="p-3 bg-background rounded border-l-4 border-green-500">
                <p className="text-sm font-semibold">2️⃣ Write Action</p>
                <p className="text-xs text-muted-foreground mt-1">Press Enter after scene heading</p>
                <p className="text-xs text-muted-foreground">Describe what we see happening</p>
                <p className="text-xs font-mono mt-2">Example: Detective Morgan sits at his desk, reviewing case files.</p>
              </div>

              <div className="p-3 bg-background rounded border-l-4 border-purple-500">
                <p className="text-sm font-semibold">3️⃣ Add Character</p>
                <p className="text-xs text-muted-foreground mt-1">Press Tab from action line</p>
                <p className="text-xs text-muted-foreground">Type character name (auto-capitalizes)</p>
                <p className="text-xs font-mono mt-2">Example: MORGAN</p>
              </div>

              <div className="p-3 bg-background rounded border-l-4 border-orange-500">
                <p className="text-sm font-semibold">4️⃣ Write Dialogue</p>
                <p className="text-xs text-muted-foreground mt-1">Press Enter after character name</p>
                <p className="text-xs text-muted-foreground">Type what the character says</p>
                <p className="text-xs font-mono mt-2">Example: Something doesn't add up here.</p>
              </div>

              <div className="p-3 bg-background rounded border-l-4 border-pink-500">
                <p className="text-sm font-semibold">5️⃣ Add Parenthetical (Optional)</p>
                <p className="text-xs text-muted-foreground mt-1">While in dialogue, press Tab</p>
                <p className="text-xs text-muted-foreground">Type actor direction</p>
                <p className="text-xs font-mono mt-2">Example: (looking up)</p>
              </div>

              <div className="p-3 bg-background rounded border-l-4 border-red-500">
                <p className="text-sm font-semibold">6️⃣ Continue Scene</p>
                <p className="text-xs text-muted-foreground mt-1">Press Enter from dialogue → returns to action</p>
                <p className="text-xs text-muted-foreground">Continue describing what happens next</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Keyboard Shortcuts Reference */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Keyboard Shortcuts Reference</h3>
          <p className="text-sm text-muted-foreground mb-3">
            The editor automatically formats your screenplay as you type. Here are all the shortcuts:
          </p>
          <div className="space-y-2">
            {Object.entries(keyboardShortcuts).map(([shortcut, description]) => (
              <div key={shortcut} className="flex items-start gap-4 p-3 bg-muted/30 rounded-lg">
                <code className="text-sm bg-background px-3 py-1.5 rounded font-mono whitespace-nowrap font-semibold">
                  {shortcut}
                </code>
                <span className="text-sm text-muted-foreground flex-1 pt-1">
                  {description}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Element Types Detailed */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">All Element Types Explained</h3>
          <div className="space-y-3">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="bg-primary/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <strong className="text-base">Scene Heading (Slug Line)</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    Format: INT./EXT. LOCATION - TIME
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Style: ALL CAPS, left-aligned, bold
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Purpose: Establishes where and when the scene takes place
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="bg-primary/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <strong className="text-base">Action</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    Format: Normal sentence case
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Style: Left-aligned, regular text
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Purpose: Describes visual action, sounds, and events on screen
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="bg-primary/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <strong className="text-base">Character Name</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    Format: ALL CAPS
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Style: Centered, appears above dialogue
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Purpose: Identifies who is speaking
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="bg-primary/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-sm">4</span>
                </div>
                <div className="flex-1">
                  <strong className="text-base">Dialogue</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    Format: Normal sentence case
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Style: Centered (narrower column than action)
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Purpose: The words spoken by the character
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="bg-primary/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-sm">5</span>
                </div>
                <div className="flex-1">
                  <strong className="text-base">Parenthetical</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    Format: (lowercase in parentheses)
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Style: Centered, italicized, within dialogue
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Purpose: Brief acting direction for line delivery
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="bg-primary/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-sm">6</span>
                </div>
                <div className="flex-1">
                  <strong className="text-base">Transition</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    Format: ALL CAPS with colon
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Style: Right-aligned
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Purpose: Indicates special scene transitions (use rarely)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Using the Scene Outliner */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Using the Scene Outliner</h3>
          <div className="p-5 bg-muted/30 rounded-lg space-y-3">
            <p className="text-sm">
              The Scene Outliner (left panel) shows all your scenes at a glance. It helps you navigate and organize your screenplay.
            </p>
            <div className="mt-3 space-y-2">
              <p className="text-sm"><strong>Click any scene</strong> to jump to it in the editor</p>
              <p className="text-sm"><strong>Drag and drop scenes</strong> to reorder them</p>
              <p className="text-sm"><strong>Click the ✗ button</strong> on a scene to delete it</p>
              <p className="text-sm"><strong>Toggle Outliner button</strong> to show/hide the outliner for more writing space</p>
              <p className="text-sm"><strong>Scene numbers</strong> update automatically as you add or remove scenes</p>
            </div>
          </div>
        </div>

        {/* Managing Characters */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Managing Characters</h3>
          <div className="p-5 bg-muted/30 rounded-lg space-y-3">
            <p className="text-sm">
              Click the <strong>Characters</strong> tab to see all characters in your screenplay. The editor automatically detects characters when you write dialogue.
            </p>
            <div className="mt-3 space-y-3">
              <div className="p-3 bg-background rounded">
                <p className="text-sm font-semibold">✓/✗ Completion Icons:</p>
                <p className="text-xs text-muted-foreground mt-1">
                  • <strong className="text-green-600">Green ✓</strong> = Character type selected AND profile filled<br/>
                  • <strong className="text-yellow-600">Yellow ✗</strong> = Missing type or profile
                </p>
              </div>
              <div className="p-3 bg-background rounded">
                <p className="text-sm font-semibold">Character Types:</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Select the role: Protagonist, Antagonist, Supporting, Minor, or Cameo
                </p>
              </div>
              <div className="p-3 bg-background rounded">
                <p className="text-sm font-semibold">Character Profile:</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add backstory, personality traits, motivations, physical description, arc, etc.
                </p>
              </div>
              <div className="p-3 bg-background rounded">
                <p className="text-sm font-semibold">Rename Characters:</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click the character name to edit it. All instances in your screenplay update automatically.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Managing Locations */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Managing Locations</h3>
          <div className="p-5 bg-muted/30 rounded-lg space-y-3">
            <p className="text-sm">
              Click the <strong>Locations</strong> tab to see all locations from your scene headings. Locations are automatically extracted as you write.
            </p>
            <div className="mt-3 space-y-3">
              <div className="p-3 bg-background rounded">
                <p className="text-sm font-semibold">✓/✗ Completion Icons:</p>
                <p className="text-xs text-muted-foreground mt-1">
                  • <strong className="text-green-600">Green ✓</strong> = Location description filled<br/>
                  • <strong className="text-yellow-600">Yellow ✗</strong> = Description missing
                </p>
              </div>
              <div className="p-3 bg-background rounded">
                <p className="text-sm font-semibold">Location Descriptions:</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add details about the location: atmosphere, visual details, mood, significance to the story, etc.
                </p>
              </div>
              <div className="p-3 bg-background rounded">
                <p className="text-sm font-semibold">Time of Day Tracking:</p>
                <p className="text-xs text-muted-foreground mt-1">
                  See how many times each location appears at different times (Day, Night, etc.)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Exporting Your Screenplay</h3>
          <div className="p-5 bg-muted/30 rounded-lg space-y-3">
            <p className="text-sm">
              When you're ready to share your screenplay, click the <strong>Export</strong> button in the editor.
            </p>
            <div className="mt-3 space-y-2">
              <div className="p-3 bg-background rounded">
                <p className="text-sm font-semibold">📄 Text File (.txt)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Professional screenplay format with proper spacing and title page. Includes "_draft" suffix.
                </p>
              </div>
              <div className="p-3 bg-background rounded">
                <p className="text-sm font-semibold">📕 PDF Document (.pdf)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Industry-standard PDF with title page, proper pagination, and professional formatting.
                </p>
              </div>
              <div className="p-3 bg-background rounded">
                <p className="text-sm font-semibold">👥 Characters Export</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Export character list with profiles, types, and scene appearances in JSON, TXT, CSV, or PDF format.
                </p>
              </div>
              <div className="p-3 bg-background rounded">
                <p className="text-sm font-semibold">📍 Locations Export</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Export location list with descriptions and time-of-day tracking in JSON, TXT, CSV, or PDF format.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Pro Tips */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Professional Screenplay Tips</h3>
          <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg space-y-4 border border-primary/20">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-lg">✍️</span>
                <div>
                  <p className="text-sm font-semibold">Show, Don't Tell</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Instead of "Sarah is nervous," write "Sarah's hands shake as she reaches for the door."
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-lg">🎬</span>
                <div>
                  <p className="text-sm font-semibold">Less is More</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Keep action paragraphs short (2-4 lines). White space makes scripts easier to read and feels faster-paced.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-lg">💬</span>
                <div>
                  <p className="text-sm font-semibold">Dialogue Should Sound Natural</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Read your dialogue out loud. People speak in contractions, interrupt each other, and rarely use perfect grammar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-lg">⏱️</span>
                <div>
                  <p className="text-sm font-semibold">One Page = One Minute</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Aim for 90-120 pages for a feature film. This equals roughly 90-120 minutes of screen time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-lg">🎯</span>
                <div>
                  <p className="text-sm font-semibold">Every Scene Must Have Purpose</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Each scene should either advance the plot, reveal character, or create mood. If it doesn't, consider cutting it.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-lg">💾</span>
                <div>
                  <p className="text-sm font-semibold">Auto-Save is Enabled</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your work saves automatically every 30 seconds. You can also press Ctrl/Cmd+S to save manually anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Ready to Start Writing?</h3>
          <div className="p-5 bg-primary/10 rounded-lg border-2 border-primary/30">
            <p className="text-sm font-semibold mb-3">🚀 Your First Steps:</p>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Close this Help tab by clicking another tab (Editor, Characters, or Locations)</li>
              <li>In the editor, type "INT. " to start your first scene heading</li>
              <li>Follow the autocomplete suggestions or press Tab to fill in location and time</li>
              <li>Press Enter to start writing action - describe what we see</li>
              <li>Press Tab when a character needs to speak</li>
              <li>Keep writing! The editor handles all the formatting for you</li>
            </ol>
            <p className="text-sm mt-4 text-muted-foreground italic">
              Remember: Every great screenplay starts with a single scene. Just start writing and let the story unfold!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

