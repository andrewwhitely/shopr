import { useAuth0 } from '@auth0/auth0-react';
import React, { FC } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  fallback,
}) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-32'>
        <div className='text-center'>
          <div className='spinner w-8 h-8 mx-auto mb-4' />
          <p className='text-sm font-body text-warm-stone-500'>Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <div className='flex items-center justify-center py-32'>
          <div className='text-center max-w-sm mx-auto px-6'>
            <h1 className='font-display text-4xl font-light text-espresso mb-3'>
              Welcome to Shopr
            </h1>
            <p className='text-sm font-body text-warm-stone-500 mb-8 leading-relaxed'>
              Log in to access your personal wishlist and start tracking the
              things you want.
            </p>
            <button
              onClick={() => loginWithRedirect()}
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
