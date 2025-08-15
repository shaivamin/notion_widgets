import React from 'react';
import { Helmet } from 'react-helmet-async';

const SchoolsPage = () => {
  return (
    <>
      <Helmet>
        <title>Schools - School Events Hub</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Schools</h1>
        </div>
        <div className="card p-8">
          <p className="text-center text-gray-600">
            School management will be implemented here.
          </p>
        </div>
      </div>
    </>
  );
};

export default SchoolsPage;