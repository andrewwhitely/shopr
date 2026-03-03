import { useAuth0 } from '@auth0/auth0-react';
import { useCallback } from 'react';

const AUDIENCE =
  (import.meta as any).env?.VITE_AUTH0_AUDIENCE || 'https://api.shopr.app';

export const useAuth = () => {
  const {
    isAuthenticated,
    isLoading,
    user,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const getToken = useCallback(async () => {
    if (!isAuthenticated) return null;

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: AUDIENCE },
      });
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const login = useCallback(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);

  const logoutUser = useCallback(() => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }, [logout]);

  return {
    isAuthenticated,
    isLoading,
    user,
    getToken,
    login,
    logout: logoutUser,
  };
};
