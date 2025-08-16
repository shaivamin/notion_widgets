import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response time for debugging
    const endTime = new Date();
    const startTime = response.config.metadata?.startTime;
    if (startTime) {
      const duration = endTime - startTime;
      console.debug(`API Request: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }
    
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle authentication errors
      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(new Error('Authentication required'));
      }
      
      // Handle forbidden errors
      if (status === 403) {
        return Promise.reject(new Error('You do not have permission to perform this action'));
      }
      
      // Handle validation errors
      if (status === 422) {
        const validationErrors = data.details || [];
        const errorMessage = validationErrors.length > 0 
          ? validationErrors.map(err => `${err.field}: ${err.message}`).join(', ')
          : 'Validation failed';
        return Promise.reject(new Error(errorMessage));
      }
      
      // Handle server errors
      if (status >= 500) {
        return Promise.reject(new Error('Server error. Please try again later.'));
      }
      
      // Handle other errors
      const errorMessage = data.error || data.message || 'An error occurred';
      return Promise.reject(new Error(errorMessage));
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please check your connection.'));
    }
    
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Authentication
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    googleAuth: '/api/auth/google',
  },
  
  // Users
  users: {
    me: '/api/users/me',
    profile: '/api/users/profile',
    changePassword: '/api/users/change-password',
    children: '/api/users/children',
    notifications: '/api/users/notifications',
  },
  
  // Events
  events: {
    list: '/api/events',
    create: '/api/events',
    detail: (id) => `/api/events/${id}`,
    update: (id) => `/api/events/${id}`,
    delete: (id) => `/api/events/${id}`,
    subscribe: (id) => `/api/events/${id}/subscribe`,
    unsubscribe: (id) => `/api/events/${id}/unsubscribe`,
    rsvp: (id) => `/api/events/${id}/rsvp`,
    categories: '/api/events/categories',
  },
  
  // Schools
  schools: {
    list: '/api/schools',
    detail: (id) => `/api/schools/${id}`,
    events: (id) => `/api/schools/${id}/events`,
    children: (id) => `/api/schools/${id}/children`,
  },
  
  // Calendar
  calendar: {
    events: '/api/calendar/events',
    sync: '/api/calendar/sync',
    export: '/api/calendar/export',
    import: '/api/calendar/import',
  },
  
  // Notifications
  notifications: {
    list: '/api/notifications',
    markRead: (id) => `/api/notifications/${id}/read`,
    markAllRead: '/api/notifications/read-all',
    settings: '/api/notifications/settings',
    test: '/api/notifications/test',
  },
  
  // Admin
  admin: {
    dashboard: '/api/admin/dashboard',
    users: '/api/admin/users',
    events: '/api/admin/events',
    schools: '/api/admin/schools',
    reports: '/api/admin/reports',
    settings: '/api/admin/settings',
  },
};

// API service functions
export const apiService = {
  // Authentication
  auth: {
    login: (credentials) => api.post(endpoints.auth.login, credentials),
    register: (userData) => api.post(endpoints.auth.register, userData),
    logout: () => api.post(endpoints.auth.logout),
    refresh: () => api.post(endpoints.auth.refresh),
    forgotPassword: (email) => api.post(endpoints.auth.forgotPassword, { email }),
    resetPassword: (token, password) => api.post(endpoints.auth.resetPassword, { token, password }),
  },
  
  // Users
  users: {
    getProfile: () => api.get(endpoints.users.me),
    updateProfile: (data) => api.put(endpoints.users.profile, data),
    changePassword: (data) => api.put(endpoints.users.changePassword, data),
    getChildren: () => api.get(endpoints.users.children),
    addChild: (childData) => api.post(endpoints.users.children, childData),
    updateChild: (id, childData) => api.put(`${endpoints.users.children}/${id}`, childData),
    deleteChild: (id) => api.delete(`${endpoints.users.children}/${id}`),
    getNotifications: (params) => api.get(endpoints.users.notifications, { params }),
  },
  
  // Events
  events: {
    getList: (params) => api.get(endpoints.events.list, { params }),
    getDetail: (id) => api.get(endpoints.events.detail(id)),
    create: (eventData) => api.post(endpoints.events.create, eventData),
    update: (id, eventData) => api.put(endpoints.events.update(id), eventData),
    delete: (id) => api.delete(endpoints.events.delete(id)),
    subscribe: (id) => api.post(endpoints.events.subscribe(id)),
    unsubscribe: (id) => api.post(endpoints.events.unsubscribe(id)),
    rsvp: (id, status) => api.post(endpoints.events.rsvp(id), { status }),
    getCategories: () => api.get(endpoints.events.categories),
  },
  
  // Schools
  schools: {
    getList: (params) => api.get(endpoints.schools.list, { params }),
    getDetail: (id) => api.get(endpoints.schools.detail(id)),
    getEvents: (id, params) => api.get(endpoints.schools.events(id), { params }),
    getChildren: (id) => api.get(endpoints.schools.children(id)),
  },
  
  // Calendar
  calendar: {
    getEvents: (params) => api.get(endpoints.calendar.events, { params }),
    sync: (provider) => api.post(endpoints.calendar.sync, { provider }),
    export: (params) => api.get(endpoints.calendar.export, { params }),
    import: (data) => api.post(endpoints.calendar.import, data),
  },
  
  // Notifications
  notifications: {
    getList: (params) => api.get(endpoints.notifications.list, { params }),
    markRead: (id) => api.put(endpoints.notifications.markRead(id)),
    markAllRead: () => api.put(endpoints.notifications.markAllRead),
    getSettings: () => api.get(endpoints.notifications.settings),
    updateSettings: (settings) => api.put(endpoints.notifications.settings, settings),
    test: (type) => api.post(endpoints.notifications.test, { type }),
  },
  
  // Admin
  admin: {
    getDashboard: () => api.get(endpoints.admin.dashboard),
    getUsers: (params) => api.get(endpoints.admin.users, { params }),
    getEvents: (params) => api.get(endpoints.admin.events, { params }),
    getSchools: (params) => api.get(endpoints.admin.schools, { params }),
    getReports: (params) => api.get(endpoints.admin.reports, { params }),
    getSettings: () => api.get(endpoints.admin.settings),
    updateSettings: (settings) => api.put(endpoints.admin.settings, settings),
  },
};

// File upload helper
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Export the configured axios instance
export default api;