"use client"

import {
  MessageSquare,
  BookOpen,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  GraduationCap,
  User,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/app-context"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { OnlineIndicator } from "@/components/ui/online-indicator"
import { TooltipProvider } from "@/components/ui/tooltip-provider"
import { UnivalleLogo } from "@/components/ui/univalle-logo"
import { useState } from "react"

interface SidebarProps {
  activePage: string
  onPageChange: (page: string) => void
  unreadCounts?: { chats: number; calendar: number }
  collapsed?: boolean
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

export default function Sidebar({
  activePage,
  onPageChange,
  unreadCounts = { chats: 0, calendar: 0 },
  collapsed: initialCollapsed = false,
}: SidebarProps) {
  const { currentUser, logout, theme } = useApp()
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed)

  const menuItems =
    currentUser?.role === "professor" ? [...baseMenuItems, statsItem, settingsItem] : [...baseMenuItems, settingsItem]

  return (
    <TooltipProvider>
      <div
        className={`${isCollapsed ? "w-20" : "w-64"} bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 relative`}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 z-10 w-6 h-6 bg-sidebar-primary text-sidebar-primary-foreground rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={`p-4 ${isCollapsed ? "px-3" : "p-6"} border-b border-sidebar-border`}>
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
            {theme === "institutional" && !isCollapsed ? (
              <UnivalleLogo size="sm" showText={false} />
            ) : (
              <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
            )}
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-lg text-sidebar-foreground">CampusChat</h1>
                {theme === "institutional" && (
                  <p className="text-[10px] text-sidebar-foreground/70">Universidad del Valle</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 lg:p-4 py-4 lg:py-6">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activePage === item.id
              const count =
                item.id === "chats" ? unreadCounts.chats : item.id === "calendar" ? unreadCounts.calendar : 0

              const buttonContent = (
                <button
                  key={item.id} // Added key property
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3"} px-3 lg:px-4 py-2.5 rounded-lg transition-all duration-200 relative ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium flex-1 text-left">{item.label}</span>}
                  {count > 0 && (
                    <span
                      className={`${isCollapsed ? "absolute -top-1 -right-1" : "ml-2"} min-w-5 h-5 px-1.5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-200 flex-shrink-0`}
                    >
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </button>
              )

              return isCollapsed ? (
                <TooltipWrapper key={item.id} content={item.label} position="right">
                  {buttonContent}
                </TooltipWrapper>
              ) : (
                <div key={item.id}>{buttonContent}</div>
              )
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className={`p-2 lg:p-4 border-t border-sidebar-border space-y-3 ${isCollapsed ? "items-center" : ""}`}>
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-3`}>
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0 ${
                  currentUser?.role === "professor"
                    ? "bg-gradient-to-br from-amber-500 to-orange-600"
                    : "bg-sidebar-primary"
                }`}
              >
                {currentUser?.avatar || "??"}
              </div>
              <OnlineIndicator isOnline={true} size="sm" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-sidebar-foreground truncate">
                    {currentUser?.name || "Usuario"}
                  </p>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                      currentUser?.role === "professor"
                        ? "bg-amber-500/20 text-amber-200"
                        : "bg-sidebar-primary/30 text-sidebar-foreground"
                    }`}
                  >
                    {currentUser?.role === "professor" ? (
                      <>
                        <GraduationCap className="w-3 h-3" /> Profesor
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3" /> Estudiante
                      </>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
          {isCollapsed ? (
            <TooltipWrapper content="Cerrar sesión" position="right">
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </TooltipWrapper>
          ) : (
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full flex items-center gap-2 justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
