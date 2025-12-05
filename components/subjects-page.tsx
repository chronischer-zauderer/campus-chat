"use client"

import {
  BookOpen,
  Plus,
  Clock,
  Users,
  FileText,
  GraduationCap,
  User,
  X,
  MoreVertical,
  Edit,
  Trash2,
  Settings,
  Copy,
  Check,
  RefreshCw,
  KeyRound,
  LogIn,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useApp } from "@/contexts/app-context"
import { getSubjectsForUser, generateAccessCode, findSubjectByAccessCode, type Subject } from "@/lib/demo-data"

export default function SubjectsPage() {
  const { currentUser } = useApp()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState<Subject | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Subject | null>(null)
  const [showAccessCodeModal, setShowAccessCodeModal] = useState<Subject | null>(null)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)

  // Form states
  const [subjectName, setSubjectName] = useState("")
  const [subjectCode, setSubjectCode] = useState("")
  const [subjectSchedule, setSubjectSchedule] = useState("")
  const [joinCode, setJoinCode] = useState("")
  const [joinError, setJoinError] = useState("")
  const [joinSuccess, setJoinSuccess] = useState<Subject | null>(null)

  // Local subjects for demo
  const [localSubjects, setLocalSubjects] = useState<Subject[]>([])
  const [joinedSubjectIds, setJoinedSubjectIds] = useState<string[]>([])

  if (!currentUser) return null

  const baseSubjects = getSubjectsForUser(currentUser.id, currentUser.role)
  // Include joined subjects for students
  const joinedSubjects = localSubjects.filter((s) => joinedSubjectIds.includes(s.id))
  const createdSubjects = localSubjects.filter((s) => s.instructorId === currentUser.id)
  const subjects = [...baseSubjects, ...createdSubjects, ...joinedSubjects]
  const isProf = currentUser.role === "professor"

  const handleCreateSubject = () => {
    if (!subjectName.trim() || !subjectCode.trim()) return

    const newSubject: Subject = {
      id: `subj-new-${Date.now()}`,
      name: subjectName,
      code: subjectCode,
      instructor: currentUser.name,
      instructorId: currentUser.id,
      students: 0,
      schedule: subjectSchedule || "Por definir",
      materials: 0,
      enrolledStudentIds: [],
      accessCode: generateAccessCode(),
    }

    setLocalSubjects((prev) => [newSubject, ...prev])
    setSubjectName("")
    setSubjectCode("")
    setSubjectSchedule("")
    setShowCreateModal(false)
    // Show access code modal after creation
    setShowAccessCodeModal(newSubject)
  }

  const handleDeleteSubject = (subject: Subject) => {
    setLocalSubjects((prev) => prev.filter((s) => s.id !== subject.id))
    setShowDeleteConfirm(null)
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleRegenerateCode = (subject: Subject) => {
    const newCode = generateAccessCode()
    setLocalSubjects((prev) => prev.map((s) => (s.id === subject.id ? { ...s, accessCode: newCode } : s)))
    if (showAccessCodeModal?.id === subject.id) {
      setShowAccessCodeModal({ ...subject, accessCode: newCode })
    }
  }

  const handleJoinSubject = () => {
    if (!joinCode.trim()) {
      setJoinError("Por favor ingresa un código de acceso")
      return
    }

    // Check in local subjects and global subjects
    const foundSubject =
      findSubjectByAccessCode(joinCode) ||
      localSubjects.find((s) => s.accessCode.toUpperCase() === joinCode.toUpperCase())

    if (!foundSubject) {
      setJoinError("Código de acceso inválido. Verifica e intenta de nuevo.")
      return
    }

    // Check if already enrolled
    if (foundSubject.enrolledStudentIds.includes(currentUser.id) || joinedSubjectIds.includes(foundSubject.id)) {
      setJoinError("Ya estás inscrito en esta materia.")
      return
    }

    // Check if it's their own subject
    if (foundSubject.instructorId === currentUser.id) {
      setJoinError("No puedes inscribirte a tu propia materia.")
      return
    }

    // Join the subject
    setJoinedSubjectIds((prev) => [...prev, foundSubject.id])
    if (!localSubjects.find((s) => s.id === foundSubject.id)) {
      setLocalSubjects((prev) => [...prev, { ...foundSubject, students: foundSubject.students + 1 }])
    }
    setJoinSuccess(foundSubject)
    setJoinError("")
    setJoinCode("")
  }

  const closeJoinModal = () => {
    setShowJoinModal(false)
    setJoinCode("")
    setJoinError("")
    setJoinSuccess(null)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{isProf ? "Mis Materias" : "Materias Inscritas"}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              {isProf ? (
                <>
                  <GraduationCap className="w-3.5 h-3.5" />
                  Materias que imparto
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5" />
                  Materias en las que estoy inscrita
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isProf && (
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 bg-transparent"
              onClick={() => setShowJoinModal(true)}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Unirse con Código
            </Button>
          )}
          {isProf && (
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Materia
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <BookOpen className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">No hay materias</p>
            <p className="text-sm">
              {isProf ? "Aún no tienes materias asignadas" : "No estás inscrito en ninguna materia"}
            </p>
            {isProf ? (
              <Button className="mt-4 bg-primary text-primary-foreground" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear tu primera materia
              </Button>
            ) : (
              <Button className="mt-4 bg-primary text-primary-foreground" onClick={() => setShowJoinModal(true)}>
                <LogIn className="w-4 h-4 mr-2" />
                Unirse a una materia
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-foreground">{subject.name}</h3>
                          {isProf && (
                            <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs font-medium rounded-full">
                              Profesor
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{subject.code}</p>
                      </div>
                    </div>

                    {/* Subject Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {!isProf && (
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Profesor</p>
                            <p className="text-sm font-medium text-foreground">{subject.instructor}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Estudiantes</p>
                          <p className="text-sm font-medium text-foreground">{subject.students}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Horario</p>
                          <p className="text-sm font-medium text-foreground">{subject.schedule}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Materiales</p>
                          <p className="text-sm font-medium text-foreground">{subject.materials}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isProf && (
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setActiveMenu(activeMenu === subject.id ? null : subject.id)}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      {activeMenu === subject.id && (
                        <div className="absolute right-0 top-full mt-1 w-52 bg-card border border-border rounded-lg shadow-lg z-50 py-1">
                          <button
                            className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground"
                            onClick={() => {
                              setShowAccessCodeModal(subject)
                              setActiveMenu(null)
                            }}
                          >
                            <KeyRound className="w-4 h-4" /> Ver Código de Acceso
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground"
                            onClick={() => {
                              setShowEditModal(subject)
                              setSubjectName(subject.name)
                              setSubjectCode(subject.code)
                              setSubjectSchedule(subject.schedule)
                              setActiveMenu(null)
                            }}
                          >
                            <Edit className="w-4 h-4" /> Editar Materia
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground">
                            <Users className="w-4 h-4" /> Ver Estudiantes
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground">
                            <FileText className="w-4 h-4" /> Subir Material
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground">
                            <Settings className="w-4 h-4" /> Configuración
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-destructive"
                            onClick={() => {
                              setShowDeleteConfirm(subject)
                              setActiveMenu(null)
                            }}
                          >
                            <Trash2 className="w-4 h-4" /> Eliminar Materia
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {activeMenu && <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />}

      {/* Create Subject Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Crear Nueva Materia</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Nombre de la materia *</label>
                <Input
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="Ej: Programación Avanzada"
                  className="bg-input border-border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Código *</label>
                <Input
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  placeholder="Ej: CS501"
                  className="bg-input border-border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Horario</label>
                <Input
                  value={subjectSchedule}
                  onChange={(e) => setSubjectSchedule(e.target.value)}
                  placeholder="Ej: Lun, Mié 10:00 AM"
                  className="bg-input border-border"
                />
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <KeyRound className="w-4 h-4 inline mr-1" />
                  Se generará automáticamente un código de acceso para que los estudiantes se unan.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground"
                onClick={handleCreateSubject}
                disabled={!subjectName.trim() || !subjectCode.trim()}
              >
                Crear Materia
              </Button>
            </div>
          </div>
        </div>
      )}

      {showAccessCodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Código de Acceso</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAccessCodeModal(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Comparte este código con tus estudiantes para que se unan a:
              </p>
              <p className="font-semibold text-foreground mb-4">{showAccessCodeModal.name}</p>

              <div className="bg-muted rounded-lg p-6 mb-4">
                <p className="text-3xl font-mono font-bold tracking-widest text-primary">
                  {showAccessCodeModal.accessCode}
                </p>
              </div>

              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => handleCopyCode(showAccessCodeModal.accessCode)}
                  className="flex items-center gap-2"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedCode ? "Copiado" : "Copiar Código"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRegenerateCode(showAccessCodeModal)}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerar
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Si el código se filtra, puedes regenerarlo. Los estudiantes ya inscritos no serán afectados.
              </p>
            </div>

            <div className="flex justify-center mt-6">
              <Button className="bg-primary text-primary-foreground" onClick={() => setShowAccessCodeModal(null)}>
                Entendido
              </Button>
            </div>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Unirse a una Materia</h2>
              <Button variant="ghost" size="icon" onClick={closeJoinModal}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {joinSuccess ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">¡Inscripción Exitosa!</h3>
                <p className="text-muted-foreground mb-4">
                  Te has unido a <span className="font-medium text-foreground">{joinSuccess.name}</span>
                </p>
                <p className="text-sm text-muted-foreground mb-6">Profesor: {joinSuccess.instructor}</p>
                <Button className="bg-primary text-primary-foreground" onClick={closeJoinModal}>
                  Continuar
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ingresa el código de acceso que te proporcionó tu profesor
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Input
                      value={joinCode}
                      onChange={(e) => {
                        setJoinCode(e.target.value.toUpperCase())
                        setJoinError("")
                      }}
                      placeholder="Ej: ED2025A"
                      className="bg-input border-border text-center text-lg font-mono tracking-widest uppercase"
                      maxLength={8}
                    />
                    {joinError && <p className="text-sm text-destructive mt-2 text-center">{joinError}</p>}
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground text-center">
                      El código de acceso es proporcionado por el profesor de la materia. Si no lo tienes, solicítalo a
                      tu profesor.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={closeJoinModal}>
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 bg-primary text-primary-foreground"
                    onClick={handleJoinSubject}
                    disabled={!joinCode.trim()}
                  >
                    Unirse
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Editar Materia</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowEditModal(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Nombre de la materia</label>
                <Input
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="bg-input border-border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Código</label>
                <Input
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  className="bg-input border-border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Horario</label>
                <Input
                  value={subjectSchedule}
                  onChange={(e) => setSubjectSchedule(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowEditModal(null)}>
                Cancelar
              </Button>
              <Button className="flex-1 bg-primary text-primary-foreground">Guardar Cambios</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-sm p-6 shadow-xl">
            <h2 className="text-xl font-bold text-foreground mb-2">Eliminar Materia</h2>
            <p className="text-muted-foreground mb-6">
              ¿Estás seguro de que deseas eliminar "{showDeleteConfirm.name}"? Todos los estudiantes serán removidos.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowDeleteConfirm(null)}>
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => handleDeleteSubject(showDeleteConfirm)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
