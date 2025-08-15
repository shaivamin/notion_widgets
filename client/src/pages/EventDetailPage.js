import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Bell, 
  ExternalLink,
  ChevronLeft,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const EventDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reminderTime, setReminderTime] = useState('60'); // Default 1 hour
  const [isReminderSet, setIsReminderSet] = useState(false);

  // Mock event data - in real app, this would come from API
  const event = {
    id: id,
    title: 'Parent-Teacher Conference',
    description: 'Join us for the quarterly parent-teacher conference to discuss your child\'s progress and address any concerns. This is a great opportunity to meet with teachers and learn about your child\'s academic and social development.',
    date: '2024-01-15',
    time: '14:00',
    endTime: '15:00',
    location: {
      name: 'Room 201',
      address: '123 Main Street, Anytown, ST 12345'
    },
    school: 'Lincoln Elementary',
    category: 'academic',
    child: 'Emma Johnson',
    grade: '3',
    teacher: 'Ms. Sarah Wilson',
    isAllDay: false,
    requiresRSVP: true,
    maxAttendees: 25,
    currentAttendees: 18,
    attachments: [
      { name: 'Conference Guidelines.pdf', url: '#' },
      { name: 'Progress Report.pdf', url: '#' }
    ],
    tags: ['parent meeting', 'academic', 'conference']
  };

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-800',
      sports: 'bg-green-100 text-green-800',
      pta: 'bg-purple-100 text-purple-800',
      closure: 'bg-red-100 text-red-800',
      holiday: 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleSetReminder = () => {
    // In real app, this would call the API to set a reminder
    setIsReminderSet(true);
    // Show success message
  };

  const handleAddToCalendar = () => {
    // In real app, this would integrate with Google Calendar, Apple Calendar, etc.
    const eventDetails = {
      title: event.title,
      start: new Date(`${event.date}T${event.time}`),
      end: new Date(`${event.date}T${event.endTime}`),
      location: event.location.name,
      description: event.description
    };
    
    // Create calendar event URL
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${eventDetails.end.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
    
    window.open(calendarUrl, '_blank');
  };

  const handleRSVP = (status) => {
    // In real app, this would call the API to RSVP
    console.log(`RSVP: ${status}`);
  };

  return (
    <>
      <Helmet>
        <title>{event.title} - School Events Hub</title>
      </Helmet>

      <div className="space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Event Header */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                  {event.requiresRSVP && (
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800">
                      RSVP Required
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                <p className="text-gray-600 mb-4">{event.description}</p>
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                    <p className="text-sm text-gray-600">
                      {formatTime(event.time)} - {formatTime(event.endTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{event.location.name}</p>
                    <p className="text-sm text-gray-600">{event.location.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Child & Teacher</p>
                    <p className="font-medium text-gray-900">{event.child} (Grade {event.grade})</p>
                    <p className="text-sm text-gray-600">{event.teacher}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* RSVP Section */}
                {event.requiresRSVP && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">RSVP</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">
                        {event.currentAttendees} of {event.maxAttendees} spots filled
                      </span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(event.currentAttendees / event.maxAttendees) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRSVP('attending')}
                        className="btn-success btn-sm"
                      >
                        I'll Attend
                      </button>
                      <button
                        onClick={() => handleRSVP('declined')}
                        className="btn-secondary btn-sm"
                      >
                        Can't Make It
                      </button>
                    </div>
                  </div>
                )}

                {/* Reminder Section */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Set Reminder</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <select
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="form-input flex-1"
                      >
                        <option value="15">15 minutes before</option>
                        <option value="30">30 minutes before</option>
                        <option value="60">1 hour before</option>
                        <option value="1440">1 day before</option>
                        <option value="10080">1 week before</option>
                      </select>
                    </div>
                    <button
                      onClick={handleSetReminder}
                      disabled={isReminderSet}
                      className={`w-full btn ${isReminderSet ? 'btn-success' : 'btn-primary'}`}
                    >
                      {isReminderSet ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Reminder Set
                        </>
                      ) : (
                        <>
                          <Bell className="w-4 h-4 mr-2" />
                          Set Reminder
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Add to Calendar Section */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Add to Calendar</h3>
                  <button
                    onClick={handleAddToCalendar}
                    className="w-full btn btn-success"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Add to Google Calendar
                  </button>
                </div>
              </div>
            </div>

            {/* Attachments */}
            {event.attachments && event.attachments.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Attachments</h3>
                <div className="space-y-2">
                  {event.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{attachment.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetailPage;