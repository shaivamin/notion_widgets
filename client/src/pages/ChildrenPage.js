import React from 'react';
import { Helmet } from 'react-helmet-async';

const ChildrenPage = () => {
  return (
    <>
      <Helmet>
        <title>Children - School Events Hub</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Children</h1>
        </div>
        <div className="card p-8">
          <p className="text-center text-gray-600">
            Children management will be implemented here.
          </p>
        </div>
      </div>
    </>
  );
};

export default ChildrenPage;