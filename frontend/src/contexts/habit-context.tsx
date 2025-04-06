"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { API_URL } from "@/lib/config"
import { useToast } from "@/src/components/ui/use-toast"

export interface Habit {
  _id: string
  title: string
  description: string
  frequency: "daily" | "weekly"
  category?: string
  completions: {
    date: string
    completed: boolean
  }[]
  createdAt: string
  updatedAt: string
  currentStreak: number
  longestStreak: number
}

interface HabitFormData {
  title: string
  description: string
  frequency: "daily" | "weekly"
  category?: string
}

interface HabitContextType {
  habits: Habit[]
  loading: boolean
  error: string | null
  fetchHabits: () => Promise<void>
  createHabit: (habitData: HabitFormData) => Promise<void>
  updateHabit: (id: string, habitData: HabitFormData) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  markHabitCompletion: (id: string, date: string, completed: boolean) => Promise<void>
  getHabitById: (id: string) => Habit | undefined
  getCompletionStats: () => {
    total: number
    completed: number
    completionRate: number
    dailyHabits: number
    weeklyHabits: number
  }
}

const HabitContext = createContext<HabitContextType | undefined>(undefined)

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  const fetchHabits = async () => {
    if (!isAuthenticated) return

    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/habits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch habits")
      }

      const data = await response.json()
      setHabits(data)
    } catch (error: any) {
      setError(error.message || "An error occurred while fetching habits")
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load habits",
      })
    } finally {
      setLoading(false)
    }
  }

  const createHabit = async (habitData: HabitFormData) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/habits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(habitData),
      })

      if (!response.ok) {
        throw new Error("Failed to create habit")
      }

      const newHabit = await response.json()
      setHabits((prevHabits) => [...prevHabits, newHabit])
      toast({
        title: "Success",
        description: "Habit created successfully",
      })
    } catch (error: any) {
      setError(error.message || "An error occurred while creating the habit")
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create habit",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateHabit = async (id: string, habitData: HabitFormData) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/habits/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(habitData),
      })

      if (!response.ok) {
        throw new Error("Failed to update habit")
      }

      const updatedHabit = await response.json()
      setHabits((prevHabits) =>
        prevHabits.map((habit) => (habit._id === id ? updatedHabit : habit))
      )
      toast({
        title: "Success",
        description: "Habit updated successfully",
      })
    } catch (error: any) {
      setError(error.message || "An error occurred while updating the habit")
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update habit",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteHabit = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/habits/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete habit")
      }

      setHabits((prevHabits) =>
        prevHabits.filter((habit) => habit._id !== id)
      )
      toast({
        title: "Success",
        description: "Habit deleted successfully",
      })
    } catch (error: any) {
      setError(error.message || "An error occurred while deleting the habit")
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete habit",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const markHabitCompletion = async (id: string, date: string, completed: boolean) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/habits/${id}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date, completed }),
      })

      if (!response.ok) {
        throw new Error("Failed to update habit completion")
      }

      const updatedHabit = await response.json()
      setHabits((prevHabits) =>
        prevHabits.map((habit) => (habit._id === id ? updatedHabit : habit))
      )
    } catch (error: any) {
      setError(error.message || "An error occurred while updating habit completion")
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update habit completion",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getHabitById = (id: string) => {
    return habits.find((habit) => habit._id === id)
  }

  const getCompletionStats = () => {
    const total = habits.length
    const dailyHabits = habits.filter((habit) => habit.frequency === "daily").length
    const weeklyHabits = habits.filter((habit) => habit.frequency === "weekly").length

    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    let totalCompletions = 0
    let completedCompletions = 0

    habits.forEach((habit) => {
      const recentCompletions = habit.completions.filter((completion) => {
        const completionDate = new Date(completion.date)
        return completionDate >= startOfWeek
      })

      totalCompletions += recentCompletions.length
      completedCompletions += recentCompletions.filter((c) => c.completed).length
    })

    const completionRate =
      totalCompletions > 0
        ? Math.round((completedCompletions / totalCompletions) * 100)
        : 0

    return {
      total,
      completed: completedCompletions,
      completionRate,
      dailyHabits,
      weeklyHabits,
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchHabits()
    }
  }, [isAuthenticated])

  return (
    <HabitContext.Provider
      value={{
        habits,
        loading,
        error,
        fetchHabits,
        createHabit,
        updateHabit,
        deleteHabit,
        markHabitCompletion,
        getHabitById,
        getCompletionStats,
      }}
    >
      {children}
    </HabitContext.Provider>
  )
}

export function useHabits() {
  const context = useContext(HabitContext)
  if (context === undefined) {
    throw new Error("useHabits must be used within a HabitProvider")
  }
  return context
}