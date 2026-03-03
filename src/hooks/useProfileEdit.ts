import { useEffect, useState } from 'react';
import { useUserState } from './useUserState';
import { useAuth0Management } from '../utils/auth0Management';

interface EditableUser {
  name: string;
  nickname: string;
}

export const useProfileEdit = (user: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editedUser, setEditedUser] = useState<EditableUser>({
    name: user?.name || '',
    nickname: user?.nickname || '',
  });

  const { updateProfile } = useAuth0Management();
  const { updateUser, refreshUser } = useUserState();

  // Sync when user prop changes (e.g. after refresh)
  useEffect(() => {
    setEditedUser({
      name: user?.name || '',
      nickname: user?.nickname || '',
    });
  }, [user]);

  const handleSave = async (onSuccess?: () => void) => {
    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      await updateProfile({
        name: editedUser.name,
        nickname: editedUser.nickname,
      });

      updateUser({
        name: editedUser.name,
        nickname: editedUser.nickname,
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
        error instanceof Error ? error.message : 'Failed to update profile'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || '',
      nickname: user?.nickname || '',
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
