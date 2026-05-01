"use client"

import { Plus } from "lucide-react"

import { DatePicker } from "./date-picker"
import { Button } from "@/components/ui/button"

interface CalendarSidebarProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  onNewCalendar?: () => void
  onNewEvent?: () => void
  events?: Array<{ date: Date; count: number }>
  className?: string
}

export function CalendarSidebar({ 
  selectedDate,
  onDateSelect,
  onNewCalendar,
  onNewEvent,
  events = [],
  className 
}: CalendarSidebarProps) {
  return (
    <div className={`flex flex-col h-full bg-background text-foreground ${className}`}>
      {/* Add New Event Button */}
      <div className="border-b border-border/60 bg-background p-6 text-foreground dark:border-white/15">
        <Button 
          className="w-full cursor-pointer bg-foreground text-background hover:bg-foreground/90 dark:border-border dark:bg-transparent dark:text-foreground dark:hover:bg-accent"
          onClick={onNewEvent}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Event
        </Button>
      </div>

      {/* Date Picker */}
      <DatePicker
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        events={events}
      />

      <div className="flex-1" />
    </div>
  )
}