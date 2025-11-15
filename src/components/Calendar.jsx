import React, { useState, useMemo } from 'react'
import dayjs from 'dayjs'
import EventList from './EventList'
import EventModal from './EventModal'

const Calendar = ({ events = [], onAddEvent, onUpdateEvent, onDeleteEvent }) => {
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [selectedDate, setSelectedDate] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  const monthStart = currentDate.startOf('month')
  const monthEnd = currentDate.endOf('month')
  const startDate = monthStart.startOf('week')
  const endDate = monthEnd.endOf('week')

  const calendarDays = useMemo(() => {
    const days = []
    let day = startDate
    while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
      days.push(day)
      day = day.add(1, 'day')
    }
    return days
  }, [startDate, endDate])

  // Generate years (current year ± 10 years)
  const years = useMemo(() => {
    const currentYear = dayjs().year()
    const yearList = []
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      yearList.push(i)
    }
    return yearList
  }, [])

  // Generate months
  const months = useMemo(() => {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
  }, [])

  const goToPreviousMonth = () => {
    setCurrentDate(prev => prev.subtract(1, 'month'))
  }

  const goToNextMonth = () => {
    setCurrentDate(prev => prev.add(1, 'month'))
  }

  const goToToday = () => {
    setCurrentDate(dayjs())
  }

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value)
    setCurrentDate(prev => prev.year(newYear))
  }

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value)
    setCurrentDate(prev => prev.month(newMonth))
  }

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = dayjs(event.date)
      return eventDate.isSame(date, 'day')
    })
  }

  const isCurrentMonth = (date) => {
    return date.isSame(currentDate, 'month')
  }

  const isToday = (date) => {
    return date.isSame(dayjs(), 'day')
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    setEditingEvent(null)
    setIsModalOpen(true)
  }

  const handleEventClick = (event) => {
    setEditingEvent(event)
    setSelectedDate(dayjs(event.date))
    setIsModalOpen(true)
  }

  const handleEventDelete = (eventId) => {
    if (onDeleteEvent) {
      onDeleteEvent(eventId)
    }
  }

  const handleSaveEvent = (formData) => {
    if (editingEvent) {
      // Update existing event
      if (onUpdateEvent) {
        onUpdateEvent(editingEvent.id, formData)
      }
    } else {
      // Create new event
      if (onAddEvent) {
        onAddEvent({
          ...formData,
          id: Date.now().toString()
        })
      }
    }
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <>
      <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
                aria-label="Previous month"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Year and Month Selectors */}
              <div className="flex items-center gap-2">
                <select
                  value={currentDate.month()}
                  onChange={handleMonthChange}
                  className="bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                  style={{ 
                    color: 'white',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  {months.map((month, index) => (
                    <option key={index} value={index} style={{ color: '#1f2937', backgroundColor: 'white' }}>
                      {month}
                    </option>
                  ))}
                </select>
                
                <select
                  value={currentDate.year()}
                  onChange={handleYearChange}
                  className="bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                  style={{ 
                    color: 'white',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  {years.map(year => (
                    <option key={year} value={year} style={{ color: '#1f2937', backgroundColor: 'white' }}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
                aria-label="Next month"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={goToToday}
                className="px-5 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors font-medium"
              >
                Today
              </button>
              <button
                onClick={() => {
                  setSelectedDate(dayjs())
                  setEditingEvent(null)
                  setIsModalOpen(true)
                }}
                className="px-5 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Event
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          <div className="grid grid-cols-7 gap-2">
            {/* Week day headers */}
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-3 text-center text-sm font-bold text-gray-600 uppercase tracking-wide"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((date, idx) => {
              const dayEvents = getEventsForDate(date)
              const isCurrentMonthDay = isCurrentMonth(date)
              const isTodayDate = isToday(date)

              return (
                <div
                  key={idx}
                  className={`min-h-[160px] p-3 border border-gray-200 rounded-xl transition-all cursor-pointer flex flex-col ${
                    !isCurrentMonthDay
                      ? 'bg-gray-50 opacity-40'
                      : 'bg-white hover:bg-gray-50 hover:shadow-md'
                  } ${isTodayDate ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50' : ''}`}
                  onClick={() => handleDateClick(date)}
                >
                  <div className="flex items-center justify-between mb-2 flex-shrink-0">
                    <div
                      className={`text-sm font-semibold ${
                        isTodayDate
                          ? 'bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md'
                          : isCurrentMonthDay
                          ? 'text-gray-800'
                          : 'text-gray-400'
                      }`}
                    >
                      {date.format('D')}
                    </div>
                    {dayEvents.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto max-h-[120px]">
                    <EventList 
                      events={dayEvents} 
                      date={date}
                      onEventClick={handleEventClick}
                      onEventDelete={handleEventDelete}
                    />
                  </div>
                  {dayEvents.length === 0 && (
                    <div className="text-xs text-gray-400 text-center mt-auto pt-2">
                      Click to add event
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingEvent(null)
          setSelectedDate(null)
        }}
        onSave={handleSaveEvent}
        event={editingEvent}
        selectedDate={selectedDate}
      />
    </>
  )
}

export default Calendar
