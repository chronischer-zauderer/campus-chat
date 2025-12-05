"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, X, Users, BookOpen, MoreVertical, Pin, BellOff, Trash2, Archive } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { getChatsForUser, type Chat } from "@/lib/demo-data"
import { OnlineIndicator } from "@/components/ui/online-indicator"
import { EmptyState } from "@/components/ui/empty-state"

interface ChatListPanelProps {
  selectedChatId: number
  onSelectChat: (id: number) => void
  onCreateGroup?: () => void
  fullWidth?: boolean
}

export default function ChatListPanel({
  selectedChatId,
  onSelectChat,
  onCreateGroup,
  fullWidth = false,
}: ChatListPanelProps) {
  const { currentUser } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [chats, setChats] = useState<Chat[]>([])
  const [activeFilter, setActiveFilter] = useState<"Todos" | "Materias" | "Equipos">("Todos")
  const [showChatMenu, setShowChatMenu] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        const userChats = getChatsForUser(currentUser.id)
        setChats(userChats)
        setIsLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [currentUser])

  if (!currentUser) return null

  const filteredChats = chats
    .filter((chat) => {
      const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = activeFilter === "Todos" || chat.type === activeFilter
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return 0
    })

  const togglePinChat = (id: number) => {
    setChats(chats.map((chat) => (chat.id === id ? { ...chat, isPinned: !chat.isPinned } : chat)))
    setShowChatMenu(null)
  }

  const toggleMuteChat = (id: number) => {
    setChats(chats.map((chat) => (chat.id === id ? { ...chat, isMuted: !chat.isMuted } : chat)))
    setShowChatMenu(null)
  }

  const archiveChat = (id: number) => {
    setChats(chats.filter((chat) => chat.id !== id))
    setShowChatMenu(null)
  }

  const markAsRead = (id: number) => {
    setChats(chats.map((chat) => (chat.id === id ? { ...chat, unread: 0 } : chat)))
  }

  if (isLoading) {
    return (
      <div
        className={`${fullWidth ? "w-full" : "w-full sm:w-80 lg:w-96"} bg-card border-r border-border flex flex-col`}
      >
        <div className="p-4 border-b border-border space-y-4">
          <div className="h-7 bg-muted rounded w-32 animate-pulse" />
          <div className="h-10 bg-muted rounded-lg animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-8 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-2 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`${fullWidth ? "w-full" : "w-full sm:w-80 lg:w-96"} bg-card border-r border-border flex flex-col`}>
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-border space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Mensajes</h2>
          <Button
            size="icon"
            className="h-9 w-9 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-transform hover:scale-105 active:scale-95"
            onClick={onCreateGroup}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-muted border-0 rounded-lg h-10 transition-all focus:ring-2 focus:ring-primary/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-muted-foreground/20 rounded p-0.5 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        <div className="flex gap-1.5 sm:gap-2">
          {(["Todos", "Materias", "Equipos"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1 sm:gap-1.5 ${
                activeFilter === filter
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {filter === "Materias" && <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              {filter === "Equipos" && <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              <span className="hidden xs:inline sm:inline">{filter}</span>
              <span className="xs:hidden sm:hidden">{filter.substring(0, 3)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          <div className="space-y-1 p-2">
            {filteredChats.map((chat, index) => (
              <div
                key={chat.id}
                className="relative group animate-in fade-in slide-in-from-left-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => {
                    onSelectChat(chat.id)
                    markAsRead(chat.id)
                  }}
                  className={`w-full p-2.5 sm:p-3 rounded-lg transition-all duration-200 text-left ${
                    selectedChatId === chat.id ? "bg-primary/10 shadow-sm" : "hover:bg-muted hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    {/* Avatar with online indicator */}
                    <div className="relative">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                        <span className="text-xs sm:text-sm font-bold text-primary-foreground">{chat.avatar}</span>
                      </div>
                      {chat.isPinned && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                          <Pin className="w-2.5 h-2.5 text-accent-foreground" />
                        </div>
                      )}
                      <OnlineIndicator isOnline={Math.random() > 0.3} size="sm" />
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0 pr-6 sm:pr-8">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate text-sm flex items-center gap-1 flex-1">
                          {chat.name}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-1">{chat.lastMessage}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span
                            className={`text-xs px-1 sm:px-1.5 py-0.5 rounded ${
                              chat.type === "Materias" ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"
                            }`}
                          >
                            {chat.type}
                          </span>
                          {chat.unread > 0 && (
                            <span className="text-xs font-bold bg-accent text-accent-foreground px-1.5 sm:px-2 py-0.5 rounded-full animate-in zoom-in duration-200">
                              {chat.unread}
                            </span>
                          )}
                          {chat.isMuted && <BellOff className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Menu button */}
                <div
                  className={`absolute right-2 top-2.5 sm:top-3 transition-opacity ${
                    showChatMenu === chat.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowChatMenu(showChatMenu === chat.id ? null : chat.id)
                    }}
                    className={`p-1.5 rounded-lg hover:bg-muted transition-colors ${showChatMenu === chat.id ? "bg-muted" : ""}`}
                  >
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {showChatMenu === chat.id && (
                  <div className="absolute right-2 top-10 sm:top-12 w-40 sm:w-44 bg-card border border-border rounded-lg shadow-lg z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={() => togglePinChat(chat.id)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground transition-colors"
                    >
                      <Pin className="w-4 h-4" />
                      {chat.isPinned ? "Desfijar" : "Fijar arriba"}
                    </button>
                    <button
                      onClick={() => toggleMuteChat(chat.id)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground transition-colors"
                    >
                      <BellOff className="w-4 h-4" />
                      {chat.isMuted ? "Activar notificaciones" : "Silenciar"}
                    </button>
                    <button
                      onClick={() => archiveChat(chat.id)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground transition-colors"
                    >
                      <Archive className="w-4 h-4" />
                      Archivar
                    </button>
                    <div className="border-t border-border my-1" />
                    <button
                      onClick={() => archiveChat(chat.id)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <EmptyState
            type="search"
            title="Sin resultados"
            description={`No se encontraron chats para "${searchQuery}"`}
            action={{
              label: "Limpiar búsqueda",
              onClick: () => setSearchQuery(""),
            }}
          />
        ) : (
          <EmptyState
            type="chat"
            title="No hay chats"
            description="Comienza una conversación creando un nuevo grupo"
            action={
              onCreateGroup
                ? {
                    label: "Crear grupo",
                    onClick: onCreateGroup,
                  }
                : undefined
            }
          />
        )}
      </div>

      {/* Click outside to close menu */}
      {showChatMenu && <div className="fixed inset-0 z-40" onClick={() => setShowChatMenu(null)} />}
    </div>
  )
}
