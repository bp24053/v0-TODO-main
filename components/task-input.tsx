"use client"

import { cn } from "@/lib/utils"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

interface TaskInputProps {
  onAddTask: (title: string, parentId?: string) => void
  parentId?: string
  placeholder?: string
}

export function TaskInput({ onAddTask, parentId, placeholder = "Add a new task..." }: TaskInputProps) {
  const [title, setTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && !isSubmitting) {
      setIsSubmitting(true)
      await new Promise((resolve) => setTimeout(resolve, 100))
      onAddTask(title.trim(), parentId)
      setTitle("")
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={placeholder}
        className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:scale-[1.01]"
        disabled={isSubmitting}
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
  )
}
