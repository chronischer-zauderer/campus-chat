"use client"

import { useState, useEffect } from "react"
import { Bell, X, MessageSquare, Calendar, FileText, Users, CheckCircle, Info, Trash2 } from "lucide-react"
import { useApp } from "@/contexts/app-context"

interface Notification {
  id: string
  type: "message" | "deadline" | "submission" | "team" | "system"
  title: string
  description: string
  time: string
  read: boolean
  priority?: "high" | "medium" | "low"
}

interface NotificationCenterProps {
  onClose?: () => void
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const { currentUser } = useApp()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<"all" | "unread">("all")

  useEffect(() => {
    // Simular notificaciones basadas en el rol
    const baseNotifications: Notification[] = [
      {
        id: "1",
        type: "message",
        title: "Nuevo mensaje",
        description: "Tienes 3 mensajes sin leer en Estructuras de Datos",
        time: "Hace 5 min",
        read: false,
        priority: "medium",
      },
      {
        id: "2",
        type: "deadline",
        title: "Fecha límite próxima",
        description: "Taller 3 - Algoritmos vence mañana",
        time: "Hace 1 hora",
        read: false,
        priority: "high",
      },
      {
        id: "3",
        type: "team",
        title: "Nuevo miembro",
        description: "Juan Pérez se unió al equipo Proyecto Final",
        time: "Hace 2 horas",
        read: true,
      },
      {
        id: "4",
        type: "system",
        title: "Actualización del sistema",
        description: "CampusChat se actualizó con nuevas funciones",
        time: "Hace 1 día",
        read: true,
      },
    ]

    if (currentUser?.role === "professor") {
      baseNotifications.unshift({
        id: "0",
        type: "submission",
        title: "Nueva entrega",
        description: "María García entregó el Parcial 1",
        time: "Hace 2 min",
        read: false,
        priority: "high",
      })
    }

    setNotifications(baseNotifications)
  }, [currentUser])

  const unreadCount = notifications.filter((n) => !n.read).length
  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.read) : notifications

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-4 h-4" />
      case "deadline":
        return <Calendar className="w-4 h-4" />
      case "submission":
        return <FileText className="w-4 h-4" />
      case "team":
        return <Users className="w-4 h-4" />
      case "system":
        return <Info className="w-4 h-4" />
    }
  }

  const getIconColor = (type: Notification["type"], priority?: string) => {
    if (priority === "high") return "bg-red-500 text-white"
    switch (type) {
      case "message":
        return "bg-blue-500 text-white"
      case "deadline":
        return "bg-amber-500 text-white"
      case "submission":
        return "bg-emerald-500 text-white"
      case "team":
        return "bg-violet-500 text-white"
      case "system":
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="w-full max-w-sm bg-card border border-border rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Notificaciones</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {onClose && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              filter === "unread"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Sin leer
          </button>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="ml-auto text-xs text-primary hover:text-primary/80 font-medium">
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No hay notificaciones</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${
                !notification.read ? "bg-primary/5" : ""
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type, notification.priority)}`}
                >
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"} text-foreground`}>
                      {notification.title}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                      className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
                {!notification.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
