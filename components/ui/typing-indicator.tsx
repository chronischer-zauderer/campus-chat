"use client"

interface TypingIndicatorProps {
  users: string[]
}

export function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) return null

  const text =
    users.length === 1
      ? `${users[0]} está escribiendo`
      : users.length === 2
        ? `${users[0]} y ${users[1]} están escribiendo`
        : `${users[0]} y otros están escribiendo`

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground animate-in fade-in duration-300">
      <div className="flex gap-1">
        <span
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <span>{text}</span>
    </div>
  )
}
