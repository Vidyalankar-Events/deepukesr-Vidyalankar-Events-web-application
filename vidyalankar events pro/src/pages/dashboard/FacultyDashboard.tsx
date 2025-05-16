import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, Bell, MessageSquare, Settings, BarChart, Plus, X, AlertCircle, Loader, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { Database } from '../../types/supabase';

type Event = Database['public']['Tables']['events']['Row'];

export function FacultyDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const fetchEvents = async () => {
      if (!profile?.id) return;
      
      setIsLoading(true);
      const fetchedEvents = await eventService.getFacultyEvents(profile.id);
      setEvents(fetchedEvents);
      setIsLoading(false);
    };

    fetchEvents();
  }, [profile?.id]);

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
        const updatedEvents = await eventService.getFacultyEvents(profile.id);
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

  const handleEditClick = (event: Event) => {
    setEventToEdit(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      capacity: event.capacity.toString(),
      price: event.price,
      image_url: event.image_url || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile || !eventToEdit) return;

    try {
      const { error } = await eventService.updateEvent(eventToEdit.id, {
        ...eventForm,
        capacity: parseInt(eventForm.capacity),
        organizer_id: profile.id,
        organizer_name: profile.name,
        organizer_contact: profile.contact || null
      });

      if (!error) {
        // Refresh events list
        const updatedEvents = await eventService.getFacultyEvents(profile.id);
        setEvents(updatedEvents);
        setShowEditModal(false);
        setEventToEdit(null);
      }
    } catch (err) {
      console.error('Error updating event:', err);
    }
  };

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete || !profile) return;
    
    const success = await eventService.deleteEvent(eventToDelete.id);
    if (success) {
      setEvents(events.filter(e => e.id !== eventToDelete.id));
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  const stats = {
    totalEvents: events.length,
    activeEvents: events.filter(e => e.status === 'approved').length,
    pendingApprovals: events.filter(e => e.status === 'pending').length,
    totalParticipants: 450 // This would be dynamic in a real app
  };

  const recentActivities = [
    { id: 1, type: 'Event', message: 'Tech Workshop 2025 approved', time: '2 hours ago' },
    { id: 2, type: 'Registration', message: '25 new registrations for Coding Competition', time: '4 hours ago' },
    { id: 3, type: 'Update', message: 'Updated Cultural Night schedule', time: '6 hours ago' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-900">
        <Loader className="w-12 h-12 text-[#f14621] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Faculty Dashboard</h1>
          <p className="mt-2 text-gray-400">Welcome back, {profile?.name}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-[#ff6b4a]" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Total Events</p>
                <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Bell className="w-8 h-8 text-[#ff6b4a]" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Active Events</p>
                <p className="text-2xl font-bold text-white">{stats.activeEvents}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-[#ff6b4a]" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Pending Approvals</p>
                <p className="text-2xl font-bold text-white">{stats.pendingApprovals}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-[#ff6b4a]" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Total Participants</p>
                <p className="text-2xl font-bold text-white">{stats.totalParticipants}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <button 
            onClick={() => setShowCreateEventModal(true)}
            className="flex items-center justify-center space-x-2 bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <Plus className="w-5 h-5 text-[#ff6b4a]" />
            <span className="text-white">Create Event</span>
          </button>
          <button 
            onClick={() => navigate('/faculty/calendar')}
            className="flex items-center justify-center space-x-2 bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <Calendar className="w-5 h-5 text-[#ff6b4a]" />
            <span className="text-white">View Calendar</span>
          </button>
          <button 
            onClick={() => navigate('/faculty/analytics')}
            className="flex items-center justify-center space-x-2 bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <BarChart className="w-5 h-5 text-[#ff6b4a]" />
            <span className="text-white">Analytics</span>
          </button>
          <button 
            onClick={() => navigate('/faculty/settings')}
            className="flex items-center justify-center space-x-2 bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <Settings className="w-5 h-5 text-[#ff6b4a]" />
            <span className="text-white">Settings</span>
          </button>
        </div>

        {/* Events List */}
        <div className="bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">My Events</h2>
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-[#f14621]/10 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-[#f14621]" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{event.title}</div>
                          <div className="text-sm text-gray-400">{event.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {event.date} • {event.time}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => navigate(`/events/register/${event.id}`)}
                          className="text-blue-400 hover:text-blue-300"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleEditClick(event)}
                          className="text-yellow-400 hover:text-yellow-300"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(event)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete"
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

        {/* Recent Activities */}
        <div className="bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Activities</h2>
          <div className="space-y-6">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="p-2 bg-[#f14621]/10 rounded-lg">
                  <Bell className="w-5 h-5 text-[#ff6b4a]" />
                </div>
                <div>
                  <p className="text-white">{activity.message}</p>
                  <p className="text-sm text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
                  Your event has been created and is now pending approval.
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

      {/* Edit Event Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Edit Event</h2>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setEventToEdit(null);
                }}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
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
                  onClick={() => {
                    setShowEditModal(false);
                    setEventToEdit(null);
                  }}
                  className="px-6 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#f14621] text-white rounded-lg hover:bg-[#d13d1b] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
    </div>
  );
}