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
      <div className="p-6 border-b bg-background text-foreground">
        <Button 
          className="w-full cursor-pointer text-foreground text-white dark:bg-transparent dark:border-gray-200"
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