// JWT verification using the Web Crypto API against Auth0's JWKS endpoint.
// Auth0 issues RS256 (RSASSA-PKCS1-v1_5 / SHA-256) access tokens.

// ── JWKS in-memory cache (persists for isolate lifetime, ~1 h TTL) ─────────
const _jwksCache = { keys: null, fetchedAt: 0 };
const JWKS_CACHE_TTL = 3_600_000; // 1 hour in ms

async function fetchJWKS(domain) {
  const now = Date.now();
  if (_jwksCache.keys && now - _jwksCache.fetchedAt < JWKS_CACHE_TTL) {
    return _jwksCache.keys;
  }
  const res = await fetch(`https://${domain}/.well-known/jwks.json`);
  if (!res.ok) {
    throw new Error(`Failed to fetch JWKS: ${res.status} ${res.statusText}`);
  }
  const { keys } = await res.json();
  _jwksCache.keys = keys;
  _jwksCache.fetchedAt = now;
  return keys;
}

// ── Base64url helpers ──────────────────────────────────────────────────────
function base64UrlToString(str) {
  str += '='.repeat((4 - (str.length % 4)) % 4);
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
}

function base64UrlToBuffer(str) {
  const binary = base64UrlToString(str);
  const buf = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i);
  return buf.buffer;
}

// ── RS256 signature verification via Web Crypto API ───────────────────────
async function verifyRS256Signature(headerB64, payloadB64, signatureB64, jwk) {
  const publicKey = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const sig = base64UrlToBuffer(signatureB64);
  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    publicKey,
    sig,
    data,
  );
  if (!valid) throw new Error('Token signature is invalid');
}

// ── Public: full JWT verification ─────────────────────────────────────────
export async function verifyToken(token, domain, audience) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');

  const [headerB64, payloadB64, signatureB64] = parts;
  const header = JSON.parse(base64UrlToString(headerB64));
  const payload = JSON.parse(base64UrlToString(payloadB64));

  // Algorithm guard — Auth0 uses RS256
  if (header.alg !== 'RS256')
    throw new Error(`Unsupported algorithm: ${header.alg}`);
  if (!header.kid) throw new Error('Token header is missing kid');

  // Claims validation
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) throw new Error('Token has expired');

  const expectedIssuer = `https://${domain}/`;
  if (payload.iss !== expectedIssuer) {
    throw new Error(
      `Invalid issuer: expected ${expectedIssuer}, got ${payload.iss}`,
    );
  }

  const audList = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!audList.includes(audience)) {
    throw new Error(`Invalid audience: expected ${audience}`);
  }

  // Fetch JWKS and find the key matching this token's kid
  let keys = await fetchJWKS(domain);
  let jwk = keys.find((k) => k.kid === header.kid && k.use === 'sig');

  if (!jwk) {
    // kid not found — Auth0 may have rotated keys; bust cache and retry once
    _jwksCache.keys = null;
    keys = await fetchJWKS(domain);
    jwk = keys.find((k) => k.kid === header.kid && k.use === 'sig');
    if (!jwk) throw new Error(`No signing key found for kid: ${header.kid}`);
  }

  await verifyRS256Signature(headerB64, payloadB64, signatureB64, jwk);
  return payload;
}

// ── Public: authenticate an incoming request ───────────────────────────────
export async function authenticateRequest(request, env) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Missing or invalid Authorization header');
    }
    const token = authHeader.slice(7);
    const decoded = await verifyToken(
      token,
      env.AUTH0_DOMAIN,
      env.AUTH0_AUDIENCE,
    );
    return {
      userId: decoded.sub,
      email: decoded.email,
      name: decoded.name,
    };
  } catch (error) {
    const authError = new Error('Authentication failed');
    authError.reason = error.message;
    throw authError;
  }
}
