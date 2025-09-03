"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface TaskFiltersProps {
  filter: "all" | "active" | "completed"
  onFilterChange: (filter: "all" | "active" | "completed") => void
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  availableTags: string[]
}

export function TaskFilters({ filter, onFilterChange, selectedTags, onTagsChange, availableTags }: TaskFiltersProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const clearAllTags = () => {
    onTagsChange([])
  }

  return (
    <Card className="p-4 space-y-4 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-muted-foreground">Filter:</span>
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("all")}
          className="transition-all duration-200 hover:scale-105"
        >
          All
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("active")}
          className="transition-all duration-200 hover:scale-105"
        >
          Active
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("completed")}
          className="transition-all duration-200 hover:scale-105"
        >
          Completed
        </Button>
      </div>

      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-muted-foreground">Tags:</span>
          {availableTags.map((tag, index) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer hover:bg-accent transition-all duration-200 hover:scale-105 animate-in fade-in slide-in-from-bottom-1"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => toggleTag(tag)}
            >
              {tag}
              {selectedTags.includes(tag) && <X className="ml-1 h-3 w-3" />}
            </Badge>
          ))}
          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllTags}
              className="text-xs transition-all duration-200 hover:scale-105"
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}
