import React, { useState } from 'react'
import dayjs from 'dayjs'

const EventItem = ({ event, onEventClick, onEventDelete }) => {
  const [showActions, setShowActions] = useState(false)
  
  const [startH, startM] = event.startTime.split(':').map(Number)
  const [endH, endM] = event.endTime.split(':').map(Number)
  const timeString = dayjs().hour(startH).minute(startM).format('h:mm A')
  const endTimeString = dayjs().hour(endH).minute(endM).format('h:mm A')

  const handleClick = (e) => {
    e.stopPropagation()
    if (onEventClick) {
      onEventClick(event)
    }
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Delete "${event.title}"?`)) {
      onEventDelete(event.id)
    }
    setShowActions(false)
  }

  // Build tooltip text
  const tooltipText = event.description 
    ? `${event.title}\n${timeString} - ${endTimeString}\n\n${event.description}`
    : `${event.title}\n${timeString} - ${endTimeString}`

  return (
    <div
      className="group relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={`text-xs p-1.5 rounded-md cursor-pointer transition-all hover:shadow-sm ${
          event.hasConflict ? 'opacity-90' : ''
        }`}
        style={{
          backgroundColor: `${event.color}20`,
          borderLeft: `3px solid ${event.color}`,
          color: event.color
        }}
        onClick={handleClick}
        title={tooltipText}
      >
        <div className="font-semibold truncate text-[11px]">{event.title}</div>
        <div className="text-[10px] opacity-75 mt-0.5">{timeString}</div>
        {event.description && (
          <div className="text-[10px] opacity-65 mt-0.5 line-clamp-1 italic truncate">
            {event.description}
          </div>
        )}
      </div>
      
      {showActions && (
        <div className="absolute right-0 top-0 bg-white shadow-lg rounded-lg border border-gray-200 z-10 flex gap-1 p-1">
          <button
            onClick={handleClick}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default EventItem
