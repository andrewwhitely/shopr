// Database helper functions for D1

export class WishlistDB {
  constructor(db) {
    this.db = db;
  }

  // Get all wishlist items for a user
  async getWishlistItems(userId) {
    const result = await this.db
      .prepare(
        `
        SELECT 
          id, name, price, currency, date_added, purchased, 
          date_purchased, notes, category, url, created_at, updated_at
        FROM wishlist_items 
        WHERE user_id = ?
        ORDER BY date_added DESC
      `
      )
      .bind(userId)
      .all();

    // Get price history for each item
    const items = await Promise.all(
      result.results.map(async (item) => {
        const priceHistory = await this.getPriceHistory(item.id);
        return {
          ...item,
          priceHistory,
        };
      })
    );

    return items;
  }

  // Get a specific wishlist item
  async getWishlistItem(itemId, userId) {
    const item = await this.db
      .prepare(
        `
        SELECT 
          id, name, price, currency, date_added, purchased, 
          date_purchased, notes, category, url, created_at, updated_at
        FROM wishlist_items 
        WHERE id = ? AND user_id = ?
      `
      )
      .bind(itemId, userId)
      .first();

    if (!item) return null;

    const priceHistory = await this.getPriceHistory(itemId);
    return {
      ...item,
      priceHistory,
    };
  }

  // Add a new wishlist item
  async addWishlistItem(userId, item) {
    const itemId = this.generateId();
    const now = new Date().toISOString();

    await this.db
      .prepare(
        `
        INSERT INTO wishlist_items 
        (id, user_id, name, price, currency, date_added, purchased, 
         date_purchased, notes, category, url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      )
      .bind(
        itemId,
        userId,
        item.name,
        item.price,
        item.currency || 'USD',
        now,
        item.purchased ? 1 : 0,
        item.datePurchased || null,
        item.notes || null,
        item.category || null,
        item.url || null
      )
      .run();

    // Add initial price entry
    await this.addPriceEntry(itemId, item.price);

    return this.getWishlistItem(itemId, userId);
  }

  // Update a wishlist item
  async updateWishlistItem(itemId, userId, updates) {
    const setParts = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'purchased') {
        setParts.push(`${key} = ?`);
        values.push(value ? 1 : 0);
      } else if (key !== 'id' && key !== 'user_id') {
        setParts.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (setParts.length === 0) {
      return this.getWishlistItem(itemId, userId);
    }

    values.push(itemId, userId);

    await this.db
      .prepare(
        `
        UPDATE wishlist_items 
        SET ${setParts.join(', ')}
        WHERE id = ? AND user_id = ?
      `
      )
      .bind(...values)
      .run();

    return this.getWishlistItem(itemId, userId);
  }

  // Delete a wishlist item
  async deleteWishlistItem(itemId, userId) {
    // Delete price history first (due to foreign key constraint)
    await this.db
      .prepare('DELETE FROM price_history WHERE item_id = ?')
      .bind(itemId)
      .run();

    // Delete the item
    const result = await this.db
      .prepare('DELETE FROM wishlist_items WHERE id = ? AND user_id = ?')
      .bind(itemId, userId)
      .run();

    return result.changes > 0;
  }

  // Add price entry to history
  async addPriceEntry(itemId, price) {
    const now = new Date().toISOString();

    await this.db
      .prepare(
        `
        INSERT INTO price_history (item_id, price, date)
        VALUES (?, ?, ?)
      `
      )
      .bind(itemId, price, now)
      .run();
  }

  // Get price history for an item
  async getPriceHistory(itemId) {
    const result = await this.db
      .prepare(
        `
        SELECT price, date 
        FROM price_history 
        WHERE item_id = ?
        ORDER BY date ASC
      `
      )
      .bind(itemId)
      .all();

    return result.results;
  }

  // Get categories for a user
  async getCategories(userId) {
    const result = await this.db
      .prepare(
        `
        SELECT DISTINCT category 
        FROM wishlist_items 
        WHERE user_id = ? AND category IS NOT NULL AND category != ''
        ORDER BY category
      `
      )
      .bind(userId)
      .all();

    return result.results.map((row) => row.category);
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
