"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileText,
  ImageIcon,
  Link2,
  CheckSquare,
  Download,
  Trash2,
  Search,
  Upload,
  Filter,
  X,
  Eye,
  FolderPlus,
  Share2,
  ExternalLink,
} from "lucide-react"
import { useApp } from "@/contexts/app-context"

interface FileItem {
  id: number
  name: string
  type: "pdf" | "image" | "link" | "task"
  size: string
  uploadedBy: string
  date: string
  tabs: string
  url?: string
  completed?: boolean
}

const initialFiles: FileItem[] = [
  {
    id: 1,
    name: "Notas de Clase - Semana 1",
    type: "pdf",
    size: "2.4 MB",
    uploadedBy: "Prof. Smith",
    date: "Nov 15, 2024",
    tabs: "PDFs",
  },
  {
    id: 2,
    name: "Plantilla de Tarea",
    type: "pdf",
    size: "1.8 MB",
    uploadedBy: "Tú",
    date: "Nov 10, 2024",
    tabs: "PDFs",
  },
  {
    id: 3,
    name: "Captura del Proyecto",
    type: "image",
    size: "856 KB",
    uploadedBy: "Sarah Johnson",
    date: "Nov 12, 2024",
    tabs: "Imágenes",
  },
  {
    id: 4,
    name: "Tablero de Inspiración",
    type: "image",
    size: "1.2 MB",
    uploadedBy: "Tú",
    date: "Nov 8, 2024",
    tabs: "Imágenes",
  },
  {
    id: 5,
    name: "Artículo de Investigación",
    type: "link",
    size: "Enlace Externo",
    uploadedBy: "Mike Chen",
    date: "Nov 14, 2024",
    tabs: "Enlaces",
    url: "https://example.com/research",
  },
  {
    id: 6,
    name: "Preguntas de Guía de Estudio",
    type: "task",
    size: "5 preguntas",
    uploadedBy: "Prof. Smith",
    date: "Nov 16, 2024",
    tabs: "Tareas",
    completed: false,
  },
]

export default function FilesPage() {
  const { currentUser } = useApp()
  const [activeTab, setActiveTab] = useState("Todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [files, setFiles] = useState<FileItem[]>(initialFiles)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [showPreview, setShowPreview] = useState<FileItem | null>(null)
  const [showAddLinkModal, setShowAddLinkModal] = useState(false)
  const [showFileMenu, setShowFileMenu] = useState<number | null>(null)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date")

  const [newLinkName, setNewLinkName] = useState("")
  const [newLinkUrl, setNewLinkUrl] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const tabs = ["Todos", "PDFs", "Imágenes", "Enlaces", "Tareas"]

  const filteredFiles = files
    .filter((file) => {
      const matchesTab = activeTab === "Todos" || file.tabs === activeTab
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTab && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime()
      return 0
    })

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />
      case "image":
        return <ImageIcon className="w-5 h-5 text-blue-500" />
      case "link":
        return <Link2 className="w-5 h-5 text-green-500" />
      case "task":
        return <CheckSquare className="w-5 h-5 text-purple-500" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files
    if (uploadedFiles) {
      Array.from(uploadedFiles).forEach((file) => {
        const isImage = file.type.startsWith("image/")
        const newFile: FileItem = {
          id: files.length + Math.random() * 1000,
          name: file.name,
          type: isImage ? "image" : "pdf",
          size: `${(file.size / 1024).toFixed(1)} KB`,
          uploadedBy: "Tú",
          date: new Date().toLocaleDateString("es-ES", { month: "short", day: "numeric", year: "numeric" }),
          tabs: isImage ? "Imágenes" : "PDFs",
        }
        setFiles((prev) => [newFile, ...prev])
      })
    }
    setShowUploadModal(false)
  }

  const handleAddLink = () => {
    if (newLinkName && newLinkUrl) {
      const newFile: FileItem = {
        id: files.length + Math.random() * 1000,
        name: newLinkName,
        type: "link",
        size: "Enlace Externo",
        uploadedBy: "Tú",
        date: new Date().toLocaleDateString("es-ES", { month: "short", day: "numeric", year: "numeric" }),
        tabs: "Enlaces",
        url: newLinkUrl,
      }
      setFiles((prev) => [newFile, ...prev])
      setNewLinkName("")
      setNewLinkUrl("")
      setShowAddLinkModal(false)
    }
  }

  const handleDeleteFile = (id: number) => {
    setFiles(files.filter((f) => f.id !== id))
    setShowDeleteConfirm(null)
  }

  const handleToggleTask = (id: number) => {
    setFiles(files.map((f) => (f.id === id ? { ...f, completed: !f.completed } : f)))
  }

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="h-20 bg-card border-b border-border px-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Archivos</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 bg-transparent" onClick={() => setShowAddLinkModal(true)}>
            <Link2 className="w-4 h-4 mr-2" />
            Agregar Enlace
          </Button>
          <Button
            className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg flex items-center gap-2"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload className="w-4 h-4" />
            Subir Archivo
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 px-8 py-4 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="px-8 py-4 flex items-center gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar archivos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border rounded-lg h-10"
          />
        </div>
        <div className="relative">
          <Button
            variant="outline"
            className="h-10 border-border rounded-lg flex items-center gap-2 bg-transparent"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            <Filter className="w-4 h-4" />
            Ordenar
          </Button>
          {showFilterMenu && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-card border border-border rounded-lg shadow-lg z-50 py-1">
              <button
                onClick={() => {
                  setSortBy("date")
                  setShowFilterMenu(false)
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-muted ${sortBy === "date" ? "text-primary font-medium" : "text-foreground"}`}
              >
                Por Fecha
              </button>
              <button
                onClick={() => {
                  setSortBy("name")
                  setShowFilterMenu(false)
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-muted ${sortBy === "name" ? "text-primary font-medium" : "text-foreground"}`}
              >
                Por Nombre
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <div className="space-y-2">
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors ${
                  file.type === "task" && file.completed ? "opacity-60" : ""
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted">
                  {getFileIcon(file.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`font-medium text-foreground truncate ${file.type === "task" && file.completed ? "line-through" : ""}`}
                    >
                      {file.name}
                    </h3>
                    {file.type === "link" && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {file.size} • Subido por {file.uploadedBy} • {file.date}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {file.type === "task" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 ${file.completed ? "text-green-500" : "text-muted-foreground"}`}
                      onClick={() => handleToggleTask(file.id)}
                    >
                      {file.completed ? "Completada" : "Marcar"}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPreview(file)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setShowDeleteConfirm(file.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <FolderPlus className="w-12 h-12 mb-4 opacity-50" />
              <p>No se encontraron archivos</p>
              <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setShowUploadModal(true)}>
                Subir primer archivo
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Subir Archivo</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowUploadModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-foreground font-medium mb-1">Arrastra archivos aquí o haz clic para seleccionar</p>
              <p className="text-sm text-muted-foreground">Soporta PDF, imágenes y documentos</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif"
              onChange={handleFileUpload}
            />
            <Button className="w-full mt-4" onClick={() => fileInputRef.current?.click()}>
              Seleccionar Archivos
            </Button>
          </div>
        </div>
      )}

      {/* Add Link Modal */}
      {showAddLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Agregar Enlace</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAddLinkModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Nombre del enlace</label>
                <Input
                  value={newLinkName}
                  onChange={(e) => setNewLinkName(e.target.value)}
                  placeholder="Ej: Artículo de React"
                  className="bg-input border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">URL</label>
                <Input
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="bg-input border-border"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowAddLinkModal(false)}>
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground"
                onClick={handleAddLink}
                disabled={!newLinkName || !newLinkUrl}
              >
                Agregar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-sm p-6 shadow-xl">
            <h2 className="text-xl font-bold text-foreground mb-2">Eliminar Archivo</h2>
            <p className="text-muted-foreground mb-6">
              ¿Estás seguro de que deseas eliminar este archivo? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowDeleteConfirm(null)}>
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => handleDeleteFile(showDeleteConfirm)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Vista Previa</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowPreview(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg mb-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-background">
                {getFileIcon(showPreview.type)}
              </div>
              <div>
                <h3 className="font-medium text-foreground">{showPreview.name}</h3>
                <p className="text-sm text-muted-foreground">{showPreview.size}</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Subido por:</strong> {showPreview.uploadedBy}
              </p>
              <p>
                <strong>Fecha:</strong> {showPreview.date}
              </p>
              <p>
                <strong>Tipo:</strong> {showPreview.type.toUpperCase()}
              </p>
              {showPreview.url && (
                <p>
                  <strong>URL:</strong>{" "}
                  <a
                    href={showPreview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {showPreview.url}
                  </a>
                </p>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowPreview(null)}>
                Cerrar
              </Button>
              <Button className="flex-1 bg-primary text-primary-foreground">
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
            </div>
          </div>
        </div>
      )}

      {showFilterMenu && <div className="fixed inset-0 z-40" onClick={() => setShowFilterMenu(false)} />}
    </div>
  )
}
