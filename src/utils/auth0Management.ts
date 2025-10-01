import { useAuth0 } from '@auth0/auth0-react';

interface UserUpdateData {
  name?: string;
  nickname?: string;
  email?: string;
  picture?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

// Note: Auth0ManagementClient class removed - we now use backend API

// Hook for using Auth0 Management API via our backend
export const useAuth0Management = () => {
  const { user, getAccessTokenSilently } = useAuth0();

  const API_BASE_URL =
    import.meta.env?.VITE_API_BASE_URL ||
    'https://shopr-api.andrewnwhitely.workers.dev';

  const updateProfile = async (userData: UserUpdateData) => {
    if (!user?.sub) {
      throw new Error('User not authenticated');
    }

    const token = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }

    return await response.json();
  };

  const getProfile = async () => {
    if (!user?.sub) {
      throw new Error('User not authenticated');
    }

    const token = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get profile');
    }

    return await response.json();
  };

  return {
    updateProfile,
    getProfile,
    isReady: !!user?.sub,
  };
};

// Alternative: Server-side implementation helper
export const createManagementApiEndpoint = (
  domain: string,
  clientId: string,
  clientSecret: string
) => {
  return {
    /**
     * Server-side function to get Management API token
     * This should be implemented in your backend
     */
    async getManagementToken() {
      const response = await fetch(`https://${domain}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          audience: `https://${domain}/api/v2/`,
          grant_type: 'client_credentials',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get management token');
      }

      const data = await response.json();
      return data.access_token;
    },

    /**
     * Server-side function to update user profile
     */
    async updateUserProfile(userId: string, userData: UserUpdateData) {
      const token = await this.getManagementToken();

      const response = await fetch(`https://${domain}/api/v2/users/${userId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user profile');
      }

      return await response.json();
    },
  };
};
