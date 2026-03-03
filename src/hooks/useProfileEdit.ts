import { useEffect, useState } from 'react';
import { CURRENCIES } from '../constants/currencies';
import type { Currency } from '../constants/currencies';
import { useAuth0Management } from '../utils/auth0Management';
import { useUserState } from './useUserState';

interface EditableUser {
  name: string;
  username: string;
  defaultCurrency: Currency;
}

export const useProfileEdit = (user: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  // Auth0 uses "nickname" for username
  const username = user?.nickname ?? user?.username ?? '';
  const defaultCurrency =
    (user?.user_metadata?.default_currency as Currency) || 'USD';

  const [editedUser, setEditedUser] = useState<EditableUser>({
    name: user?.name || '',
    username,
    defaultCurrency: CURRENCIES.includes(defaultCurrency as Currency)
      ? defaultCurrency
      : 'USD',
  });

  const { updateProfile } = useAuth0Management();
  const { updateUser, refreshUser } = useUserState();

  // Sync when user prop changes (e.g. after refresh)
  useEffect(() => {
    const u = user?.nickname ?? user?.username ?? '';
    const curr =
      (user?.user_metadata?.default_currency as Currency) || 'USD';
    setEditedUser({
      name: user?.name || '',
      username: u,
      defaultCurrency: CURRENCIES.includes(curr) ? curr : 'USD',
    });
  }, [user]);

  const handleSave = async (onSuccess?: () => void) => {
    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      await updateProfile({
        name: editedUser.name,
        username: editedUser.username,
        user_metadata: {
          ...user?.user_metadata,
          default_currency: editedUser.defaultCurrency,
        },
      });

      updateUser({
        name: editedUser.name,
        username: editedUser.username,
        nickname: editedUser.username, // Auth0 uses nickname; keep in sync
        user_metadata: {
          ...user?.user_metadata,
          default_currency: editedUser.defaultCurrency,
        },
      });

      await refreshUser();

      setIsEditing(false);
      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : 'Failed to update profile',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    const curr =
      (user?.user_metadata?.default_currency as Currency) || 'USD';
    setEditedUser({
      name: user?.name || '',
      username: user?.nickname ?? user?.username ?? '',
      defaultCurrency: CURRENCIES.includes(curr) ? curr : 'USD',
    });
    setSaveError(null);
    setIsEditing(false);
  };

  return {
    isEditing,
    isSaving,
    saveError,
    saveSuccess,
    editedUser,
    setEditedUser,
    setIsEditing,
    handleSave,
    handleCancel,
  };
};
