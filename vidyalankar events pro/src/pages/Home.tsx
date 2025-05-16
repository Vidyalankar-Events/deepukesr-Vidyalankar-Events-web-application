import React, { useState, useEffect, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { eventService } from '../services/eventService';
import { Database } from '../types/supabase';

type Event = Database['public']['Tables']['events']['Row'];

const stats = [
  { label: 'Active Users', value: '5000+' },
  { label: 'Events Hosted', value: '500+' },
  { label: 'Success Rate', value: '99%' },
  { label: 'Downloads', value: '10K+' }
];

// Memoized Carousel Controls
const CarouselControls = memo(({ 
  currentIndex, 
  totalSlides, 
  onPrev, 
  onNext, 
  onDotClick 
}) => (
  <>
    {/* Navigation arrows */}
    <button
      onClick={onPrev}
      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-colors z-10"
      aria-label="Previous slide"
    >
      <ChevronLeft size={24} />
    </button>
    
    <button
      onClick={onNext}
      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-colors z-10"
      aria-label="Next slide"
    >
      <ChevronRight size={24} />
    </button>
    
    {/* Dot indicators */}
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`w-3 h-3 rounded-full transition-colors ${
            index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  </>
));

const CarouselSlide = memo(({ image, isActive, index }) => (
  <div
    className={`absolute inset-0  transition-opacity duration-1000 ease-in-out ${
      isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}
    aria-hidden={!isActive}
  >
    {image.type === 'image' ? (
      <img
        src={image.url}
        alt={`Slide ${index + 1}`}
        className="w-full h-full object-cover"
        loading={index === 0 ? "eager" : "lazy"}
      />
    ) : (
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={image.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    )}
    <div className="absolute inset-0  bg-[#f14621] mix-blend-multiply"></div>
  </div>
));


// Main Home component
export function Home() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef(null);
  
  // Images for the carousel - memoized to prevent recreation
const images = useRef([
  {
    type: 'image',
    url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
  },
  {
    type: 'video',
    url: "public/video/first.mp4" // Replace with your actual hosted video
  },
  {
    type: 'image',
    url: "https://vsit.edu.in/images/Banner%20Slider/1.png"
  },
  {
    type: 'image',
    url: "public/video/VSIT-homescreen.png"
  }
]).current;


  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const fetchedEvents = await eventService.getEvents();
      setEvents(fetchedEvents);
      setIsLoading(false);
    };

    fetchEvents();
  }, []);
  
  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Reset timer when slide changes manually
  const goToSlide = (index) => {
    setCurrentIndex(index);
    resetTimer();
  };

  // Timer functions
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      if (isAutoPlaying) {
        timerRef.current = setInterval(nextSlide, 2000);
      }
    }
  };

  // Auto-play functionality with cleanup
  useEffect(() => {
    if (isAutoPlaying) {
      timerRef.current = setInterval(nextSlide, 2000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isAutoPlaying]);

  // Event handlers for mouse interaction
  const pauseAutoplay = () => setIsAutoPlaying(false);
  const resumeAutoplay = () => setIsAutoPlaying(true);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const handleDayMouseEnter = (date, e) => {
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

  const changeMonth = (increment) => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + increment, 1));
  };

  return (
    <div>
      {/* Hero Section - Updated with fixed 500px height */}
      <div className="relative bg-[#f14621] pt-16">
        <div 
          className="relative h-[500px] w-full overflow-hidden"
          onMouseEnter={pauseAutoplay}
          onMouseLeave={resumeAutoplay}
        >
          {/* Image slider */}
          <div className="relative h-full w-full">
            {images.map((img, index) => (
              <CarouselSlide 
                key={index}
                image={img}
                isActive={index === currentIndex}
                index={index}
              />
            ))}
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                  Manage, Join & Experience College Events at Vidyalankar
                </h1>
                <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-white max-w-3xl">
                  Your comprehensive platform for discovering, organizing, and participating in college events.
                  Join the community and never miss out on what's happening on campus.
                </p>
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center sm:justify-start">
                  <button className="bg-white text-[#f14621] px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl font-medium hover:bg-[#eccec7] transition-colors text-sm sm:text-base">
                    Get Started
                  </button>
                  <button className="border-2 border-white text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl font-medium hover:bg-white hover:text-[#f14621] transition-colors text-sm sm:text-base">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <CarouselControls
            currentIndex={currentIndex}
            totalSlides={images.length}
            onPrev={prevSlide}
            onNext={nextSlide}
            onDotClick={goToSlide}
          />
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