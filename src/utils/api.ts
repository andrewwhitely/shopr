import { NewWishlistItem, WishlistItem } from '../types';

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  'https://shopr-api.andrewnwhitely.workers.dev';

class ApiClient {
  private authToken: string | null = null;

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private getAuthToken(): string | null {
    return this.authToken;
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const token = this.getAuthToken();

    // Normalize headers to a Headers instance so we can set Authorization safely
    const headers = new Headers({ 'Content-Type': 'application/json' });

    // Merge any headers from options
    if (options.headers) {
      const incoming = new Headers(options.headers as HeadersInit);
      incoming.forEach((value, key) => headers.set(key, value));
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Wishlist items
  async getWishlistItems(): Promise<WishlistItem[]> {
    const response = await this.makeRequest('/api/wishlist');
    return response.items.map(this.mapApiItemToWishlistItem);
  }

  async getWishlistItem(id: string): Promise<WishlistItem> {
    const response = await this.makeRequest(`/api/wishlist/${id}`);
    return this.mapApiItemToWishlistItem(response.item);
  }

  async addWishlistItem(item: NewWishlistItem): Promise<WishlistItem> {
    const response = await this.makeRequest('/api/wishlist', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return this.mapApiItemToWishlistItem(response.item);
  }

  async updateWishlistItem(
    id: string,
    updates: Partial<WishlistItem>
  ): Promise<WishlistItem> {
    // Map camelCase fields to snake_case expected by the backend
    const payload: Record<string, any> = { ...updates };
    if (Object.prototype.hasOwnProperty.call(payload, 'datePurchased')) {
      payload.date_purchased = payload.datePurchased ?? null;
      delete payload.datePurchased;
    }

    const response = await this.makeRequest(`/api/wishlist/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return this.mapApiItemToWishlistItem(response.item);
  }

  async deleteWishlistItem(id: string): Promise<void> {
    await this.makeRequest(`/api/wishlist/${id}`, {
      method: 'DELETE',
    });
  }

  // Price history
  async addPriceEntry(itemId: string, price: number): Promise<WishlistItem> {
    const response = await this.makeRequest(`/api/wishlist/${itemId}/price`, {
      method: 'POST',
      body: JSON.stringify({ price }),
    });
    return this.mapApiItemToWishlistItem(response.item);
  }

  // Categories
  async getCategories(): Promise<string[]> {
    const response = await this.makeRequest('/api/categories');
    return response.categories;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.makeRequest('/health');
  }

  // Map API response to frontend WishlistItem format
  private mapApiItemToWishlistItem(apiItem: any): WishlistItem {
    return {
      id: apiItem.id,
      name: apiItem.name,
      price: apiItem.price,
      currency: apiItem.currency,
      dateAdded: apiItem.date_added,
      purchased: Boolean(apiItem.purchased),
      datePurchased: apiItem.date_purchased,
      notes: apiItem.notes,
      category: apiItem.category,
      url: apiItem.url,
      priceHistory: apiItem.priceHistory || [],
    };
  }
}

export const apiClient = new ApiClient();
