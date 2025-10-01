# Shopr Backend API Deployment Guide

This guide covers deploying the Shopr backend API with Cloudflare Workers and D1 Database.

## Prerequisites

1. **Cloudflare Account** - Sign up at [cloudflare.com](https://cloudflare.com)
2. **Auth0 Account** - Set up at [auth0.com](https://auth0.com)
3. **Wrangler CLI** - Install with `npm install -g wrangler`

## Step 1: Backend Setup

### 1.1 Install Dependencies

```bash
cd backend
npm install
```

### 1.2 Create D1 Database

```bash
npm run db:create
```

Copy the database ID from the output and update `wrangler.toml`:

```toml
database_id = "your-actual-database-id-here"
```

### 1.3 Run Database Migrations

```bash
# Local development
npm run db:migrate:local

# Production (after deployment)
npm run db:migrate
```

### 1.4 Configure Auth0

Update `wrangler.toml` with your Auth0 settings:

```toml
[env.production.vars]
AUTH0_DOMAIN = "your-domain.auth0.com"
AUTH0_AUDIENCE = "your-api-identifier"
```

### 1.5 Deploy Backend

```bash
npm run deploy
```

This will give you a URL like `https://shopr-api.your-subdomain.workers.dev`

## Step 2: Auth0 Configuration

### 2.1 Create Auth0 Application

1. Go to Auth0 Dashboard → Applications
2. Create Application → Single Page Application
3. Copy the Domain and Client ID

### 2.2 Configure Application Settings

```
Allowed Callback URLs: https://your-frontend-domain.com/callback
Allowed Logout URLs: https://your-frontend-domain.com
Allowed Web Origins: https://your-frontend-domain.com
```

### 2.3 Create API

1. Go to Auth0 Dashboard → APIs
2. Create API
3. Set Identifier (this becomes your AUTH0_AUDIENCE)
4. Set Signing Algorithm to RS256

## Step 3: Frontend Configuration

### 3.1 Environment Variables

Create `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://shopr-api.your-subdomain.workers.dev
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-api-identifier
```

### 3.2 Install Auth0 Dependencies

```bash
npm install @auth0/auth0-react
```

### 3.3 Update Frontend Code

Follow the Auth0 React integration guide to add authentication to your React app.

## Step 4: Cloudflare Pages Deployment

### 4.1 Connect Repository

1. Go to Cloudflare Dashboard → Pages
2. Connect your Git repository
3. Set build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`

### 4.2 Environment Variables

In Cloudflare Pages settings, add:

```
VITE_API_BASE_URL = https://shopr-api.your-subdomain.workers.dev
VITE_AUTH0_DOMAIN = your-domain.auth0.com
VITE_AUTH0_CLIENT_ID = your-client-id
VITE_AUTH0_AUDIENCE = your-api-identifier
```

## Step 5: Testing

### 5.1 Test API Health

```bash
curl https://shopr-api.your-subdomain.workers.dev/health
```

### 5.2 Test Authentication Flow

1. Visit your deployed frontend
2. Click login
3. Authenticate with Auth0
4. Verify you can add/edit/delete wishlist items

## Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure your frontend domain is in Auth0 allowed origins
   - Check API CORS headers in backend code

2. **Database Connection Issues**

   - Verify database ID in `wrangler.toml`
   - Ensure migrations have been run

3. **Auth0 Token Issues**
   - Check token audience matches API identifier
   - Verify JWT verification in backend

### Debug Commands

```bash
# Check backend logs
wrangler tail shopr-api

# Test database locally
wrangler d1 execute shopr-db --local --command "SELECT * FROM wishlist_items"

# Check environment variables
wrangler secret list
```

## Production Considerations

1. **Security**

   - Use HTTPS for all endpoints
   - Implement rate limiting
   - Validate all inputs

2. **Performance**

   - Enable Cloudflare caching for static assets
   - Use D1 indexes for better query performance

3. **Monitoring**
   - Set up Cloudflare Analytics
   - Monitor Auth0 logs
   - Track API usage

## Cost Estimation

- **Cloudflare Workers**: $5/month for 10M requests
- **D1 Database**: $5/month for 5M reads + 100K writes
- **Auth0**: Free tier up to 7,000 active users
- **Cloudflare Pages**: Free tier includes 500 builds/month

Total: ~$10/month for small to medium usage.
