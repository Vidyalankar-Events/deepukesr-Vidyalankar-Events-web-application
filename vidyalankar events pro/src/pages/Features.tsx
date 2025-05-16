import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Bell, MessageSquare, Settings, CheckCircle, ArrowRight } from 'lucide-react';

const features = [
  {
    title: 'User Roles & Authentication',
    description: 'Secure access for students, faculty, and admins with role-specific dashboards',
    icon: Users
  },
  {
    title: 'Event Discovery',
    description: 'Find and filter events by category with our intuitive calendar view',
    icon: Calendar
  },
  {
    title: 'Real-Time Updates',
    description: 'Stay informed with instant notifications and event reminders',
    icon: Bell
  },
  {
    title: 'Interactive Forum',
    description: 'Engage in discussions and connect with event organizers',
    icon: MessageSquare
  },
  {
    title: 'Admin Control',
    description: 'Comprehensive tools for event management and analytics',
    icon: Settings
  },
  {
    title: 'Easy Registration',
    description: 'One-click registration with digital tickets and QR codes',
    icon: CheckCircle
  }
];

export function Features() {
  return (
    <div className="pt-16 bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-[#f14621] py-24">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
            alt="College event features"
          />
          <div className="absolute inset-0 bg-[#f14621] mix-blend-multiply opacity-90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              Powerful Features for Seamless Events
            </h1>
            <p className="mt-6 text-xl text-white max-w-3xl mx-auto">
              Discover all the tools and features that make VidyalankarEvents the perfect platform for managing and experiencing college events.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white sm:text-4xl">
              Everything you need to manage college events
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-400">
              Powerful features designed to make event management seamless and engaging
            </p>
          </div>

          <div className="mt-12 sm:mt-20 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-[#ff6b4a] w-12 h-12">
                  <feature.icon size={32} />
                </div>
                <h3 className="mt-4 text-lg font-medium text-white">{feature.title}</h3>
                <p className="mt-2 text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
            <p className="mt-4 text-lg text-gray-400">
              Join thousands of students and faculty members already using VidyalankarEvents
            </p>
            <Link 
              to="/signup"
              className="inline-block mt-8 bg-[#f14621] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#d13d1b] transition-colors backdrop-blur-sm bg-opacity-80 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Create Your Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}