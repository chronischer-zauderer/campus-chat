"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import ChatListPanel from "@/components/chat-list-panel"
import ChatWindow from "@/components/chat-window"
import FilesPage from "@/components/files-page"
import CalendarPage from "@/components/calendar-page"
import SubjectsPage from "@/components/subjects-page"
import TeamsPage from "@/components/teams-page"
import SettingsPage from "@/components/settings-page"
import StatsPage from "@/components/stats-page" // Import StatsPage
import { MobileBottomNav, MobileHeader } from "@/components/mobile-nav"
import { EmptyState } from "@/components/ui/empty-state"
import { GlobalSearch } from "@/components/global-search"
import { NotificationCenter } from "@/components/notification-center"
import { AccessibilityMenu } from "@/components/accessibility-menu"
import { useMediaQuery } from "@/hooks/use-mobile"
import { useApp } from "@/contexts/app-context"
import { getChatsForUser, getDeadlinesForUser } from "@/lib/demo-data"
import { Bell, Accessibility, X, Search } from "lucide-react"

export default function DashboardPage() {
  const [activePage, setActivePage] = useState("chats")
  const [selectedChat, setSelectedChat] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAccessibility, setShowAccessibility] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")
  const { currentUser } = useApp()

  const [unreadCounts, setUnreadCounts] = useState({ chats: 0, calendar: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (currentUser) {
      const chats = getChatsForUser(currentUser.id)
      const deadlines = getDeadlinesForUser(currentUser.id, currentUser.role)

      const unreadChats = chats.filter((c) => c.unread > 0).reduce((acc, c) => acc + c.unread, 0)

      const now = new Date()
      const upcomingDeadlines = deadlines.filter((d) => {
        const deadline = new Date(d.dueDate)
        const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays >= 0 && diffDays <= 3
      }).length

      setUnreadCounts({ chats: unreadChats, calendar: upcomingDeadlines })
    }
  }, [currentUser])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setShowSearch(true)
      }
      if (e.key === "Escape") {
        setShowSearch(false)
        setShowNotifications(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSearchNavigate = (page: string, itemId?: number | string) => {
    setActivePage(page)
    if (page === "chats" && itemId) {
      const chatId = typeof itemId === "string" ? Number.parseInt(itemId.replace("chat-", "")) : itemId
      setSelectedChat(chatId)
    }
    setShowSearch(false)
  }

  const showChatListOnMobile = isMobile && selectedChat === 0
  const showChatWindowOnMobile = isMobile && selectedChat > 0

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Mobile Header - only on mobile */}
      {isMobile && <MobileHeader activePage={activePage} onPageChange={setActivePage} />}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - hidden on mobile, shown on tablet+ */}
        {!isMobile && (
          <Sidebar
            activePage={activePage}
            onPageChange={setActivePage}
            unreadCounts={unreadCounts}
            collapsed={isTablet}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 overflow-hidden flex flex-col ${isMobile ? "pt-14 pb-16" : ""}`}>
          {!isMobile && (
            <div className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 gap-4 flex-shrink-0">
              {/* Search */}
              <div className="flex-1 max-w-xl">
                <GlobalSearch onNavigate={handleSearchNavigate} />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAccessibility(true)}
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Accesibilidad"
                >
                  <Accessibility className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative"
                  title="Notificaciones"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCounts.chats + unreadCounts.calendar > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                  )}
                </button>
              </div>
            </div>
          )}

          {showNotifications && !isMobile && (
            <>
              <div className="fixed inset-0 z-[60]" onClick={() => setShowNotifications(false)} />
              <div className="fixed top-16 right-4 z-[70]">
                <NotificationCenter onClose={() => setShowNotifications(false)} />
              </div>
            </>
          )}

          {isMobile && (
            <div className="flex items-center justify-end gap-2 px-4 py-2 border-b border-border bg-card/50">
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowAccessibility(true)}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <Accessibility className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowNotifications(true)}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCounts.chats + unreadCounts.calendar > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                )}
              </button>
            </div>
          )}

          <div className="flex-1 overflow-hidden animate-in fade-in duration-300">
            {activePage === "chats" ? (
              <div className="flex h-full overflow-hidden">
                {/* Chat List - responsive width */}
                {(!isMobile || showChatListOnMobile) && (
                  <ChatListPanel selectedChatId={selectedChat} onSelectChat={setSelectedChat} fullWidth={isMobile} />
                )}

                {/* Chat Window or Empty State */}
                {selectedChat > 0
                  ? (!isMobile || showChatWindowOnMobile) && (
                      <ChatWindow chatId={selectedChat} onBack={() => setSelectedChat(0)} showBackButton={isMobile} />
                    )
                  : !isMobile && (
                      <div className="flex-1 flex flex-col items-center justify-center bg-muted/30 p-6 overflow-y-auto">
                        <EmptyState
                          type="chat"
                          title="Selecciona un chat"
                          description="Elige una conversación de la lista para comenzar a chatear"
                        />
                      </div>
                    )}
              </div>
            ) : activePage === "files" ? (
              <FilesPage />
            ) : activePage === "calendar" ? (
              <CalendarPage />
            ) : activePage === "subjects" ? (
              <SubjectsPage />
            ) : activePage === "teams" ? (
              <TeamsPage />
            ) : activePage === "settings" ? (
              <SettingsPage />
            ) : activePage === "stats" ? ( // Added stats page route
              <StatsPage />
            ) : null}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav activePage={activePage} onPageChange={setActivePage} unreadCounts={unreadCounts} />}

      {/* Accessibility Menu Modal */}
      <AccessibilityMenu isOpen={showAccessibility} onClose={() => setShowAccessibility(false)} />

      {showSearch && isMobile && (
        <div className="fixed inset-0 z-50 bg-background animate-in fade-in duration-200">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 p-4 border-b border-border">
              <div className="flex-1">
                <GlobalSearch onNavigate={handleSearchNavigate} onClose={() => setShowSearch(false)} />
              </div>
              <button onClick={() => setShowSearch(false)} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-4">
              <p className="text-sm text-muted-foreground text-center">
                Escribe para buscar chats, materias, equipos o archivos
              </p>
            </div>
          </div>
        </div>
      )}

      {showNotifications && isMobile && (
        <div
          className="fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-200"
          onClick={() => setShowNotifications(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[80vh] animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <NotificationCenter onClose={() => setShowNotifications(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
