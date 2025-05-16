import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Lock, Globe, Moon, Mail, Save, RefreshCw } from 'lucide-react';

export function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('en');
  const [timeZone, setTimeZone] = useState('Asia/Kolkata');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate saving settings
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-[#f14621] py-16">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
            alt="Settings"
          />
          <div className="absolute inset-0 bg-[#f14621] mix-blend-multiply opacity-90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              System Settings
            </h1>
            <p className="mt-4 text-xl text-white max-w-3xl mx-auto">
              Configure and customize your VidyalankarEvents experience
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

        {/* Settings Form */}
        <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <form onSubmit={handleSaveSettings} className="p-6">
            {/* Notifications Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-[#f14621]" />
                Notification Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Email Notifications</h3>
                    <p className="text-gray-400 text-sm">Receive updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f14621]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f14621]"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Push Notifications</h3>
                    <p className="text-gray-400 text-sm">Get instant updates in browser</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pushNotifications}
                      onChange={(e) => setPushNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f14621]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f14621]"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Event Reminders</h3>
                    <p className="text-gray-400 text-sm">Get reminders before events</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={eventReminders}
                      onChange={(e) => setEventReminders(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f14621]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f14621]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Moon className="w-5 h-5 mr-2 text-[#f14621]" />
                Display Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Dark Mode</h3>
                    <p className="text-gray-400 text-sm">Use dark theme</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f14621]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f14621]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Localization Settings */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-[#f14621]" />
                Localization Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="language" className="block text-white font-medium mb-2">
                    Language
                  </label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#f14621] focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="mr">Marathi</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="timezone" className="block text-white font-medium mb-2">
                    Time Zone
                  </label>
                  <select
                    id="timezone"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#f14621] focus:border-transparent"
                  >
                    <option value="Asia/Kolkata">India (GMT+5:30)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">New York (GMT-4)</option>
                    <option value="Europe/London">London (GMT+1)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-[#f14621]" />
                Security Settings
              </h2>
              <div className="space-y-4">
                <button
                  type="button"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset API Keys
                </button>
              </div>
            </div>

            {/* Email Settings */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-[#f14621]" />
                Email Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="smtp_host" className="block text-white font-medium mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    id="smtp_host"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#f14621] focus:border-transparent"
                    placeholder="smtp.example.com"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="smtp_port" className="block text-white font-medium mb-2">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      id="smtp_port"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#f14621] focus:border-transparent"
                      placeholder="587"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="smtp_security" className="block text-white font-medium mb-2">
                      Security
                    </label>
                    <select
                      id="smtp_security"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#f14621] focus:border-transparent"
                    >
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#f14621] text-white px-6 py-2 rounded-lg hover:bg-[#d13d1b] transition-colors flex items-center"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}