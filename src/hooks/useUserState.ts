import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useState } from 'react';

export const useUserState = () => {
  const { user: auth0User, getAccessTokenSilently } = useAuth0();
  const [user, setUser] = useState(auth0User);

  // Update local user state when Auth0 user changes
  useEffect(() => {
    setUser(auth0User);
  }, [auth0User]);

  // Function to update user data after profile changes
  const updateUser = useCallback((updatedData: Partial<typeof auth0User>) => {
    setUser((prev) => ({
      ...prev,
      ...updatedData,
    }));
  }, []);

  // Function to refresh user data from Auth0
  const refreshUser = useCallback(async () => {
    try {
      // Force refresh of token to get latest user data
      await getAccessTokenSilently({ ignoreCache: true });
      // The user object will be updated by the useEffect above
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }, [getAccessTokenSilently]);

  return {
    user,
    updateUser,
    refreshUser,
  };
};
