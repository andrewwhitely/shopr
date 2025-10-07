import { authenticateRequest } from './auth.js';
import { WishlistDB } from './database.js';

// Auth0 Management API functions
async function getManagementToken(env) {
  // Management API MUST use tenant domain, not custom domain
  const tenantDomain = env.AUTH0_TENANT_DOMAIN || env.AUTH0_DOMAIN;

  const response = await fetch(`https://${tenantDomain}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: env.AUTH0_CLIENT_ID,
      client_secret: env.AUTH0_CLIENT_SECRET,
      audience: `https://${tenantDomain}/api/v2/`,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to get management token: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();
  return data.access_token;
}

async function updateUserProfile(userId, updates, env) {
  const token = await getManagementToken(env);
  // Management API MUST use tenant domain, not custom domain
  const tenantDomain = env.AUTH0_TENANT_DOMAIN || env.AUTH0_DOMAIN;

  const response = await fetch(
    `https://${tenantDomain}/api/v2/users/${userId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to update user profile: ${response.status} ${errorText}`
    );
  }

  const result = await response.json();
  return result;
}

async function getUserProfile(userId, env) {
  const token = await getManagementToken(env);
  // Management API MUST use tenant domain, not custom domain
  const tenantDomain = env.AUTH0_TENANT_DOMAIN || env.AUTH0_DOMAIN;

  const response = await fetch(
    `https://${tenantDomain}/api/v2/users/${userId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get user profile');
  }

  return await response.json();
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle CORS preflight requests
function handleCORS(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }
}

// Error response helper
function errorResponse(message, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Success response helper
function successResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request, env, ctx) {
    // Handle CORS
    const corsResponse = handleCORS(request);
    if (corsResponse) return corsResponse;

    const db = new WishlistDB(env.DB);
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Public endpoints (no auth required)
      if (path === '/health') {
        return successResponse({
          status: 'healthy',
          timestamp: new Date().toISOString(),
        });
      }

      // All other endpoints require authentication
      const auth = await authenticateRequest(request, env);

      // Debug endpoint for Auth0 Management API (requires auth)
      if (path === '/debug/auth0' && request.method === 'GET') {
        try {
          const token = await getManagementToken(env);
          return successResponse({
            message: 'Auth0 Management API token obtained successfully',
            tokenLength: token.length,
            domain: env.AUTH0_DOMAIN,
            hasClientId: !!env.AUTH0_CLIENT_ID,
            hasClientSecret: !!env.AUTH0_CLIENT_SECRET,
            userId: auth.userId,
          });
        } catch (error) {
          return errorResponse(
            `Auth0 Management API error: ${error.message}`,
            500
          );
        }
      }

      // Route handling
      if (path === '/api/wishlist' && request.method === 'GET') {
        // Get all wishlist items
        try {
          console.log('Getting wishlist items for user:', auth.userId);
          const items = await db.getWishlistItems(auth.userId);
          console.log('Retrieved items count:', items.length);
          return successResponse({ items });
        } catch (dbError) {
          console.error('Database error in GET wishlist:', dbError);
          return errorResponse(`Database error: ${dbError.message}`, 500);
        }
      }

      if (path === '/api/wishlist' && request.method === 'POST') {
        // Add new wishlist item
        const item = await request.json();
        const newItem = await db.addWishlistItem(auth.userId, item);
        return successResponse({ item: newItem }, 201);
      }

      if (path.startsWith('/api/wishlist/') && request.method === 'GET') {
        // Get specific wishlist item
        const itemId = path.split('/')[3];
        const item = await db.getWishlistItem(itemId, auth.userId);

        if (!item) {
          return errorResponse('Item not found', 404);
        }

        return successResponse({ item });
      }

      if (path.startsWith('/api/wishlist/') && request.method === 'PUT') {
        // Update wishlist item
        const itemId = path.split('/')[3];
        const updates = await request.json();
        const updatedItem = await db.updateWishlistItem(
          itemId,
          auth.userId,
          updates
        );

        if (!updatedItem) {
          return errorResponse('Item not found', 404);
        }

        return successResponse({ item: updatedItem });
      }

      if (path.startsWith('/api/wishlist/') && request.method === 'DELETE') {
        // Delete wishlist item (idempotent)
        const itemId = path.split('/')[3];

        // Verify the item exists and belongs to the current user
        const existing = await db.getWishlistItem(itemId, auth.userId);

        // If the item doesn't exist (or doesn't belong to user), respond success to be idempotent
        if (!existing) {
          return successResponse({ success: true });
        }

        const deleted = await db.deleteWishlistItem(itemId, auth.userId);
        return successResponse({ success: !!deleted });
      }

      if (
        path.startsWith('/api/wishlist/') &&
        path.endsWith('/price') &&
        request.method === 'POST'
      ) {
        // Add price entry
        const itemId = path.split('/')[3];
        const { price } = await request.json();

        // Verify item exists and belongs to user
        const item = await db.getWishlistItem(itemId, auth.userId);
        if (!item) {
          return errorResponse('Item not found', 404);
        }

        await db.addPriceEntry(itemId, price);
        await db.updateWishlistItem(itemId, auth.userId, { price });

        const updatedItem = await db.getWishlistItem(itemId, auth.userId);
        return successResponse({ item: updatedItem });
      }

      if (path === '/api/categories' && request.method === 'GET') {
        // Get user's categories
        const categories = await db.getCategories(auth.userId);
        return successResponse({ categories });
      }

      // User profile management endpoints
      if (path === '/api/user/profile' && request.method === 'PUT') {
        try {
          // Update user profile via Auth0 Management API
          const updates = await request.json();

          const updatedProfile = await updateUserProfile(
            auth.userId,
            updates,
            env
          );

          return successResponse({ profile: updatedProfile });
        } catch (error) {
          return errorResponse(
            `Failed to update profile: ${error.message}`,
            500
          );
        }
      }

      if (path === '/api/user/profile' && request.method === 'GET') {
        try {
          // Get user profile from Auth0 Management API
          const profile = await getUserProfile(auth.userId, env);
          return successResponse({ profile });
        } catch (error) {
          return errorResponse(`Failed to get profile: ${error.message}`, 500);
        }
      }

      // Route not found
      return errorResponse('Not found', 404);
    } catch (error) {
      console.error('API Error:', error);

      if (error.message === 'Authentication failed') {
        return errorResponse('Unauthorized', 401);
      }

      // Return more detailed error information for debugging
      return errorResponse(`Internal server error: ${error.message}`, 500);
    }
  },
};
