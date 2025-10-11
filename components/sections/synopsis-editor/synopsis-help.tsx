"use client"

import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { SynopsisHelpProps } from "./types"

export function SynopsisHelp({}: SynopsisHelpProps) {
  return (
    <div className="p-4 border-t bg-muted/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <HelpCircle className="h-4 w-4" />
          <span>Need help? Check out our writing guide</span>
        </div>
        <Button variant="outline" size="sm">
          View Guide
        </Button>
      </div>
    </div>
  )
}
