import React, { useState, useEffect, useMemo } from 'react'
import dayjs from 'dayjs'

const EventModal = ({ isOpen, onClose, onSave, event, selectedDate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    color: '#3b82f6'
  })

  const [selectedYear, setSelectedYear] = useState(dayjs().year())
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month())
  const [selectedDay, setSelectedDay] = useState(dayjs().date())

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

  // Generate days based on selected month and year
  const daysInMonth = useMemo(() => {
    return dayjs().year(selectedYear).month(selectedMonth).daysInMonth()
  }, [selectedYear, selectedMonth])

  const days = useMemo(() => {
    const daysList = []
    for (let i = 1; i <= daysInMonth; i++) {
      daysList.push(i)
    }
    return daysList
  }, [daysInMonth])

  const colorOptions = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Yellow', value: '#fbbf24' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Pink', value: '#ec4899' },
  ]

  // Update formData when date components change
  useEffect(() => {
    const maxDay = daysInMonth
    const adjustedDay = selectedDay > maxDay ? maxDay : selectedDay
    if (adjustedDay !== selectedDay) {
      setSelectedDay(adjustedDay)
    }
    
    const dateString = dayjs()
      .year(selectedYear)
      .month(selectedMonth)
      .date(adjustedDay)
      .format('YYYY-MM-DD')
    
    setFormData(prev => ({ ...prev, date: dateString }))
  }, [selectedYear, selectedMonth, selectedDay, daysInMonth])

  useEffect(() => {
    if (event) {
      const eventDate = dayjs(event.date)
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        color: event.color || '#3b82f6'
      })
      setSelectedYear(eventDate.year())
      setSelectedMonth(eventDate.month())
      setSelectedDay(eventDate.date())
    } else if (selectedDate) {
      const date = dayjs(selectedDate)
      setSelectedYear(date.year())
      setSelectedMonth(date.month())
      setSelectedDay(date.date())
      setFormData(prev => ({
        ...prev,
        date: date.format('YYYY-MM-DD'),
        startTime: dayjs().format('HH:mm'),
        endTime: dayjs().add(1, 'hour').format('HH:mm')
      }))
    } else {
      const today = dayjs()
      setSelectedYear(today.year())
      setSelectedMonth(today.month())
      setSelectedDay(today.date())
      setFormData({
        title: '',
        description: '',
        date: today.format('YYYY-MM-DD'),
        startTime: today.format('HH:mm'),
        endTime: today.add(1, 'hour').format('HH:mm'),
        color: '#3b82f6'
      })
    }
  }, [event, selectedDate, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate times
    const [startH, startM] = formData.startTime.split(':').map(Number)
    const [endH, endM] = formData.endTime.split(':').map(Number)
    const startMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM

    if (endMinutes <= startMinutes) {
      alert('End time must be after start time')
      return
    }

    onSave(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {event ? 'Edit Event' : 'New Event'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Add a description (optional)"
                rows="3"
              />
            </div>

            {/* Date Selection with Year, Month, Day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      const newMonth = parseInt(e.target.value)
                      setSelectedMonth(newMonth)
                      // Adjust day if it exceeds days in new month
                      const maxDay = dayjs().year(selectedYear).month(newMonth).daysInMonth()
                      if (selectedDay > maxDay) {
                        setSelectedDay(maxDay)
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Day</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  >
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Also show standard date input for accessibility */}
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => {
                  const date = dayjs(e.target.value)
                  setFormData({ ...formData, date: e.target.value })
                  setSelectedYear(date.year())
                  setSelectedMonth(date.month())
                  setSelectedDay(date.date())
                }}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      formData.color === color.value
                        ? 'border-gray-800 scale-110 shadow-lg ring-2 ring-offset-2 ring-gray-300'
                        : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                {event ? 'Update' : 'Create'} Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EventModal
