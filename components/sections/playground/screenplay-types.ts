import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

// Screenplay element types matching industry standards
export type ScreenplayElementType = 
  | 'scene-heading'
  | 'action'
  | 'character'
  | 'dialogue'
  | 'parenthetical'
  | 'transition'

export type CustomElement = {
  type: ScreenplayElementType
  children: CustomText[]
}

export type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}

// Initial value for empty screenplay
export const initialValue: Descendant[] = [
  {
    type: 'scene-heading',
    children: [{ text: 'INT. COFFEE SHOP - DAY' }],
  },
  {
    type: 'action',
    children: [{ text: 'A busy coffee shop filled with the aroma of fresh coffee. SARAH sits at a corner table typing on her laptop.' }],
  },
  {
    type: 'character',
    children: [{ text: 'BARISTA' }],
  },
  {
    type: 'dialogue',
    children: [{ text: 'What can I get for you?' }],
  },
  {
    type: 'action',
    children: [{ text: 'Sarah looks up from her screen, slightly distracted.' }],
  },
  {
    type: 'character',
    children: [{ text: 'SARAH' }],
  },
  {
    type: 'dialogue',
    children: [{ text: 'Just a black coffee, please. Large.' }],
  },
  {
    type: 'parenthetical',
    children: [{ text: 'beat' }],
  },
  {
    type: 'dialogue',
    children: [{ text: 'Actually, make that two. It\'s going to be a long night.' }],
  },
  {
    type: 'action',
    children: [{ text: '' }],
  },
]

// Element style configurations matching screenplay standards
export const elementStyles: Record<ScreenplayElementType, React.CSSProperties> = {
  'scene-heading': {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: '1.5em',
    marginBottom: '0.75em',
    fontSize: '1.05em',
    letterSpacing: '0.5px',
  },
  'action': {
    marginBottom: '1em',
    lineHeight: '1.6',
    marginLeft: '1.5em',
    marginRight: '1.5em',
  },
  'character': {
    textTransform: 'uppercase',
    marginLeft: '35%',
    marginTop: '1em',
    marginBottom: '0.25em',
    fontWeight: '600',
  },
  'dialogue': {
    marginLeft: '25%',
    marginRight: '25%',
    marginBottom: '1em',
  },
  'parenthetical': {
    marginLeft: '30%',
    marginRight: '30%',
    fontStyle: 'italic',
  },
  'transition': {
    textTransform: 'uppercase',
    textAlign: 'right',
    marginTop: '1em',
    marginBottom: '1em',
    fontWeight: '600',
  },
}

// Keyboard shortcuts for element transitions
export const keyboardShortcuts = {
  'Enter from scene-heading': 'Creates action line',
  'Tab from action': 'Converts to character name',
  'Shift+Tab from action': 'Converts to scene heading',
  'Enter from character': 'Creates dialogue',
  'Tab from dialogue': 'Creates parenthetical',
  'Enter from dialogue': 'Creates action',
  'Enter from parenthetical': 'Returns to dialogue',
  'Type "INT." or "EXT." in action': 'Auto-converts to scene heading',
  'Ctrl/Cmd+H': 'Create/convert to scene heading',
  'Ctrl/Cmd+Z': 'Undo',
  'Ctrl/Cmd+Shift+Z': 'Redo',
  'Ctrl/Cmd+S': 'Save screenplay',
}

