import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Bell, 
  Users, 
  Plus, 
  Clock, 
  MapPin,
  ChevronRight,
  BookOpen,
  Trophy,
  Users as UsersIcon,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  // Mock data - in real app, this would come from API
  const upcomingEvents = [
    {
      id: 1,
      title: 'Parent-Teacher Conference',
      date: '2024-01-15',
      time: '14:00',
      location: 'Room 201',
      school: 'Lincoln Elementary',
      category: 'academic',
      child: 'Emma Johnson',
      grade: '3'
    },
    {
      id: 2,
      title: 'Spring Sports Day',
      date: '2024-01-20',
      time: '09:00',
      location: 'School Gym',
      school: 'Lincoln Elementary',
      category: 'sports',
      child: 'Emma Johnson',
      grade: '3'
    },
    {
      id: 3,
      title: 'PTA Meeting',
      date: '2024-01-25',
      time: '19:00',
      location: 'Library',
      school: 'Lincoln Elementary',
      category: 'pta',
      child: 'Alex Johnson',
      grade: '5'
    },
    {
      id: 4,
      title: 'Science Fair',
      date: '2024-01-30',
      time: '16:00',
      location: 'Gymnasium',
      school: 'Lincoln Elementary',
      category: 'academic',
      child: 'Alex Johnson',
      grade: '5'
    }
  ];

  const children = [
    {
      id: 1,
      name: 'Emma Johnson',
      grade: '3',
      school: 'Lincoln Elementary',
      upcomingEvents: 2
    },
    {
      id: 2,
      name: 'Alex Johnson',
      grade: '5',
      school: 'Lincoln Elementary',
      upcomingEvents: 2
    }
  ];

  const quickActions = [
    {
      title: 'Add Child',
      description: 'Register a new child',
      icon: Plus,
      href: '/children',
      color: 'bg-blue-500'
    },
    {
      title: 'View Calendar',
      description: 'See all events',
      icon: Calendar,
      href: '/calendar',
      color: 'bg-purple-500'
    },
    {
      title: 'Notifications',
      description: 'Manage preferences',
      icon: Bell,
      href: '/notifications',
      color: 'bg-orange-500'
    }
  ];

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
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <>
      <Helmet>
        <title>Home - School Events Hub</title>
      </Helmet>

      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-blue-100">
            You have {upcomingEvents.length} upcoming events this week.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className="card p-4 hover:shadow-medium transition-shadow cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Events - Primary User Journey */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
                  <Link to="/calendar" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Calendar
                  </Link>
                </div>
              </div>
              <div className="card-body">
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <Link
                        key={event.id}
                        to={`/events/${event.id}`}
                        className="block"
                      >
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-gray-900 truncate">{event.title}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(event.category)}`}>
                                {event.category}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-sm text-gray-500">{event.school} • {event.child} (Grade {event.grade})</p>
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
                    <p className="text-gray-600 mb-4">You're all caught up! Check back later for new events.</p>
                    <Link to="/calendar" className="btn-primary">
                      View Calendar
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Children Overview */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">My Children</h2>
                <Link to="/children" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Manage
                </Link>
              </div>
            </div>
            <div className="card-body">
              {children.length > 0 ? (
                <div className="space-y-4">
                  {children.map((child) => (
                    <div key={child.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {child.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{child.name}</h3>
                        <p className="text-sm text-gray-600">
                          Grade {child.grade} • {child.school}
                        </p>
                        <p className="text-xs text-gray-500">
                          {child.upcomingEvents} upcoming event{child.upcomingEvents !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No children added</h3>
                  <p className="text-gray-600 mb-4">Add your children to start tracking their school events.</p>
                  <Link to="/children" className="btn-primary">
                    Add Child
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-semibold text-gray-900">{upcomingEvents.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Academic</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {upcomingEvents.filter(e => e.category === 'academic').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sports</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {upcomingEvents.filter(e => e.category === 'sports').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reminders</p>
                <p className="text-2xl font-semibold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;