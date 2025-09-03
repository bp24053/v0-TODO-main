"use client"

import { TaskItem } from "@/components/task-item"
import type { Task } from "@/app/page"

interface TaskListProps {
  tasks: Task[]
  allTasks: Task[]
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
  onToggleTask: (id: string) => void
  onAddSubtask: (title: string, parentId?: string) => void
}

export function TaskList({ tasks, allTasks, onUpdateTask, onDeleteTask, onToggleTask, onAddSubtask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No tasks yet. Add your first task above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          allTasks={allTasks}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onToggleTask={onToggleTask}
          onAddSubtask={onAddSubtask}
        />
      ))}
    </div>
  )
}
