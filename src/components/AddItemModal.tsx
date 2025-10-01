import { X } from 'lucide-react';
import React, { useState } from 'react';
import { NewWishlistItem } from '../types';
import { CategoryDropdown } from './CategoryDropdown';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: NewWishlistItem) => void;
  editingItem?: (NewWishlistItem & { id: string }) | null;
  categories: string[];
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  editingItem,
  categories,
}) => {
  const [formData, setFormData] = useState<NewWishlistItem>({
    name: editingItem?.name || '',
    price: editingItem?.price || 0,
    currency: editingItem?.currency || 'USD',
    purchased: editingItem?.purchased || false,
    notes: editingItem?.notes || '',
    category: editingItem?.category || '',
    url: editingItem?.url || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        price: editingItem.price,
        currency: editingItem.currency,
        purchased: editingItem.purchased,
        notes: editingItem.notes,
        category: editingItem.category,
        url: editingItem.url,
      });
    } else {
      setFormData({
        name: '',
        price: 0,
        currency: 'USD',
        purchased: false,
        notes: '',
        category: '',
        url: '',
      });
    }
    setErrors({});
  }, [editingItem, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.url && formData.url.trim()) {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onAdd(formData);
    onClose();
  };

  const handleInputChange = (
    field: keyof NewWishlistItem,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-lg font-semibold'>
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button onClick={onClose} className='btn btn-secondary p-2'>
            <X className='w-5 h-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-4 space-y-4'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Item Name *
            </label>
            <input
              type='text'
              id='name'
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`input ${errors.name ? 'border-red-500' : ''}`}
              placeholder='Enter item name'
            />
            {errors.name && (
              <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='price'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Price *
              </label>
              <input
                type='number'
                id='price'
                step='0.01'
                min='0'
                value={formData.price}
                onChange={(e) =>
                  handleInputChange('price', parseFloat(e.target.value) || 0)
                }
                className={`input ${errors.price ? 'border-red-500' : ''}`}
                placeholder='0.00'
              />
              {errors.price && (
                <p className='text-red-500 text-sm mt-1'>{errors.price}</p>
              )}
            </div>

            <div>
              <label
                htmlFor='currency'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Currency
              </label>
              <select
                id='currency'
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className='input'
              >
                <option value='USD'>USD</option>
                <option value='EUR'>EUR</option>
                <option value='GBP'>GBP</option>
                <option value='CAD'>CAD</option>
                <option value='AUD'>AUD</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor='category'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Category
            </label>
            <CategoryDropdown
              value={formData.category || ''}
              onChange={(value) => handleInputChange('category', value)}
              options={categories}
              placeholder='e.g., Electronics, Clothing'
            />
          </div>

          <div>
            <label
              htmlFor='url'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              URL
            </label>
            <input
              type='url'
              id='url'
              value={formData.url || ''}
              onChange={(e) => handleInputChange('url', e.target.value)}
              className={`input ${errors.url ? 'border-red-500' : ''}`}
              placeholder='https://example.com/product'
            />
            {errors.url && (
              <p className='text-red-500 text-sm mt-1'>{errors.url}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='notes'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Notes
            </label>
            <textarea
              id='notes'
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className='input min-h-[80px] resize-none'
              placeholder='Add any additional notes...'
            />
          </div>

          {editingItem && (
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='purchased'
                checked={formData.purchased}
                onChange={(e) =>
                  handleInputChange('purchased', e.target.checked)
                }
                className='mr-2'
              />
              <label htmlFor='purchased' className='text-sm text-gray-700'>
                Mark as purchased
              </label>
            </div>
          )}

          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='btn btn-secondary flex-1'
            >
              Cancel
            </button>
            <button type='submit' className='btn btn-primary flex-1'>
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
