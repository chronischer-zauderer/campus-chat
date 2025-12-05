import type { UserRole } from "@/contexts/app-context"

export interface Subject {
  id: string
  name: string
  code: string
  instructor: string
  instructorId: string
  students: number
  schedule: string
  materials: number
  enrolledStudentIds: string[]
  accessCode: string
}

export interface Team {
  id: string
  name: string
  description: string
  memberCount: number
  members: Array<{ id: string; name: string; avatar: string; role: "professor" | "student" }>
  creatorId: string
  creatorRole: "professor" | "student"
  messageCount: number
  projectCount: number
}

export interface Chat {
  id: number
  name: string
  lastMessage: string
  timestamp: string
  unread: number
  avatar: string
  type: "Materias" | "Equipos"
  isPinned?: boolean
  isMuted?: boolean
  memberIds: string[]
  creatorId: string
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  type: "exam" | "assignment" | "meeting" | "deadline"
  priority: "high" | "medium" | "low"
  subjectId?: string
  creatorId: string
}

// All subjects in the system
export const allSubjects: Subject[] = [
  {
    id: "subj-1",
    name: "Estructuras de Datos",
    code: "CS201",
    instructor: "Dr. Carlos Mendoza",
    instructorId: "prof-1",
    students: 45,
    schedule: "Lun, Mié 10:00 AM",
    materials: 8,
    enrolledStudentIds: ["std-1", "std-2", "std-3"],
    accessCode: "ED2025A",
  },
  {
    id: "subj-2",
    name: "Desarrollo Web",
    code: "CS301",
    instructor: "Dr. Carlos Mendoza",
    instructorId: "prof-1",
    students: 38,
    schedule: "Mar, Jue 2:00 PM",
    materials: 12,
    enrolledStudentIds: ["std-1", "std-4", "std-5"],
    accessCode: "DW2025B",
  },
  {
    id: "subj-3",
    name: "Bases de Datos",
    code: "CS401",
    instructor: "Dra. Ana López",
    instructorId: "prof-2",
    students: 32,
    schedule: "Mié, Vie 1:00 PM",
    materials: 6,
    enrolledStudentIds: ["std-1", "std-2"],
    accessCode: "BD2025C",
  },
  {
    id: "subj-4",
    name: "Algoritmos Avanzados",
    code: "CS205",
    instructor: "Dr. Carlos Mendoza",
    instructorId: "prof-1",
    students: 28,
    schedule: "Lun, Mié, Vie 11:00 AM",
    materials: 15,
    enrolledStudentIds: ["std-2", "std-3", "std-6"],
    accessCode: "AA2025D",
  },
  {
    id: "subj-5",
    name: "Ingeniería de Software",
    code: "CS350",
    instructor: "Dr. Roberto Vargas",
    instructorId: "prof-3",
    students: 42,
    schedule: "Mar, Jue 9:00 AM",
    materials: 10,
    enrolledStudentIds: ["std-1", "std-4"],
    accessCode: "IS2025E",
  },
]

// All teams in the system
export const allTeams: Team[] = [
  {
    id: "team-1",
    name: "Proyecto App Móvil",
    description: "Desarrollo de aplicación multiplataforma",
    memberCount: 5,
    members: [
      { id: "std-1", name: "María García", avatar: "MG", role: "student" },
      { id: "std-2", name: "Juan Pérez", avatar: "JP", role: "student" },
      { id: "std-3", name: "Laura Sánchez", avatar: "LS", role: "student" },
      { id: "std-4", name: "Pedro Ruiz", avatar: "PR", role: "student" },
      { id: "std-5", name: "Ana Martínez", avatar: "AM", role: "student" },
    ],
    creatorId: "std-1",
    creatorRole: "student",
    messageCount: 245,
    projectCount: 3,
  },
  {
    id: "team-2",
    name: "Laboratorio IA",
    description: "Investigación en modelos de machine learning",
    memberCount: 4,
    members: [
      { id: "prof-1", name: "Dr. Carlos Mendoza", avatar: "CM", role: "professor" },
      { id: "std-1", name: "María García", avatar: "MG", role: "student" },
      { id: "std-2", name: "Juan Pérez", avatar: "JP", role: "student" },
      { id: "std-6", name: "Carlos Díaz", avatar: "CD", role: "student" },
    ],
    creatorId: "prof-1",
    creatorRole: "professor",
    messageCount: 189,
    projectCount: 2,
  },
  {
    id: "team-3",
    name: "Diseño Web UI/UX",
    description: "Diseño de interfaces para proyectos de clase",
    memberCount: 3,
    members: [
      { id: "std-1", name: "María García", avatar: "MG", role: "student" },
      { id: "std-4", name: "Pedro Ruiz", avatar: "PR", role: "student" },
      { id: "std-5", name: "Ana Martínez", avatar: "AM", role: "student" },
    ],
    creatorId: "std-4",
    creatorRole: "student",
    messageCount: 156,
    projectCount: 4,
  },
  {
    id: "team-4",
    name: "Seminario Investigación",
    description: "Grupo de investigación en computación",
    memberCount: 6,
    members: [
      { id: "prof-1", name: "Dr. Carlos Mendoza", avatar: "CM", role: "professor" },
      { id: "prof-2", name: "Dra. Ana López", avatar: "AL", role: "professor" },
      { id: "std-1", name: "María García", avatar: "MG", role: "student" },
      { id: "std-2", name: "Juan Pérez", avatar: "JP", role: "student" },
      { id: "std-3", name: "Laura Sánchez", avatar: "LS", role: "student" },
      { id: "std-6", name: "Carlos Díaz", avatar: "CD", role: "student" },
    ],
    creatorId: "prof-1",
    creatorRole: "professor",
    messageCount: 320,
    projectCount: 5,
  },
]

// All chats in the system
export const allChats: Chat[] = [
  {
    id: 1,
    name: "CS201 - Estructuras de Datos",
    lastMessage: "¿Alguien terminó la tarea de árboles?",
    timestamp: "2:30 PM",
    unread: 3,
    avatar: "ED",
    type: "Materias",
    isPinned: true,
    memberIds: ["prof-1", "std-1", "std-2", "std-3"],
    creatorId: "prof-1",
  },
  {
    id: 2,
    name: "Proyecto App Móvil",
    lastMessage: "¡Los mockups se ven geniales!",
    timestamp: "1:15 PM",
    unread: 1,
    avatar: "PM",
    type: "Equipos",
    memberIds: ["std-1", "std-2", "std-3", "std-4", "std-5"],
    creatorId: "std-1",
  },
  {
    id: 3,
    name: "Laboratorio IA",
    lastMessage: "Subí los resultados del experimento",
    timestamp: "12:00 PM",
    unread: 0,
    avatar: "IA",
    type: "Equipos",
    memberIds: ["prof-1", "std-1", "std-2", "std-6"],
    creatorId: "prof-1",
  },
  {
    id: 4,
    name: "CS301 - Desarrollo Web",
    lastMessage: "El parcial es el viernes",
    timestamp: "Ayer",
    unread: 2,
    avatar: "DW",
    type: "Materias",
    memberIds: ["prof-1", "std-1", "std-4", "std-5"],
    creatorId: "prof-1",
  },
  {
    id: 5,
    name: "CS401 - Bases de Datos",
    lastMessage: "¿Cuándo es la entrega del proyecto?",
    timestamp: "Ayer",
    unread: 0,
    avatar: "BD",
    type: "Materias",
    isMuted: true,
    memberIds: ["prof-2", "std-1", "std-2"],
    creatorId: "prof-2",
  },
  {
    id: 6,
    name: "Seminario Investigación",
    lastMessage: "Próxima reunión el lunes a las 4pm",
    timestamp: "Lun",
    unread: 5,
    avatar: "SI",
    type: "Equipos",
    memberIds: ["prof-1", "prof-2", "std-1", "std-2", "std-3", "std-6"],
    creatorId: "prof-1",
  },
  {
    id: 7,
    name: "CS205 - Algoritmos Avanzados",
    lastMessage: "El examen incluye grafos y DP",
    timestamp: "Dom",
    unread: 0,
    avatar: "AA",
    type: "Materias",
    memberIds: ["prof-1", "std-2", "std-3", "std-6"],
    creatorId: "prof-1",
  },
  {
    id: 8,
    name: "Diseño Web UI/UX",
    lastMessage: "Terminé los wireframes",
    timestamp: "Sab",
    unread: 0,
    avatar: "UX",
    type: "Equipos",
    memberIds: ["std-1", "std-4", "std-5"],
    creatorId: "std-4",
  },
]

// Calendar events
export const allCalendarEvents: CalendarEvent[] = [
  {
    id: "ev-1",
    title: "Parcial Estructuras de Datos",
    date: "2025-06-15",
    type: "exam",
    priority: "high",
    subjectId: "subj-1",
    creatorId: "prof-1",
  },
  {
    id: "ev-2",
    title: "Entrega Proyecto Web",
    date: "2025-06-20",
    type: "assignment",
    priority: "high",
    subjectId: "subj-2",
    creatorId: "prof-1",
  },
  {
    id: "ev-3",
    title: "Reunión Laboratorio IA",
    date: "2025-06-10",
    type: "meeting",
    priority: "medium",
    creatorId: "prof-1",
  },
  {
    id: "ev-4",
    title: "Quiz Bases de Datos",
    date: "2025-06-12",
    type: "exam",
    priority: "medium",
    subjectId: "subj-3",
    creatorId: "prof-2",
  },
  {
    id: "ev-5",
    title: "Presentación Seminario",
    date: "2025-06-18",
    type: "deadline",
    priority: "high",
    creatorId: "prof-1",
  },
]

// Helper functions to get user-specific data
export function getSubjectsForUser(userId: string, userRole: UserRole): Subject[] {
  if (userRole === "professor") {
    return allSubjects.filter((s) => s.instructorId === userId)
  }
  return allSubjects.filter((s) => s.enrolledStudentIds.includes(userId))
}

export function getTeamsForUser(userId: string): Team[] {
  return allTeams.filter((t) => t.members.some((m) => m.id === userId))
}

export function getChatsForUser(userId: string): Chat[] {
  return allChats.filter((c) => c.memberIds.includes(userId))
}

export function getCalendarEventsForUser(userId: string, userRole: UserRole): CalendarEvent[] {
  // Get subjects the user is part of
  const userSubjects = getSubjectsForUser(userId, userRole)
  const userSubjectIds = userSubjects.map((s) => s.id)

  return allCalendarEvents.filter((e) => {
    // Events created by the user
    if (e.creatorId === userId) return true
    // Events from subjects the user is enrolled in
    if (e.subjectId && userSubjectIds.includes(e.subjectId)) return true
    return false
  })
}

export function getUserRoleInTeam(userId: string, team: Team): "Leader" | "Member" {
  if (team.creatorId === userId) return "Leader"
  return "Member"
}

export function canUserManageTeam(userId: string, userRole: UserRole, team: Team): boolean {
  if (userRole === "professor") return true
  if (team.creatorRole === "student" && team.creatorId === userId) return true
  return false
}

export function canUserDeleteTeam(userId: string, userRole: UserRole, team: Team): boolean {
  if (userRole === "professor" && team.creatorId === userId) return true
  if (team.creatorRole === "student" && team.creatorId === userId) return true
  return false
}

export function generateAccessCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function findSubjectByAccessCode(accessCode: string): Subject | undefined {
  return allSubjects.find((s) => s.accessCode.toUpperCase() === accessCode.toUpperCase())
}

export function getDeadlinesForUser(userId: string, userRole: UserRole): CalendarEvent[] {
  return getCalendarEventsForUser(userId, userRole)
}
