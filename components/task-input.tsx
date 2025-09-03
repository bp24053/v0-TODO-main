"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Calendar, Palette, X } from "lucide-react"

interface TaskInputProps {
  onAddTask: (title: string, parentId?: string, color?: string, reminder?: Date) => void
  parentId?: string
  placeholder?: string
}

export function TaskInput({ onAddTask, parentId, placeholder = "Add a new task..." }: TaskInputProps) {
  const [title, setTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedColor, setSelectedColor] = useState("bg-primary")
  const [reminderDate, setReminderDate] = useState("")

  const colors = [
    "bg-primary",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && !isSubmitting) {
      setIsSubmitting(true)
      await new Promise((resolve) => setTimeout(resolve, 100))

      const reminder = reminderDate ? new Date(reminderDate) : undefined
      onAddTask(title.trim(), parentId, selectedColor, reminder)

      setTitle("")
      setSelectedColor("bg-primary")
      setReminderDate("")
      setIsExpanded(false)
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setTitle("")
    setSelectedColor("bg-primary")
    setReminderDate("")
    setIsExpanded(false)
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={placeholder}
          className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:scale-[1.01]"
          disabled={isSubmitting}
          onFocus={() => setIsExpanded(true)}
        />
        <Button
          type="submit"
          size="sm"
          className="shrink-0 transition-all duration-200 hover:scale-105 disabled:scale-100"
          disabled={isSubmitting || !title.trim()}
        >
          <Plus className={cn("h-4 w-4 transition-transform duration-200", isSubmitting && "animate-spin")} />
          {isSubmitting ? "Adding..." : "Add Task"}
        </Button>
      </form>

      {isExpanded && (
        <div className="animate-in slide-in-from-top-2 duration-200 space-y-3 p-3 bg-muted/30 rounded-lg border">
          {/* Color Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Palette className="h-4 w-4" />
              Color
            </div>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110",
                    color,
                    selectedColor === color ? "border-foreground scale-110" : "border-muted-foreground/30",
                  )}
                />
              ))}
            </div>
          </div>

          {/* Reminder Date Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Reminder (Optional)
            </div>
            <Input
              type="datetime-local"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="w-full"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="transition-all duration-200 hover:scale-105 bg-transparent"
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
