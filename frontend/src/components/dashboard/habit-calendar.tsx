"use client"

import { useState } from "react"
import { useHabits } from "@/src/contexts/habit-context"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { cn } from "@/lib/utils"
import LoadingSpinner from "@/src/components/ui/loading-spinner"

export default function HabitCalendar() {
  const { habits, loading, markHabitCompletion } = useHabits()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedHabit, setSelectedHabit] = useState<string | "all">("all")

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const filteredHabits = selectedHabit === "all" ? habits : habits.filter((habit) => habit._id === selectedHabit)

  const toggleCompletion = async (habitId: string, date: string) => {
    const habit = habits.find((h) => h._id === habitId)
    if (!habit) return

    const isCompleted = habit.completions.some((c) => c.date === date && c.completed)

    await markHabitCompletion(habitId, date, !isCompleted)
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (habits.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <h3 className="mb-2 text-xl font-semibold">No habits to display</h3>
          <p className="text-center text-muted-foreground">Add habits to see them in the calendar view</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <CardTitle>Habit Calendar</CardTitle>
            <CardDescription>Track your habit completion over time</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedHabit} onValueChange={(value: string) => setSelectedHabit(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select habit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Habits</SelectItem>
                {habits.map((habit) => (
                  <SelectItem key={habit._id} value={habit._id}>
                    {habit.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2 text-sm font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <div key={`empty-start-${index}`} className="h-12 rounded-md p-1" />
          ))}
          {days.map((day) => {
            const dateString = format(day, "yyyy-MM-dd")
            const isToday = isSameDay(day, new Date())

            return (
              <div
                key={dateString}
                className={cn("h-12 rounded-md border p-1", isToday && "border-primary bg-primary/5")}
              >
                <div className="flex h-full flex-col">
                  <span className="text-xs">{format(day, "d")}</span>
                  <div className="mt-auto flex flex-wrap gap-1">
                    {filteredHabits.map((habit) => {
                      const isCompleted = habit.completions.some((c) => c.date === dateString && c.completed)

                      return (
                        <button
                          key={`${habit._id}-${dateString}`}
                          className={cn("h-2 w-2 rounded-full", isCompleted ? "bg-primary" : "bg-muted")}
                          onClick={() => toggleCompletion(habit._id, dateString)}
                          aria-label={`${isCompleted ? "Unmark" : "Mark"} ${habit.title} as completed on ${format(day, "MMM d, yyyy")}`}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
          {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
            <div key={`empty-end-${index}`} className="h-12 rounded-md p-1" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

