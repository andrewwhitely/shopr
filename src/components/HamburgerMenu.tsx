import { useAuth0 } from '@auth0/auth0-react';
import { LogIn, LogOut, Mail, Menu, PenSquare, Save, ShoppingBag, X } from 'lucide-react';
import { FC, useEffect, useRef, useState } from 'react';
import { useWishlistStats } from '../contexts/WishlistContext';
import { useProfileEdit } from '../hooks/useProfileEdit';
import { useUserState } from '../hooks/useUserState';
import { formatCurrency } from '../utils/helpers';

interface HamburgerMenuProps {}

const getInitials = (name?: string) =>
  (name ?? '')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

export const HamburgerMenu: FC<HamburgerMenuProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, loginWithRedirect } = useAuth0();
  const { user } = useUserState();
  const { itemCount, totalValue } = useWishlistStats();
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    isEditing,
    isSaving,
    saveError,
    saveSuccess,
    editedUser,
    setEditedUser,
    setIsEditing,
    handleSave,
    handleCancel,
  } = useProfileEdit(user);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isEditing) {
          handleCancel();
        } else {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isEditing, handleCancel]);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    setIsOpen(false);
  };

  const handleLogin = () => {
    loginWithRedirect();
    setIsOpen(false);
  };

  const initials = getInitials(user?.name);

  return (
    <div className='relative' ref={menuRef}>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='hamburger-button p-2 rounded-lg text-warm-stone-600 hover:bg-warm-stone-100 focus:outline-none'
        aria-label='Toggle menu'
        aria-expanded={isOpen}
      >
        <div className={`hamburger-icon ${isOpen ? 'rotate-90' : ''}`}>
          {isOpen ? (
            <X className='w-5 h-5' />
          ) : (
            <Menu className='w-5 h-5' />
          )}
        </div>
      </button>

      <>
        {/* Backdrop */}
        <div
          className={`mobile-nav-backdrop fixed inset-0 bg-espresso/40 z-40 sm:hidden ${
            isOpen ? 'open' : ''
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`mobile-menu-panel fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl z-50 sm:hidden ${
            isOpen ? 'open' : ''
          } ${!isOpen ? 'pointer-events-none' : ''}`}
        >
          {/* Panel Header — profile section */}
          <div className='px-5 py-4 border-b border-warm-stone-100'>
            <div className='flex items-start justify-between'>
              {isAuthenticated && user ? (
                <div className='flex items-start gap-3 flex-1 min-w-0'>
                  {/* Avatar */}
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name ?? 'Profile'}
                      className='w-10 h-10 rounded-full ring-2 ring-warm-stone-100 ring-offset-1 flex-shrink-0 mt-0.5'
                    />
                  ) : (
                    <div className='w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-warm-stone-100 ring-offset-1 mt-0.5'>
                      <span className='font-body font-semibold text-brand-600 text-xs'>
                        {initials || '?'}
                      </span>
                    </div>
                  )}

                  {/* Name / edit fields */}
                  <div className='flex-1 min-w-0'>
                    {isEditing ? (
                      <div className='space-y-1.5'>
                        <input
                          type='text'
                          value={editedUser.name}
                          onChange={(e) =>
                            setEditedUser({ ...editedUser, name: e.target.value })
                          }
                          className='input w-full text-sm'
                          placeholder='Full name'
                          autoFocus
                        />
                        <input
                          type='text'
                          value={editedUser.nickname}
                          onChange={(e) =>
                            setEditedUser({ ...editedUser, nickname: e.target.value })
                          }
                          className='input w-full text-xs'
                          placeholder='Nickname'
                        />
                      </div>
                    ) : (
                      <>
                        <p className='font-display text-lg font-light text-espresso leading-tight truncate'>
                          {user.name || user.email}
                        </p>
                        <p className='font-mono text-xs text-warm-stone-400 truncate'>
                          @{user.nickname || user.email?.split('@')[0] || '—'}
                        </p>
                      </>
                    )}

                    {/* Email */}
                    {!isEditing && user.email && (
                      <div className='flex items-center gap-1.5 mt-1'>
                        <Mail className='w-3 h-3 text-warm-stone-400 flex-shrink-0' />
                        <span className='font-body text-xs text-warm-stone-500 truncate'>
                          {user.email}
                        </span>
                      </div>
                    )}

                    {/* Wishlist stats */}
                    {!isEditing && (
                      <div className='flex items-center gap-1.5 mt-2 px-2.5 py-1.5 bg-warm-stone-50 rounded-lg'>
                        <ShoppingBag className='w-3 h-3 text-brand-500 flex-shrink-0' />
                        <span className='font-mono text-xs text-warm-stone-600'>
                          {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          {totalValue > 0 && (
                            <> · <span className='text-espresso'>{formatCurrency(totalValue)}</span></>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Save/Cancel when editing */}
                    {isEditing && (
                      <div className='flex gap-1.5 mt-2'>
                        <button
                          onClick={() => handleSave()}
                          disabled={isSaving}
                          className='flex-1 btn btn-primary flex items-center justify-center gap-1.5 text-xs py-1.5 disabled:opacity-50'
                        >
                          <Save className='w-3 h-3' />
                          {isSaving ? 'Saving…' : 'Save'}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={isSaving}
                          className='flex-1 btn btn-secondary flex items-center justify-center gap-1.5 text-xs py-1.5 disabled:opacity-50'
                        >
                          <X className='w-3 h-3' />
                          Cancel
                        </button>
                      </div>
                    )}

                    {/* Feedback */}
                    {saveSuccess && (
                      <p className='font-body text-xs text-green-600 mt-1.5'>
                        ✓ Profile updated.
                      </p>
                    )}
                    {saveError && (
                      <p className='font-body text-xs text-red-600 mt-1.5'>
                        {saveError}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <p className='font-display text-lg font-light text-espresso'>
                    Welcome
                  </p>
                  <p className='text-xs font-body text-warm-stone-500'>
                    Track your wishlist
                  </p>
                </div>
              )}

              {/* Header actions: edit icon (if auth) + close */}
              <div className='flex items-center gap-1 flex-shrink-0 ml-2'>
                {isAuthenticated && user && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className='p-1.5 rounded-lg text-warm-stone-400 hover:text-brand-500 hover:bg-warm-stone-50 transition-colors'
                    aria-label='Edit profile'
                  >
                    <PenSquare className='w-4 h-4' />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className='p-1.5 rounded-lg text-warm-stone-400 hover:text-espresso hover:bg-warm-stone-100 transition-colors'
                  aria-label='Close menu'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className='flex flex-col p-4 space-y-1'>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className='mobile-menu-item flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-left w-full transition-colors'
              >
                <LogOut className='w-4 h-4 text-red-500' />
                <span className='font-body font-medium text-red-600 text-sm'>
                  Sign out
                </span>
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className='mobile-menu-item flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 text-left w-full transition-colors'
              >
                <LogIn className='w-4 h-4 text-brand-500' />
                <span className='font-body font-medium text-brand-600 text-sm'>
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
