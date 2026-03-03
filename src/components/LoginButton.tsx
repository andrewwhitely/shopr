import { useAuth0 } from '@auth0/auth0-react';
import { User } from 'lucide-react';
import { FC, useRef, useState } from 'react';
import { useUserState } from '../hooks/useUserState';
import { ProfilePopover } from './ProfilePopover';

export const LoginButton: FC = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const { user } = useUserState();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileButtonRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className='flex items-center'>
        <div className='spinner w-4 h-4' />
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className='relative'>
        <div
          ref={profileButtonRef}
          className='flex items-center gap-2 cursor-pointer rounded-full p-1 transition-colors hover:bg-warm-stone-100'
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className='w-8 h-8 rounded-full ring-2 ring-white ring-offset-1'
            />
          ) : (
            <div className='w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center'>
              <User className='w-4 h-4 text-brand-600' />
            </div>
          )}
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
        className='btn btn-secondary text-sm px-3 py-1.5'
      >
        Login
      </button>
      <button
        onClick={() =>
          loginWithRedirect({
            authorizationParams: {
              screen_hint: 'signup',
            },
          })
        }
        className='btn btn-primary text-sm px-3 py-1.5'
      >
        Sign Up
      </button>
    </div>
  );
};
