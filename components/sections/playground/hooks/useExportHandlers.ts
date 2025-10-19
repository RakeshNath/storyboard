import { useCallback } from 'react'
import { Descendant, Element as SlateElement, Node } from 'slate'
import { CustomElement } from '../screenplay-types'

export interface ExportOptions {
  sceneTitles: boolean
  sceneSynopsis: boolean
  sceneContent: boolean
}

export interface LocationExportOptions {
  locationDescription: boolean
  sceneList: boolean
  characterList: boolean
  completeScenes: boolean
}

export interface LocationData {
  name: string
  scenes: number[]
  timeOfDay: Record<string, number>
  description?: string
  characters: string[]
}

export interface CharacterData {
  name: string
  appearances: number
  scenes: number[]
  profile: string
  dialogues: { text: string; lineNumber: number }[]
}

export function useExportHandlers(
  value: Descendant[],
  screenplayTitle: string,
  authorName: string,
  locations: LocationData[],
  characterDetails: CharacterData[],
  characterTypes: Record<string, string>,
  characterProfiles: Record<string, string>,
  locationProfiles: Record<string, string>
) {
  // Get content for a specific scene number
  const getSceneContent = useCallback((sceneNumber: number) => {
    let currentScene = 0
    const sceneContent: string[] = []
    
    value.forEach((node) => {
      if (SlateElement.isElement(node)) {
        if (node.type === 'scene-heading') {
          currentScene++
          if (currentScene === sceneNumber) {
            sceneContent.push(Node.string(node))
          }
        } else if (currentScene === sceneNumber) {
          sceneContent.push(Node.string(node))
        }
      }
    })
    
    return sceneContent.join('\n')
  }, [value])

  // Export as plain text
  const handleExportText = useCallback(() => {
    console.log('Exporting plain text...')
    try {
      const text = value
        .map(node => {
          if (SlateElement.isElement(node)) {
            return Node.string(node)
          }
          return ''
        })
        .join('\n')
      
      console.log('Text content:', text.substring(0, 100))
      
      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const fileName = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_draft.txt`
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
      
      console.log('Plain text export completed')
    } catch (error) {
      console.error('Error exporting plain text:', error)
      alert('Error exporting text file. Please try again.')
    }
  }, [value, screenplayTitle])

  // Export as formatted screenplay
  const handleExportFormatted = useCallback((exportOptions: ExportOptions) => {
    console.log('Exporting formatted text...')
    try {
      // Create title page
      const titlePage = `



${''.padStart(35)}${screenplayTitle.toUpperCase()}



${''.padStart(40)}Written By

${''.padStart(40)}${authorName}




FADE IN:


`

      // Format screenplay content
      const formattedContent = value
        .map(node => {
          if (SlateElement.isElement(node)) {
            const customNode = node as CustomElement
            const text = Node.string(node).trim()
            
            if (!text) return ''
            
            // Apply export options
            if (customNode.type === 'scene-heading' && !exportOptions.sceneTitles) {
              return ''
            }
            if (customNode.type !== 'scene-heading' && !exportOptions.sceneContent) {
              return ''
            }
            
            // Format based on type
            switch (customNode.type) {
              case 'scene-heading':
                return `\n${text.toUpperCase()}`
              case 'action':
                return text
              case 'character':
                return `${text.toUpperCase()}`
              case 'dialogue':
                return `          ${text}`
              case 'parenthetical':
                return `                    (${text})`
              case 'transition':
                return `                    ${text.toUpperCase()}`
              default:
                return text
            }
          }
          return ''
        })
        .filter(line => line !== '')
        .join('\n')

      const finalContent = titlePage + formattedContent + '\n\nFADE OUT.\n'
      
      const blob = new Blob([finalContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_formatted.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      console.log('Formatted export completed')
    } catch (error) {
      console.error('Error exporting formatted text:', error)
      alert('Error exporting formatted file. Please try again.')
    }
  }, [value, screenplayTitle, authorName])

  // Export as PDF
  const handleExportPDF = useCallback(async (exportOptions: ExportOptions) => {
    console.log('Exporting PDF...')
    try {
      const { jsPDF } = await import('jspdf')
      
      const doc = new jsPDF()
      const margin = 20
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = margin
      
      // Create title page
      doc.setFont('times', 'bold')
      doc.setFontSize(24)
      
      // Title - centered vertically and horizontally
      const titleY = pageHeight / 2 - 50
      const titleLines = doc.splitTextToSize(screenplayTitle.toUpperCase(), pageWidth - 2 * margin)
      titleLines.forEach((line: string, index: number) => {
        const titleWidth = doc.getTextWidth(line)
        const titleX = (pageWidth - titleWidth) / 2
        doc.text(line, titleX, titleY + (index * 28))
      })
      
      // Author - below title
      doc.setFont('times', 'normal')
      doc.setFontSize(16)
      const authorY = titleY + (titleLines.length * 28) + 60
      const authorText = `Written by ${authorName}`
      const authorWidth = doc.getTextWidth(authorText)
      const authorX = (pageWidth - authorWidth) / 2
      doc.text(authorText, authorX, authorY)
      
      // Add new page for screenplay content
      doc.addPage()
      yPosition = margin
      
      // Set font for screenplay
      doc.setFont('courier', 'normal')
      doc.setFontSize(12)
      
      const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage()
          yPosition = margin
        }
      }
      
      // Add FADE IN
      doc.text('FADE IN:', margin, yPosition)
      yPosition += 20
      
      // Format and add screenplay content
      value.forEach((node) => {
        if (SlateElement.isElement(node)) {
          const customNode = node as CustomElement
          const text = Node.string(node).trim()
          
          if (!text) return
          
          // Apply export options
          if (customNode.type === 'scene-heading' && !exportOptions.sceneTitles) {
            return
          }
          if (customNode.type !== 'scene-heading' && !exportOptions.sceneContent) {
            return
          }
          
          checkPageBreak(20)
          
          switch (customNode.type) {
            case 'scene-heading':
              doc.text(text.toUpperCase(), margin, yPosition)
              yPosition += 15
              break
            case 'action':
              const actionLines = doc.splitTextToSize(text, pageWidth - 2 * margin)
              actionLines.forEach((line: string) => {
                checkPageBreak(10)
                doc.text(line, margin, yPosition)
                yPosition += 10
              })
              break
            case 'character':
              doc.text(text.toUpperCase(), margin + 60, yPosition)
              yPosition += 10
              break
            case 'dialogue':
              const dialogueLines = doc.splitTextToSize(text, pageWidth - 2 * margin - 60)
              dialogueLines.forEach((line: string) => {
                checkPageBreak(10)
                doc.text(line, margin + 20, yPosition)
                yPosition += 10
              })
              break
            case 'parenthetical':
              doc.text(`(${text})`, margin + 40, yPosition)
              yPosition += 10
              break
            case 'transition':
              doc.text(text.toUpperCase(), margin + 60, yPosition)
              yPosition += 15
              break
          }
        }
      })
      
      // Add FADE OUT
      checkPageBreak(20)
      yPosition += 10
      doc.text('FADE OUT.', margin, yPosition)
      
      doc.save(`${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_screenplay.pdf`)
      console.log('PDF export completed')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Error exporting PDF file. Please try again.')
    }
  }, [value, screenplayTitle, authorName])

  // Central export handler
  const handleExport = useCallback((format: 'txt' | 'pdf' | 'fdx', exportOptions: ExportOptions) => {
    switch (format) {
      case 'txt':
        handleExportText()
        break
      case 'pdf':
        handleExportPDF(exportOptions)
        break
      case 'fdx':
        handleExportFormatted(exportOptions)
        break
      default:
        console.error('Unknown export format:', format)
    }
  }, [handleExportText, handleExportPDF, handleExportFormatted])

  // Location Export Handlers
  const handleLocationExportJSON = useCallback((locationExportOptions: LocationExportOptions) => {
    const exportData = locations.map((location) => {
      const data: any = { name: location.name }
      
      if (locationExportOptions.locationDescription) {
        data.description = locationProfiles[location.name] || 'No description'
      }
      if (locationExportOptions.sceneList) {
        data.scenes = location.scenes
      }
      if (locationExportOptions.characterList) {
        data.characters = location.characters
      }
      if (locationExportOptions.completeScenes) {
        data.completeScenes = location.scenes.map(sceneNum => ({
          sceneNumber: sceneNum,
          content: getSceneContent(sceneNum)
        }))
      }
      
      return data
    })
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_locations.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [locations, locationProfiles, screenplayTitle, getSceneContent])

  const handleLocationExportTXT = useCallback((locationExportOptions: LocationExportOptions) => {
    let text = `LOCATIONS EXPORT\n${'='.repeat(50)}\n\n`
    
    locations.forEach((location, index) => {
      text += `LOCATION: ${location.name}\n`
      text += `${'-'.repeat(30)}\n`
      
      if (locationExportOptions.locationDescription) {
        const description = locationProfiles[location.name] || 'No description available'
        text += `Description: ${description}\n\n`
      }
      
      if (locationExportOptions.sceneList) {
        text += `Scenes: ${location.scenes.join(', ')}\n`
      }
      
      if (locationExportOptions.characterList) {
        text += `Characters: ${location.characters.length > 0 ? location.characters.join(', ') : 'None'}\n`
      }
      
      if (locationExportOptions.completeScenes) {
        text += `\nComplete Scenes:\n`
        location.scenes.forEach(sceneNum => {
          text += `\n--- Scene ${sceneNum} ---\n`
          text += getSceneContent(sceneNum)
          text += '\n'
        })
      }
      
      // Add page break between locations if complete scenes are included
      if (locationExportOptions.completeScenes && index < locations.length - 1) {
        text += '\f\n' // Form feed character for page break
      } else if (index < locations.length - 1) {
        text += '\n\n'
      }
    })
    
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_locations.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [locations, locationProfiles, screenplayTitle, getSceneContent])

  const handleLocationExportCSV = useCallback((locationExportOptions: LocationExportOptions) => {
    const headers = ['Name']
    if (locationExportOptions.locationDescription) headers.push('Description')
    if (locationExportOptions.sceneList) headers.push('Scenes')
    if (locationExportOptions.characterList) headers.push('Characters')
    
    const rows = locations.map(location => {
      const row = [location.name]
      if (locationExportOptions.locationDescription) {
        row.push(locationProfiles[location.name] || 'No description')
      }
      if (locationExportOptions.sceneList) {
        row.push(location.scenes.join('; '))
      }
      if (locationExportOptions.characterList) {
        row.push(location.characters.join('; '))
      }
      return row
    })
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_locations.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [locations, locationProfiles, screenplayTitle])

  const handleLocationExportPDF = useCallback(async (locationExportOptions: LocationExportOptions) => {
    try {
      const { jsPDF } = await import('jspdf')
      
      const doc = new jsPDF()
      const margin = 20
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = margin
      
      // Create Title Page
      doc.setFont('times', 'bold')
      doc.setFontSize(24)
      
      const titleY = pageHeight / 2 - 50
      const titleLines = doc.splitTextToSize(screenplayTitle.toUpperCase(), pageWidth - 2 * margin)
      titleLines.forEach((line: string, index: number) => {
        const titleWidth = doc.getTextWidth(line)
        const titleX = (pageWidth - titleWidth) / 2
        doc.text(line, titleX, titleY + (index * 28))
      })
      
      // Export Type
      doc.setFont('times', 'normal')
      doc.setFontSize(16)
      const exportTypeY = titleY + (titleLines.length * 28) + 40
      const exportTypeText = 'Locations Export'
      const exportTypeWidth = doc.getTextWidth(exportTypeText)
      const exportTypeX = (pageWidth - exportTypeWidth) / 2
      doc.text(exportTypeText, exportTypeX, exportTypeY)
      
      // Add new page for locations content
      doc.addPage()
      yPosition = margin
      
      doc.setFontSize(10)
      doc.setFont('times', 'normal')
      
      const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage()
          yPosition = margin
        }
      }
      
      locations.forEach((location, locationIndex) => {
        // Add page break between locations if complete scenes are requested
        if (locationIndex > 0 && locationExportOptions.completeScenes) {
          doc.addPage()
          yPosition = margin
        } else if (locationIndex > 0 && !locationExportOptions.completeScenes) {
          checkPageBreak(60) // Add spacing if not new page
        }
        
        // Location name as H1
        doc.setFont('times', 'bold')
        doc.setFontSize(16)
        doc.text(location.name.toUpperCase(), margin, yPosition)
        yPosition += 12
        
        // Description
        if (locationExportOptions.locationDescription) {
          doc.setFont('times', 'italic')
          doc.setFontSize(10)
          const description = locationProfiles[location.name] || 'No description available'
          const descLines = doc.splitTextToSize(description, pageWidth - 2 * margin)
          descLines.forEach((line: string) => {
            checkPageBreak(8)
            doc.text(line, margin, yPosition)
            yPosition += 6
          })
          yPosition += 5
        }
        
        // Characters
        if (locationExportOptions.characterList && location.characters.length > 0) {
          doc.setFont('times', 'normal')
          doc.setFontSize(10)
          checkPageBreak(15)
          doc.text(`Characters: ${location.characters.join(', ')}`, margin, yPosition)
          yPosition += 8
        }
        
        // Scenes list
        if (locationExportOptions.sceneList) {
          doc.text(`Scenes: ${location.scenes.join(', ')}`, margin, yPosition)
          yPosition += 8
        }
        
        // Complete scenes
        if (locationExportOptions.completeScenes) {
          location.scenes.forEach(sceneNum => {
            checkPageBreak(20)
            doc.setFont('times', 'bold')
            doc.text(`Scene ${sceneNum}`, margin, yPosition)
            yPosition += 8
            
            doc.setFont('times', 'normal')
            const sceneContent = getSceneContent(sceneNum)
            const contentLines = sceneContent.split('\n')
            
            contentLines.forEach((line: string) => {
              checkPageBreak(8)
              if (line.trim()) {
                // Format different types
                if (line.match(/^(INT\.|EXT\.|INT\/EXT\.|EXT\/INT\.)/)) {
                  doc.setFont('times', 'bold')
                  doc.text(line, margin, yPosition)
                } else if (line.match(/^[A-Z][A-Z\s]+$/)) {
                  doc.text(line, margin + 60, yPosition) // Character
                } else if (line.startsWith('(') && line.endsWith(')')) {
                  doc.text(line, margin + 40, yPosition) // Parenthetical
                } else {
                  doc.text(line, margin + 20, yPosition) // Dialogue/Action
                }
              }
              yPosition += 6
            })
            yPosition += 5
          })
        }
        
        yPosition += 10
      })
      
      doc.save(`${screenplayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_locations.pdf`)
    } catch (error) {
      console.error('Error exporting locations PDF:', error)
      alert('Error exporting locations PDF. Please try again.')
    }
  }, [locations, locationProfiles, screenplayTitle, getSceneContent])

  const handleLocationExport = useCallback((format: 'json' | 'txt' | 'csv' | 'pdf', locationExportOptions: LocationExportOptions) => {
    switch (format) {
      case 'json':
        handleLocationExportJSON(locationExportOptions)
        break
      case 'txt':
        handleLocationExportTXT(locationExportOptions)
        break
      case 'csv':
        handleLocationExportCSV(locationExportOptions)
        break
      case 'pdf':
        handleLocationExportPDF(locationExportOptions)
        break
      default:
        console.error('Unknown location export format:', format)
    }
  }, [handleLocationExportJSON, handleLocationExportTXT, handleLocationExportCSV, handleLocationExportPDF])

  return {
    handleExport,
    handleLocationExport,
    getSceneContent
  }
}
