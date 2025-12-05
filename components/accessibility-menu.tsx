"use client"

import { useState } from "react"
import { Accessibility, Type, Eye, Volume2, Moon, Sun, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/app-context"

interface AccessibilityMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function AccessibilityMenu({ isOpen, onClose }: AccessibilityMenuProps) {
  const { theme, setTheme } = useApp()
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xl">("normal")
  const [highContrast, setHighContrast] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  const handleFontSizeChange = (size: "normal" | "large" | "xl") => {
    setFontSize(size)
    const root = document.documentElement
    root.classList.remove("text-base", "text-lg", "text-xl")
    if (size === "large") {
      root.style.fontSize = "18px"
    } else if (size === "xl") {
      root.style.fontSize = "20px"
    } else {
      root.style.fontSize = "16px"
    }
  }

  const handleHighContrastToggle = () => {
    setHighContrast(!highContrast)
    document.documentElement.classList.toggle("high-contrast", !highContrast)
  }

  const handleReduceMotionToggle = () => {
    setReduceMotion(!reduceMotion)
    document.documentElement.classList.toggle("reduce-motion", !reduceMotion)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Accesibilidad</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Font Size */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium text-foreground text-sm">Tamaño de Fuente</h3>
            </div>
            <div className="flex gap-2">
              {[
                { value: "normal" as const, label: "Normal", size: "text-sm" },
                { value: "large" as const, label: "Grande", size: "text-base" },
                { value: "xl" as const, label: "Muy Grande", size: "text-lg" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFontSizeChange(option.value)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-center transition-colors ${
                    fontSize === option.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 border-border text-foreground hover:bg-muted"
                  } ${option.size}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {theme === "dark" ? (
                <Moon className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Sun className="w-4 h-4 text-muted-foreground" />
              )}
              <h3 className="font-medium text-foreground text-sm">Tema Visual</h3>
            </div>
            <div className="flex gap-2">
              {[
                { value: "light" as const, label: "Claro" },
                { value: "dark" as const, label: "Oscuro" },
                { value: "institutional" as const, label: "Univalle" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm text-center transition-colors ${
                    theme === option.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between py-3 border-y border-border">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <div>
                <h3 className="font-medium text-foreground text-sm">Alto Contraste</h3>
                <p className="text-xs text-muted-foreground">Mejora la visibilidad de textos y bordes</p>
              </div>
            </div>
            <button
              onClick={handleHighContrastToggle}
              className={`w-12 h-6 rounded-full transition-colors ${highContrast ? "bg-primary" : "bg-muted"} relative`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  highContrast ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Reduce Motion */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <div>
                <h3 className="font-medium text-foreground text-sm">Reducir Movimiento</h3>
                <p className="text-xs text-muted-foreground">Desactiva animaciones y transiciones</p>
              </div>
            </div>
            <button
              onClick={handleReduceMotionToggle}
              className={`w-12 h-6 rounded-full transition-colors ${reduceMotion ? "bg-primary" : "bg-muted"} relative`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  reduceMotion ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <Button onClick={onClose} className="w-full">
            Guardar Preferencias
          </Button>
        </div>
      </div>
    </div>
  )
}
