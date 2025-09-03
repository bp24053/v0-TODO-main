"use client"

import { useState, useEffect } from "react"
import { TaskList } from "@/components/task-list"
import { TaskInput } from "@/components/task-input"
import { TaskFilters } from "@/components/task-filters"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, CheckCircle2, Circle } from "lucide-react"

export interface Task {
  id: string
  title: string
  completed: boolean
  color: string
  tags: string[]
  reminder?: Date
  parentId?: string
  children?: Task[]
  createdAt: Date
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      tasks.forEach((task) => {
        if (task.reminder && !task.completed) {
          const timeDiff = task.reminder.getTime() - now.getTime()
          // Show notification for reminders within 5 minutes
          if (timeDiff > 0 && timeDiff <= 5 * 60 * 1000) {
            if (Notification.permission === "granted") {
              new Notification(`Task Reminder: ${task.title}`, {
                body: `This task is due at ${task.reminder.toLocaleTimeString()}`,
                icon: "/favicon.ico",
              })
            }
          }
        }
      })
    }

    // Request notification permission
    if (Notification.permission === "default") {
      Notification.requestPermission()
    }

    const interval = setInterval(checkReminders, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [tasks])

  const addTask = (title: string, parentId?: string, color?: string, reminder?: Date) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      color: color || "bg-primary",
      tags: [],
      reminder,
      parentId,
      createdAt: new Date(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id && task.parentId !== id))
  }

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const filteredTasks = tasks.filter((task) => {
    if (task.parentId) return false // Only show root tasks, children are handled in TaskList

    const matchesFilter =
      filter === "all" || (filter === "active" && !task.completed) || (filter === "completed" && task.completed)

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => task.tags.includes(tag))

    return matchesFilter && matchesTags
  })

  const allTags = Array.from(new Set(tasks.flatMap((task) => task.tags)))

  const now = new Date()
  const overdueTasks = tasks.filter((task) => task.reminder && new Date(task.reminder) < now && !task.completed)
  const upcomingTasks = tasks.filter((task) => task.reminder && new Date(task.reminder) > now && !task.completed)

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Todo App
          </h1>
          <p className="text-muted-foreground">Organize your tasks with tags, colors, hierarchy, and reminders</p>

          {(overdueTasks.length > 0 || upcomingTasks.length > 0) && (
            <div className="flex justify-center gap-4 mt-4 animate-in slide-in-from-top-2 duration-300 delay-200">
              {overdueTasks.length > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="h-3 w-3" />
                  {overdueTasks.length} Overdue
                </Badge>
              )}
              {upcomingTasks.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  {upcomingTasks.length} Upcoming
                </Badge>
              )}
            </div>
          )}
        </div>

        <Card className="p-6 animate-in slide-in-from-bottom-4 duration-500 delay-100 hover:shadow-lg transition-shadow duration-300">
          <TaskInput onAddTask={addTask} />
        </Card>

        <div className="animate-in slide-in-from-bottom-4 duration-500 delay-200">
          <TaskFilters
            filter={filter}
            onFilterChange={setFilter}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            availableTags={allTags}
          />
        </div>

        <div className="animate-in slide-in-from-bottom-4 duration-500 delay-300">
          <TaskList
            tasks={filteredTasks}
            allTasks={tasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onToggleTask={toggleTask}
            onAddSubtask={addTask}
          />
        </div>

        {tasks.length > 0 && (
          <Card className="p-4 animate-in fade-in duration-500 delay-500">
            <div className="flex justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Circle className="h-4 w-4" />
                <span>{tasks.filter((t) => !t.completed).length} Active</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>{tasks.filter((t) => t.completed).length} Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-accent"></span>
                <span>{tasks.length} Total</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
