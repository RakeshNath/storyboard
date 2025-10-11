// Types for Synopsis Editor components

export interface SynopsisStats {
  pages: number
  words: number
  characters: number
  lines: number
}

export interface SynopsisEditorProps {
  synopsisId: string
  synopsisTitle: string
  onBack: () => void
}

export interface SynopsisHeaderProps {
  synopsisTitle: string
  onBack: () => void
  pageCount: number
  wordCount: number
  characterCount: number
  hasUnsavedChanges: boolean
  onSave: () => void
}

export interface SynopsisToolbarProps {
  editor: any // TipTap editor instance
}

export interface SynopsisEditorContentProps {
  editor: any // TipTap editor instance
  pageCount: number
}

export interface SynopsisHelpProps {
  // No props needed for help content
}

export interface SynopsisStatsProps {
  wordCount: number
  characterCount: number
}
