"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TaskInput } from "@/components/task-input"
import { ChevronRight, Plus, Trash2, Palette, Tag, X, Clock, Bell, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "@/app/page"

interface TaskItemProps {
  task: Task
  allTasks: Task[]
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
  onToggleTask: (id: string) => void
  onAddSubtask: (title: string, parentId?: string) => void
  level?: number
}

const colorOptions = ["bg-primary", "bg-secondary", "bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-red-500"]

export function TaskItem({
  task,
  allTasks,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
  onAddSubtask,
  level = 0,
}: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSubtaskInput, setShowSubtaskInput] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showTagInput, setShowTagInput] = useState(false)
  const [showReminderInput, setShowReminderInput] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [reminderDateTime, setReminderDateTime] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const subtasks = allTasks.filter((t) => t.parentId === task.id)
  const hasSubtasks = subtasks.length > 0

  const now = new Date()
  const isOverdue = task.reminder && new Date(task.reminder) < now && !task.completed
  const hasUpcomingReminder = task.reminder && new Date(task.reminder) > now && !task.completed

  const handleAddSubtask = (title: string) => {
    onAddSubtask(title, task.id)
    setShowSubtaskInput(false)
  }

  const handleAddTag = () => {
    if (newTag.trim() && !task.tags.includes(newTag.trim())) {
      onUpdateTask(task.id, { tags: [...task.tags, newTag.trim()] })
      setNewTag("")
      setShowTagInput(false)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateTask(task.id, { tags: task.tags.filter((tag) => tag !== tagToRemove) })
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTag()
    } else if (e.key === "Escape") {
      setNewTag("")
      setShowTagInput(false)
    }
  }

  const handleSetReminder = () => {
    if (reminderDateTime) {
      onUpdateTask(task.id, { reminder: new Date(reminderDateTime) })
      setReminderDateTime("")
      setShowReminderInput(false)
    }
  }

  const handleRemoveReminder = () => {
    onUpdateTask(task.id, { reminder: undefined })
  }

  const handleReminderKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSetReminder()
    } else if (e.key === "Escape") {
      setReminderDateTime("")
      setShowReminderInput(false)
    }
  }

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      onDeleteTask(task.id)
    }, 200)
  }

  const formatReminderDate = (date: Date) => {
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffDays === 1) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffDays === -1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffDays < 0) {
      return `${Math.abs(diffDays)} days ago`
    } else if (diffDays <= 7) {
      return `In ${diffDays} days`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className={cn("space-y-2 animate-in slide-in-from-left-2 duration-300", level > 0 && "ml-6")}>
      <Card
        className={cn(
          "p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] group",
          task.completed && "opacity-60 scale-95",
          isOverdue && "border-destructive border-2 shadow-destructive/20",
          hasUpcomingReminder && "border-accent border-2 shadow-accent/20",
          isDeleting && "animate-out slide-out-to-right-2 scale-95 opacity-0 duration-200",
        )}
      >
        <div className="flex items-center gap-3">
          {hasSubtasks && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 h-6 w-6 hover:bg-accent/20 transition-colors duration-200"
            >
              <div className={cn("transition-transform duration-200", isExpanded && "rotate-90")}>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Button>
          )}

          <div
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              task.color,
              isOverdue && "animate-pulse",
              hasUpcomingReminder && "ring-2 ring-accent/50",
            )}
          />

          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleTask(task.id)}
            className="transition-all duration-200 hover:scale-110"
          />

          <span
            className={cn(
              "flex-1 text-sm transition-all duration-300",
              task.completed && "line-through text-muted-foreground",
            )}
          >
            {task.title}
          </span>

          {task.reminder && (
            <div className="flex items-center gap-1 animate-in fade-in duration-300">
              {isOverdue ? (
                <AlertTriangle className="h-3 w-3 text-destructive animate-pulse" />
              ) : (
                <Bell className="h-3 w-3 text-accent" />
              )}
              <span
                className={cn(
                  "text-xs transition-colors duration-200",
                  isOverdue ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {formatReminderDate(task.reminder)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveReminder}
                className="p-0 h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive/20"
              >
                <X className="h-2 w-2" />
              </Button>
            </div>
          )}

          <div className="flex items-center gap-1 flex-wrap">
            {task.tags.map((tag, index) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs group/tag cursor-pointer hover:bg-accent/20 transition-all duration-200 animate-in fade-in slide-in-from-bottom-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {tag}
                <X
                  className="ml-1 h-2 w-2 opacity-0 group-hover/tag:opacity-100 transition-opacity duration-200 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveTag(tag)
                  }}
                />
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReminderInput(!showReminderInput)}
              className="p-1 h-6 w-6 hover:bg-blue-500/20 hover:text-blue-600 transition-all duration-200"
            >
              <Clock className="h-3 w-3" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTagInput(!showTagInput)}
              className="p-1 h-6 w-6 hover:bg-purple-500/20 hover:text-purple-600 transition-all duration-200"
            >
              <Tag className="h-3 w-3" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-1 h-6 w-6 hover:bg-orange-500/20 hover:text-orange-600 transition-all duration-200"
            >
              <Palette className="h-3 w-3" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSubtaskInput(!showSubtaskInput)}
              className="p-1 h-6 w-6 hover:bg-green-500/20 hover:text-green-600 transition-all duration-200"
            >
              <Plus className="h-3 w-3" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="p-1 h-6 w-6 text-destructive hover:bg-destructive/20 hover:scale-110 transition-all duration-200"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {showReminderInput && (
          <div className="mt-3 flex gap-2 animate-in slide-in-from-top-2 duration-300">
            <Input
              type="datetime-local"
              value={reminderDateTime}
              onChange={(e) => setReminderDateTime(e.target.value)}
              onKeyDown={handleReminderKeyPress}
              className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50"
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleSetReminder}
              disabled={!reminderDateTime}
              className="transition-all duration-200 hover:scale-105"
            >
              Set Reminder
            </Button>
          </div>
        )}

        {showTagInput && (
          <div className="mt-3 flex gap-2 animate-in slide-in-from-top-2 duration-300">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleTagKeyPress}
              placeholder="Enter tag name..."
              className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-purple-500/50"
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleAddTag}
              disabled={!newTag.trim()}
              className="transition-all duration-200 hover:scale-105"
            >
              Add Tag
            </Button>
          </div>
        )}

        {showColorPicker && (
          <div className="mt-3 flex gap-2 animate-in slide-in-from-top-2 duration-300">
            {colorOptions.map((color, index) => (
              <button
                key={color}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-125 hover:shadow-lg",
                  color,
                  task.color === color
                    ? "border-foreground ring-2 ring-offset-2 ring-foreground/20"
                    : "border-transparent hover:border-foreground/30",
                )}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => {
                  onUpdateTask(task.id, { color })
                  setShowColorPicker(false)
                }}
              />
            ))}
          </div>
        )}

        {showSubtaskInput && (
          <div className="mt-3 animate-in slide-in-from-top-2 duration-300">
            <TaskInput onAddTask={handleAddSubtask} placeholder="Add a subtask..." />
          </div>
        )}
      </Card>

      {isExpanded && hasSubtasks && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
          {subtasks.map((subtask, index) => (
            <div
              key={subtask.id}
              className="animate-in slide-in-from-left-2 duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TaskItem
                task={subtask}
                allTasks={allTasks}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                onToggleTask={onToggleTask}
                onAddSubtask={onAddSubtask}
                level={level + 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
