import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  School,
  Calendar,
  Bell,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ChildrenPage = () => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock children data - in real app, this would come from API
  const children = [
    {
      id: 1,
      firstName: 'Emma',
      lastName: 'Johnson',
      grade: '3',
      school: 'Lincoln Elementary',
      schoolId: 'school-1',
      dateOfBirth: '2015-08-15',
      studentId: 'STU001',
      upcomingEvents: 2,
      emergencyContact: {
        name: 'John Johnson',
        phone: '+1-555-0123',
        relationship: 'Father'
      }
    },
    {
      id: 2,
      firstName: 'Alex',
      lastName: 'Johnson',
      grade: '5',
      school: 'Lincoln Elementary',
      schoolId: 'school-1',
      dateOfBirth: '2013-03-22',
      studentId: 'STU002',
      upcomingEvents: 2,
      emergencyContact: {
        name: 'John Johnson',
        phone: '+1-555-0123',
        relationship: 'Father'
      }
    }
  ];

  const schools = [
    { id: 'school-1', name: 'Lincoln Elementary', type: 'elementary', district: 'Anytown School District' },
    { id: 'school-2', name: 'Washington Middle School', type: 'middle', district: 'Anytown School District' },
    { id: 'school-3', name: 'Jefferson High School', type: 'high', district: 'Anytown School District' }
  ];

  const getGradeColor = (grade) => {
    const colors = {
      'K': 'bg-purple-100 text-purple-800',
      '1': 'bg-blue-100 text-blue-800',
      '2': 'bg-blue-100 text-blue-800',
      '3': 'bg-green-100 text-green-800',
      '4': 'bg-green-100 text-green-800',
      '5': 'bg-yellow-100 text-yellow-800',
      '6': 'bg-orange-100 text-orange-800',
      '7': 'bg-red-100 text-red-800',
      '8': 'bg-red-100 text-red-800',
      '9': 'bg-indigo-100 text-indigo-800',
      '10': 'bg-indigo-100 text-indigo-800',
      '11': 'bg-purple-100 text-purple-800',
      '12': 'bg-purple-100 text-purple-800'
    };
    return colors[grade] || 'bg-gray-100 text-gray-800';
  };

  const getAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <>
      <Helmet>
        <title>My Children - School Events Hub</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Children</h1>
            <p className="text-gray-600">Manage your children's profiles and school connections</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Child
          </button>
        </div>

        {/* Children List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children.map((child) => (
            <div key={child.id} className="card">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {child.firstName.charAt(0)}{child.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {child.firstName} {child.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Age {getAge(child.dateOfBirth)} • Student ID: {child.studentId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* School Information */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <School className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{child.school}</p>
                      <p className="text-sm text-gray-600">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGradeColor(child.grade)}`}>
                          Grade {child.grade}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{child.emergencyContact.name}</p>
                      <p className="text-sm text-gray-600">
                        {child.emergencyContact.relationship} • {child.emergencyContact.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{child.upcomingEvents} events</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Bell className="w-4 h-4" />
                      <span>Notifications</span>
                    </div>
                  </div>
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Child Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Add Child</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">First Name</label>
                      <input type="text" className="form-input" placeholder="Enter first name" />
                    </div>
                    <div>
                      <label className="form-label">Last Name</label>
                      <input type="text" className="form-input" placeholder="Enter last name" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Date of Birth</label>
                      <input type="date" className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">Student ID (Optional)</label>
                      <input type="text" className="form-input" placeholder="Enter student ID" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="form-label">School</label>
                    <select className="form-input">
                      <option value="">Select school</option>
                      {schools.map(school => (
                        <option key={school.id} value={school.id}>
                          {school.name} ({school.type})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="form-label">Grade</label>
                    <select className="form-input">
                      <option value="">Select grade</option>
                      {['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(grade => (
                        <option key={grade} value={grade}>Grade {grade}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Contact Name</label>
                        <input type="text" className="form-input" placeholder="Enter contact name" />
                      </div>
                      <div>
                        <label className="form-label">Phone Number</label>
                        <input type="tel" className="form-input" placeholder="Enter phone number" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="form-label">Relationship</label>
                      <input type="text" className="form-input" placeholder="e.g., Father, Mother, Guardian" />
                    </div>
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button className="btn-primary">
                  Add Child
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChildrenPage;