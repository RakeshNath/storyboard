export interface ThemeColors {
  primary: string
  secondary: string
  background: string
  foreground: string
  accent: string
}

export interface ThemeConfig {
  id: string
  name: string
  colors: ThemeColors
  textStyle: {
    heading: string
    body: string
  }
}

export const loadTheme = () => {
  if (typeof window === "undefined") return

  const savedTheme = localStorage.getItem("selectedTheme")
  if (savedTheme) {
    // Theme will be applied by the ThemesContent component
    return savedTheme
  }
  return "professional"
}

export const applyThemeToDocument = (colors: ThemeColors) => {
  if (typeof window === "undefined") return
  if (!colors || typeof colors !== 'object') return

  const root = document.documentElement

  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value)
  })
}
