import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, CreditCard, CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/eventService';
import { Database } from '../types/supabase';

type Event = Database['public']['Tables']['events']['Row'];

export function EventRegistration() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user, profile, isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roll_number: '',
    department: '',
    year: '',
    special_requirements: ''
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      
      setIsLoading(true);
      const fetchedEvent = await eventService.getEventById(eventId);
      setEvent(fetchedEvent);
      setIsLoading(false);
       
      // Pre-fill form with user data if available
      if (profile) {
        setFormData(prev => ({
          ...prev,
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.contact || '',
          department: profile.department || '',
          year: profile.year || ''
        }));
      }
    };

    fetchEvent();
  }, [eventId, profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event || !user) return;
    
    try {
      const { data, error } = await eventService.registerForEvent(
        event.id,
        user.id,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          roll_number: formData.roll_number,
          department: formData.department,
          year: formData.year,
          special_requirements: formData.special_requirements || null
        }
      );
      
      if (error) {
        console.error('Registration error:', error);
        return;
      }
      
      // Show success state
      setRegistrationComplete(true);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/events/registered');
      }, 3000);
    } catch (err) {
      console.error('Error registering for event:', err);
    }
  };

  // Check if event is in the past
  const isEventPast = event ? new Date(event.date) < new Date() : false;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 text-[#f14621] animate-spin" />
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Event Not Found</h2>
          <p className="mt-2 text-gray-600">The event you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/events')}
            className="mt-4 bg-[#f14621] text-white px-6 py-2 rounded-lg hover:bg-[#d13d1b] transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-gray-900">Sign In Required</h2>
          <p className="mt-2 text-gray-600">You need to sign in to register for this event.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/login', { state: { returnUrl: `/events/register/${eventId}` } })}
              className="bg-[#f14621] text-white px-6 py-3 rounded-xl hover:bg-[#d13d1b] transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (registrationComplete) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">
              You have successfully registered for {event.title}. A confirmation email has been sent to your registered email address.
            </p>
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center text-gray-700 mb-2">
                <Calendar className="w-5 h-5 mr-2 text-[#f14621]" />
                <span>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })} • {event.time}
                </span>
              </div>
              <div className="flex items-center justify-center text-gray-700">
                <MapPin className="w-5 h-5 mr-2 text-[#f14621]" />
                <span>{event.location}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/events/registered')}
                className="bg-[#f14621] text-white px-6 py-3 rounded-xl hover:bg-[#d13d1b] transition-colors"
              >
                View My Registrations
              </button>
              <button 
                onClick={() => navigate('/events')}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Browse More Events
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="relative bg-[#f14621] py-16">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src={event.image_url || "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"}
            alt={event.title}
          />
          <div className="absolute inset-0 bg-[#f14621] mix-blend-multiply opacity-90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Register for {event.title}
            </h1>
            <p className="mt-4 text-xl text-white max-w-3xl mx-auto">
              Complete the form below to secure your spot at this event
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
              <div className="h-48 relative">
                <img 
                  src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-[#f14621]">{event.category}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{event.title}</h3>
                <p className="text-gray-600 mb-6">{event.description}</p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-3 text-[#f14621]" />
                    <span>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })} • {event.time}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-[#f14621]" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users className="w-5 h-5 mr-3 text-[#f14621]" />
                    <span>Capacity: {event.capacity}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CreditCard className="w-5 h-5 mr-3 text-[#f14621]" />
                    <span>Registration Fee: {event.price}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Organized by:</h4>
                  <p className="text-gray-600">{event.organizer_name}</p>
                  {event.organizer_contact && (
                    <p className="text-gray-600 mt-1">{event.organizer_contact}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Registration Form</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="roll_number" className="block text-sm font-medium text-gray-700 mb-1">
                      Roll Number / ID *
                    </label>
                    <input
                      type="text"
                      id="roll_number"
                      name="roll_number"
                      value={formData.roll_number}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                      <option value="Business Administration">Business Administration</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                      Year of Study *
                    </label>
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="First Year">First Year</option>
                      <option value="Second Year">Second Year</option>
                      <option value="Third Year">Third Year</option>
                      <option value="Fourth Year">Fourth Year</option>
                      <option value="Faculty">Faculty</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="special_requirements" className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requirements or Questions
                  </label>
                  <textarea
                    id="special_requirements"
                    name="special_requirements"
                    value={formData.special_requirements}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                  ></textarea>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 rounded border-gray-300 text-[#f14621] focus:ring-[#f14621]"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the event terms and conditions
                  </label>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#f14621] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#d13d1b] transition-colors"
                  >
                    Complete Registration
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}