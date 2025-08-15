import React from 'react';
import { Helmet } from 'react-helmet-async';

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Login - School Events Hub</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back to School Events Hub
            </p>
          </div>
          <div className="card p-8">
            <p className="text-center text-gray-600">
              Login functionality will be implemented here.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;