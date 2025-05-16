import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, Users, TrendingUp, Filter } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Radar } from 'react-chartjs-2';
import { eventService } from '../../services/eventService';
import { Database } from '../../types/supabase';

type Event = Database['public']['Tables']['events']['Row'];

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Chart theme colors
const chartColors = {
  primary: '#f14621',
  primaryLight: 'rgba(241, 70, 33, 0.2)',
  categories: [
    'rgba(241, 70, 33, 0.8)',   // Primary
    'rgba(59, 130, 246, 0.8)',  // Blue
    'rgba(234, 179, 8, 0.8)',   // Yellow
    'rgba(16, 185, 129, 0.8)',  // Green
    'rgba(139, 92, 246, 0.8)',  // Purple
    'rgba(249, 115, 22, 0.8)'   // Orange
  ]
};

export function Reports() {
  const [selectedReport, setSelectedReport] = useState('events');
  const [dateRange, setDateRange] = useState('month');
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const fetchedEvents = await eventService.getEvents();
      setEvents(fetchedEvents);
      setIsLoading(false);
    };

    fetchEvents();

    // Set up real-time subscription
    const subscription = eventService.subscribeToEvents((payload) => {
      if (payload.eventType === 'INSERT') {
        setEvents(prev => [...prev, payload.new]);
      } else if (payload.eventType === 'UPDATE') {
        setEvents(prev => prev.map(event => 
          event.id === payload.new.id ? payload.new : event
        ));
      } else if (payload.eventType === 'DELETE') {
        setEvents(prev => prev.filter(event => event.id !== payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Update date range based on selection
  useEffect(() => {
    const now = new Date();
    let start = new Date();

    switch (dateRange) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(now.toISOString().split('T')[0]);
  }, [dateRange]);

  // Filter events by date range
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
  });

  // Prepare data for category distribution
  const categoryData = {
    labels: ['Technical', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Seminar'],
    datasets: [{
      data: categoryLabels.map(category => 
        filteredEvents.filter(event => event.category === category).length
      ),
      backgroundColor: chartColors.categories,
      borderColor: chartColors.categories.map(color => color.replace('0.8', '1')),
      borderWidth: 1
    }]
  };

  // Prepare data for participation trends
  const participationData = {
    labels: getDateLabels(startDate, endDate),
    datasets: [{
      label: 'Event Participation',
      data: getDateLabels(startDate, endDate).map(date => 
        filteredEvents
          .filter(event => event.date === date)
          .reduce((sum, event) => sum + event.capacity, 0)
      ),
      fill: true,
      backgroundColor: chartColors.primaryLight,
      borderColor: chartColors.primary,
      tension: 0.4
    }]
  };

  // Prepare data for department-wise registration
  const departmentData = {
    labels: ['CS', 'IT', 'Electronics', 'Mechanical', 'Civil'],
    datasets: [{
      label: 'Registration Count',
      data: departmentLabels.map(dept =>
        filteredEvents.reduce((sum, event) => {
          const deptCount = event.registrations?.filter(reg => reg.department === dept).length || 0;
          return sum + deptCount;
        }, 0)
      ),
      backgroundColor: chartColors.categories[0]
    }]
  };

  // Prepare data for feedback analysis
  const feedbackData = {
    labels: ['Content', 'Organization', 'Venue', 'Timing', 'Interaction', 'Overall'],
    datasets: [{
      label: 'Average Rating',
      data: feedbackLabels.map(aspect =>
        calculateAverageRating(filteredEvents, aspect)
      ),
      backgroundColor: chartColors.primaryLight,
      borderColor: chartColors.primary,
      pointBackgroundColor: chartColors.primary,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: chartColors.primary
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#fff',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: '600'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13
        },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6
      }
    },
    scales: {
      r: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        pointLabels: {
          color: '#fff',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        },
        ticks: {
          backdropColor: 'transparent',
          color: '#fff'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      }
    }
  };

  const handleExport = () => {
    // Generate PDF report
    const reportData = {
      title: 'Event Analytics Report',
      dateRange: `${startDate} to ${endDate}`,
      charts: {
        categories: categoryData,
        participation: participationData,
        departments: departmentData,
        feedback: feedbackData
      },
      summary: {
        totalEvents: filteredEvents.length,
        totalParticipants: filteredEvents.reduce((sum, event) => sum + event.capacity, 0),
        averageRating: calculateAverageRating(filteredEvents, 'overall')
      }
    };

    // TODO: Implement PDF generation and download
    console.log('Exporting report:', reportData);
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-[#f14621] py-16">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
            alt="Reports and Analytics"
          />
          <div className="absolute inset-0 bg-[#f14621] mix-blend-multiply opacity-90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Reports & Analytics
            </h1>
            <p className="mt-4 text-xl text-white max-w-3xl mx-auto">
              Generate detailed reports and analyze event performance metrics
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

        {/* Report Controls */}
        <div className="bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-[#f14621] focus:border-transparent"
            >
              <option value="events">Event Analytics</option>
              <option value="users">User Statistics</option>
              <option value="registrations">Registration Trends</option>
              <option value="feedback">Feedback Analysis</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-[#f14621] focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>

            <div className="flex gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-[#f14621] focus:border-transparent"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-[#f14621] focus:border-transparent"
              />
            </div>

            <button 
              onClick={handleExport}
              className="bg-[#f14621] text-white px-6 py-2 rounded-lg hover:bg-[#d13d1b] transition-colors flex items-center whitespace-nowrap"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f14621]"></div>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-[#ff6b4a]" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Total Events</p>
                    <p className="text-2xl font-bold text-white">{filteredEvents.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-[#ff6b4a]" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Total Participants</p>
                    <p className="text-2xl font-bold text-white">
                      {filteredEvents.reduce((sum, event) => sum + event.capacity, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-[#ff6b4a]" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Avg. Attendance</p>
                    <p className="text-2xl font-bold text-white">
                      {Math.round(
                        (filteredEvents.reduce((sum, event) => sum + event.capacity, 0) / 
                        (filteredEvents.length || 1)) * 100
                      )}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center">
                  <Filter className="w-8 h-8 text-[#ff6b4a]" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Avg. Rating</p>
                    <p className="text-2xl font-bold text-white">
                      {calculateAverageRating(filteredEvents, 'overall').toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Event Categories */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Event Categories</h3>
                <div className="h-[300px]">
                  <Pie data={categoryData} options={chartOptions} />
                </div>
              </div>

              {/* Participation Trends */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Participation Trends</h3>
                <div className="h-[300px]">
                  <Line data={participationData} options={chartOptions} />
                </div>
              </div>

              {/* Department-wise Registration */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Department-wise Registration</h3>
                <div className="h-[300px]">
                  <Bar data={departmentData} options={chartOptions} />
                </div>
              </div>

              {/* Feedback Ratings */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Event Feedback Analysis</h3>
                <div className="h-[300px]">
                  <Radar data={feedbackData} options={chartOptions} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Helper functions
const categoryLabels = ['Technical', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Seminar'];
const departmentLabels = ['CS', 'IT', 'Electronics', 'Mechanical', 'Civil'];
const feedbackLabels = ['content', 'organization', 'venue', 'timing', 'interaction', 'overall'];

function getDateLabels(start: string, end: string): string[] {
  const dates = [];
  let current = new Date(start);
  const endDate = new Date(end);

  while (current <= endDate) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function calculateAverageRating(events: Event[], aspect: string): number {
  const ratings = events
    .filter(event => event.feedback && event.feedback[aspect])
    .map(event => event.feedback[aspect]);

  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
}