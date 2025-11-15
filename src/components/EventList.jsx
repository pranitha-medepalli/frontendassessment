import React, { useMemo } from 'react'
import EventItem from './EventItem'

const EventList = ({ events, date, onEventClick, onEventDelete }) => {
  // Detect conflicts by checking overlapping time ranges
  const eventsWithConflicts = useMemo(() => {
    if (events.length === 0) return []

    // Sort events by start time
    const sortedEvents = [...events].sort((a, b) => {
      const timeA = a.startTime.split(':').map(Number)
      const timeB = b.startTime.split(':').map(Number)
      const minutesA = timeA[0] * 60 + timeA[1]
      const minutesB = timeB[0] * 60 + timeB[1]
      return minutesA - minutesB
    })

    // Calculate end times and detect conflicts
    return sortedEvents.map((event, index) => {
      const [hours, minutes] = event.startTime.split(':').map(Number)
      const startMinutes = hours * 60 + minutes
      const [endHours, endMinutes] = event.endTime.split(':').map(Number)
      const endMinutesTotal = endHours * 60 + endMinutes

      // Check for conflicts with other events
      const conflicts = sortedEvents.filter((otherEvent, otherIndex) => {
        if (index === otherIndex) return false

        const [otherHours, otherMinutes] = otherEvent.startTime.split(':').map(Number)
        const otherStartMinutes = otherHours * 60 + otherMinutes
        const [otherEndHours, otherEndMinutesValue] = otherEvent.endTime.split(':').map(Number)
        const otherEndMinutes = otherEndHours * 60 + otherEndMinutesValue

        // Check if time ranges overlap
        return (
          (startMinutes < otherEndMinutes && endMinutesTotal > otherStartMinutes)
        )
      })

      return {
        ...event,
        startMinutes,
        endMinutes: endMinutesTotal,
        hasConflict: conflicts.length > 0,
        conflictCount: conflicts.length + 1, // Include self
      }
    })
  }, [events])

  if (events.length === 0) {
    return null
  }

  return (
    <div className="space-y-1.5">
      {eventsWithConflicts.map((event) => (
        <EventItem 
          key={event.id} 
          event={event}
          onEventClick={onEventClick}
          onEventDelete={onEventDelete}
        />
      ))}
      {eventsWithConflicts.some(e => e.hasConflict) && (
        <div className="text-xs text-orange-600 font-medium mt-1 flex items-center gap-1 px-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Conflict detected
        </div>
      )}
    </div>
  )
}

export default EventList
