// Types for Screenplay Editor wrapper component

export interface ScreenplayEditorProps {
  screenplayId: string
  onBack: () => void
  onTitleChange?: (title: string) => void
  initialTitle?: string
}
