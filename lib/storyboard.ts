export interface Storyboard {
  id: string
  title: string
  type: "screenplay" | "synopsis"
  status: "draft" | "in-progress" | "completed" | "revision"
  pages: number
  sceneCount?: number
  subsceneCount?: number
  lastModified: string
  created: string
  genre: string
  content?: string
}

export const getStoryboards = (): Storyboard[] => {
  if (typeof window === "undefined") return []

  const storyboards = localStorage.getItem("storyboards")
  return storyboards ? JSON.parse(storyboards) : []
}

export const saveStoryboard = (storyboard: Storyboard) => {
  const storyboards = getStoryboards()
  const existingIndex = storyboards.findIndex((s) => s.id === storyboard.id)

  if (existingIndex >= 0) {
    storyboards[existingIndex] = storyboard
  } else {
    storyboards.push(storyboard)
  }

  localStorage.setItem("storyboards", JSON.stringify(storyboards))
}

export const deleteStoryboard = (id: string) => {
  const storyboards = getStoryboards()
  const filtered = storyboards.filter((s) => s.id !== id)
  localStorage.setItem("storyboards", JSON.stringify(filtered))
}

export const createNewStoryboard = (type: "screenplay" | "synopsis" = "screenplay"): Storyboard => {
  return {
    id: Date.now().toString(),
    title: "Untitled Storyboard",
    type: type,
    status: "draft",
    pages: 0,
    sceneCount: type === "screenplay" ? 0 : undefined,
    subsceneCount: type === "screenplay" ? 0 : undefined,
    lastModified: "Just now",
    created: new Date().toISOString(),
    genre: "Drama",
    content: "",
  }
}
