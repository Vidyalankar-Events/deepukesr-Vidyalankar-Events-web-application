import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export function Contact() {
  return (
    <div className="pt-16 bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-[#f14621] py-24">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
            alt="Contact support team"
          />
          <div className="absolute inset-0 bg-[#f14621] mix-blend-multiply opacity-90"></div>
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

      {/* Contact Information */}
      <div className="py-24 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">Send us a Message</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="mt-1 block w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="mt-1 block w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-[#f14621] focus:ring-[#f14621]"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#f14621] text-white px-6 py-3 rounded-lg hover:bg-[#d13d1b] transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-[#ff6b4a] mt-1" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Address</h3>
                    <p className="mt-2 text-gray-300">
                      Vidyalankar Campus<br />
                      Wadala (E), Mumbai - 400037<br />
                      Maharashtra, India
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-[#ff6b4a] mt-1" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Phone</h3>
                    <p className="mt-2 text-gray-300">+91 22 2416 1126</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-[#ff6b4a] mt-1" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Email</h3>
                    <p className="mt-2 text-gray-300">info@vidyalankarevents.edu</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-[#ff6b4a] mt-1" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Office Hours</h3>
                    <p className="mt-2 text-gray-300">
                      Monday - Friday: 9:00 AM - 5:00 PM<br />
                      Saturday: 9:00 AM - 1:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-12">
                <h3 className="text-lg font-medium text-white mb-4">Location</h3>
                <div className="h-64 bg-gray-700 rounded-lg">
                  {/* Map iframe would go here */}
                  <div className="w-full h-full rounded-lg bg-gray-700 flex items-center justify-center">
                    <p className="text-gray-400">Map View</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-400">
              Find quick answers to common questions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-medium text-white">How do I register for an event?</h3>
              <p className="mt-2 text-gray-300">
                Simply log in to your account, browse the events, and click the "Register" button on any event you're interested in.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-medium text-white">Can I organize my own event?</h3>
              <p className="mt-2 text-gray-300">
                Yes! Faculty members and authorized student organizations can create and manage their own events through the platform.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-medium text-white">How do I get notifications?</h3>
              <p className="mt-2 text-gray-300">
                Enable notifications in your account settings to receive updates about events you're interested in or registered for.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-medium text-white">Is there a mobile app?</h3>
              <p className="mt-2 text-gray-300">
                Yes, our mobile app is available for both iOS and Android devices. Download it from your respective app store.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}