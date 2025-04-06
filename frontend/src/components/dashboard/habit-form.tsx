"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useHabits } from "@/src/contexts/habit-context"
import { Button } from "@/src/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import LoadingSpinner from "@/src/components/ui/loading-spinner"

const habitSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  frequency: z.enum(["daily", "weekly"]),
  category: z.string().optional(),
})

type HabitFormValues = z.infer<typeof habitSchema>

interface HabitFormProps {
  open: boolean
  habitId: string | null
  onClose: () => void
}

export default function HabitForm({ open, habitId, onClose }: HabitFormProps) {
  const { getHabitById, createHabit, updateHabit, loading } = useHabits()

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: "",
      description: "",
      frequency: "daily",
      category: "",
    },
  })

  useEffect(() => {
    if (open && habitId) {
      const habit = getHabitById(habitId)
      if (habit) {
        form.reset({
          title: habit.title,
          description: habit.description,
          frequency: habit.frequency,
          category: habit.category || "",
        })
      }
    } else if (open) {
      form.reset({
        title: "",
        description: "",
        frequency: "daily",
        category: "",
      })
    }
  }, [open, habitId, getHabitById, form])

  const onSubmit = async (data: HabitFormValues) => {
    try {
      if (habitId) {
        await updateHabit(habitId, { ...data, description: data.description || "" })
      } else {
        await createHabit({ ...data, description: data.description || "" })
      }
      onClose()
    } catch (error) {
      console.error("Error saving habit:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{habitId ? "Edit Habit" : "Create New Habit"}</DialogTitle>
          <DialogDescription>
            {habitId ? "Update your habit details below" : "Add a new habit to track your progress"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Exercise, Read, Meditate..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add details about your habit..." {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>How often you want to perform this habit</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Health, Learning..." {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <LoadingSpinner /> : habitId ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

