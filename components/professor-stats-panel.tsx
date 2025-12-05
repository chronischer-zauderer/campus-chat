"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Users,
  BookOpen,
  FileText,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  X,
  Plus,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/contexts/app-context"
import { getSubjectsForUser, getCalendarEventsForUser, getTeamsForUser } from "@/lib/demo-data"

interface StatCard {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: React.ReactNode
  color: string
}

interface ProfessorStatsPanelProps {
  onNavigate?: (page: string) => void
}

export function ProfessorStatsPanel({ onNavigate }: ProfessorStatsPanelProps) {
  const { currentUser } = useApp()
  const [stats, setStats] = useState<StatCard[]>([])
  const [recentActivity, setRecentActivity] = useState<{ id: number; text: string; time: string; type: string }[]>([])

  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const [showScheduleExamModal, setShowScheduleExamModal] = useState(false)
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false)
  const [showAlertsModal, setShowAlertsModal] = useState(false)

  // Form states
  const [taskForm, setTaskForm] = useState({ title: "", subject: "", dueDate: "", description: "" })
  const [examForm, setExamForm] = useState({ title: "", subject: "", date: "", duration: "" })

  useEffect(() => {
    if (!currentUser || currentUser.role !== "professor") return

    const subjects = getSubjectsForUser(currentUser.id, currentUser.role)
    const events = getCalendarEventsForUser(currentUser.id, currentUser.role)
    const teams = getTeamsForUser(currentUser.id)

    const totalStudents = subjects.reduce((acc, s) => acc + s.students, 0)
    const pendingTasks = events.filter((e) => new Date(e.dueDate) > new Date()).length
    const completedTasks = events.length - pendingTasks

    setStats([
      {
        title: "Estudiantes Totales",
        value: totalStudents,
        change: "+12 este mes",
        changeType: "positive",
        icon: <Users className="w-5 h-5" />,
        color: "bg-blue-500",
      },
      {
        title: "Materias Activas",
        value: subjects.length,
        icon: <BookOpen className="w-5 h-5" />,
        color: "bg-emerald-500",
      },
      {
        title: "Tareas Pendientes",
        value: pendingTasks,
        change: "3 para esta semana",
        changeType: "neutral",
        icon: <Clock className="w-5 h-5" />,
        color: "bg-amber-500",
      },
      {
        title: "Entregas Revisadas",
        value: completedTasks,
        change: "+8 esta semana",
        changeType: "positive",
        icon: <CheckCircle className="w-5 h-5" />,
        color: "bg-violet-500",
      },
    ])

    setRecentActivity([
      { id: 1, text: "María García entregó Taller 3", time: "Hace 5 min", type: "submission" },
      { id: 2, text: "Nuevo mensaje en Estructuras de Datos", time: "Hace 15 min", type: "message" },
      { id: 3, text: "Juan Pérez se unió a Algoritmos", time: "Hace 1 hora", type: "join" },
      { id: 4, text: "Recordatorio: Parcial 2 en 3 días", time: "Hace 2 horas", type: "reminder" },
    ])
  }, [currentUser])

  const subjects = currentUser ? getSubjectsForUser(currentUser.id, currentUser.role) : []

  const handleCreateTask = () => {
    // Simular creación de tarea
    setShowCreateTaskModal(false)
    setTaskForm({ title: "", subject: "", dueDate: "", description: "" })
    // En una app real, esto enviaría al backend
  }

  const handleScheduleExam = () => {
    setShowScheduleExamModal(false)
    setExamForm({ title: "", subject: "", date: "", duration: "" })
  }

  // Submissions data
  const submissions = [
    { id: 1, student: "María García", task: "Taller 3 - Algoritmos", date: "Hace 5 min", status: "pending" },
    { id: 2, student: "Carlos López", task: "Parcial 1 - Estructuras", date: "Hace 1 hora", status: "pending" },
    { id: 3, student: "Ana Martínez", task: "Proyecto Final", date: "Hace 2 horas", status: "reviewed" },
    { id: 4, student: "Juan Pérez", task: "Taller 3 - Algoritmos", date: "Hace 3 horas", status: "pending" },
  ]

  // Alerts data
  const alerts = [
    { id: 1, type: "warning", message: "5 estudiantes no han entregado Taller 3", time: "Vence mañana" },
    { id: 2, type: "info", message: "Parcial 2 programado para el viernes", time: "En 3 días" },
    { id: 3, type: "error", message: "2 estudiantes con bajo rendimiento en Algoritmos", time: "Requiere atención" },
  ]

  if (!currentUser || currentUser.role !== "professor") return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Panel de Estadísticas</h2>
          <p className="text-sm text-muted-foreground">Resumen de tu actividad académica</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Semestre 2024-2</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-4 border-border hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              if (stat.title === "Materias Activas") onNavigate?.("subjects")
              else if (stat.title === "Tareas Pendientes") onNavigate?.("calendar")
            }}
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
              {stat.change && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    stat.changeType === "positive"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : stat.changeType === "negative"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stat.change}
                </span>
              )}
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="p-4 border-border">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Actividad Reciente
        </h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  activity.type === "submission"
                    ? "bg-emerald-500"
                    : activity.type === "message"
                      ? "bg-blue-500"
                      : activity.type === "join"
                        ? "bg-violet-500"
                        : "bg-amber-500"
                }`}
              />
              <p className="flex-1 text-sm text-foreground">{activity.text}</p>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions for Professor */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setShowCreateTaskModal(true)}
          className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/50 transition-all group"
        >
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-foreground">Crear Tarea</span>
        </button>
        <button
          onClick={() => setShowScheduleExamModal(true)}
          className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/50 transition-all group"
        >
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-foreground">Programar Parcial</span>
        </button>
        <button
          onClick={() => setShowSubmissionsModal(true)}
          className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/50 transition-all group"
        >
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <CheckCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-foreground">Ver Entregas</span>
        </button>
        <button
          onClick={() => setShowAlertsModal(true)}
          className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/50 transition-all group relative"
        >
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <AlertCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-foreground">Alertas</span>
          <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {alerts.length}
          </span>
        </button>
      </div>

      {/* Create Task Modal */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Crear Nueva Tarea
              </h2>
              <button
                onClick={() => setShowCreateTaskModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Título de la tarea</label>
                <Input
                  placeholder="Ej: Taller 4 - Recursión"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Materia</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={taskForm.subject}
                  onChange={(e) => setTaskForm({ ...taskForm, subject: e.target.value })}
                >
                  <option value="">Seleccionar materia...</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Fecha de entrega</label>
                <Input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Descripción</label>
                <textarea
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                  placeholder="Instrucciones de la tarea..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                />
              </div>
            </div>
            <div className="p-4 border-t border-border flex gap-2">
              <Button variant="outline" onClick={() => setShowCreateTaskModal(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleCreateTask} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Crear Tarea
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Exam Modal */}
      {showScheduleExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                Programar Parcial
              </h2>
              <button
                onClick={() => setShowScheduleExamModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Nombre del parcial</label>
                <Input
                  placeholder="Ej: Parcial 2 - Estructuras de Datos"
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Materia</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={examForm.subject}
                  onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                >
                  <option value="">Seleccionar materia...</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Fecha</label>
                  <Input
                    type="date"
                    value={examForm.date}
                    onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Duración</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={examForm.duration}
                    onChange={(e) => setExamForm({ ...examForm, duration: e.target.value })}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="60">1 hora</option>
                    <option value="90">1.5 horas</option>
                    <option value="120">2 horas</option>
                    <option value="180">3 horas</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border flex gap-2">
              <Button variant="outline" onClick={() => setShowScheduleExamModal(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleScheduleExam} className="flex-1 bg-amber-500 hover:bg-amber-600">
                <Calendar className="w-4 h-4 mr-2" />
                Programar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {showSubmissionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Entregas Recientes
              </h2>
              <button
                onClick={() => setShowSubmissionsModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {submissions.map((sub) => (
                <div key={sub.id} className="p-4 border-b border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{sub.student}</p>
                      <p className="text-sm text-muted-foreground">{sub.task}</p>
                      <p className="text-xs text-muted-foreground mt-1">{sub.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {sub.status === "pending" ? (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs rounded-full">
                          Pendiente
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs rounded-full">
                          Revisado
                        </span>
                      )}
                      <Button size="sm" variant="outline">
                        Revisar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border">
              <Button
                onClick={() => {
                  setShowSubmissionsModal(false)
                  onNavigate?.("files")
                }}
                variant="outline"
                className="w-full"
              >
                Ver todas las entregas
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Modal */}
      {showAlertsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Alertas y Recordatorios
              </h2>
              <button onClick={() => setShowAlertsModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border-b border-border flex items-start gap-3 ${
                    alert.type === "error"
                      ? "bg-red-50 dark:bg-red-950/20"
                      : alert.type === "warning"
                        ? "bg-amber-50 dark:bg-amber-950/20"
                        : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      alert.type === "error" ? "bg-red-500" : alert.type === "warning" ? "bg-amber-500" : "bg-blue-500"
                    } text-white`}
                  >
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Atender
                  </Button>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border">
              <Button onClick={() => setShowAlertsModal(false)} className="w-full">
                Entendido
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
