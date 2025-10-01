import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { AddItemModal } from './components/AddItemModal';
import { FilterBar } from './components/FilterBar';
import { HamburgerMenu } from './components/HamburgerMenu';
import { LoginButton } from './components/LoginButton';
import { ProtectedRoute } from './components/ProtectedRoute';
import { StatsCard } from './components/StatsCard';
import { WishlistItem } from './components/WishlistItem';
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
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200 safe-area-top'>
        <div className='mobile-container sm:desktop-container'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='logo-font text-5xl'>shopr</h1>
            </div>
            <div className='flex items-center gap-2'>
              <ProtectedRoute
                fallback={
                  <div className='flex items-center gap-2'>
                    {/* Desktop Login Button for unauthenticated users */}
                    <div className='hidden sm:block'>
                      <LoginButton />
                    </div>

                    {/* Mobile Hamburger Menu for unauthenticated users */}
                    <div className='sm:hidden'>
                      <HamburgerMenu
                        onAddItem={() => setIsAddModalOpen(true)}
                        onShowStats={() => setShowMobileStats(!showMobileStats)}
                        onShowFilters={() =>
                          setShowMobileFilters(!showMobileFilters)
                        }
                      />
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
                    <Plus className='w-5 h-5' />
                    <span>Add Item</span>
                  </button>

                  {/* Desktop Login */}
                  <div className='hidden sm:block'>
                    <LoginButton />
                  </div>

                  {/* Mobile Hamburger Menu for authenticated users */}
                  <div className='sm:hidden'>
                    <HamburgerMenu
                      onAddItem={() => setIsAddModalOpen(true)}
                      onShowStats={() => setShowMobileStats(!showMobileStats)}
                      onShowFilters={() =>
                        setShowMobileFilters(!showMobileFilters)
                      }
                    />
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
              {/* Stats */}
              <StatsCard items={items} />

              {/* Filters */}
              <FilterBar
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
              />
            </aside>

            {/* Mobile Stats & Filters */}
            <div className='sm:hidden space-y-6'>
              {showMobileStats && <StatsCard items={items} />}
              {showMobileFilters && (
                <FilterBar
                  filters={filters}
                  onFiltersChange={setFilters}
                  categories={categories}
                />
              )}
            </div>

            {/* Main Content Area */}
            <div className='sm:desktop-main'>
              {/* Desktop Stats (compact) */}
              <div className='hidden sm:block mb-6'>
                <div className='grid grid-cols-4 gap-4'>
                  <div className='card text-center'>
                    <div className='text-2xl font-bold text-gray-900'>
                      {items.length}
                    </div>
                    <div className='text-sm text-gray-600'>Total Items</div>
                  </div>
                  <div className='card text-center'>
                    <div className='text-2xl font-bold text-green-600'>
                      {items.filter((item) => item.purchased).length}
                    </div>
                    <div className='text-sm text-gray-600'>Purchased</div>
                  </div>
                  <div className='card text-center'>
                    <div className='text-2xl font-bold text-blue-600'>
                      {items.filter((item) => !item.purchased).length}
                    </div>
                    <div className='text-sm text-gray-600'>Remaining</div>
                  </div>
                  <div className='card text-center'>
                    <div className='text-2xl font-bold text-purple-600'>
                      {
                        new Set(
                          items.map((item) => item.category).filter(Boolean)
                        ).size
                      }
                    </div>
                    <div className='text-sm text-gray-600'>Categories</div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className='card text-center py-12'>
                  <div className='animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4'></div>
                  <p className='text-gray-600'>Loading your wishlist...</p>
                </div>
              ) : error ? (
                <div className='card text-center py-12'>
                  <div className='text-red-500 mb-4'>
                    <Search className='w-12 h-12 mx-auto mb-2' />
                    <h3 className='text-lg font-medium mb-2'>
                      Error loading wishlist
                    </h3>
                    <p className='text-sm text-gray-600 mb-4'>{error}</p>
                    <button onClick={refreshItems} className='btn btn-primary'>
                      Try Again
                    </button>
                  </div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className='card text-center py-12'>
                  <Search className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    {items.length === 0
                      ? 'No items yet'
                      : 'No items match your filters'}
                  </h3>
                  <p className='text-gray-600 mb-4'>
                    {items.length === 0
                      ? 'Start building your wishlist by adding your first item!'
                      : 'Try adjusting your filters to see more items.'}
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
                <div className='max-h-[60vh] overflow-y-auto pr-1'>
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
  );
}

export default App;
