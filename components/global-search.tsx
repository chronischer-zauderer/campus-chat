"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, MessageSquare, BookOpen, Users, Calendar, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useApp } from "@/contexts/app-context"
import { getChatsForUser, getSubjectsForUser, getTeamsForUser, getCalendarEventsForUser } from "@/lib/demo-data"

interface SearchResult {
  id: string
  type: "chat" | "subject" | "team" | "event" | "file"
  title: string
  subtitle: string
  icon: React.ReactNode
}

interface GlobalSearchProps {
  onNavigate: (page: string, itemId?: number | string) => void
  onClose?: () => void
}

export function GlobalSearch({ onNavigate, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { currentUser } = useApp()

  useEffect(() => {
    if (!query.trim() || !currentUser) {
      setResults([])
      return
    }

    const searchTerm = query.toLowerCase()
    const allResults: SearchResult[] = []

    // Buscar en chats
    const chats = getChatsForUser(currentUser.id)
    chats.forEach((chat) => {
      if (chat.name.toLowerCase().includes(searchTerm)) {
        allResults.push({
          id: `chat-${chat.id}`,
          type: "chat",
          title: chat.name,
          subtitle: chat.lastMessage,
          icon: <MessageSquare className="w-4 h-4" />,
        })
      }
    })

    // Buscar en materias
    const subjects = getSubjectsForUser(currentUser.id, currentUser.role)
    subjects.forEach((subject) => {
      if (subject.name.toLowerCase().includes(searchTerm) || subject.code.toLowerCase().includes(searchTerm)) {
        allResults.push({
          id: `subject-${subject.id}`,
          type: "subject",
          title: subject.name,
          subtitle: subject.code,
          icon: <BookOpen className="w-4 h-4" />,
        })
      }
    })

    // Buscar en equipos
    const teams = getTeamsForUser(currentUser.id)
    teams.forEach((team) => {
      if (team.name.toLowerCase().includes(searchTerm)) {
        allResults.push({
          id: `team-${team.id}`,
          type: "team",
          title: team.name,
          subtitle: `${team.members.length} miembros`,
          icon: <Users className="w-4 h-4" />,
        })
      }
    })

    // Buscar en eventos del calendario
    const events = getCalendarEventsForUser(currentUser.id, currentUser.role)
    events.forEach((event) => {
      if (event.title.toLowerCase().includes(searchTerm) || event.subject.toLowerCase().includes(searchTerm)) {
        allResults.push({
          id: `event-${event.id}`,
          type: "event",
          title: event.title,
          subtitle: event.subject,
          icon: <Calendar className="w-4 h-4" />,
        })
      }
    })

    setResults(allResults.slice(0, 8))
    setSelectedIndex(0)
  }, [query, currentUser])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === "Enter" && results[selectedIndex]) {
      handleSelect(results[selectedIndex])
    } else if (e.key === "Escape") {
      setIsOpen(false)
      onClose?.()
    }
  }

  const handleSelect = (result: SearchResult) => {
    const pageMap: Record<string, string> = {
      chat: "chats",
      subject: "subjects",
      team: "teams",
      event: "calendar",
      file: "files",
    }
    onNavigate(pageMap[result.type], result.id)
    setQuery("")
    setIsOpen(false)
    onClose?.()
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      chat: "Chat",
      subject: "Materia",
      team: "Equipo",
      event: "Evento",
      file: "Archivo",
    }
    return labels[type] || type
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar chats, materias, equipos, archivos..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-9 bg-muted/50 border-border focus:bg-background"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("")
              setResults([])
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Resultados */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-border">
            <span className="text-xs text-muted-foreground">{results.length} resultados encontrados</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                  index === selectedIndex ? "bg-primary/10" : "hover:bg-muted/50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    index === selectedIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {result.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{result.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                </div>
                <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                  {getTypeLabel(result.type)}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-6 text-center z-50">
          <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No se encontraron resultados para "{query}"</p>
        </div>
      )}
    </div>
  )
}
