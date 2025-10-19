"use client"

export function PlaygroundContent() {
  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <p className="text-lg text-muted-foreground">
          This is your creative playground. Experiment with ideas, test features, or build something new.
        </p>
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
          <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
            📝 <strong>Screenplay Editor Location:</strong>
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
            The professional screenplay editor is now available in the <strong>Storyboards</strong> section. 
            Click on any screenplay card to start writing!
          </p>
        </div>
      </div>
    </div>
  )
}
