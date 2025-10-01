import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
}) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
          <div className='text-center max-w-md mx-auto p-6'>
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              Welcome to Shopr
            </h1>
            <p className='text-gray-600 mb-6'>
              Please log in to access your personal wishlist and start tracking
              your items.
            </p>
            <button
              onClick={() => window.location.reload()}
              className='btn btn-primary'
            >
              Login to Continue
            </button>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};
