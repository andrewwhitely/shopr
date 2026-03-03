import { Plus } from 'lucide-react';
import { useState } from 'react';
import { AddItemModal } from './components/AddItemModal';
import { CollapsibleFilterBar } from './components/CollapsibleFilterBar';
import { FilterBar } from './components/FilterBar';
import { HamburgerMenu } from './components/HamburgerMenu';
import { LoginButton } from './components/LoginButton';
import { ProtectedRoute } from './components/ProtectedRoute';
import { StatsCard } from './components/StatsCard';
import { WishlistItem } from './components/WishlistItem';
import { WishlistContext } from './contexts/WishlistContext';
import { useWishlist } from './hooks/useWishlist';
import { NewWishlistItem, WishlistItem as WishlistItemType } from './types';

function App() {
  const {
    items,
    filteredItems,
    filters,
    setFilters,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    togglePurchased,
    updatePrice,
    refreshItems,
  } = useWishlist();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<
    (WishlistItemType & { id: string }) | null
  >(null);

  const handleAddItem = async (newItem: NewWishlistItem) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, newItem);
        setEditingItem(null);
      } else {
        await addItem(newItem);
      }
    } catch (error) {
      // Error handled by UI state
    }
  };

  const handleEditItem = (item: WishlistItemType) => {
    setEditingItem(item);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const categories = [
    ...new Set(
      items
        .map((item) => item.category)
        .filter((cat): cat is string => Boolean(cat))
    ),
  ];

  const totalValue = items.reduce((sum, item) => sum + (item.price ?? 0), 0);

  return (
    <WishlistContext.Provider value={{ itemCount: items.length, totalValue }}>
    <div className='min-h-screen bg-parchment'>
      {/* Header */}
      <header className='bg-white/95 backdrop-blur-sm border-b border-warm-stone-100 safe-area-top sticky top-0 z-30'>
        <div className='mobile-container sm:desktop-container'>
          <div className='flex items-center justify-between h-14'>
            <h1 className='logo-font text-4xl sm:text-5xl leading-none'>
              <a href='/'>shopr</a>
            </h1>

            <div className='flex items-center gap-2'>
              <ProtectedRoute
                fallback={
                  <div className='flex items-center gap-2'>
                    <div className='hidden sm:block'>
                      <LoginButton />
                    </div>
                    <div className='sm:hidden'>
                      <HamburgerMenu />
                    </div>
                  </div>
                }
              >
                <div className='flex items-center gap-2'>
                  {/* Desktop Add Button */}
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className='btn btn-primary items-center gap-2 hidden sm:flex'
                    title='Add new item'
                  >
                    <Plus className='w-4 h-4' />
                    <span>Add Item</span>
                  </button>

                  <div className='hidden sm:block'>
                    <LoginButton />
                  </div>

                  <div className='sm:hidden'>
                    <HamburgerMenu />
                  </div>
                </div>
              </ProtectedRoute>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='mobile-container sm:desktop-container safe-area-bottom'>
        <ProtectedRoute>
          <div className='sm:desktop-grid'>
            {/* Desktop Sidebar */}
            <aside className='sm:desktop-sidebar hidden sm:block'>
              <StatsCard items={items} />

              <div className='h-px bg-warm-stone-200' />

              <FilterBar
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
              />
            </aside>

            {/* Mobile Stats & Filters */}
            <div className='sm:hidden space-y-4 mb-5'>
              <StatsCard items={items} />
              <CollapsibleFilterBar
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
              />
            </div>

            {/* Main Content Area */}
            <div className='sm:desktop-main'>
              {loading ? (
                <div className='text-center py-16'>
                  <div className='spinner mx-auto mb-4' />
                  <p className='text-sm font-body text-warm-stone-500'>
                    Loading your wishlist…
                  </p>
                </div>
              ) : error ? (
                <div className='text-center py-16'>
                  <p className='font-display text-2xl font-light text-espresso mb-2'>
                    Something went wrong
                  </p>
                  <p className='text-sm font-body text-warm-stone-500 mb-6'>
                    {error}
                  </p>
                  <button onClick={refreshItems} className='btn btn-primary'>
                    Try Again
                  </button>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className='text-center py-16'>
                  <div className='font-display text-7xl font-light text-warm-stone-200 mb-4 leading-none select-none'>
                    ∅
                  </div>
                  <h3 className='font-display text-2xl font-light text-espresso mb-2'>
                    {items.length === 0
                      ? 'Your wishlist awaits'
                      : 'No matches found'}
                  </h3>
                  <p className='text-sm font-body text-warm-stone-500 mb-6'>
                    {items.length === 0
                      ? 'Start tracking the things you want.'
                      : 'Try adjusting your filters.'}
                  </p>
                  {items.length === 0 && (
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className='btn btn-primary'
                    >
                      Add Your First Item
                    </button>
                  )}
                </div>
              ) : (
                <div className='space-y-4'>
                  {/* Mobile Add Button */}
                  <div className='sm:hidden'>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className='btn btn-primary w-full'
                    >
                      <Plus className='w-4 h-4 mr-2' />
                      Add New Item
                    </button>
                  </div>

                  {/* Items List */}
                  <div className='bg-white rounded-xl border border-warm-stone-200 overflow-hidden divide-y divide-warm-stone-100'>
                    {filteredItems.map((item) => (
                      <WishlistItem
                        key={item.id}
                        item={item}
                        onTogglePurchased={togglePurchased}
                        onDelete={deleteItem}
                        onEdit={handleEditItem}
                        onUpdatePrice={updatePrice}
                      />
                    ))}
                  </div>

                  <p className='text-xs font-body text-warm-stone-400 text-center pt-1'>
                    {filteredItems.length} item
                    {filteredItems.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </ProtectedRoute>
      </main>

      {/* Add/Edit Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddItem}
        editingItem={editingItem}
        categories={categories}
      />
    </div>
    </WishlistContext.Provider>
  );
}

export default App;
