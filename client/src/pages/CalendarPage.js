import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin,
  Users,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CalendarPage = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'

  // Mock events data - in real app, this would come from API
  const events = [
    {
      id: 1,
      title: 'Parent-Teacher Conference',
      date: '2024-01-15',
      time: '14:00',
      category: 'academic',
      child: 'Emma Johnson'
    },
    {
      id: 2,
      title: 'Spring Sports Day',
      date: '2024-01-20',
      time: '09:00',
      category: 'sports',
      child: 'Emma Johnson'
    },
    {
      id: 3,
      title: 'PTA Meeting',
      date: '2024-01-25',
      time: '19:00',
      category: 'pta',
      child: 'Alex Johnson'
    },
    {
      id: 4,
      title: 'Science Fair',
      date: '2024-01-30',
      time: '16:00',
      category: 'academic',
      child: 'Alex Johnson'
    }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-800 border-blue-200',
      sports: 'bg-green-100 text-green-800 border-green-200',
      pta: 'bg-purple-100 text-purple-800 border-purple-200',
      closure: 'bg-red-100 text-red-800 border-red-200',
      holiday: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty days for the start of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days in the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameMonth = (date) => {
    if (!date) return false;
    return date.getMonth() === currentDate.getMonth() && 
           date.getFullYear() === currentDate.getFullYear();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <>
      <Helmet>
        <title>Calendar - School Events Hub</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600">Plan ahead and view all upcoming events</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                viewMode === 'month' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                viewMode === 'week' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week
            </button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold text-gray-900">{monthName}</h2>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={goToToday}
                className="btn-secondary"
              >
                Today
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-gray-50 p-3 text-center">
                  <span className="text-sm font-medium text-gray-500">{day}</span>
                </div>
              ))}
              
              {/* Calendar Days */}
              {days.map((day, index) => {
                const dayEvents = getEventsForDate(day);
                const isCurrentMonth = isSameMonth(day);
                const isCurrentDay = isToday(day);
                
                return (
                  <div
                    key={index}
                    className={`min-h-[120px] bg-white p-2 ${
                      !isCurrentMonth ? 'text-gray-300' : ''
                    }`}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${
                          isCurrentDay 
                            ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center'
                            : ''
                        }`}>
                          {day.getDate()}
                        </div>
                        
                        {/* Events for this day */}
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <Link
                              key={event.id}
                              to={`/events/${event.id}`}
                              className={`block p-1 rounded text-xs border ${getCategoryColor(event.category)} hover:opacity-80 transition-opacity`}
                            >
                              <div className="font-medium truncate">{event.title}</div>
                              <div className="text-xs opacity-75">{formatTime(event.time)}</div>
                            </Link>
                          ))}
                          
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Plus className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Add Event</div>
                      <div className="text-sm text-gray-600">Create a new event</div>
                    </div>
                  </button>
                  
                  <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Sync Calendar</div>
                      <div className="text-sm text-gray-600">Connect with Google Calendar</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                {events.slice(0, 5).map(event => (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(event.time)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{event.child}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarPage;