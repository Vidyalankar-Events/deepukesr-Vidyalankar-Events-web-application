import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { eventService } from '../services/eventService';
import { Database } from '../types/supabase';

type Event = Database['public']['Tables']['events']['Row'];

const stats = [
  { label: 'Active Users', value: '5000+' },
  { label: 'Events Hosted', value: '500+' },
  { label: 'Success Rate', value: '99%' },
  { label: 'Downloads', value: '10K+' }
];

export function Home() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const handleDayMouseEnter = (date: Date, e: React.MouseEvent) => {
    setHoveredDate(date);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleDayMouseLeave = () => {
    setHoveredDate(null);
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 sm:h-16 md:h-24 bg-gray-50/10 rounded-lg"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
      const isToday = date.toDateString() === new Date().toDateString();
      const dayEvents = getEventsForDate(date);
      
      days.push(
        <div 
          key={day} 
          className={`relative h-12 sm:h-16 md:h-24 bg-gray-50/10 rounded-lg p-1 sm:p-2 ${
            isToday ? 'ring-2 ring-[#f14621]' : ''
          } cursor-pointer hover:bg-gray-50/20 transition-colors`}
          onMouseEnter={(e) => handleDayMouseEnter(date, e)}
          onMouseLeave={handleDayMouseLeave}
        >
          <div className="flex justify-between items-start">
            <span className={`text-xs sm:text-sm font-medium text-gray-200 ${isToday ? 'text-[#f14621]' : ''}`}>
              {day}
            </span>
            {dayEvents.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-[#f14621]/20 text-[#ff6b4a] rounded-full">
                {dayEvents.length}
              </span>
            )}
          </div>
          {dayEvents.length > 0 && (
            <div className="mt-1 hidden sm:block">
              {dayEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="text-xs font-medium text-[#ff6b4a] truncate"
                  title={`${event.title} - ${event.time}`}
                >
                  {event.title}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const changeMonth = (increment: number) => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + increment, 1));
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-[#f14621] pt-16">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Students at college event"
          />
          <div className="absolute inset-0 bg-[#f14621] mix-blend-multiply"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-16 sm:py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
            Manage, Join & Experience College Events at Vidyalankar
          </h1>
          <p className="mt-6 text-lg text-white max-w-3xl">
            Your comprehensive platform for discovering, organizing, and participating in college events.
            Join the community and never miss out on what's happening on campus.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-[#f14621] px-8 py-3 rounded-xl font-medium hover:bg-[#eccec7] transition-colors">
              Get Started
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-medium hover:bg-white hover:text-[#f14621] transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Calendar and Events Section */}
      <div className="py-16 sm:py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white sm:text-4xl">
              Upcoming Events
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-400">
              Discover and participate in exciting events happening at Vidyalankar
            </p>
          </div>

          {/* Calendar */}
          <div className="bg-gray-800 rounded-2xl p-4 sm:p-8 mb-16">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-0">Event Calendar</h2>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => changeMonth(-1)}
                  className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                  Previous
                </button>
                <span className="text-base sm:text-xl font-medium text-white">
                  {months[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
                </span>
                <button 
                  onClick={() => changeMonth(1)}
                  className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-2 sm:mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs sm:text-sm text-gray-400 font-medium">
                  {day}
                </div>
              ))}
            </div>

            <div className="relative">
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f14621]"></div>
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-2 sm:gap-4">
                  {generateCalendarDays()}
                </div>
              )}

              {/* Hover Card */}
              {hoveredDate && (
                <div 
                  className="absolute z-50 bg-gray-900 rounded-xl shadow-xl p-4 w-80"
                  style={{
                    left: `${mousePosition.x + 16}px`,
                    top: `${mousePosition.y + 16}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="text-sm text-gray-400 mb-2">
                    {hoveredDate.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  {getEventsForDate(hoveredDate).length > 0 ? (
                    <div className="space-y-3">
                      {getEventsForDate(hoveredDate).map((event) => (
                        <Link
                          key={event.id}
                          to={`/events/register/${event.id}`}
                          className="block bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors"
                        >
                          <h4 className="font-medium text-white mb-2">{event.title}</h4>
                          <div className="flex items-center text-gray-400 text-sm mb-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTime(event.time)}
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400">No events scheduled</div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#f14621]"></div>
                <span className="ml-2 text-xs sm:text-sm text-gray-400">Event Scheduled</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-50/10"></div>
                <span className="ml-2 text-xs sm:text-sm text-gray-400">No Events</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#f14621]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-1 text-sm sm:text-base text-[#eccec7]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}