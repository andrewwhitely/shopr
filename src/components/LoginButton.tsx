import { useAuth0 } from '@auth0/auth0-react';
import { LogIn, LogOut, User } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { ProfilePopover } from './ProfilePopover';

export const LoginButton: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } =
    useAuth0();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileButtonRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className='flex items-center gap-2'>
        <div className='animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full'></div>
        <span className='text-sm text-gray-600'>Loading...</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className='relative'>
        <div className='flex items-center gap-3'>
          <div
            ref={profileButtonRef}
            className='flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-lg p-1 transition-colors'
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className='w-8 h-8 rounded-full'
              />
            ) : (
              <div className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center'>
                <User className='w-4 h-4 text-gray-600' />
              </div>
            )}
            <span className='text-sm text-gray-700 hidden sm:inline'>
              {user.name || user.email}
            </span>
          </div>
          <button
            onClick={() =>
              logout({
                logoutParams: {
                  returnTo: window.location.origin,
                },
              })
            }
            className='btn btn-secondary text-sm flex items-center gap-1'
          >
            <LogOut className='w-4 h-4' />
            <span className='hidden sm:inline'>Logout</span>
          </button>
        </div>

        <ProfilePopover
          user={user}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          triggerRef={profileButtonRef}
        />
      </div>
    );
  }

  return (
    <div className='flex items-center gap-2'>
      <button
        onClick={() => loginWithRedirect()}
        className='btn btn-primary flex items-center gap-2'
      >
        <LogIn className='w-4 h-4' />
        <span className='hidden sm:inline'>Login</span>
      </button>
      <button
        onClick={() =>
          loginWithRedirect({
            authorizationParams: {
              screen_hint: 'signup',
            },
          })
        }
        className='btn btn-secondary flex items-center gap-2'
      >
        <span className='hidden sm:inline'>Sign Up</span>
        <span className='sm:hidden'>Sign Up</span>
      </button>
    </div>
  );
};
