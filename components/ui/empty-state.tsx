"use client"
import { MessageSquare, Users, FileText, Calendar, BookOpen, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  type: "chat" | "teams" | "files" | "calendar" | "subjects" | "search"
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ type, title, description, action }: EmptyStateProps) {
  const getIllustration = () => {
    const baseClass = "w-16 h-16 text-muted-foreground/50"
    switch (type) {
      case "chat":
        return (
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className={baseClass} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-lg">💬</span>
            </div>
          </div>
        )
      case "teams":
        return (
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className={baseClass} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-lg">🤝</span>
            </div>
          </div>
        )
      case "files":
        return (
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className={baseClass} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-lg">📁</span>
            </div>
          </div>
        )
      case "calendar":
        return (
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className={baseClass} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-lg">📅</span>
            </div>
          </div>
        )
      case "subjects":
        return (
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className={baseClass} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-lg">📚</span>
            </div>
          </div>
        )
      case "search":
        return (
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className={baseClass} />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center animate-in fade-in duration-500">
      {getIllustration()}
      <h3 className="text-lg font-semibold text-foreground mt-6">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  )
}
