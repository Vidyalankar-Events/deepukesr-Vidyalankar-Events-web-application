import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { Database } from '../../types/supabase';

type Event = Database['public']['Tables']['events']['Row'];

export function FacultyCalendar() {
  const { profile } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const fetchedEvents = await eventService.getEvents();
      setEvents(fetchedEvents);
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (increment: number) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + increment, 1));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-gray-800/50 rounded-lg"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      const isToday = date.toDateString() === new Date().toDateString();
      const dayEvents = getEventsForDate(date);
      
      days.push(
        <div 
          key={day} 
          className={`h-32 bg-gray-800 rounded-lg p-3 ${isToday ? 'ring-2 ring-[#f14621]' : ''}`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium ${isToday ? 'text-[#f14621]' : 'text-gray-300'}`}>
              {day}
            </span>
            {dayEvents.length > 0 && (
              <span className="px-2 py-0.5 text-xs bg-[#f14621]/10 text-[#ff6b4a] rounded-full">
                {dayEvents.length}
              </span>
            )}
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.map((event, index) => (
              <div 
                key={event.id}
                className="text-xs p-1 rounded bg-[#f14621]/10 text-[#ff6b4a] truncate"
                title={`${event.title} - ${event.time}`}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            to="/dashboard/faculty"
            className="flex items-center text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-md p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Event Calendar</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => changeMonth(-1)}
                className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xl font-medium text-white">
                {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </span>
              <button 
                onClick={() => changeMonth(1)}
                className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm text-gray-400 font-medium">
                {day}
              </div>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f14621]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-4">
              {generateCalendarDays()}
            </div>
          )}

          {/* Legend */}
          <div className="mt-8 flex items-center justify-center space-x-6">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-[#f14621]"></div>
              <span className="ml-2 text-sm text-gray-400">Your Events</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="ml-2 text-sm text-gray-400">Approved</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="ml-2 text-sm text-gray-400">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}