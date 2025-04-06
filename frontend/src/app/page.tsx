"use client"

import { useEffect } from "react"
import { useRouter} from "next/navigation"
import { useAuth } from "@/src/contexts/auth-context"
import Dashboard from "@/src/components/dashboard/dashboard"
import LandingPage from "@/src/components/landing-page"
import LoadingSpinner from "@/src/components/ui/loading-spinner"

export default function Home() {
  const { isAuthenticated, loading, checkAuth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return <main>{isAuthenticated ? <Dashboard /> : <LandingPage />}</main>
}

