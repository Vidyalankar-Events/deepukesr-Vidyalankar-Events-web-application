import React from 'react';
import { Users, Award, Clock, Globe } from 'lucide-react';

const team = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Principal',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    name: 'Prof. Michael Chen',
    role: 'Event Coordinator',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    name: 'Dr. Emily Rodriguez',
    role: 'Student Affairs Director',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    name: 'Prof. David Kumar',
    role: 'Technical Director',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }
];

const values = [
  {
    icon: Users,
    title: 'Community First',
    description: 'We believe in fostering a vibrant and inclusive community where everyone can participate and grow.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for excellence in every event we organize, ensuring the highest quality experiences.'
  },
  {
    icon: Clock,
    title: 'Efficiency',
    description: 'Our platform is designed to make event management seamless and time-efficient for all users.'
  },
  {
    icon: Globe,
    title: 'Innovation',
    description: 'We continuously innovate to provide cutting-edge solutions for campus event management.'
  }
];

export function About() {
  return (
    <div className="pt-16 bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-[#f14621] py-24">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
            alt="Contact support"
          />
          <div className="absolute inset-0 bg-[#f14621] mix-blend-multiply"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl mx-auto">
            Have questions about VidyalankarEvents? We're here to help!
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Our Mission</h2>
            <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto">
              To create a dynamic platform that brings together students, faculty, and staff, 
              facilitating meaningful connections and unforgettable events that enhance the 
              college experience at Vidyalankar.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Our Values</h2>
            <p className="mt-4 text-lg text-gray-400">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-[#ff6b4a] w-12 h-12 mb-4">
                  <value.icon size={32} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-24 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Our Team</h2>
            <p className="mt-4 text-lg text-gray-400">
              Meet the dedicated professionals behind VidyalankarEvents
            </p>
          </div>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="rounded-full object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                <p className="text-[#ff6b4a]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#f14621] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-white">500+</p>
              <p className="mt-2 text-white/80">Events Hosted</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white">10,000+</p>
              <p className="mt-2 text-white/80">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white">50+</p>
              <p className="mt-2 text-white/80">Partner Organizations</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white">95%</p>
              <p className="mt-2 text-white/80">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}