"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { HabitList } from "./habit-list"
import { NewHabitDialog } from "./new-habit-dialog"
import { WeeklyView } from "./weekly-view"

export type Habit = {
  id: string
  name: string
  description?: string
  color: string
  completedDates: string[]
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [isNewHabitDialogOpen, setIsNewHabitDialogOpen] = useState(false)

  // Load habits from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits")
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits))
    }
  }, [])

  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits))
  }, [habits])

  const addHabit = (habit: Omit<Habit, "id" | "completedDates">) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      completedDates: [],
    }
    setHabits((prev) => [...prev, newHabit])
  }

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === habitId) {
          const isCompleted = habit.completedDates.includes(date)
          return {
            ...habit,
            completedDates: isCompleted
              ? habit.completedDates.filter((d) => d !== date)
              : [...habit.completedDates, date],
          }
        }
        return habit
      })
    )
  }

  const deleteHabit = (habitId: string) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== habitId))
  }

  return (
    <div className="container max-w-6xl mx-auto py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Your Habits</h2>
          <p className="text-sm text-muted-foreground">
            {habits.length > 0
              ? `You're tracking ${habits.length} habit${habits.length > 1 ? "s" : ""}.`
              : "Start tracking your habits today!"}
          </p>
        </div>
        <Button onClick={() => setIsNewHabitDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </div>

      {/* Habit Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <HabitList habits={habits} onToggle={toggleHabitCompletion} onDelete={deleteHabit} />
        <WeeklyView habits={habits} onToggle={toggleHabitCompletion} />
      </div>

      {/* Modal for New Habit */}
      <NewHabitDialog
        open={isNewHabitDialogOpen}
        onOpenChange={setIsNewHabitDialogOpen}
        onAddHabit={addHabit}
      />
    </div>
  )
}
