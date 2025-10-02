# Shopr Backend API

Backend API for the Shopr wishlist application using Cloudflare Workers and D1 Database.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create D1 Database

```bash
npm run db:create
```

This will output a database ID. Copy this ID and update it in `wrangler.toml`.

### 3. Run Database Migrations

```bash
# For local development
npm run db:migrate:local

# For production
npm run db:migrate
```

### 4. Configure Auth0

Update `wrangler.toml` with your Auth0 settings:

- `AUTH0_DOMAIN`: Your Auth0 domain
- `AUTH0_AUDIENCE`: Your API identifier from Auth0

### 5. Deploy

```bash
npm run deploy
```

## Local Wrangler Config

- Copy the example file and adjust values locally:

```bash
cp wrangler.example.toml wrangler.toml
```

- Do not commit `wrangler.toml` (it is ignored by `backend/.gitignore`).
- For production, set secrets instead of plain values, for example:

```bash
npx wrangler secret put AUTH0_DOMAIN --env production
npx wrangler secret put AUTH0_AUDIENCE --env production
npx wrangler secret put AUTH0_CLIENT_ID --env production
npx wrangler secret put AUTH0_CLIENT_SECRET --env production
```

## API Endpoints

### Authentication

All endpoints (except `/health`) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

### Endpoints

#### Health Check

- `GET /health` - Check API health

#### Wishlist Items

- `GET /api/wishlist` - Get all wishlist items for authenticated user
- `POST /api/wishlist` - Add new wishlist item
- `GET /api/wishlist/{id}` - Get specific wishlist item
- `PUT /api/wishlist/{id}` - Update wishlist item
- `DELETE /api/wishlist/{id}` - Delete wishlist item

#### Price History

- `POST /api/wishlist/{id}/price` - Add price entry to item

#### Categories

- `GET /api/categories` - Get user's categories

## Data Models

### Wishlist Item

```typescript
interface WishlistItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  date_added: string;
  purchased: boolean;
  date_purchased?: string;
  notes?: string;
  category?: string;
  url?: string;
  priceHistory: PriceEntry[];
}
```

### Price Entry

```typescript
interface PriceEntry {
  price: number;
  date: string;
}
```

## Development

### Local Development

```bash
npm run dev
```

### Database Management

```bash
# Apply migrations locally
npm run db:migrate:local

# Apply migrations to production
npm run db:migrate
```
