"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  Clock,
  AlertCircle,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  MoreVertical,
  GraduationCap,
  User,
} from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { getCalendarEventsForUser, getSubjectsForUser } from "@/lib/demo-data"

interface Deadline {
  id: string
  title: string
  subject: string
  dueDate: string
  dueTime: string
  priority: "high" | "medium" | "low"
  chatName: string
  color: string
  description?: string
  creatorId: string
}

export default function CalendarPage() {
  const { currentUser } = useApp()
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState<Deadline | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showDeadlineMenu, setShowDeadlineMenu] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    dueDate: "",
    dueTime: "",
    priority: "medium" as "high" | "medium" | "low",
    chatName: "",
    description: "",
  })

  useEffect(() => {
    if (currentUser) {
      const events = getCalendarEventsForUser(currentUser.id, currentUser.role)
      const subjects = getSubjectsForUser(currentUser.id, currentUser.role)

      const mappedDeadlines: Deadline[] = events.map((e) => {
        const subject = subjects.find((s) => s.id === e.subjectId)
        return {
          id: e.id,
          title: e.title,
          subject: subject?.code || "General",
          dueDate: e.date,
          dueTime: e.type === "exam" ? "10:00 AM" : e.type === "meeting" ? "4:00 PM" : "11:59 PM",
          priority: e.priority,
          chatName: subject?.name || "Sin materia",
          color: getPriorityColor(e.priority),
          creatorId: e.creatorId,
        }
      })
      setDeadlines(mappedDeadlines.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()))
    }
  }, [currentUser])

  if (!currentUser) return null

  const isProf = currentUser.role === "professor"

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-600 dark:text-red-400">
            Alta Prioridad
          </span>
        )
      case "medium":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
            Media
          </span>
        )
      case "low":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-600 dark:text-blue-400">
            Baja
          </span>
        )
    }
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-950"
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-950"
      case "low":
        return "bg-blue-100 dark:bg-blue-950"
      default:
        return "bg-muted"
    }
  }

  const canEditDeadline = (deadline: Deadline) => {
    if (isProf) return true
    return deadline.creatorId === currentUser.id
  }

  const handleAddDeadline = () => {
    const newDeadline: Deadline = {
      id: `ev-${Date.now()}`,
      title: formData.title,
      subject: formData.subject,
      dueDate: formData.dueDate,
      dueTime: formData.dueTime,
      priority: formData.priority,
      chatName: formData.chatName || "Sin grupo",
      color: getPriorityColor(formData.priority),
      description: formData.description,
      creatorId: currentUser.id,
    }
    setDeadlines(
      [...deadlines, newDeadline].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    )
    setFormData({ title: "", subject: "", dueDate: "", dueTime: "", priority: "medium", chatName: "", description: "" })
    setShowAddModal(false)
  }

  const handleEditDeadline = () => {
    if (showEditModal) {
      setDeadlines(
        deadlines.map((d) =>
          d.id === showEditModal.id
            ? {
                ...d,
                title: formData.title,
                subject: formData.subject,
                dueDate: formData.dueDate,
                dueTime: formData.dueTime,
                priority: formData.priority,
                chatName: formData.chatName,
                description: formData.description,
                color: getPriorityColor(formData.priority),
              }
            : d,
        ),
      )
      setShowEditModal(null)
      setFormData({
        title: "",
        subject: "",
        dueDate: "",
        dueTime: "",
        priority: "medium",
        chatName: "",
        description: "",
      })
    }
  }

  const handleDeleteDeadline = (id: string) => {
    setDeadlines(deadlines.filter((d) => d.id !== id))
    setShowDeleteConfirm(null)
  }

  const openEditModal = (deadline: Deadline) => {
    setFormData({
      title: deadline.title,
      subject: deadline.subject,
      dueDate: deadline.dueDate,
      dueTime: deadline.dueTime,
      priority: deadline.priority,
      chatName: deadline.chatName,
      description: deadline.description || "",
    })
    setShowEditModal(deadline)
    setShowDeadlineMenu(null)
  }

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days = []
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const getDeadlinesForDay = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return deadlines.filter((d) => d.dueDate === dateStr)
  }

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="h-20 bg-card border-b border-border px-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fechas y Calendario</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            {isProf ? (
              <>
                <GraduationCap className="w-3.5 h-3.5" />
                Fechas de tus materias
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                Fechas de tus cursos inscritos
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
            className="rounded-lg"
          >
            Lista
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            onClick={() => setViewMode("calendar")}
            className="rounded-lg"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Calendario
          </Button>
          <Button className="bg-primary text-primary-foreground rounded-lg ml-2" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Fecha
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {viewMode === "list" ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-muted-foreground">Tienes {deadlines.length} fechas límite próximas</p>
            </div>

            {deadlines.map((deadline) => (
              <div
                key={deadline.id}
                className={`p-5 rounded-xl border border-border ${deadline.color} hover:shadow-md transition-shadow relative group`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <h3 className="text-lg font-bold text-foreground">{deadline.title}</h3>
                      {getPriorityBadge(deadline.priority)}
                      {deadline.creatorId === currentUser.id && (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                          Creada por ti
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">{deadline.subject}</span> • {deadline.chatName}
                    </p>

                    {deadline.description && (
                      <p className="text-sm text-muted-foreground mb-3">{deadline.description}</p>
                    )}

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(deadline.dueDate).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {deadline.dueTime}
                      </div>
                    </div>
                  </div>

                  {canEditDeadline(deadline) && (
                    <div className="flex gap-2">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setShowDeadlineMenu(showDeadlineMenu === deadline.id ? null : deadline.id)}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                        {showDeadlineMenu === deadline.id && (
                          <div className="absolute right-0 top-full mt-1 w-36 bg-card border border-border rounded-lg shadow-lg z-50 py-1">
                            <button
                              onClick={() => openEditModal(deadline)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground"
                            >
                              <Edit className="w-4 h-4" /> Editar
                            </button>
                            <button
                              onClick={() => {
                                setShowDeleteConfirm(deadline.id)
                                setShowDeadlineMenu(null)
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-destructive"
                            >
                              <Trash2 className="w-4 h-4" /> Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {deadlines.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Calendar className="w-12 h-12 mb-4 opacity-50" />
                <p>No hay fechas límite programadas</p>
                <Button className="mt-4" onClick={() => setShowAddModal(true)}>
                  Agregar primera fecha
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Calendar View */
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-bold text-foreground">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {generateCalendarDays().map((day, index) => {
                const dayDeadlines = day ? getDeadlinesForDay(day) : []
                const isToday =
                  day &&
                  new Date().getDate() === day &&
                  new Date().getMonth() === currentMonth.getMonth() &&
                  new Date().getFullYear() === currentMonth.getFullYear()

                return (
                  <div
                    key={index}
                    className={`min-h-24 p-2 rounded-lg border transition-colors ${
                      day
                        ? isToday
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted/50"
                        : "border-transparent"
                    }`}
                  >
                    {day && (
                      <>
                        <span className={`text-sm font-medium ${isToday ? "text-primary" : "text-foreground"}`}>
                          {day}
                        </span>
                        <div className="mt-1 space-y-1">
                          {dayDeadlines.slice(0, 2).map((d) => (
                            <div
                              key={d.id}
                              className={`text-xs p-1 rounded truncate ${
                                d.priority === "high"
                                  ? "bg-red-500/20 text-red-600 dark:text-red-400"
                                  : d.priority === "medium"
                                    ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                                    : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                              }`}
                            >
                              {d.title}
                            </div>
                          ))}
                          {dayDeadlines.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{dayDeadlines.length - 2} más</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                {showEditModal ? "Editar Fecha" : "Nueva Fecha Límite"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowAddModal(false)
                  setShowEditModal(null)
                  setFormData({
                    title: "",
                    subject: "",
                    dueDate: "",
                    dueTime: "",
                    priority: "medium",
                    chatName: "",
                    description: "",
                  })
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Título *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Entrega de tarea final"
                  className="bg-input border-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Materia *</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Ej: CS201"
                    className="bg-input border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Grupo</label>
                  <Input
                    value={formData.chatName}
                    onChange={(e) => setFormData({ ...formData, chatName: e.target.value })}
                    placeholder="Opcional"
                    className="bg-input border-border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Fecha *</label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Hora</label>
                  <Input
                    value={formData.dueTime}
                    onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                    placeholder="Ej: 11:59 PM"
                    className="bg-input border-border"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Prioridad</label>
                <div className="flex gap-2">
                  {(["high", "medium", "low"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setFormData({ ...formData, priority: p })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.priority === p
                          ? p === "high"
                            ? "bg-red-500 text-white"
                            : p === "medium"
                              ? "bg-yellow-500 text-white"
                              : "bg-blue-500 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p === "high" ? "Alta" : p === "medium" ? "Media" : "Baja"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Descripción</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles adicionales..."
                  className="bg-input border-border"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setShowAddModal(false)
                    setShowEditModal(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground"
                  onClick={showEditModal ? handleEditDeadline : handleAddDeadline}
                  disabled={!formData.title || !formData.subject || !formData.dueDate}
                >
                  {showEditModal ? "Guardar Cambios" : "Crear Fecha"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-sm p-6 shadow-xl">
            <h2 className="text-xl font-bold text-foreground mb-2">¿Eliminar fecha?</h2>
            <p className="text-muted-foreground mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowDeleteConfirm(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" className="flex-1" onClick={() => handleDeleteDeadline(showDeleteConfirm)}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDeadlineMenu && <div className="fixed inset-0 z-40" onClick={() => setShowDeadlineMenu(null)} />}
    </div>
  )
}
