import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Calendar, Edit, Trash2, Eye, AlertCircle, Plus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { Database } from '../../types/supabase';

type Event = Database['public']['Tables']['events']['Row'];

export function ManageEvents() {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    capacity: '',
    price: 'Free',
    image_url: ''
  });

  React.useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const fetchedEvents = await eventService.getEvents();
      setEvents(fetchedEvents);
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    
    const success = await eventService.deleteEvent(eventToDelete.id);
    if (success) {
      setEvents(events.filter(e => e.id !== eventToDelete.id));
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;

    try {
      const { error } = await eventService.createEvent({
        ...eventForm,
        capacity: parseInt(eventForm.capacity),
        organizer_id: profile.id,
        organizer_name: profile.name,
        organizer_contact: profile.contact || null
      });

      if (!error) {
        setFormSubmitted(true);
        // Refresh events list
        const updatedEvents = await eventService.getEvents();
        setEvents(updatedEvents);
        
        setTimeout(() => {
          setShowCreateEventModal(false);
          setFormSubmitted(false);
          setEventForm({
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
            category: '',
            capacity: '',
            price: 'Free',
            image_url: ''
          });
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.organizer_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-16 bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-[#f14621] py-16">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
            alt="Manage events"
          />
          <div className="absolute inset-0 bg-[#f14621] mix-blend-multiply opacity-90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Manage Events
            </h1>
            <p className="mt-4 text-xl text-white max-w-3xl mx-auto">
              Create, edit, and manage all events from one central location
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            to="/dashboard/admin"
            className="flex items-center text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-gray-700 border border-gray-600 rounded-lg py-2 text-white focus:ring-2 focus:ring-[#f14621] focus:border-transparent"
              />
            </div>

            <div className="flex space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg py-2 text-white focus:ring-2 focus:ring-[#f14621] focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="technical">Technical</option>
                <option value="cultural">Cultural</option>
                <option value="sports">Sports</option>
                <option value="academic">Academic</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg py-2 text-white focus:ring-2 focus:ring-[#f14621] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <button 
              onClick={() => setShowCreateEventModal(true)}
              className="bg-[#f14621] text-white px-6 py-2 rounded-lg hover:bg-[#d13d1b] transition-colors"
            >
              Create Event
            </button>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Registrations
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-[#f14621]/10 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-[#f14621]" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{event.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {event.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#f14621]/10 text-[#ff6b4a]">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        event.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        event.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {/* This would be dynamic in a real app */}
                      45 / {event.capacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button className="text-blue-400 hover:text-blue-300">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="text-yellow-400 hover:text-yellow-300">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(event)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && eventToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-4">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-white">Confirm Delete</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the event "{eventToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Create New Event</h2>
              <button 
                onClick={() => setShowCreateEventModal(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {formSubmitted ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Event Created Successfully</h3>
                <p className="text-gray-400 mb-4">
                  The event has been created and is now visible in the events list.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={eventForm.title}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={eventForm.date}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">
                      Time *
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={eventForm.time}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={eventForm.location}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={eventForm.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={eventForm.category}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Technical">Technical</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Sports">Sports</option>
                      <option value="Academic">Academic</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Seminar">Seminar</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-300 mb-1">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={eventForm.capacity}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
                      Price
                    </label>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={eventForm.price}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      placeholder="Free or ₹XXX"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="image_url" className="block text-sm font-medium text-gray-300 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      id="image_url"
                      name="image_url"
                      value={eventForm.image_url}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateEventModal(false)}
                    className="px-6 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#f14621] text-white rounded-lg hover:bg-[#d13d1b] transition-colors"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}