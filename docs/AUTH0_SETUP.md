# Auth0 Setup Guide for Shopr

This guide will help you configure Auth0 for your Shopr application.

## Step 1: Create Auth0 Application

### 1.1 Sign up for Auth0

1. Go to [auth0.com](https://auth0.com) and create a free account
2. Choose your region (closest to your users)

### 1.2 Create Application

1. In the Auth0 Dashboard, go to **Applications** → **Applications**
2. Click **Create Application**
3. Name: `Shopr Frontend`
4. Application Type: **Single Page Application**
5. Click **Create**

### 1.3 Configure Application Settings

In your application settings, update:

**Allowed Callback URLs:**

```
http://localhost:5173,http://localhost:3000,https://your-domain.com
```

**Allowed Logout URLs:**

```
http://localhost:5173,http://localhost:3000,https://your-domain.com
```

**Allowed Web Origins:**

```
http://localhost:5173,http://localhost:3000,https://your-domain.com
```

**Allowed Origins (CORS):**

```
http://localhost:5173,http://localhost:3000,https://your-domain.com
```

## Step 2: Create API

### 2.1 Create API

1. Go to **Applications** → **APIs**
2. Click **Create API**
3. Name: `Shopr API`
4. Identifier: `https://api.shopr.app` (or your backend URL)
5. Signing Algorithm: **RS256**
6. Click **Create**

### 2.2 Configure API Settings

1. Go to your API settings
2. Note the **Identifier** (this is your `AUTH0_AUDIENCE`)
3. In **Settings** tab, configure:
   - **Token Endpoint Authentication Method**: `None`
   - **Allow Offline Access**: `Yes`

## Step 3: Configure Environment Variables

### 3.1 Frontend Environment Variables

Create a `.env` file in your project root:

```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.shopr.app

# API Configuration
VITE_API_BASE_URL=https://your-backend-url.workers.dev
```

### 3.2 Backend Environment Variables

Update your `backend/wrangler.toml`:

```toml
[env.production.vars]
AUTH0_DOMAIN = "your-domain.auth0.com"
AUTH0_AUDIENCE = "https://api.shopr.app"
```

## Step 4: Test Authentication Flow

### 4.1 Start Development Server

```bash
npm run dev
```

### 4.2 Test Login Flow

1. Visit your app
2. Click **Login** button
3. You should be redirected to Auth0
4. Complete authentication
5. You should be redirected back to your app

### 4.3 Test API Calls

1. After login, try adding a wishlist item
2. Check browser network tab for API calls with Authorization headers
3. Verify items are saved and loaded correctly

## Step 5: Production Deployment

### 5.1 Update Auth0 Settings

Before deploying to production, update your Auth0 application:

**Allowed Callback URLs:**

```
https://your-production-domain.com
```

**Allowed Logout URLs:**

```
https://your-production-domain.com
```

**Allowed Web Origins:**

```
https://your-production-domain.com
```

### 5.2 Update Environment Variables

In your hosting platform (Cloudflare Pages, Vercel, etc.), set:

```
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.shopr.app
VITE_API_BASE_URL=https://your-production-backend-url.workers.dev
```

## Troubleshooting

### Common Issues

#### 1. "Invalid Callback URL" Error

- Check that your current URL is in the **Allowed Callback URLs** list
- Make sure there are no trailing slashes or typos

#### 2. "Invalid Audience" Error

- Verify `VITE_AUTH0_AUDIENCE` matches your API identifier
- Check that the audience is set correctly in the Auth0Provider

#### 3. CORS Errors

- Add your domain to **Allowed Web Origins** and **Allowed Origins (CORS)**
- Ensure your backend API has proper CORS headers

#### 4. Token Validation Errors

- Verify `AUTH0_DOMAIN` and `AUTH0_AUDIENCE` in backend environment
- Check that your backend is using the correct JWKS endpoint

#### 5. "Application does not have access" Error

- In your Auth0 application, go to **APIs** tab
- Authorize your application for your API
- Grant the necessary scopes (openid, profile, email)

### Debug Commands

#### Check Token

```javascript
// In browser console
const { getAccessTokenSilently } = useAuth0();
getAccessTokenSilently().then((token) => console.log(token));
```

#### Verify API Response

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://your-api-url.workers.dev/api/wishlist
```

## Security Best Practices

1. **Never expose secrets** in frontend code
2. **Use HTTPS** in production
3. **Validate tokens** on the backend
4. **Set appropriate token expiration** times
5. **Use refresh tokens** for better UX
6. **Implement proper logout** to clear tokens

## Free Tier Limits

- **7,000 active users** per month
- **2 social connections**
- **Unlimited logins**
- **Community support**

For production apps with more users, consider upgrading to a paid plan.

## Next Steps

1. **Customize login UI** with Auth0 Universal Login
2. **Add social logins** (Google, GitHub, etc.)
3. **Implement user roles** if needed
4. **Add passwordless authentication**
5. **Set up monitoring** and analytics
