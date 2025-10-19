"use client"

import { ScreenplayEditorAggregator } from './components/screenplay-editor-aggregator'

interface ScreenplayEditorProProps {
  title?: string
}

export function ScreenplayEditorPro({ title }: ScreenplayEditorProProps) {
  return <ScreenplayEditorAggregator title={title} />
}

export default ScreenplayEditorPro