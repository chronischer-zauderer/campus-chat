"use client"

import { type ReactNode, useState } from "react"

interface TooltipWrapperProps {
  children: ReactNode
  content: string
  position?: "top" | "bottom" | "left" | "right"
}

export function TooltipWrapper({ children, content, position = "top" }: TooltipWrapperProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute ${positionClasses[position]} z-50 px-2 py-1 text-xs font-medium text-popover-foreground bg-popover border border-border rounded shadow-md whitespace-nowrap animate-in fade-in duration-150`}
        >
          {content}
        </div>
      )}
    </div>
  )
}
