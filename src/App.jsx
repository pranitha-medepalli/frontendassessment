import React, { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import eventsData from './data/events.json'

function App() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    // Load events from JSON file
    setEvents(eventsData)
  }, [])

  const handleAddEvent = (newEvent) => {
    setEvents([...events, newEvent])
  }

  const handleUpdateEvent = (eventId, updatedEvent) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...updatedEvent, id: eventId } : event
    ))
  }

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Calendar App
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your events and schedule with ease
          </p>
        </header>
        <Calendar 
          events={events}
          onAddEvent={handleAddEvent}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>
    </div>
  )
}

export default App
