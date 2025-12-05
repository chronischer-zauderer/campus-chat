"use client"

import {
  Settings,
  Bell,
  Lock,
  User,
  Globe,
  LogOut,
  Palette,
  GraduationCap,
  Camera,
  X,
  Shield,
  Monitor,
  Smartphone,
  Check,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useApp, type Theme } from "@/contexts/app-context"

export default function SettingsPage() {
  const { theme, setTheme, currentUser, logout, updateUser } = useApp()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [language, setLanguage] = useState("Español")

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showSessionsModal, setShowSessionsModal] = useState(false)
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    bio: currentUser?.bio || "",
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    showEmail: true,
    showPhone: false,
    showOnlineStatus: true,
    allowMessages: "everyone" as "everyone" | "contacts" | "nobody",
  })

  // Mock sessions data
  const [sessions] = useState([
    { id: 1, device: "Chrome en Windows", location: "Cali, Colombia", lastActive: "Activo ahora", current: true },
    { id: 2, device: "Safari en iPhone", location: "Cali, Colombia", lastActive: "Hace 2 horas", current: false },
    { id: 3, device: "Firefox en MacOS", location: "Bogotá, Colombia", lastActive: "Hace 3 días", current: false },
  ])

  const themes: { value: Theme; label: string; description: string }[] = [
    { value: "light", label: "Claro", description: "Interfaz limpia y brillante" },
    { value: "dark", label: "Oscuro", description: "Cómodo para la vista" },
    { value: "institutional", label: "Institucional", description: "Colores de Univalle (Rojo)" },
  ]

  const handleSaveProfile = () => {
    if (profileForm.name.trim()) {
      updateUser({
        name: profileForm.name,
        phone: profileForm.phone,
        bio: profileForm.bio,
      })
      setShowProfileModal(false)
    }
  }

  const handleChangePassword = () => {
    setPasswordError("")
    setPasswordSuccess(false)

    if (passwordForm.currentPassword.length < 6) {
      setPasswordError("La contraseña actual es incorrecta")
      return
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres")
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden")
      return
    }

    setPasswordSuccess(true)
    setTimeout(() => {
      setShowPasswordModal(false)
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setPasswordSuccess(false)
    }, 1500)
  }

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 p-4 sm:p-6 border-b border-border bg-background">
        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
          <Settings className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Configuración</h1>
      </div>

      {/* Content - scrollable area */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4 sm:p-6 pb-8 sm:pb-12">
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 pb-6">
            {/* Account Section */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-base sm:text-lg font-semibold text-foreground">Cuenta</h2>
              </div>

              {currentUser && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-muted/50 rounded-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg flex-shrink-0 ${
                        currentUser.role === "professor"
                          ? "bg-gradient-to-br from-amber-500 to-orange-600"
                          : "bg-gradient-to-br from-primary to-primary/80"
                      }`}
                    >
                      {currentUser.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">{currentUser.name}</h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            currentUser.role === "professor"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {currentUser.role === "professor" ? (
                            <>
                              <GraduationCap className="w-3 h-3" /> Profesor
                            </>
                          ) : (
                            <>
                              <User className="w-3 h-3" /> Estudiante
                            </>
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                      {currentUser.phone && <p className="text-sm text-muted-foreground">{currentUser.phone}</p>}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div>
                    <p className="font-medium text-foreground">Información del Perfil</p>
                    <p className="text-sm text-muted-foreground">Actualiza tu nombre y foto de perfil</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto bg-transparent"
                    onClick={() => {
                      setProfileForm({
                        name: currentUser?.name || "",
                        phone: currentUser?.phone || "",
                        bio: currentUser?.bio || "",
                      })
                      setShowProfileModal(true)
                    }}
                  >
                    Configurar
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div>
                    <p className="font-medium text-foreground">Cambiar Contraseña</p>
                    <p className="text-sm text-muted-foreground">Modifica tu contraseña de acceso</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto bg-transparent"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Configurar
                  </Button>
                </div>
              </div>
            </div>

            {/* Theme Section */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border">
                <Palette className="w-5 h-5 text-primary" />
                <h2 className="text-base sm:text-lg font-semibold text-foreground">Apariencia</h2>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-3 sm:mb-4">Elige tu tema de color preferido</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {themes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                        theme === t.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-6 h-6 rounded-full flex-shrink-0 ${
                            t.value === "light"
                              ? "bg-gradient-to-br from-purple-400 to-blue-400"
                              : t.value === "dark"
                                ? "bg-gradient-to-br from-gray-700 to-gray-900"
                                : "bg-gradient-to-br from-red-700 to-red-500"
                          }`}
                        />
                        <span className="font-medium text-foreground">{t.label}</span>
                        {theme === t.value && <Check className="w-4 h-4 text-primary ml-auto" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{t.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border">
                <Bell className="w-5 h-5 text-primary" />
                <h2 className="text-base sm:text-lg font-semibold text-foreground">Notificaciones</h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">Notificaciones Push</p>
                    <p className="text-sm text-muted-foreground">Recibe notificaciones en tu dispositivo</p>
                  </div>
                  <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                      notificationsEnabled ? "bg-primary" : "bg-muted"
                    } flex items-center ${notificationsEnabled ? "justify-end" : "justify-start"} p-1`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">Notificaciones por Email</p>
                    <p className="text-sm text-muted-foreground">Recibe actualizaciones por correo</p>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                      emailNotifications ? "bg-primary" : "bg-muted"
                    } flex items-center ${emailNotifications ? "justify-end" : "justify-start"} p-1`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </button>
                </div>
              </div>
            </div>

            {/* Language Section */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="text-base sm:text-lg font-semibold text-foreground">Idioma</h2>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">Idioma de la Interfaz</p>
                  <p className="text-sm text-muted-foreground">Selecciona tu idioma preferido</p>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground w-full sm:w-auto"
                >
                  <option>Español</option>
                  <option>English</option>
                  <option>Français</option>
                  <option>Português</option>
                </select>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border">
                <Lock className="w-5 h-5 text-primary" />
                <h2 className="text-base sm:text-lg font-semibold text-foreground">Privacidad y Seguridad</h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div>
                    <p className="font-medium text-foreground">Configuración de Privacidad</p>
                    <p className="text-sm text-muted-foreground">Controla quién puede ver tu perfil</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto bg-transparent"
                    onClick={() => setShowPrivacyModal(true)}
                  >
                    Configurar
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div>
                    <p className="font-medium text-foreground">Sesiones Activas</p>
                    <p className="text-sm text-muted-foreground">Gestiona tus sesiones de inicio</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto bg-transparent"
                    onClick={() => setShowSessionsModal(true)}
                  >
                    Configurar
                  </Button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-card border border-destructive/50 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-destructive mb-3 sm:mb-4">Zona de Peligro</h3>
              <div className="space-y-2 sm:space-y-3">
                <Button variant="outline" className="w-full bg-transparent" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
                <Button variant="destructive" className="w-full" onClick={() => setShowDeleteAccountModal(true)}>
                  Eliminar Cuenta
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Editar Perfil</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowProfileModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex justify-center mb-6">
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl ${
                    currentUser?.role === "professor"
                      ? "bg-gradient-to-br from-amber-500 to-orange-600"
                      : "bg-gradient-to-br from-primary to-primary/80"
                  }`}
                >
                  {currentUser?.avatar}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Nombre completo</label>
                <Input
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="bg-input border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Teléfono</label>
                <Input
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="+57 300 123 4567"
                  className="bg-input border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Biografía</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Cuéntanos sobre ti..."
                  rows={3}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowProfileModal(false)}>
                  Cancelar
                </Button>
                <Button className="flex-1 bg-primary text-primary-foreground" onClick={handleSaveProfile}>
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Cambiar Contraseña</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowPasswordModal(false)
                  setPasswordError("")
                  setPasswordSuccess(false)
                  setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {passwordSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Contraseña actualizada</h3>
                <p className="text-muted-foreground">Tu contraseña ha sido cambiada exitosamente.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Contraseña actual</label>
                  <div className="relative">
                    <Input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="bg-input border-border pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Nueva contraseña</label>
                  <div className="relative">
                    <Input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="bg-input border-border pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Mínimo 8 caracteres</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Confirmar nueva contraseña</label>
                  <div className="relative">
                    <Input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="bg-input border-border pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 bg-primary text-primary-foreground"
                    onClick={handleChangePassword}
                    disabled={
                      !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword
                    }
                  >
                    Cambiar Contraseña
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Privacidad</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowPrivacyModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Mostrar email</p>
                  <p className="text-sm text-muted-foreground">Otros pueden ver tu correo</p>
                </div>
                <button
                  onClick={() => setPrivacySettings({ ...privacySettings, showEmail: !privacySettings.showEmail })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    privacySettings.showEmail ? "bg-primary" : "bg-muted"
                  } flex items-center ${privacySettings.showEmail ? "justify-end" : "justify-start"} p-1`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Mostrar teléfono</p>
                  <p className="text-sm text-muted-foreground">Otros pueden ver tu número</p>
                </div>
                <button
                  onClick={() => setPrivacySettings({ ...privacySettings, showPhone: !privacySettings.showPhone })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    privacySettings.showPhone ? "bg-primary" : "bg-muted"
                  } flex items-center ${privacySettings.showPhone ? "justify-end" : "justify-start"} p-1`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Estado en línea</p>
                  <p className="text-sm text-muted-foreground">Mostrar cuando estés activo</p>
                </div>
                <button
                  onClick={() =>
                    setPrivacySettings({ ...privacySettings, showOnlineStatus: !privacySettings.showOnlineStatus })
                  }
                  className={`w-12 h-6 rounded-full transition-colors ${
                    privacySettings.showOnlineStatus ? "bg-primary" : "bg-muted"
                  } flex items-center ${privacySettings.showOnlineStatus ? "justify-end" : "justify-start"} p-1`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </button>
              </div>

              <div className="pt-2">
                <p className="font-medium text-foreground mb-2">¿Quién puede enviarte mensajes?</p>
                <div className="space-y-2">
                  {[
                    { value: "everyone", label: "Todos" },
                    { value: "contacts", label: "Solo contactos" },
                    { value: "nobody", label: "Nadie" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPrivacySettings({ ...privacySettings, allowMessages: option.value as any })}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        privacySettings.allowMessages === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <span className="text-foreground">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button className="w-full mt-4" onClick={() => setShowPrivacyModal(false)}>
                Guardar Configuración
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sessions Modal */}
      {showSessionsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Sesiones Activas</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowSessionsModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 rounded-lg border ${
                    session.current ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        {session.device.includes("iPhone") || session.device.includes("Android") ? (
                          <Smartphone className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <Monitor className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{session.device}</p>
                        <p className="text-sm text-muted-foreground">{session.location}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {session.current ? (
                            <span className="text-green-600 dark:text-green-400 font-medium">Sesión actual</span>
                          ) : (
                            session.lastActive
                          )}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        Cerrar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 bg-transparent text-destructive border-destructive/50 hover:bg-destructive/10"
            >
              Cerrar todas las demás sesiones
            </Button>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-sm p-6 shadow-xl">
            <div className="flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mx-auto mb-4">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-foreground text-center mb-2">¿Eliminar cuenta?</h2>
            <p className="text-muted-foreground text-center mb-6">
              Esta acción es irreversible. Todos tus datos, mensajes y archivos serán eliminados permanentemente.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setShowDeleteAccountModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  setShowDeleteAccountModal(false)
                  logout()
                }}
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
