"use client"

import { useMemo } from "react"
import { format, startOfWeek, addDays, isToday, isSameDay, parseISO } from "date-fns"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import type { Habit } from "./habit-tracker"

interface WeeklyViewProps {
  habits: Habit[]
  onToggle: (habitId: string, date: string) => void
}

export function WeeklyView({ habits, onToggle }: WeeklyViewProps) {
  const weekDays = useMemo(() => {
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 }) // Start from Monday
    return Array.from({ length: 7 }).map((_, index) => {
      const date = addDays(startDate, index)
      return {
        date,
        formattedDate: format(date, "yyyy-MM-dd"),
        dayName: format(date, "EEE"),
        dayNumber: format(date, "d"),
      }
    })
  }, [])

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center sm:text-left">Weekly Progress</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {habits.length === 0 ? (
          <p className="text-center text-muted-foreground">Add habits to see your weekly progress</p>
        ) : (
          <>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-muted-foreground">
              {weekDays.map((day) => (
                <div key={day.formattedDate} className="flex flex-col items-center gap-1">
                  <span>{day.dayName}</span>
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm",
                      isToday(day.date)
                        ? "bg-primary text-primary-foreground font-bold shadow"
                        : "text-foreground"
                    )}
                  >
                    {day.dayNumber}
                  </span>
                </div>
              ))}
            </div>

            {/* Habit Rows */}
            <div className="space-y-6">
              {habits.map((habit) => (
                <div key={habit.id} className="space-y-3">
                  {/* Habit Title */}
                  <div className="flex items-center gap-2">
                    <div className={cn("h-3 w-3 rounded-full", habit.color)} />
                    <span className="text-sm font-semibold">{habit.name}</span>
                  </div>

                  {/* Habit Check Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day) => {
                      const isCompleted = habit.completedDates.some((date) =>
                        isSameDay(parseISO(date), day.date)
                      )

                      return (
                        <button
                          key={day.formattedDate}
                          onClick={() => onToggle(habit.id, day.formattedDate)}
                          className={cn(
                            "flex h-10 w-full items-center justify-center rounded-lg border transition-colors duration-150",
                            isCompleted
                              ? `${habit.color} text-white border-transparent shadow-md`
                              : "border-dashed border-muted hover:bg-muted"
                          )}
                          aria-label={`${isCompleted ? "Unmark" : "Mark"} ${habit.name} on ${day.dayName}`}
                        >
                          {isCompleted && (
                            <span className="sr-only">Completed</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
