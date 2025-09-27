export interface User {
  email: string
  name: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  location?: string
  phoneNumber?: string
  subscription?: string
  theme?: string
}

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}

export const updateUserTheme = (theme: string) => {
  if (typeof window === "undefined") return

  const user = getUser()
  if (user) {
    const updatedUser = { ...user, theme }
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }
}

export const getUserTheme = (): string => {
  const user = getUser()
  return user?.theme || "minimalist" // Default to minimalist theme
}

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
    window.location.href = "/login"
  }
}
