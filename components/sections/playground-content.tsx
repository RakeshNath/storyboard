"use client"

import Image from "next/image"

export function PlaygroundContent() {
  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <Image
        src="/logos/sb-removebg-preview.png"
        alt="StoryBoard Logo"
        width={400}
        height={120}
        className="max-w-full h-auto"
        priority
      />
    </div>
  )
}
