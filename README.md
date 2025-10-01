# Shopr - Wishlist & Purchase Tracker

A modern Progressive Web App (PWA) for tracking your wishlist items, their prices, and purchase status. Built with React, TypeScript, and Tailwind CSS. Works perfectly on mobile browsers and desktop computers.

## Features

- ✅ **Add & Manage Items**: Track items with name, price, date added, and notes
- 💰 **Price Tracking**: Update prices and see price change history with trend indicators
- 📱 **Mobile Optimized**: Clean, responsive design perfect for mobile browsers
- 🖥️ **Desktop Enhanced**: Optimized layout for larger screens with sidebar and grid views
- 🏷️ **Categories**: Organize items by categories
- 🔍 **Filtering & Sorting**: Filter by purchase status, sort by date/price/name
- 📊 **Statistics**: View total value, purchased items, and category counts
- 💾 **Local Storage**: All data persists in your browser
- 🌍 **Multi-Currency**: Support for USD, EUR, GBP, CAD, AUD
- ⌨️ **Keyboard Shortcuts**: Power user features with keyboard navigation
- 📲 **PWA Ready**: Install as an app on your phone or desktop
- 🌐 **Web View Optimized**: Perfect for viewing in mobile browsers

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory:

   ```bash
   cd shopr
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## Usage

### Adding Items

1. Click the "Add Item" button
2. Fill in the item details (name, price, currency, category, notes)
3. Click "Add Item" to save

### Managing Items

- **Mark as Purchased**: Click "Mark as Purchased" to toggle purchase status
- **Update Price**: Click the dollar sign icon to update the current price
- **Edit Item**: Click the edit icon to modify item details
- **Delete Item**: Click the trash icon to remove an item

### Keyboard Shortcuts

- **Ctrl/Cmd + N**: Add new item
- **?**: Show keyboard shortcuts help
- **Escape**: Close modals and cancel actions
- **Enter**: Submit forms

### Filtering & Sorting

- Use the filter bar to show only wishlist items or purchased items
- Sort by date added, price, or name
- Filter by category
- Clear filters to show all items

### Price Tracking

- Each time you update a price, it's added to the price history
- View price changes with percentage and absolute value
- See trend indicators (up/down arrows)

### Web View Features

- **PWA Installation**: Add to home screen for app-like experience
- **Offline Support**: Works without internet connection
- **Responsive Design**: Optimized for both mobile and desktop
- **Keyboard Navigation**: Full keyboard accessibility
- **Desktop Layout**: Sidebar with stats and filters on larger screens

## Deployment

### Static Hosting (Recommended)

This app can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repo or drag & drop the `dist` folder
- **Netlify**: Connect your GitHub repo or drag & drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions to build and deploy
- **Firebase Hosting**: Use `firebase deploy` after building

### Local Server

You can also serve the built files locally:

```bash
npm run build
npm run preview
```

## Data Storage

All data is stored locally in your browser using localStorage. This means:

- ✅ No server required
- ✅ Data stays private on your device
- ✅ Works offline
- ⚠️ Data is tied to your browser/device
- ⚠️ Clearing browser data will remove your wishlist

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Adding New Currencies

Edit `src/components/AddItemModal.tsx` and add new currency options to the select element.

### Styling

The app uses Tailwind CSS. You can customize colors, spacing, and other styles by modifying:

- `tailwind.config.js` for theme configuration
- `src/index.css` for custom CSS classes
- Individual component files for component-specific styles

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
