export interface User {
  email: string
  name: string
}

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
    window.location.href = "/login"
  }
}
