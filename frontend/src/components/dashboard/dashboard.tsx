"use client"

import { useState, useEffect } from "react"
import { useHabits } from "@/src/contexts/habit-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import DashboardHeader from "./dashboard-header"
import HabitsList from "./habits-list"
import HabitCalendar from "./habit-calendar"
import StatsOverview from "./stats-overview"
import HabitForm from "./habit-form"
import LoadingSpinner from "@/src/components/ui/loading-spinner"

export default function Dashboard() {
  const { habits, loading, fetchHabits } = useHabits()
  const [isHabitFormOpen, setIsHabitFormOpen] = useState(false)
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null)

  useEffect(() => {
 
    fetchHabits()
    
  }, []) 

  const handleAddHabit = () => {
    setSelectedHabitId(null)
    setIsHabitFormOpen(true)
  }

  const handleEditHabit = (id: string) => {
    setSelectedHabitId(id)
    setIsHabitFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsHabitFormOpen(false)
    setSelectedHabitId(null)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader onAddHabit={handleAddHabit} />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <Tabs defaultValue="habits" className="space-y-6">
            <TabsList>
              <TabsTrigger value="habits">Habits</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            <TabsContent value="habits" className="space-y-6">
              <HabitsList onEdit={handleEditHabit} />
            </TabsContent>
            <TabsContent value="calendar">
              <HabitCalendar />
            </TabsContent>
            <TabsContent value="stats">
              <StatsOverview />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <HabitForm open={isHabitFormOpen} habitId={selectedHabitId} onClose={handleCloseForm} />
    </div>
  )
}
