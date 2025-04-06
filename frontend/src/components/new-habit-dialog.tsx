"use client"

import type React from "react"
import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/src/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { Textarea } from "@/src/components/ui/textarea"
import type { Habit } from "./habit-tracker"

const colorOptions = [
  { label: "Red", value: "bg-red-500" },
  { label: "Green", value: "bg-green-500" },
  { label: "Blue", value: "bg-blue-500" },
  { label: "Purple", value: "bg-purple-500" },
  { label: "Pink", value: "bg-pink-500" },
  { label: "Orange", value: "bg-orange-500" },
  { label: "Teal", value: "bg-teal-500" },
]

interface NewHabitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddHabit: (habit: Omit<Habit, "id" | "completedDates">) => void
}

export function NewHabitDialog({ open, onOpenChange, onAddHabit }: NewHabitDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState(colorOptions[0].value)
  const [openColorSelect, setOpenColorSelect] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onAddHabit({
      name,
      description: description.trim() || undefined,
      color,
    })

    setName("")
    setDescription("")
    setColor(colorOptions[0].value)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add a New Habit</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Track a new habit you want to build. Don’t worry, you can change it later.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Habit Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., Workout, Read..."
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe your habit goal..."
                className="min-h-[80px]"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-sm font-medium">Color Tag</Label>
              <Popover open={openColorSelect} onOpenChange={setOpenColorSelect}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openColorSelect}
                    className="justify-between w-full"
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn("h-4 w-4 rounded-full", color)} />
                      {colorOptions.find((c) => c.value === color)?.label || "Choose a color"}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                  <Command>
                    <CommandInput placeholder="Search color..." />
                    <CommandList>
                      <CommandEmpty>No colors found.</CommandEmpty>
                      <CommandGroup>
                        {colorOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => {
                              setColor(option.value)
                              setOpenColorSelect(false)
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div className={cn("h-4 w-4 rounded-full", option.value)} />
                              {option.label}
                            </div>
                            <Check
                              className={cn("ml-auto h-4 w-4", color === option.value ? "opacity-100" : "opacity-0")}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto">
              Save Habit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
