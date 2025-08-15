import React from 'react';
import { Helmet } from 'react-helmet-async';

const NotificationsPage = () => {
  return (
    <>
      <Helmet>
        <title>Notifications - School Events Hub</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>
        <div className="card p-8">
          <p className="text-center text-gray-600">
            Notification management will be implemented here.
          </p>
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;