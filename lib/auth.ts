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

  try {
    const userStr = localStorage.getItem("user")
    if (!userStr) return null
    
    return JSON.parse(userStr)
  } catch (error) {
    // If user data is invalid JSON, remove it and return null
    localStorage.removeItem("user")
    return null
  }
}

export const updateUserTheme = (theme: string) => {
  if (typeof window === "undefined") return

  const user = getUser()
  if (user) {
    try {
      const updatedUser = { ...user, theme }
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (error) {
      // Handle localStorage errors gracefully
      console.error('Failed to update user theme:', error)
      throw error
    }
  }
}

export const getUserTheme = (): string => {
  const user = getUser()
  return user?.theme || "minimalist" // Default to minimalist theme
}

export const logout = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("user")
      window.location.href = "/login"
    } catch (error) {
      console.error('Error during logout:', error)
      // Still redirect even if localStorage fails
      window.location.href = "/login"
    }
  }
}
