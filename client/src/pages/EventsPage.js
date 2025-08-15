import React from 'react';
import { Helmet } from 'react-helmet-async';

const EventsPage = () => {
  return (
    <>
      <Helmet>
        <title>Events - School Events Hub</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        </div>
        <div className="card p-8">
          <p className="text-center text-gray-600">
            Events listing and management will be implemented here.
          </p>
        </div>
      </div>
    </>
  );
};

export default EventsPage;