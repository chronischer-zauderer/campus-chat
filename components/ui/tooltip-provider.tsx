"use client"

import { type ReactNode, createContext, useContext } from "react"

const TooltipContext = createContext<boolean>(false)

export function useTooltipContext() {
  return useContext(TooltipContext)
}

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <TooltipContext.Provider value={true}>{children}</TooltipContext.Provider>
}
