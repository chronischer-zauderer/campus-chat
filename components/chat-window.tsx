"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Send,
  Paperclip,
  Phone,
  Video,
  Info,
  Search,
  X,
  MoreVertical,
  Smile,
  Pin,
  Trash2,
  Edit,
  UserPlus,
  LogOut,
  Settings,
  GraduationCap,
  ImageIcon,
  FileText,
  Link2,
  Check,
  Copy,
  Reply,
  Forward,
} from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { getChatsForUser, allTeams } from "@/lib/demo-data"

interface ChatWindowProps {
  chatId: number
  onBack?: () => void
  showBackButton?: boolean
}

interface Message {
  id: number
  senderId: string
  sender: string
  avatar: string
  message: string
  isOwn: boolean
  time: string
  reactions?: { emoji: string; count: number }[]
  isPinned?: boolean
  isDeleted?: boolean
  attachment?: { type: string; name: string; size: string }
}

export default function ChatWindow({ chatId, onBack, showBackButton }: ChatWindowProps) {
  const { currentUser } = useApp()
  const [message, setMessage] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showGroupMenu, setShowGroupMenu] = useState(false)
  const [showGroupInfo, setShowGroupInfo] = useState(false)
  const [showReactionPicker, setShowReactionPicker] = useState<number | null>(null)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [showMessageMenu, setShowMessageMenu] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)

  const [showEditGroupModal, setShowEditGroupModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
  const [showGroupSettings, setShowGroupSettings] = useState(false)

  const [chatInfo, setChatInfo] = useState<{
    name: string
    description: string
    memberCount: number
    creatorRole: "professor" | "student"
    creatorId: string
    members: Array<{ id: string; name: string; avatar: string; role: "professor" | "student" }>
  } | null>(null)

  const [editGroupName, setEditGroupName] = useState("")
  const [editGroupDescription, setEditGroupDescription] = useState("")
  const [selectedInvites, setSelectedInvites] = useState<string[]>([])
  const [inviteSearch, setInviteSearch] = useState("")

  useEffect(() => {
    if (currentUser) {
      const userChats = getChatsForUser(currentUser.id)
      const currentChat = userChats.find((c) => c.id === chatId)

      if (currentChat) {
        // Find team info if it's a team chat
        const team = allTeams.find((t) => t.name === currentChat.name || currentChat.name.includes(t.name))

        setChatInfo({
          name: currentChat.name,
          description: team?.description || "Grupo de chat",
          memberCount: currentChat.memberIds.length,
          creatorRole: team?.creatorRole || "student",
          creatorId: currentChat.creatorId,
          members:
            team?.members ||
            currentChat.memberIds.map((id) => ({
              id,
              name: id === currentUser.id ? currentUser.name : `Usuario ${id}`,
              avatar: id === currentUser.id ? currentUser.avatar : id.substring(0, 2).toUpperCase(),
              role: id.startsWith("prof") ? ("professor" as const) : ("student" as const),
            })),
        })
        setEditGroupName(currentChat.name)
        setEditGroupDescription(team?.description || "")

        // Generate contextual messages
        const contextMessages: Message[] = [
          {
            id: 1,
            senderId: currentChat.creatorId,
            sender: currentChat.creatorId === currentUser.id ? currentUser.name : "Administrador",
            avatar: currentChat.creatorId === currentUser.id ? currentUser.avatar : "AD",
            message: `¡Bienvenidos al grupo ${currentChat.name}!`,
            isOwn: currentChat.creatorId === currentUser.id,
            time: "9:00 AM",
            isPinned: true,
          },
          {
            id: 2,
            senderId: "other-1",
            sender: "Compañero",
            avatar: "CO",
            message: currentChat.lastMessage,
            isOwn: false,
            time: currentChat.timestamp,
          },
        ]
        setMessages(contextMessages)
      }
    }
  }, [currentUser, chatId])

  if (!currentUser || !chatInfo) return null

  const isProf = currentUser.role === "professor"

  const canManageGroup = () => {
    if (isProf) return true
    if (chatInfo.creatorRole === "student" && chatInfo.creatorId === currentUser.id) return true
    return false
  }

  const canDeleteGroup = () => {
    if (isProf && chatInfo.creatorId === currentUser.id) return true
    if (chatInfo.creatorRole === "student" && chatInfo.creatorId === currentUser.id) return true
    return false
  }

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        senderId: currentUser.id,
        sender: currentUser.name,
        avatar: currentUser.avatar,
        message: message.trim(),
        isOwn: true,
        time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const addReaction = (messageId: number, emoji: string) => {
    setMessages(
      messages.map((m) => {
        if (m.id === messageId) {
          const existingReaction = m.reactions?.find((r) => r.emoji === emoji)
          if (existingReaction) {
            return {
              ...m,
              reactions: m.reactions?.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r)),
            }
          }
          return { ...m, reactions: [...(m.reactions || []), { emoji, count: 1 }] }
        }
        return m
      }),
    )
    setShowReactionPicker(null)
  }

  const togglePinMessage = (messageId: number) => {
    setMessages(messages.map((m) => (m.id === messageId ? { ...m, isPinned: !m.isPinned } : m)))
    setShowMessageMenu(null)
  }

  const deleteMessage = (messageId: number) => {
    setMessages(messages.map((m) => (m.id === messageId ? { ...m, isDeleted: true, message: "Mensaje eliminado" } : m)))
    setShowMessageMenu(null)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0]
    if (file) {
      const newMessage: Message = {
        id: messages.length + 1,
        senderId: currentUser.id,
        sender: currentUser.name,
        avatar: currentUser.avatar,
        message: "",
        isOwn: true,
        time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        attachment: { type, name: file.name, size: `${(file.size / 1024).toFixed(1)} KB` },
      }
      setMessages([...messages, newMessage])
    }
    setShowAttachMenu(false)
  }

  const filteredMessages = searchQuery
    ? messages.filter((m) => m.message.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages

  const emojis = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🔥", "👏"]

  const availableMembers = [
    { id: "avail-1", name: "Emma Rodriguez", role: "student" as const, avatar: "ER" },
    { id: "avail-2", name: "James Wilson", role: "student" as const, avatar: "JW" },
    { id: "avail-3", name: "Prof. Martinez", role: "professor" as const, avatar: "PM" },
  ].filter((m) => !chatInfo.members.some((cm) => cm.id === m.id))

  const filteredAvailableMembers = availableMembers.filter((m) =>
    m.name.toLowerCase().includes(inviteSearch.toLowerCase()),
  )

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="h-20 bg-card border-b border-border px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div
            className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center cursor-pointer"
            onClick={() => setShowGroupInfo(true)}
          >
            <span className="text-base font-bold text-primary-foreground">
              {chatInfo.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-bold text-foreground">{chatInfo.name}</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {chatInfo.memberCount} miembros
              {chatInfo.creatorId === currentUser.id && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary/20 text-primary rounded text-xs">Admin</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground rounded-lg"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-lg">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-lg">
            <Video className="w-5 h-5" />
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground rounded-lg"
              onClick={() => setShowGroupMenu(!showGroupMenu)}
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
            {showGroupMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-50 py-1">
                <button
                  onClick={() => {
                    setShowGroupInfo(true)
                    setShowGroupMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground"
                >
                  <Info className="w-4 h-4" /> Info del Grupo
                </button>
                {canManageGroup() && (
                  <>
                    <button
                      onClick={() => {
                        setShowEditGroupModal(true)
                        setShowGroupMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground"
                    >
                      <Edit className="w-4 h-4" /> Editar Grupo
                    </button>
                    <button
                      onClick={() => {
                        setShowInviteModal(true)
                        setShowGroupMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground"
                    >
                      <UserPlus className="w-4 h-4" /> Invitar Miembros
                    </button>
                    <button
                      onClick={() => {
                        setShowGroupSettings(true)
                        setShowGroupMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground"
                    >
                      <Settings className="w-4 h-4" /> Configuración
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setShowLeaveConfirm(true)
                    setShowGroupMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground"
                >
                  <LogOut className="w-4 h-4" /> Abandonar Grupo
                </button>
                {canDeleteGroup() && (
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true)
                      setShowGroupMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" /> Eliminar Grupo
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="px-6 py-3 bg-card border-b border-border flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en el chat..."
            className="flex-1 bg-muted border-0"
            autoFocus
          />
          <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredMessages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 group ${msg.isOwn ? "flex-row-reverse" : ""}`}>
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.isOwn ? "bg-primary" : "bg-muted"
              }`}
            >
              <span className={`text-sm font-bold ${msg.isOwn ? "text-primary-foreground" : "text-foreground"}`}>
                {msg.avatar}
              </span>
            </div>
            <div className={`max-w-[70%] ${msg.isOwn ? "items-end" : "items-start"}`}>
              <div className="flex items-center gap-2 mb-1">
                {!msg.isOwn && (
                  <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                    {msg.sender}
                    {msg.senderId?.startsWith("prof") && <GraduationCap className="w-3 h-3 text-accent" />}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">{msg.time}</span>
                {msg.isPinned && <Pin className="w-3 h-3 text-accent" />}
              </div>
              <div className="relative">
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.isDeleted
                      ? "bg-muted/50 text-muted-foreground italic"
                      : msg.isOwn
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                  }`}
                >
                  {msg.attachment ? (
                    <div className="flex items-center gap-2">
                      {msg.attachment.type === "image" ? (
                        <ImageIcon className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{msg.attachment.name}</p>
                        <p className="text-xs opacity-70">{msg.attachment.size}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                  )}
                </div>

                {!msg.isDeleted && (
                  <div
                    className={`absolute top-0 ${msg.isOwn ? "left-0 -translate-x-full" : "right-0 translate-x-full"} opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 px-2`}
                  >
                    <button
                      onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)}
                      className="p-1 rounded hover:bg-muted"
                    >
                      <Smile className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setShowMessageMenu(showMessageMenu === msg.id ? null : msg.id)}
                      className="p-1 rounded hover:bg-muted"
                    >
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                )}

                {showReactionPicker === msg.id && (
                  <div
                    className={`absolute ${msg.isOwn ? "right-0" : "left-0"} top-full mt-1 bg-card border border-border rounded-lg shadow-lg p-2 flex gap-1 z-50`}
                  >
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => addReaction(msg.id, emoji)}
                        className="p-1 hover:bg-muted rounded text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {showMessageMenu === msg.id && (
                  <div
                    className={`absolute ${msg.isOwn ? "right-0" : "left-0"} top-full mt-1 bg-card border border-border rounded-lg shadow-lg py-1 w-36 z-50`}
                  >
                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground">
                      <Copy className="w-4 h-4" /> Copiar
                    </button>
                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground">
                      <Reply className="w-4 h-4" /> Responder
                    </button>
                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground">
                      <Forward className="w-4 h-4" /> Reenviar
                    </button>
                    {canManageGroup() && (
                      <button
                        onClick={() => togglePinMessage(msg.id)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground"
                      >
                        <Pin className="w-4 h-4" /> {msg.isPinned ? "Desfijar" : "Fijar"}
                      </button>
                    )}
                    {(msg.isOwn || canManageGroup()) && (
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-destructive"
                      >
                        <Trash2 className="w-4 h-4" /> Eliminar
                      </button>
                    )}
                  </div>
                )}
              </div>

              {msg.reactions && msg.reactions.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {msg.reactions.map((reaction, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-muted rounded-full text-xs flex items-center gap-1">
                      {reaction.emoji} {reaction.count}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-card border-t border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground rounded-lg"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            {showAttachMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-lg py-1 w-40">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground"
                >
                  <ImageIcon className="w-4 h-4" /> Foto
                </button>
                <button
                  onClick={() => docInputRef.current?.click()}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground"
                >
                  <FileText className="w-4 h-4" /> Documento
                </button>
                <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-foreground">
                  <Link2 className="w-4 h-4" /> Enlace
                </button>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "image")}
          />
          <input
            type="file"
            ref={docInputRef}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => handleFileUpload(e, "document")}
          />
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-muted border-0 rounded-lg h-11"
          />
          <Button
            size="icon"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-11 w-11"
            onClick={handleSend}
            disabled={!message.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Modals */}
      {showGroupInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-md p-6 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Info del Grupo</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowGroupInfo(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {chatInfo.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{chatInfo.name}</h3>
                <p className="text-sm text-muted-foreground">{chatInfo.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Creado por {chatInfo.creatorRole === "professor" ? "Profesor" : "Estudiante"}
                  {chatInfo.creatorId === currentUser.id && " (tú)"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Miembros ({chatInfo.members.length})</h4>
                <div className="space-y-2">
                  {chatInfo.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          member.id === currentUser.id ? "bg-accent" : "bg-primary/20"
                        }`}
                      >
                        <span
                          className={`text-sm font-bold ${
                            member.id === currentUser.id ? "text-accent-foreground" : "text-primary"
                          }`}
                        >
                          {member.avatar}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground flex items-center gap-1">
                          {member.name}
                          {member.id === currentUser.id && " (tú)"}
                          {member.role === "professor" && <GraduationCap className="w-3 h-3 text-accent" />}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.role === "professor" ? "Profesor" : "Estudiante"}
                          {member.id === chatInfo.creatorId && " • Admin"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditGroupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Editar Grupo</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowEditGroupModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Nombre del grupo</label>
                <Input
                  value={editGroupName}
                  onChange={(e) => setEditGroupName(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Descripción</label>
                <Input
                  value={editGroupDescription}
                  onChange={(e) => setEditGroupDescription(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowEditGroupModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground"
                  onClick={() => {
                    setChatInfo({ ...chatInfo, name: editGroupName, description: editGroupDescription })
                    setShowEditGroupModal(false)
                  }}
                >
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Invitar Miembros</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowInviteModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <Input
                value={inviteSearch}
                onChange={(e) => setInviteSearch(e.target.value)}
                placeholder="Buscar usuarios..."
                className="bg-input border-border"
              />
              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredAvailableMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() =>
                      setSelectedInvites(
                        selectedInvites.includes(member.id)
                          ? selectedInvites.filter((id) => id !== member.id)
                          : [...selectedInvites, member.id],
                      )
                    }
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedInvites.includes(member.id) ? "bg-primary/10 border border-primary" : "hover:bg-muted"
                    }`}
                  >
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{member.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground flex items-center gap-1">
                        {member.name}
                        {member.role === "professor" && <GraduationCap className="w-3 h-3 text-accent" />}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.role === "professor" ? "Profesor" : "Estudiante"}
                      </p>
                    </div>
                    {selectedInvites.includes(member.id) && <Check className="w-5 h-5 text-primary" />}
                  </div>
                ))}
                {filteredAvailableMembers.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No hay usuarios disponibles</p>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowInviteModal(false)}>
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground"
                  disabled={selectedInvites.length === 0}
                  onClick={() => {
                    setShowInviteModal(false)
                    setSelectedInvites([])
                  }}
                >
                  Invitar ({selectedInvites.length})
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-sm p-6 shadow-xl">
            <h2 className="text-xl font-bold text-foreground mb-2">¿Abandonar grupo?</h2>
            <p className="text-muted-foreground mb-6">Dejarás de recibir mensajes de este grupo.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowLeaveConfirm(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" className="flex-1" onClick={() => setShowLeaveConfirm(false)}>
                Abandonar
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-sm p-6 shadow-xl">
            <h2 className="text-xl font-bold text-foreground mb-2">¿Eliminar grupo?</h2>
            <p className="text-muted-foreground mb-6">
              Esta acción no se puede deshacer. Todos los mensajes serán eliminados.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowDeleteConfirm(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

      {showGroupSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Configuración del Grupo</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowGroupSettings(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                <div>
                  <p className="text-sm font-medium text-foreground">Silenciar notificaciones</p>
                  <p className="text-xs text-muted-foreground">No recibir alertas de este grupo</p>
                </div>
                <input type="checkbox" className="w-5 h-5 accent-primary" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                <div>
                  <p className="text-sm font-medium text-foreground">Solo admins pueden enviar</p>
                  <p className="text-xs text-muted-foreground">Restringir mensajes a administradores</p>
                </div>
                <input type="checkbox" className="w-5 h-5 accent-primary" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                <div>
                  <p className="text-sm font-medium text-foreground">Aprobar nuevos miembros</p>
                  <p className="text-xs text-muted-foreground">Requiere aprobación para unirse</p>
                </div>
                <input type="checkbox" className="w-5 h-5 accent-primary" />
              </div>
              <Button className="w-full bg-primary text-primary-foreground" onClick={() => setShowGroupSettings(false)}>
                Guardar Configuración
              </Button>
            </div>
          </div>
        </div>
      )}

      {(showGroupMenu || showReactionPicker || showMessageMenu || showAttachMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowGroupMenu(false)
            setShowReactionPicker(null)
            setShowMessageMenu(null)
            setShowAttachMenu(false)
          }}
        />
      )}
    </div>
  )
}
