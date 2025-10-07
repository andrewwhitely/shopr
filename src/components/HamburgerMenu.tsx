import { useAuth0 } from '@auth0/auth0-react';
import { LogIn, LogOut, Menu, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useUserState } from '../hooks/useUserState';

interface HamburgerMenuProps {}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, loginWithRedirect } = useAuth0();
  const { user } = useUserState();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
    setIsOpen(false);
  };

  const handleLogin = () => {
    loginWithRedirect();
    setIsOpen(false);
  };

  return (
    <div className='relative' ref={menuRef}>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='hamburger-button p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
        aria-label='Toggle menu'
        aria-expanded={isOpen}
      >
        <div className={`hamburger-icon ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? (
            <X className='w-6 h-6 text-gray-700' />
          ) : (
            <Menu className='w-6 h-6 text-gray-700' />
          )}
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      <>
        {/* Backdrop */}
        <div
          className={`mobile-nav-backdrop fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden ${
            isOpen ? 'open' : ''
          } ${!isOpen ? 'pointer-events-none' : ''}`}
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`mobile-menu-panel fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 sm:hidden ${
            isOpen ? 'open' : ''
          } ${!isOpen ? 'pointer-events-none' : ''}`}
        >
          {/* Menu Header */}
          <div className='flex items-center justify-between p-4 border-b border-gray-200'>
            <div className='flex items-center gap-3'>
              {isAuthenticated && user ? (
                <>
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className='w-10 h-10 rounded-full'
                    />
                  ) : (
                    <div className='w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center'>
                      <User className='w-5 h-5 text-gray-600' />
                    </div>
                  )}
                  <div>
                    <p className='font-medium text-gray-900'>
                      {user.name || user.email}
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <p className='font-medium text-gray-900'>Welcome to Shopr</p>
                  <p className='text-sm text-gray-600'>Track your wishlist</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
              aria-label='Close menu'
            >
              <X className='w-5 h-5 text-gray-700' />
            </button>
          </div>

          {/* Menu Items */}
          <nav className='flex flex-col p-4 space-y-2'>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className='mobile-menu-item flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-left w-full'
              >
                <LogOut className='w-5 h-5 text-red-600' />
                <span className='font-medium text-red-600'>Logout</span>
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className='mobile-menu-item flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-left w-full'
              >
                <LogIn className='w-5 h-5 text-blue-600' />
                <span className='font-medium text-blue-600'>
                  Login / Sign Up
                </span>
              </button>
            )}
          </nav>
        </div>
      </>
    </div>
  );
};
