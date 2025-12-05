"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Search, Check, GraduationCap, User } from "lucide-react"
import { useApp } from "@/contexts/app-context"

interface CreateGroupModalProps {
  isOpen: boolean
  onClose: () => void
}

const mockMembers = [
  { id: 1, name: "Prof. Martinez", email: "martinez@university.edu", avatar: "PM", role: "professor" as const },
  { id: 2, name: "Sarah Johnson", email: "sarah@university.edu", avatar: "SJ", role: "student" as const },
  { id: 3, name: "Mike Chen", email: "mike@university.edu", avatar: "MC", role: "student" as const },
  { id: 4, name: "Prof. Williams", email: "williams@university.edu", avatar: "PW", role: "professor" as const },
  { id: 5, name: "Emma Williams", email: "emma@university.edu", avatar: "EW", role: "student" as const },
  { id: 6, name: "Alex Rodriguez", email: "alex@university.edu", avatar: "AR", role: "student" as const },
]

const subjects = ["CS101", "Math201", "Biology110", "History202", "English150"]

export default function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const { currentUser } = useApp()
  const [groupName, setGroupName] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const toggleMember = (id: number) => {
    setSelectedMembers((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]))
  }

  const filteredMembers = mockMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreate = () => {
    // Group will be created with currentUser.role as the creator role
    // This determines permissions for the group
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-2xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Create New Group</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Creating as:{" "}
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
                {currentUser.role === "professor" ? "Professor" : "Student"}
              </span>
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div
            className={`p-3 rounded-lg text-sm ${
              currentUser.role === "professor"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "bg-primary/10 text-primary border border-primary/20"
            }`}
          >
            {currentUser.role === "professor" ? (
              <p>
                As a Professor, you will have full admin rights: assign tasks, set deadlines, and manage all group
                settings.
              </p>
            ) : (
              <p>
                As a Student creator, you and other students will have basic admin rights: add members, pin messages,
                and manage files.
              </p>
            )}
          </div>

          {/* Group Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Group Name</label>
            <Input
              placeholder="e.g., CS101 Study Group"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="bg-input border-border rounded-lg h-10"
            />
          </div>

          {/* Subject Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a subject...</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Members Search */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Add Members</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border rounded-lg h-10"
              />
            </div>
          </div>

          {/* Members List with role badges */}
          <div className="space-y-2">
            {filteredMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => toggleMember(member.id)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(member.id)}
                  onChange={() => {}}
                  className="w-4 h-4 rounded border-border cursor-pointer"
                />
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary-foreground">{member.avatar}</span>
                  </div>
                  {member.role === "professor" && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-accent rounded-full flex items-center justify-center">
                      <GraduationCap className="w-2 h-2 text-accent-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{member.name}</p>
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs ${
                        member.role === "professor" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {member.role === "professor" ? "Prof" : "Student"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
                {selectedMembers.includes(member.id) && <Check className="w-5 h-5 text-accent" />}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border bg-muted/50">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-lg border-border bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!groupName || !selectedSubject || selectedMembers.length === 0}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
          >
            Create Group
          </Button>
        </div>
      </div>
    </div>
  )
}
