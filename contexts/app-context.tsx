"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Theme = "light" | "dark" | "institutional"
export type UserRole = "professor" | "student"

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: UserRole
  phone?: string
  bio?: string
}

export const DEMO_ACCOUNTS: User[] = [
  {
    id: "prof-1",
    name: "Dr. Carlos Mendoza",
    email: "carlos.mendoza@univalle.edu.co",
    avatar: "CM",
    role: "professor",
    phone: "+57 300 123 4567",
    bio: "Profesor de Ingeniería de Sistemas con 15 años de experiencia.",
  },
  {
    id: "std-1",
    name: "María García",
    email: "maria.garcia@correounivalle.edu.co",
    avatar: "MG",
    role: "student",
    phone: "+57 310 987 6543",
    bio: "Estudiante de Ingeniería de Sistemas, 6to semestre.",
  },
]

interface AppContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  currentUser: User | null
  login: (user: User) => void
  logout: () => void
  isLoggedIn: boolean
  updateUser: (updates: Partial<User>) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("light", "dark", "institutional")
    if (theme === "dark") {
      root.classList.add("dark")
    } else if (theme === "institutional") {
      root.classList.add("institutional")
    }
  }, [theme])

  const login = (user: User) => {
    setCurrentUser(user)
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const updateUser = (updates: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates })
    }
  }

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        currentUser,
        login,
        logout,
        isLoggedIn: currentUser !== null,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
