-- Create wishlist_items table
CREATE TABLE wishlist_items (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  date_added TEXT NOT NULL,
  purchased INTEGER NOT NULL DEFAULT 0,
  date_purchased TEXT,
  notes TEXT,
  category TEXT,
  url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create price_history table
CREATE TABLE price_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id TEXT NOT NULL,
  price REAL NOT NULL,
  date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES wishlist_items(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX idx_wishlist_items_purchased ON wishlist_items(purchased);
CREATE INDEX idx_wishlist_items_category ON wishlist_items(category);
CREATE INDEX idx_price_history_item_id ON price_history(item_id);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_wishlist_items_timestamp 
  AFTER UPDATE ON wishlist_items
BEGIN
  UPDATE wishlist_items 
  SET updated_at = CURRENT_TIMESTAMP 
  WHERE id = NEW.id;
END;
