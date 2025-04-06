"use client"

import { format, startOfToday } from "date-fns"
import { Check, MoreVertical, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"

import type { Habit } from "./habit-tracker"

interface HabitListProps {
  habits: Habit[]
  onToggle: (habitId: string, date: string) => void
  onDelete: (habitId: string) => void
}

export function HabitList({ habits, onToggle, onDelete }: HabitListProps) {
  const today = format(startOfToday(), "yyyy-MM-dd")

  return (
    <Card className="shadow-lg border border-muted rounded-2xl bg-background">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold tracking-tight">Today&apos;s Habits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {habits.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">No habits yet. Add one to get started!</p>
        ) : (
          habits.map((habit) => {
            const isCompleted = habit.completedDates.includes(today)

            return (
              <div
                key={habit.id}
                className={cn(
                  "flex items-center justify-between gap-4 p-4 rounded-xl border group transition-all hover:shadow-md",
                  isCompleted ? "bg-green-50 border-green-200" : "bg-card"
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border border-muted transition-colors",
                      isCompleted ? "bg-green-500 text-white" : "bg-muted"
                    )}
                  >
                    {isCompleted && <Check className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-foreground">{habit.name}</h3>
                    {habit.description && (
                      <p className="text-sm text-muted-foreground">{habit.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={isCompleted ? "secondary" : "outline"}
                    onClick={() => onToggle(habit.id, today)}
                    className={cn(
                      "text-xs",
                      isCompleted && "hover:bg-green-600 hover:text-white"
                    )}
                  >
                    {isCompleted ? "Completed" : "Mark Complete"}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onDelete(habit.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
