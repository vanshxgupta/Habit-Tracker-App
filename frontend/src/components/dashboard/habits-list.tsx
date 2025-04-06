"use client"

import { useState } from "react"
import { useHabits } from "@/src/contexts/habit-context"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Badge } from "@/src/components/ui/badge"
import { CheckCircle, Edit, MoreHorizontal, Trash } from "lucide-react"
import LoadingSpinner from "@/src/components/ui/loading-spinner"

interface HabitsListProps {
  onEdit: (id: string) => void
}

export default function HabitsList({ onEdit }: HabitsListProps) {
  const { habits, loading, deleteHabit, markHabitCompletion } = useHabits()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setHabitToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (habitToDelete) {
      await deleteHabit(habitToDelete)
      setDeleteDialogOpen(false)
      setHabitToDelete(null)
    }
  }

  const today = format(new Date(), "yyyy-MM-dd")

  const dailyHabits = habits.filter((habit) => habit.frequency === "daily")
  const weeklyHabits = habits.filter((habit) => habit.frequency === "weekly")

  const toggleCompletion = async (habitId: string) => {
    const habit = habits.find((h) => h._id === habitId)
    if (!habit) return

    const isCompleted = habit.completions.some((c) => c.date === today && c.completed)

    await markHabitCompletion(habitId, today, !isCompleted)
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
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">No habits yet</h3>
          <p className="mb-4 text-center text-muted-foreground">Start tracking your habits by adding your first one</p>
          <Button onClick={() => onEdit("")}>Add Your First Habit</Button>
        </CardContent>
      </Card>
    )
  }

  const renderHabitList = (habitsList: typeof habits) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {habitsList.map((habit) => {
        const isCompleted = habit.completions.some((c) => c.date === today && c.completed)

        return (
          <Card key={habit._id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{habit.title}</CardTitle>
                  <CardDescription className="mt-1">{habit.description || "No description"}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(habit._id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(habit._id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{habit.frequency === "daily" ? "Daily" : "Weekly"}</Badge>
                    {habit.category && <Badge variant="secondary">{habit.category}</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Streak: {habit.currentStreak} (Best: {habit.longestStreak})
                    </span>
                  </div>
                </div>
                <Button
                  variant={isCompleted ? "default" : "outline"}
                  className="w-full"
                  onClick={() => toggleCompletion(habit._id)}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Completed
                    </>
                  ) : (
                    "Mark as Complete"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  return (
    <>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Habits ({habits.length})</TabsTrigger>
          <TabsTrigger value="daily">Daily ({dailyHabits.length})</TabsTrigger>
          <TabsTrigger value="weekly">Weekly ({weeklyHabits.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">{renderHabitList(habits)}</TabsContent>
        <TabsContent value="daily">{renderHabitList(dailyHabits)}</TabsContent>
        <TabsContent value="weekly">{renderHabitList(weeklyHabits)}</TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the habit and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

