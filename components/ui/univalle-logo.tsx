"use client"

interface UnivalleLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function UnivalleLogo({ size = "md", showText = true, className = "" }: UnivalleLogoProps) {
  const sizes = {
    sm: { icon: "w-8 h-8", text: "text-sm" },
    md: { icon: "w-12 h-12", text: "text-lg" },
    lg: { icon: "w-16 h-16", text: "text-2xl" },
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo de Univalle estilizado */}
      <div className={`${sizes[size].icon} relative flex-shrink-0`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Escudo base */}
          <path
            d="M50 5 L90 25 L90 60 C90 80 70 95 50 95 C30 95 10 80 10 60 L10 25 Z"
            fill="currentColor"
            className="text-primary"
          />
          {/* Borde interior */}
          <path
            d="M50 12 L82 28 L82 58 C82 74 66 86 50 86 C34 86 18 74 18 58 L18 28 Z"
            fill="currentColor"
            className="text-primary-foreground"
          />
          {/* U estilizada */}
          <path
            d="M35 35 L35 55 C35 65 42 72 50 72 C58 72 65 65 65 55 L65 35 L58 35 L58 55 C58 61 54 65 50 65 C46 65 42 61 42 55 L42 35 Z"
            fill="currentColor"
            className="text-primary"
          />
          {/* Línea decorativa */}
          <rect x="30" y="75" width="40" height="4" rx="2" fill="currentColor" className="text-primary" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${sizes[size].text} text-foreground leading-tight`}>Universidad</span>
          <span className={`font-bold ${sizes[size].text} text-primary leading-tight`}>del Valle</span>
        </div>
      )}
    </div>
  )
}
