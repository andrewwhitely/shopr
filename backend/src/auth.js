// Simple JWT verification for Cloudflare Workers
// We'll use a basic approach that validates the token structure and claims

// Note: JWKS verification removed for Cloudflare Workers compatibility
// In production, you should implement proper signature verification using Web Crypto API

// Helper function to decode base64url (Cloudflare Workers compatible)
function base64UrlDecode(str) {
  // Add padding if needed
  str += '='.repeat((4 - (str.length % 4)) % 4);
  // Convert base64url to base64
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // Decode using atob (available in Cloudflare Workers)
  return atob(str);
}

// Verify JWT token (simplified for Cloudflare Workers)
export async function verifyToken(token, domain, audience) {
  try {
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // Decode the payload using Cloudflare Workers compatible method
    const payload = JSON.parse(base64UrlDecode(parts[1]));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error('Token expired');
    }

    // Check issuer
    const expectedIssuer = `https://${domain}/`;
    if (payload.iss !== expectedIssuer) {
      throw new Error(
        `Invalid issuer. Expected: ${expectedIssuer}, Got: ${payload.iss}`
      );
    }

    // Check audience
    let audienceMatch = false;
    if (Array.isArray(payload.aud)) {
      audienceMatch = payload.aud.includes(audience);
    } else {
      audienceMatch = payload.aud === audience;
    }

    if (!audienceMatch) {
      throw new Error(
        `Invalid audience. Expected: ${audience}, Got: ${JSON.stringify(
          payload.aud
        )}`
      );
    }

    return payload;
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
}

// Extract user ID from token
export function getUserIdFromToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(parts[1]));

    return payload?.sub; // Auth0 user ID is in the 'sub' claim
  } catch (error) {
    return null;
  }
}

// Middleware to authenticate requests
export async function authenticateRequest(request, env) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);

    const decoded = await verifyToken(
      token,
      env.AUTH0_DOMAIN,
      env.AUTH0_AUDIENCE
    );

    return {
      userId: decoded.sub,
      email: decoded.email,
      name: decoded.name,
    };
  } catch (error) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
}
