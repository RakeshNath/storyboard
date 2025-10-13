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

// Initial value with 20 scenes for testing
export const initialValue: Descendant[] = [
  // Scene 1
  { type: 'scene-heading', children: [{ text: 'INT. COFFEE SHOP - DAY' }] },
  { type: 'action', children: [{ text: 'A busy coffee shop filled with the aroma of fresh coffee. SARAH sits at a corner table typing on her laptop.' }] },
  { type: 'character', children: [{ text: 'BARISTA' }] },
  { type: 'dialogue', children: [{ text: 'What can I get for you?' }] },
  { type: 'character', children: [{ text: 'SARAH' }] },
  { type: 'dialogue', children: [{ text: 'Just a black coffee, please. Large.' }] },
  
  // Scene 2
  { type: 'scene-heading', children: [{ text: 'INT. COFFEE SHOP - NIGHT' }] },
  { type: 'action', children: [{ text: 'The coffee shop is nearly empty. SARAH and JOHN sit across from each other.' }] },
  { type: 'character', children: [{ text: 'JOHN' }] },
  { type: 'dialogue', children: [{ text: 'I heard about your project. Sounds ambitious.' }] },
  { type: 'character', children: [{ text: 'SARAH' }] },
  { type: 'dialogue', children: [{ text: 'It is. But I think we can pull it off.' }] },
  
  // Scene 3
  { type: 'scene-heading', children: [{ text: 'EXT. PARK - DAY' }] },
  { type: 'action', children: [{ text: 'A beautiful sunny day. Children playing on swings. SARAH walks through with her phone.' }] },
  { type: 'character', children: [{ text: 'SARAH' }] },
  { type: 'parenthetical', children: [{ text: 'on phone' }] },
  { type: 'dialogue', children: [{ text: 'Mom, I can\'t talk right now. I\'m meeting someone.' }] },
  
  // Scene 4
  { type: 'scene-heading', children: [{ text: 'INT. OFFICE - DAY' }] },
  { type: 'action', children: [{ text: 'Modern office space. JOHN works at his desk. MIKE enters.' }] },
  { type: 'character', children: [{ text: 'MIKE' }] },
  { type: 'dialogue', children: [{ text: 'The client called. They want to move up the deadline.' }] },
  { type: 'character', children: [{ text: 'JOHN' }] },
  { type: 'dialogue', children: [{ text: 'That\'s impossible. We need at least two more weeks.' }] },
  
  // Scene 5
  { type: 'scene-heading', children: [{ text: 'INT. OFFICE - NIGHT' }] },
  { type: 'action', children: [{ text: 'The office is dark except for JOHN\'s desk lamp. SARAH arrives with coffee.' }] },
  { type: 'character', children: [{ text: 'SARAH' }] },
  { type: 'dialogue', children: [{ text: 'Still here? You need to get some rest.' }] },
  
  // Scene 6
  { type: 'scene-heading', children: [{ text: 'EXT. RESTAURANT - NIGHT' }] },
  { type: 'action', children: [{ text: 'An upscale restaurant. SARAH and JOHN sit at an outdoor table.' }] },
  { type: 'character', children: [{ text: 'JOHN' }] },
  { type: 'dialogue', children: [{ text: 'This is nice. We should do this more often.' }] },
  { type: 'character', children: [{ text: 'SARAH' }] },
  { type: 'dialogue', children: [{ text: 'When we\'re not drowning in deadlines, sure.' }] },
  
  // Scene 7
  { type: 'scene-heading', children: [{ text: 'INT. GYM - DAY' }] },
  { type: 'action', children: [{ text: 'MIKE works out on the treadmill. SARAH enters and gets on the next one.' }] },
  { type: 'character', children: [{ text: 'MIKE' }] },
  { type: 'dialogue', children: [{ text: 'Fancy meeting you here.' }] },
  
  // Scene 8
  { type: 'scene-heading', children: [{ text: 'EXT. PARK - DAWN' }] },
  { type: 'action', children: [{ text: 'Early morning. JOHN jogs through the park. The sun is just rising.' }] },
  { type: 'character', children: [{ text: 'JOHN' }] },
  { type: 'parenthetical', children: [{ text: 'to himself' }] },
  { type: 'dialogue', children: [{ text: 'I can do this. Just one more mile.' }] },
  
  // Scene 9
  { type: 'scene-heading', children: [{ text: 'INT. CONFERENCE ROOM - DAY' }] },
  { type: 'action', children: [{ text: 'SARAH, JOHN, and MIKE sit across from the CLIENT.' }] },
  { type: 'character', children: [{ text: 'CLIENT' }] },
  { type: 'dialogue', children: [{ text: 'We\'re impressed with your progress. When can we see a demo?' }] },
  { type: 'character', children: [{ text: 'SARAH' }] },
  { type: 'dialogue', children: [{ text: 'We can have something ready by Friday.' }] },
  
  // Scene 10
  { type: 'scene-heading', children: [{ text: 'INT. APARTMENT - NIGHT' }] },
  { type: 'action', children: [{ text: 'SARAH\'s small apartment. She paces while on the phone.' }] },
  { type: 'character', children: [{ text: 'SARAH' }] },
  { type: 'parenthetical', children: [{ text: 'frustrated' }] },
  { type: 'dialogue', children: [{ text: 'I know what I said, but the code isn\'t cooperating!' }] },
  
  // Scene 11
  { type: 'scene-heading', children: [{ text: 'EXT. BEACH - DAY' }] },
  { type: 'action', children: [{ text: 'MIKE and JOHN walk along the shore, discussing their plans.' }] },
  { type: 'character', children: [{ text: 'MIKE' }] },
  { type: 'dialogue', children: [{ text: 'What if we simplified the interface?' }] },
  { type: 'character', children: [{ text: 'JOHN' }] },
  { type: 'dialogue', children: [{ text: 'That might work. Let\'s run it by Sarah.' }] },
  
  // Scene 12
  { type: 'scene-heading', children: [{ text: 'INT. LIBRARY - DAY' }] },
  { type: 'action', children: [{ text: 'Quiet study area. SARAH researches at a computer terminal. EMMA approaches.' }] },
  { type: 'character', children: [{ text: 'EMMA' }] },
  { type: 'dialogue', children: [{ text: 'Sarah? Is that you? It\'s been forever!' }] },
  { type: 'character', children: [{ text: 'SARAH' }] },
  { type: 'dialogue', children: [{ text: 'Emma! What are you doing here?' }] },
  
  // Scene 13
  { type: 'scene-heading', children: [{ text: 'EXT. STREET - NIGHT' }] },
  { type: 'action', children: [{ text: 'Dark, rainy street. JOHN hurries along with an umbrella.' }] },
  { type: 'character', children: [{ text: 'STRANGER' }] },
  { type: 'dialogue', children: [{ text: 'Excuse me, do you have the time?' }] },
  { type: 'character', children: [{ text: 'JOHN' }] },
  { type: 'dialogue', children: [{ text: 'Sorry, in a hurry.' }] },
  
  // Scene 14
  { type: 'scene-heading', children: [{ text: 'INT. RESTAURANT - DAY' }] },
  { type: 'action', children: [{ text: 'Lunch rush. SARAH and EMMA catch up over salads.' }] },
  { type: 'character', children: [{ text: 'EMMA' }] },
  { type: 'dialogue', children: [{ text: 'So you\'re working with John again? How\'s that going?' }] },
  { type: 'character', children: [{ text: 'SARAH' }] },
  { type: 'dialogue', children: [{ text: 'It\'s... complicated. But professional.' }] },
  
  // Scene 15
  { type: 'scene-heading', children: [{ text: 'INT. APARTMENT - DAY' }] },
  { type: 'action', children: [{ text: 'JOHN\'s apartment. Messy, papers everywhere. He frantically searches for something.' }] },
  { type: 'character', children: [{ text: 'JOHN' }] },
  { type: 'parenthetical', children: [{ text: 'to himself' }] },
  { type: 'dialogue', children: [{ text: 'Where did I put those notes?' }] },
  
  // Scene 16
  { type: 'scene-heading', children: [{ text: 'EXT. COFFEE SHOP - DUSK' }] },
  { type: 'action', children: [{ text: 'Outside the coffee shop. SARAH and MIKE stand talking.' }] },
  { type: 'character', children: [{ text: 'MIKE' }] },
  { type: 'dialogue', children: [{ text: 'I think we\'re ready for the presentation.' }] },
  { type: 'character', children: [{ text: 'SARAH' }] },
  { type: 'dialogue', children: [{ text: 'I hope so. Everything is riding on this.' }] },
  
  // Scene 17
  { type: 'scene-heading', children: [{ text: 'INT. CONFERENCE ROOM - DAY' }] },
  { type: 'action', children: [{ text: 'The big presentation. SARAH, JOHN, and MIKE present to a room full of executives.' }] },
  { type: 'character', children: [{ text: 'SARAH' }] },
  { type: 'dialogue', children: [{ text: 'And that\'s how we\'ll deliver on time and under budget.' }] },
  { type: 'character', children: [{ text: 'CLIENT' }] },
  { type: 'dialogue', children: [{ text: 'Impressive. When can you start?' }] },
  
  // Scene 18
  { type: 'scene-heading', children: [{ text: 'EXT. PARK - NIGHT' }] },
  { type: 'action', children: [{ text: 'The team celebrates in the park. Champagne and laughter.' }] },
  { type: 'character', children: [{ text: 'MIKE' }] },
  { type: 'dialogue', children: [{ text: 'We actually did it!' }] },
  { type: 'character', children: [{ text: 'JOHN' }] },
  { type: 'dialogue', children: [{ text: 'This is just the beginning.' }] },
  
  // Scene 19
  { type: 'scene-heading', children: [{ text: 'INT. OFFICE - DAY' }] },
  { type: 'action', children: [{ text: 'One month later. The office is busier than ever. New employees everywhere.' }] },
  { type: 'character', children: [{ text: 'SARAH' }] },
  { type: 'dialogue', children: [{ text: 'Remember when it was just the three of us?' }] },
  { type: 'character', children: [{ text: 'JOHN' }] },
  { type: 'dialogue', children: [{ text: 'Those were simpler times.' }] },
  
  // Scene 20
  { type: 'scene-heading', children: [{ text: 'EXT. BEACH - SUNSET' }] },
  { type: 'action', children: [{ text: 'The team stands at the beach, watching the sunset together.' }] },
  { type: 'character', children: [{ text: 'SARAH' }] },
  { type: 'dialogue', children: [{ text: 'Here\'s to new beginnings.' }] },
  { type: 'character', children: [{ text: 'MIKE' }] },
  { type: 'dialogue', children: [{ text: 'And to the best team I could ask for.' }] },
  { type: 'character', children: [{ text: 'JOHN' }] },
  { type: 'dialogue', children: [{ text: 'Cheers to that.' }] },
  { type: 'action', children: [{ text: 'They clink glasses as the sun sets over the ocean.' }] },
  { type: 'transition', children: [{ text: 'FADE OUT.' }] },
  { type: 'action', children: [{ text: '' }] },
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
  'Tab from parenthetical': 'Creates transition (e.g., CUT TO:, FADE OUT)',
  'Enter from dialogue': 'Creates action',
  'Enter from parenthetical': 'Returns to dialogue',
  'Enter from transition': 'Creates action',
  'Type "INT." or "EXT." in action': 'Auto-converts to scene heading',
  'Ctrl/Cmd+H': 'Create/convert to scene heading',
  'Ctrl/Cmd+Z': 'Undo',
  'Ctrl/Cmd+Shift+Z': 'Redo',
  'Ctrl/Cmd+S': 'Save screenplay',
}

