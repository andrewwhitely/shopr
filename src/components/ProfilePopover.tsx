import { useAuth0 } from '@auth0/auth0-react';
import { Edit3, LogOut, Mail, Save, User, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth0Management } from '../utils/auth0Management';

interface ProfilePopoverProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

export const ProfilePopover: React.FC<ProfilePopoverProps> = ({
  user,
  isOpen,
  onClose,
  triggerRef,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    nickname: user?.nickname || '',
  });
  const popoverRef = useRef<HTMLDivElement>(null);
  const { updateProfile } = useAuth0Management();
  const { logout } = useAuth0();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      // Update profile via Auth0 Management API
      await updateProfile({
        name: editedUser.name,
        nickname: editedUser.nickname,
        email: editedUser.email,
      });

      setIsEditing(false);
      setSaveSuccess(true);

      // Profile updated successfully
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : 'Failed to update profile'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || '',
      email: user?.email || '',
      nickname: user?.nickname || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className='absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50'
    >
      <div className='p-4'>
        {/* Header */}
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>Profile</h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Profile Picture and Basic Info */}
        <div className='flex items-center gap-3 mb-4 pb-4 border-b border-gray-200'>
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className='w-12 h-12 rounded-full'
            />
          ) : (
            <div className='w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center'>
              <User className='w-6 h-6 text-gray-600' />
            </div>
          )}
          <div className='flex-1'>
            {isEditing ? (
              <input
                type='text'
                value={editedUser.name}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, name: e.target.value })
                }
                className='w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Full name'
              />
            ) : (
              <h4 className='font-medium text-gray-900'>
                {user?.name || 'No name'}
              </h4>
            )}
            {isEditing ? (
              <input
                type='text'
                value={editedUser.nickname}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, nickname: e.target.value })
                }
                className='w-full px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Nickname'
              />
            ) : (
              <p className='text-sm text-gray-600'>
                @{user?.nickname || user?.email?.split('@')[0]}
              </p>
            )}
          </div>
        </div>

        {/* User Details */}
        <div className='space-y-3 mb-4'>
          <div className='flex items-center gap-3'>
            <Mail className='w-4 h-4 text-gray-400' />
            <div className='flex-1'>
              {isEditing ? (
                <input
                  type='email'
                  value={editedUser.email}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, email: e.target.value })
                  }
                  className='w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Email address'
                />
              ) : (
                <span className='text-sm text-gray-700'>{user?.email}</span>
              )}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
            <p className='text-sm text-green-700'>
              ✅ Profile updated successfully! Changes will be visible after
              refresh.
            </p>
          </div>
        )}

        {/* Error Message */}
        {saveError && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-sm text-red-700'>{saveError}</p>
          </div>
        )}

        {/* Actions */}
        <div className='space-y-2'>
          <div className='flex gap-2'>
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className='flex-1 btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <Save className='w-4 h-4' />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className='flex-1 btn btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <X className='w-4 h-4' />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className='flex-1 btn btn-secondary flex items-center justify-center gap-2'
              >
                <Edit3 className='w-4 h-4' />
                Edit Profile
              </button>
            )}
          </div>

          {/* Note */}
          <div className='mt-4 p-3 bg-blue-50 rounded-lg'>
            <p className='text-xs text-blue-700'>
              <strong>Note:</strong> Profile updates are saved to Auth0 and will
              persist across all sessions and devices.
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className='w-full btn btn-outline-danger flex items-center justify-center gap-2 text-red-600 border-red-200 bg-red-100 hover:border-red-300'
          >
            <LogOut className='w-4 h-4' />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
