"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, Search } from "lucide-react"

export function PlaygroundContent() {
  // Autocomplete states
  const [autocompleteValue, setAutocompleteValue] = useState("")
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [autocompleteIndex, setAutocompleteIndex] = useState(-1)
  
  // Searchable Select states
  const [searchableValue, setSearchableValue] = useState("")
  const [showSearchable, setShowSearchable] = useState(false)
  const [searchableIndex, setSearchableIndex] = useState(-1)
  
  // Combobox states
  const [comboboxValue, setComboboxValue] = useState("")
  const [showCombobox, setShowCombobox] = useState(false)
  const [comboboxIndex, setComboboxIndex] = useState(-1)
  
  // Typeahead states
  const [typeaheadValue, setTypeaheadValue] = useState("")
  const [showTypeahead, setShowTypeahead] = useState(false)
  const [typeaheadIndex, setTypeaheadIndex] = useState(-1)
  
  const options = ["JOHN", "SARAH", "ANTAGONIST", "DETECTIVE", "MARY", "ALEX", "BOSS", "VICTIM"]

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(
      (autocompleteValue || searchableValue || comboboxValue || typeaheadValue).toLowerCase()
    )
  )

  // Keyboard navigation handlers
  const handleKeyDown = (type: string, event: React.KeyboardEvent) => {
    const currentValue = type === 'autocomplete' ? autocompleteValue :
                        type === 'searchable' ? searchableValue :
                        type === 'combobox' ? comboboxValue : typeaheadValue
    
    const currentIndex = type === 'autocomplete' ? autocompleteIndex :
                        type === 'searchable' ? searchableIndex :
                        type === 'combobox' ? comboboxIndex : typeaheadIndex
    
    const setValue = type === 'autocomplete' ? setAutocompleteValue :
                    type === 'searchable' ? setSearchableValue :
                    type === 'combobox' ? setComboboxValue : setTypeaheadValue
    
    const setIndex = type === 'autocomplete' ? setAutocompleteIndex :
                    type === 'searchable' ? setSearchableIndex :
                    type === 'combobox' ? setComboboxIndex : setTypeaheadIndex
    
    const setShow = type === 'autocomplete' ? setShowAutocomplete :
                   type === 'searchable' ? setShowSearchable :
                   type === 'combobox' ? setShowCombobox : setShowTypeahead

    const filtered = options.filter(option =>
      option.toLowerCase().includes(currentValue.toLowerCase())
    )

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (filtered.length > 0) {
          const newIndex = currentIndex < filtered.length - 1 ? currentIndex + 1 : 0
          setIndex(newIndex)
          setShow(true)
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (filtered.length > 0) {
          const newIndex = currentIndex > 0 ? currentIndex - 1 : filtered.length - 1
          setIndex(newIndex)
          setShow(true)
        }
        break
      case 'Enter':
        event.preventDefault()
        if (currentIndex >= 0 && filtered[currentIndex]) {
          setValue(filtered[currentIndex])
          setIndex(-1)
          setShow(false)
        }
        break
      case 'Escape':
        event.preventDefault()
        setIndex(-1)
        setShow(false)
        break
    }
  }

  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Input Components Playground</h1>
          <p className="text-muted-foreground">Testing different input patterns for character selection</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 1. Autocomplete */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">1. Autocomplete</h2>
            <p className="text-sm text-muted-foreground">Type to filter, shows dropdown on focus. Use ↑↓ arrows and Enter to select</p>
            
            <div className="relative">
              <Input
                value={autocompleteValue}
                onChange={(e) => {
                  setAutocompleteValue(e.target.value)
                  setAutocompleteIndex(-1)
                }}
                onFocus={() => setShowAutocomplete(true)}
                onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                onKeyDown={(e) => handleKeyDown('autocomplete', e)}
                placeholder="Type to search characters..."
                className="w-full"
              />
              
              {showAutocomplete && filteredOptions.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-full bg-background border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {filteredOptions.map((option, index) => (
                    <button
                      key={option}
                      onClick={() => {
                        setAutocompleteValue(option)
                        setShowAutocomplete(false)
                        setAutocompleteIndex(-1)
                      }}
                      className={`w-full px-3 py-2 text-left text-sm first:rounded-t-lg last:rounded-b-lg ${
                        index === autocompleteIndex 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 2. Searchable Select */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">2. Searchable Select</h2>
            <p className="text-sm text-muted-foreground">Dropdown with search input inside. Use ↑↓ arrows and Enter to select</p>
            
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowSearchable(!showSearchable)}
                className="w-full justify-between"
              >
                <span className={searchableValue ? "" : "text-muted-foreground"}>
                  {searchableValue || "Select a character..."}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {showSearchable && (
                <div className="absolute top-full left-0 mt-1 w-full bg-background border rounded-lg shadow-lg z-10">
                  <div className="p-2 border-b">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={searchableValue}
                        onChange={(e) => {
                          setSearchableValue(e.target.value)
                          setSearchableIndex(-1)
                        }}
                        onKeyDown={(e) => handleKeyDown('searchable', e)}
                        placeholder="Search characters..."
                        className="pl-8"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option, index) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSearchableValue(option)
                            setShowSearchable(false)
                            setSearchableIndex(-1)
                          }}
                          className={`w-full px-3 py-2 text-left text-sm ${
                            index === searchableIndex 
                              ? 'bg-primary text-primary-foreground' 
                              : 'hover:bg-muted/50'
                          }`}
                        >
                          {option}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No characters found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Combobox */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">3. Combobox</h2>
            <p className="text-sm text-muted-foreground">Input field + dropdown button. Use ↑↓ arrows and Enter to select</p>
            
            <div className="relative flex">
              <Input
                value={comboboxValue}
                onChange={(e) => {
                  setComboboxValue(e.target.value)
                  setComboboxIndex(-1)
                }}
                onFocus={() => setShowCombobox(true)}
                onBlur={() => setTimeout(() => setShowCombobox(false), 200)}
                onKeyDown={(e) => handleKeyDown('combobox', e)}
                placeholder="Type or click arrow..."
                className="flex-1 rounded-r-none border-r-0"
              />
              <Button
                variant="outline"
                onClick={() => setShowCombobox(!showCombobox)}
                className="rounded-l-none border-l-0 px-3"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {showCombobox && (
                <div className="absolute top-full left-0 mt-1 w-full bg-background border rounded-lg shadow-lg z-10">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, index) => (
                      <button
                        key={option}
                        onClick={() => {
                          setComboboxValue(option)
                          setShowCombobox(false)
                          setComboboxIndex(-1)
                        }}
                        className={`w-full px-3 py-2 text-left text-sm first:rounded-t-lg last:rounded-b-lg ${
                          index === comboboxIndex 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        {option}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No characters found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 4. Typeahead */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">4. Typeahead</h2>
            <p className="text-sm text-muted-foreground">Inline suggestions as you type. Use ↑↓ arrows and Enter to select</p>
            
            <div className="relative">
              <Input
                value={typeaheadValue}
                onChange={(e) => {
                  setTypeaheadValue(e.target.value)
                  setShowTypeahead(e.target.value.length > 0)
                  setTypeaheadIndex(-1)
                }}
                onFocus={() => setShowTypeahead(typeaheadValue.length > 0)}
                onBlur={() => setTimeout(() => setShowTypeahead(false), 200)}
                onKeyDown={(e) => handleKeyDown('typeahead', e)}
                placeholder="Start typing character name..."
                className="w-full"
              />
              
              {showTypeahead && filteredOptions.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-full bg-background border rounded-lg shadow-lg z-10 max-h-32 overflow-y-auto">
                  {filteredOptions.slice(0, 5).map((option, index) => (
                    <button
                      key={option}
                      onClick={() => {
                        setTypeaheadValue(option)
                        setShowTypeahead(false)
                        setTypeaheadIndex(-1)
                      }}
                      className={`w-full px-3 py-2 text-left text-sm first:rounded-t-lg last:rounded-b-lg ${
                        index === typeaheadIndex 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Values Display */}
        <div className="mt-8 p-6 bg-muted/20 rounded-lg">
          <h3 className="font-medium mb-4">Current Values:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Autocomplete:</strong> "{autocompleteValue || "Empty"}"</p>
              <p><strong>Searchable Select:</strong> "{searchableValue || "Empty"}"</p>
            </div>
            <div>
              <p><strong>Combobox:</strong> "{comboboxValue || "Empty"}"</p>
              <p><strong>Typeahead:</strong> "{typeaheadValue || "Empty"}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}