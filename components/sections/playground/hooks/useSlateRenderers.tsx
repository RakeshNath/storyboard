"use client"

import { useCallback } from 'react'
import { RenderLeafProps } from 'slate-react'
import { CustomText } from '../screenplay-types'

export function useSlateRenderers() {
  // Render leaf (text formatting)
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    let { attributes, children, leaf } = props
    const customLeaf = leaf as CustomText

    if (customLeaf.bold) {
      children = <strong>{children}</strong>
    }

    return <span {...attributes}>{children}</span>
  }, [])

  return {
    renderLeaf
  }
}
