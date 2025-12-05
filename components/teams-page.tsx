"use client"

import {
  Users,
  Plus,
  MessageSquare,
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  LogOut,
  Settings,
  GraduationCap,
  User,
  X,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useApp } from "@/contexts/app-context"
import { getTeamsForUser, getUserRoleInTeam, canUserManageTeam, canUserDeleteTeam, type Team } from "@/lib/demo-data"
import { EmptyState } from "@/components/ui/empty-state"
import { OnlineIndicator } from "@/components/ui/online-indicator"
import { useToast } from "@/components/ui/toast-provider"

const availableUsers = [
  { id: "std-1", name: "María García", avatar: "MG", role: "student" as const },
  { id: "std-2", name: "Juan Pérez", avatar: "JP", role: "student" as const },
  { id: "std-3", name: "Laura Sánchez", avatar: "LS", role: "student" as const },
  { id: "std-4", name: "Pedro Ruiz", avatar: "PR", role: "student" as const },
  { id: "std-5", name: "Ana Martínez", avatar: "AM", role: "student" as const },
  { id: "std-6", name: "Carlos Díaz", avatar: "CD", role: "student" as const },
  { id: "prof-1", name: "Dr. Carlos Mendoza", avatar: "CM", role: "professor" as const },
  { id: "prof-2", name: "Dra. Ana López", avatar: "AL", role: "professor" as const },
  { id: "prof-3", name: "Dr. Roberto Vargas", avatar: "RV", role: "professor" as const },
]

export default function TeamsPage() {
  const { currentUser } = useApp()
  const { addToast } = useToast()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState<Team | null>(null)
  const [showInviteModal, setShowInviteModal] = useState<Team | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Team | null>(null)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState<Team | null>(null)

  // Form states
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamDescription, setNewTeamDescription] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [memberSearch, setMemberSearch] = useState("")

  // Local teams state for demo purposes
  const [localTeams, setLocalTeams] = useState<Team[]>([])

  if (!currentUser) return null

  const baseTeams = getTeamsForUser(currentUser.id)
  const teams = [...baseTeams, ...localTeams]

  const filteredUsers = availableUsers.filter(
    (u) =>
      u.id !== currentUser.id &&
      u.name.toLowerCase().includes(memberSearch.toLowerCase()) &&
      !selectedMembers.includes(u.id),
  )

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return

    const newTeam: Team = {
      id: `team-new-${Date.now()}`,
      name: newTeamName,
      description: newTeamDescription,
      memberCount: selectedMembers.length + 1,
      members: [
        { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, role: currentUser.role },
        ...selectedMembers.map((id) => {
          const user = availableUsers.find((u) => u.id === id)!
          return { id: user.id, name: user.name, avatar: user.avatar, role: user.role }
        }),
      ],
      creatorId: currentUser.id,
      creatorRole: currentUser.role,
      messageCount: 0,
      projectCount: 0,
    }

    setLocalTeams((prev) => [newTeam, ...prev])
    setNewTeamName("")
    setNewTeamDescription("")
    setSelectedMembers([])
    setShowCreateModal(false)
    addToast({
      type: "success",
      title: "Equipo creado",
      description: `El equipo "${newTeam.name}" se ha creado exitosamente`,
    })
  }

  const handleDeleteTeam = (team: Team) => {
    setLocalTeams((prev) => prev.filter((t) => t.id !== team.id))
    setShowDeleteConfirm(null)
    addToast({
      type: "success",
      title: "Equipo eliminado",
      description: `El equipo "${team.name}" ha sido eliminado`,
    })
  }

  const handleLeaveTeam = (team: Team) => {
    setLocalTeams((prev) => prev.filter((t) => t.id !== team.id))
    setShowLeaveConfirm(null)
    addToast({
      type: "info",
      title: "Has abandonado el equipo",
      description: `Ya no eres miembro de "${team.name}"`,
    })
  }

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mis Equipos</h1>
            <p className="text-sm text-muted-foreground">
              Sesión:{" "}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  currentUser.role === "professor" ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
                }`}
              >
                {currentUser.role === "professor" ? (
                  <GraduationCap className="w-3 h-3" />
                ) : (
                  <User className="w-3 h-3" />
                )}
                {currentUser.name}
              </span>
            </p>
          </div>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105 active:scale-95"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear Equipo
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {teams.length === 0 ? (
          <EmptyState
            type="teams"
            title="No hay equipos"
            description="No perteneces a ningún equipo aún. Crea uno para colaborar con tus compañeros."
            action={{
              label: "Crear tu primer equipo",
              onClick: () => setShowCreateModal(true),
            }}
          />
        ) : (
          <div className="space-y-4">
            {teams.map((team, index) => {
              const userRoleInTeam = getUserRoleInTeam(currentUser.id, team)
              const canManage = canUserManageTeam(currentUser.id, currentUser.role, team)
              const canDelete = canUserDeleteTeam(currentUser.id, currentUser.role, team)

              return (
                <div
                  key={team.id}
                  className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all duration-200 hover:shadow-md animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{team.name}</h3>
                        <p className="text-sm text-muted-foreground">{team.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Creado por {team.creatorRole === "professor" ? "Profesor" : "Estudiante"}
                          {team.creatorId === currentUser.id && " (tú)"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
                        {userRoleInTeam}
                      </span>
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setActiveMenu(activeMenu === team.id ? null : team.id)}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                        {activeMenu === team.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                            {canManage && (
                              <>
                                <button
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground transition-colors"
                                  onClick={() => {
                                    setShowEditModal(team)
                                    setNewTeamName(team.name)
                                    setNewTeamDescription(team.description)
                                    setActiveMenu(null)
                                  }}
                                >
                                  <Edit className="w-4 h-4" /> Editar Equipo
                                </button>
                                <button
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground transition-colors"
                                  onClick={() => {
                                    setShowInviteModal(team)
                                    setActiveMenu(null)
                                  }}
                                >
                                  <UserPlus className="w-4 h-4" /> Invitar Miembros
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground transition-colors">
                                  <Settings className="w-4 h-4" /> Configuración
                                </button>
                              </>
                            )}
                            <button
                              className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground transition-colors"
                              onClick={() => {
                                setShowLeaveConfirm(team)
                                setActiveMenu(null)
                              }}
                            >
                              <LogOut className="w-4 h-4" /> Abandonar Equipo
                            </button>
                            {canDelete && (
                              <button
                                className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-destructive transition-colors"
                                onClick={() => {
                                  setShowDeleteConfirm(team)
                                  setActiveMenu(null)
                                }}
                              >
                                <Trash2 className="w-4 h-4" /> Eliminar Equipo
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Members with role badges and online indicators */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Miembros ({team.memberCount})</p>
                    <div className="flex items-center gap-2">
                      {team.members.map((member, idx) => (
                        <div
                          key={idx}
                          className="relative group/member"
                          title={`${member.name} (${member.role === "professor" ? "Profesor" : "Estudiante"})${member.id === currentUser.id ? " - Tú" : ""}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-transform group-hover/member:scale-110 ${
                              member.id === currentUser.id
                                ? "bg-accent text-accent-foreground ring-2 ring-accent"
                                : "bg-primary/20 text-primary"
                            }`}
                          >
                            {member.avatar}
                          </div>
                          {member.role === "professor" && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-accent rounded-full flex items-center justify-center">
                              <GraduationCap className="w-2 h-2 text-accent-foreground" />
                            </div>
                          )}
                          <OnlineIndicator isOnline={member.id === currentUser.id || Math.random() > 0.5} size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{team.messageCount} mensajes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{team.projectCount} proyectos</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {activeMenu && <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Crear Nuevo Equipo</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Nombre del equipo *</label>
                <Input
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Ej: Proyecto Final"
                  className="bg-input border-border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Descripción</label>
                <Input
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  placeholder="Describe el propósito del equipo"
                  className="bg-input border-border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Invitar miembros</label>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Buscar usuarios..."
                    className="pl-10 bg-input border-border"
                  />
                </div>

                {/* Selected members */}
                {selectedMembers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedMembers.map((id) => {
                      const user = availableUsers.find((u) => u.id === id)!
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary rounded-full text-sm animate-in zoom-in duration-200"
                        >
                          {user.name}
                          <button onClick={() => toggleMember(id)} className="hover:text-primary/70">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )
                    })}
                  </div>
                )}

                {/* User list */}
                <div className="max-h-40 overflow-y-auto border border-border rounded-lg">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => toggleMember(user.id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
                      >
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {user.avatar}
                          </div>
                          {user.role === "professor" && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-accent rounded-full flex items-center justify-center">
                              <GraduationCap className="w-2 h-2 text-accent-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.role === "professor" ? "Profesor" : "Estudiante"}
                          </p>
                        </div>
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      </button>
                    ))
                  ) : (
                    <p className="p-3 text-sm text-muted-foreground text-center">No se encontraron usuarios</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground"
                onClick={handleCreateTeam}
                disabled={!newTeamName.trim()}
              >
                Crear Equipo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Confirm Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-xl w-full max-w-sm p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-foreground mb-2">¿Abandonar equipo?</h2>
            <p className="text-muted-foreground mb-6">
              Dejarás de tener acceso a los mensajes y archivos de &quot;{showLeaveConfirm.name}&quot;.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowLeaveConfirm(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" className="flex-1" onClick={() => handleLeaveTeam(showLeaveConfirm)}>
                Abandonar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-xl w-full max-w-sm p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-foreground mb-2">¿Eliminar equipo?</h2>
            <p className="text-muted-foreground mb-6">
              Esta acción no se puede deshacer. Todos los mensajes y archivos de &quot;{showDeleteConfirm.name}&quot;
              serán eliminados.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowDeleteConfirm(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" className="flex-1" onClick={() => handleDeleteTeam(showDeleteConfirm)}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
