"use client"

import { useState } from "react"
import { useApp } from "@/contexts/app-context"
import { getSubjectsForUser, getCalendarEventsForUser } from "@/lib/demo-data"
import {
  BarChart3,
  Users,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  ClipboardList,
  Plus,
  X,
  GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast-provider"

export default function StatsPage() {
  const { currentUser } = useApp()
  const { showToast } = useToast()
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const [showCreateExamModal, setShowCreateExamModal] = useState(false)
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false)
  const [showAlertsModal, setShowAlertsModal] = useState(false)

  const subjects = currentUser ? getSubjectsForUser(currentUser.id, currentUser.role) : []
  const events = currentUser ? getCalendarEventsForUser(currentUser.id, currentUser.role) : []

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: "",
    subject: "",
    dueDate: "",
    description: "",
  })

  // Exam form state
  const [examForm, setExamForm] = useState({
    title: "",
    subject: "",
    date: "",
    duration: "60",
  })

  // Calculate stats
  const totalStudents = subjects.reduce((acc, s) => acc + (s.students || 0), 0)
  const totalMaterials = subjects.reduce((acc, s) => acc + (s.materials || 0), 0)
  const pendingTasks = events.filter((e) => e.type === "task" && new Date(e.dueDate) >= new Date()).length
  const upcomingExams = events.filter((e) => e.type === "exam" && new Date(e.dueDate) >= new Date()).length

  // Simulated submissions
  const submissions = [
    {
      id: 1,
      student: "María García",
      task: "Informe de Laboratorio",
      subject: "Estructuras de Datos",
      date: "2024-01-15",
      status: "pending",
    },
    {
      id: 2,
      student: "Juan López",
      task: "Proyecto Final",
      subject: "Ingeniería de Software",
      date: "2024-01-14",
      status: "pending",
    },
    {
      id: 3,
      student: "Ana Martínez",
      task: "Práctica 3",
      subject: "Estructuras de Datos",
      date: "2024-01-13",
      status: "reviewed",
    },
    {
      id: 4,
      student: "Carlos Ruiz",
      task: "Tarea 5",
      subject: "Bases de Datos",
      date: "2024-01-12",
      status: "pending",
    },
    {
      id: 5,
      student: "Laura Sánchez",
      task: "Ensayo",
      subject: "Ingeniería de Software",
      date: "2024-01-11",
      status: "reviewed",
    },
  ]

  // Simulated alerts
  const alerts = [
    {
      id: 1,
      type: "warning",
      message: "5 estudiantes no han entregado la Tarea 3",
      subject: "Estructuras de Datos",
      date: "Hace 2 horas",
    },
    { id: 2, type: "info", message: "Parcial programado para mañana", subject: "Bases de Datos", date: "Hace 5 horas" },
    {
      id: 3,
      type: "error",
      message: "Fecha límite de calificaciones próxima",
      subject: "Ingeniería de Software",
      date: "Hace 1 día",
    },
    {
      id: 4,
      type: "success",
      message: "Todas las entregas revisadas",
      subject: "Estructuras de Datos",
      date: "Hace 2 días",
    },
  ]

  const handleCreateTask = () => {
    if (!taskForm.title || !taskForm.subject || !taskForm.dueDate) {
      showToast("Por favor completa todos los campos requeridos", "error")
      return
    }
    showToast(`Tarea "${taskForm.title}" creada exitosamente`, "success")
    setTaskForm({ title: "", subject: "", dueDate: "", description: "" })
    setShowCreateTaskModal(false)
  }

  const handleCreateExam = () => {
    if (!examForm.title || !examForm.subject || !examForm.date) {
      showToast("Por favor completa todos los campos requeridos", "error")
      return
    }
    showToast(`Parcial "${examForm.title}" programado exitosamente`, "success")
    setExamForm({ title: "", subject: "", date: "", duration: "60" })
    setShowCreateExamModal(false)
  }

  const handleReviewSubmission = (submissionId: number) => {
    showToast("Entrega marcada como revisada", "success")
  }

  const handleDismissAlert = (alertId: number) => {
    showToast("Alerta descartada", "success")
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b border-border bg-card/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Estadísticas</h1>
            <p className="text-sm text-muted-foreground">Panel de control para profesores</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{subjects.length}</p>
                  <p className="text-xs text-muted-foreground">Materias</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
                  <p className="text-xs text-muted-foreground">Estudiantes</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pendingTasks}</p>
                  <p className="text-xs text-muted-foreground">Tareas Activas</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalMaterials}</p>
                  <p className="text-xs text-muted-foreground">Materiales</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                onClick={() => setShowCreateTaskModal(true)}
                className="h-auto py-4 flex flex-col items-center gap-2"
                variant="outline"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm">Crear Tarea</span>
              </Button>
              <Button
                onClick={() => setShowCreateExamModal(true)}
                className="h-auto py-4 flex flex-col items-center gap-2"
                variant="outline"
              >
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Programar Parcial</span>
              </Button>
              <Button
                onClick={() => setShowSubmissionsModal(true)}
                className="h-auto py-4 flex flex-col items-center gap-2 relative"
                variant="outline"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">Ver Entregas</span>
                {submissions.filter((s) => s.status === "pending").length > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {submissions.filter((s) => s.status === "pending").length}
                  </span>
                )}
              </Button>
              <Button
                onClick={() => setShowAlertsModal(true)}
                className="h-auto py-4 flex flex-col items-center gap-2 relative"
                variant="outline"
              >
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm">Alertas</span>
                {alerts.filter((a) => a.type === "error" || a.type === "warning").length > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                    {alerts.filter((a) => a.type === "error" || a.type === "warning").length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Subjects Overview */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Resumen de Materias</h2>
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{subject.name}</p>
                      <p className="text-sm text-muted-foreground">{subject.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{subject.students || 0}</p>
                      <p className="text-xs text-muted-foreground">Estudiantes</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{subject.materials || 0}</p>
                      <p className="text-xs text-muted-foreground">Materiales</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Actividad Reciente</h2>
            </div>
            <div className="space-y-3">
              {submissions.slice(0, 5).map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${submission.status === "pending" ? "bg-amber-500" : "bg-green-500"}`}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{submission.student}</p>
                      <p className="text-xs text-muted-foreground">
                        {submission.task} - {submission.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{submission.date}</span>
                    {submission.status === "pending" ? (
                      <Clock className="w-4 h-4 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Crear Nueva Tarea</h3>
              <button
                onClick={() => setShowCreateTaskModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Título *</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ej: Tarea 1 - Algoritmos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Materia *</label>
                <select
                  value={taskForm.subject}
                  onChange={(e) => setTaskForm({ ...taskForm, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Seleccionar materia</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Fecha límite *</label>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Descripción</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                  placeholder="Instrucciones de la tarea..."
                />
              </div>
            </div>
            <div className="flex gap-2 p-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowCreateTaskModal(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleCreateTask} className="flex-1">
                Crear Tarea
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Exam Modal */}
      {showCreateExamModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Programar Parcial</h3>
              <button
                onClick={() => setShowCreateExamModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nombre del Parcial *</label>
                <input
                  type="text"
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ej: Primer Parcial"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Materia *</label>
                <select
                  value={examForm.subject}
                  onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Seleccionar materia</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Fecha y Hora *</label>
                <input
                  type="datetime-local"
                  value={examForm.date}
                  onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Duración (minutos)</label>
                <select
                  value={examForm.duration}
                  onChange={(e) => setExamForm({ ...examForm, duration: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="30">30 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="90">1 hora 30 min</option>
                  <option value="120">2 horas</option>
                  <option value="180">3 horas</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 p-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowCreateExamModal(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleCreateExam} className="flex-1">
                Programar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {showSubmissionsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
              <h3 className="font-semibold text-foreground">Entregas Pendientes</h3>
              <button
                onClick={() => setShowSubmissionsModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {submissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${submission.status === "pending" ? "bg-amber-500" : "bg-green-500"}`}
                    />
                    <div>
                      <p className="font-medium text-foreground text-sm">{submission.student}</p>
                      <p className="text-xs text-muted-foreground">{submission.task}</p>
                      <p className="text-xs text-muted-foreground">
                        {submission.subject} • {submission.date}
                      </p>
                    </div>
                  </div>
                  {submission.status === "pending" ? (
                    <Button size="sm" onClick={() => handleReviewSubmission(submission.id)}>
                      Revisar
                    </Button>
                  ) : (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Revisado
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alerts Modal */}
      {showAlertsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
              <h3 className="font-semibold text-foreground">Alertas</h3>
              <button onClick={() => setShowAlertsModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    alert.type === "error"
                      ? "bg-red-500/10"
                      : alert.type === "warning"
                        ? "bg-amber-500/10"
                        : alert.type === "success"
                          ? "bg-green-500/10"
                          : "bg-blue-500/10"
                  }`}
                >
                  <div
                    className={`mt-0.5 ${
                      alert.type === "error"
                        ? "text-red-500"
                        : alert.type === "warning"
                          ? "text-amber-500"
                          : alert.type === "success"
                            ? "text-green-500"
                            : "text-blue-500"
                    }`}
                  >
                    {alert.type === "error" ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : alert.type === "warning" ? (
                      <Clock className="w-5 h-5" />
                    ) : alert.type === "success" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Calendar className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.subject} • {alert.date}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
