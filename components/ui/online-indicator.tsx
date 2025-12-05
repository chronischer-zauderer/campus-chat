"use client"

interface OnlineIndicatorProps {
  isOnline?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function OnlineIndicator({ isOnline = true, size = "md", className = "" }: OnlineIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }

  return (
    <span
      className={`absolute bottom-0 right-0 rounded-full border-2 border-card ${
        isOnline ? "bg-green-500" : "bg-muted-foreground/50"
      } ${sizeClasses[size]} ${className}`}
      title={isOnline ? "En línea" : "Desconectado"}
    />
  )
}
