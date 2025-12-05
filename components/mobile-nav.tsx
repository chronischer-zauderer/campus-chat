"use client"

import { MessageSquare, BookOpen, Users, Calendar, FileText, Settings, Menu, X, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useApp } from "@/contexts/app-context"
import { UnivalleLogo } from "@/components/ui/univalle-logo"

interface MobileNavProps {
  activePage: string
  onPageChange: (page: string) => void
  unreadCounts: { chats: number; calendar: number }
}

const baseMenuItems = [
  { id: "chats", icon: MessageSquare, label: "Chats" },
  { id: "subjects", icon: BookOpen, label: "Materias" },
  { id: "teams", icon: Users, label: "Equipos" },
  { id: "calendar", icon: Calendar, label: "Calendario" },
  { id: "files", icon: FileText, label: "Archivos" },
]

const statsItem = { id: "stats", icon: BarChart3, label: "Estadísticas" }
const settingsItem = { id: "settings", icon: Settings, label: "Ajustes" }

export function MobileBottomNav({ activePage, onPageChange, unreadCounts }: MobileNavProps) {
  const mainItems = baseMenuItems.slice(0, 5)

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {mainItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          const count = item.id === "chats" ? unreadCounts.chats : item.id === "calendar" ? unreadCounts.calendar : 0

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors relative ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export function MobileHeader({ activePage, onPageChange }: Omit<MobileNavProps, "unreadCounts">) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { currentUser, logout, theme } = useApp()

  const menuItems =
    currentUser?.role === "professor" ? [...baseMenuItems, statsItem, settingsItem] : [...baseMenuItems, settingsItem]

  const getPageTitle = () => {
    const allItems = [...baseMenuItems, statsItem, settingsItem]
    const item = allItems.find((i) => i.id === activePage)
    return item?.label || "CampusChat"
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-40 flex items-center justify-between px-4 md:hidden safe-area-top">
        <div className="flex items-center gap-3">
          {theme === "institutional" ? (
            <UnivalleLogo size="sm" />
          ) : (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
          <h1 className="font-bold text-foreground">{getPageTitle()}</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
          <Menu className="w-5 h-5" />
        </Button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-card border-l border-border animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-semibold text-foreground">Menú</span>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                    currentUser?.role === "professor" ? "bg-gradient-to-br from-amber-500 to-orange-600" : "bg-primary"
                  }`}
                >
                  {currentUser?.avatar || "??"}
                </div>
                <div>
                  <p className="font-medium text-foreground">{currentUser?.name}</p>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${
                        currentUser?.role === "professor"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {currentUser?.role === "professor" ? "Profesor" : "Estudiante"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activePage === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id)
                      setIsMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={() => {
                  logout()
                  setIsMenuOpen(false)
                }}
                className="w-full justify-start text-muted-foreground hover:text-destructive"
              >
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
