"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MessageCircle, Mail, Lock, GraduationCap, ChevronRight, User } from "lucide-react"
import { DEMO_ACCOUNTS } from "@/contexts/app-context"
import type { User as UserType } from "@/contexts/app-context"
import { UnivalleLogo } from "@/components/ui/univalle-logo"

interface LoginPageProps {
  onLoginSuccess: (user: UserType) => void
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const user = DEMO_ACCOUNTS.find((acc) => acc.email.toLowerCase() === email.toLowerCase())

    setTimeout(() => {
      setIsLoading(false)
      if (user) {
        onLoginSuccess(user)
      } else {
        setError("Credenciales inválidas. Usa una cuenta de demostración.")
      }
    }, 800)
  }

  const handleDemoLogin = (user: UserType) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLoginSuccess(user)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/10 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="flex justify-center">
            <UnivalleLogo size="lg" showText={false} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
              <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              CampusChat
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">
              Universidad del Valle - Plataforma de Comunicación
            </p>
          </div>
        </div>

        {/* Demo Accounts Section */}
        <Card className="p-4 sm:p-5 shadow-lg border-0">
          <h3 className="text-sm font-semibold text-foreground mb-2 sm:mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Cuentas de Demostración
          </h3>
          <div className="space-y-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.id}
                onClick={() => handleDemoLogin(account)}
                disabled={isLoading}
                className="w-full p-2.5 sm:p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-2 sm:gap-3 group"
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm flex-shrink-0 ${
                    account.role === "professor"
                      ? "bg-gradient-to-br from-amber-500 to-orange-600"
                      : "bg-gradient-to-br from-primary to-primary/80"
                  }`}
                >
                  {account.avatar}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <p className="font-medium text-foreground text-xs sm:text-sm truncate">{account.name}</p>
                    <span
                      className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium flex-shrink-0 ${
                        account.role === "professor"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {account.role === "professor" ? (
                        <>
                          <GraduationCap className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Profesor
                        </>
                      ) : (
                        <>
                          <User className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Estudiante
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{account.email}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        </Card>

        {/* Divider */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] sm:text-xs text-muted-foreground text-center">
            o inicia sesión con tu cuenta
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Login Card */}
        <Card className="p-4 sm:p-6 shadow-lg border-0">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {error && (
              <div className="p-2.5 sm:p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-xs sm:text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                Correo Electrónico
              </label>
              <Input
                type="email"
                placeholder="tu@correounivalle.edu.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border rounded-lg h-10 sm:h-11 text-sm"
                required
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                Contraseña
              </label>
              <Input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-border rounded-lg h-10 sm:h-11 text-sm"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-border" />
                <span className="text-muted-foreground">Recordarme</span>
              </label>
              <a href="#" className="text-primary hover:text-primary/80 font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 sm:h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg text-sm"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-border text-center text-xs sm:text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <a href="#" className="text-primary hover:text-primary/80 font-medium">
              Regístrate aquí
            </a>
          </div>
        </Card>

        {/* Footer Info */}
        <p className="text-[10px] sm:text-xs text-muted-foreground text-center px-4">
          Universidad del Valle © 2025 - CampusChat v1.0
        </p>
      </div>
    </div>
  )
}
