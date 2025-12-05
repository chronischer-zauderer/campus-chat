"use client"

import LoginPage from "@/components/login-page"
import DashboardPage from "@/components/dashboard-page"
import { AppProvider, useApp, type User } from "@/contexts/app-context"
import { ToastProvider } from "@/components/ui/toast-provider"

function AppContent() {
  const { isLoggedIn, login } = useApp()

  const handleLoginSuccess = (user: User) => {
    login(user)
  }

  return <>{!isLoggedIn ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : <DashboardPage />}</>
}

export default function Home() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  )
}
