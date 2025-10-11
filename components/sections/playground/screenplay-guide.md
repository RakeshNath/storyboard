# Professional Screenplay Editor

## Overview
A production-ready screenplay editor built with Slate.js, following industry standards like WriterDuet and Final Draft.

## Features

### ✨ Core Features
- **Auto-formatting**: Automatically formats screenplay elements per industry standards
- **Keyboard-driven workflow**: Minimal mouse usage required
- **Undo/Redo**: Full history support with Ctrl/Cmd+Z
- **Scene Outliner**: Navigate between scenes quickly
- **Auto-save**: Saves every 30 seconds automatically
- **Export**: Export as plain text or formatted screenplay

### 📝 Screenplay Elements

1. **Scene Heading** - INT/EXT location and time (all caps, bold)
2. **Action** - Description of what's happening  
3. **Character** - Character name (all caps, centered)
4. **Dialogue** - What the character says (centered)
5. **Parenthetical** - Actor direction (centered, italics)
6. **Transition** - Scene transition (all caps, right-aligned)

## Keyboard Shortcuts

### Navigation Between Elements
- **Enter from Scene Heading** → Creates Action line
- **Tab from Action** → Creates Character name
- **Enter from Character** → Creates Dialogue
- **Tab from Dialogue** → Creates Parenthetical
- **Enter from Dialogue** → Returns to Action
- **Enter from Parenthetical** → Returns to Dialogue
- **Shift+Tab** → Goes back to previous element type

### Editor Commands
- **Ctrl/Cmd+Z** - Undo
- **Ctrl/Cmd+Shift+Z** - Redo
- **Ctrl/Cmd+S** - Save screenplay

## Workflow Example

1. Start with a **Scene Heading**: `INT. COFFEE SHOP - DAY`
2. Press **Enter** → Creates an **Action** line
3. Type your action: `A busy coffee shop. People chat.`
4. Press **Tab** → Converts to **Character**
5. Type character name: `JOHN`
6. Press **Enter** → Creates **Dialogue**
7. Type dialogue: `I'll have a cappuccino, please.`
8. Press **Tab** → Creates **Parenthetical**
9. Type direction: `nervous`
10. Press **Enter** → Returns to **Dialogue**
11. Press **Enter** again → Back to **Action**

## Tips

- Use the **Outliner** (left sidebar) to navigate between scenes
- Click the **Shortcuts** button in toolbar for quick reference
- **Auto-save** runs every 30 seconds - data persists in browser
- **Export Formatted** creates industry-standard spacing
- All text is in monospace font for accurate page count estimation

## Technical Details

- Built with **Slate.js** for rich text editing
- **TypeScript** for type safety
- Full **undo/redo** history
- **localStorage** for persistence
- Mobile-responsive design
- Follows **Academy/AMPAS** screenplay formatting standards

## Future Enhancements

- Export to Final Draft (.fdx)
- Export to PDF with proper page formatting
- Live collaboration (multi-user editing)
- Character and scene tagging/analytics
- Word count and page count estimation
- Revision mode with color-coded changes

