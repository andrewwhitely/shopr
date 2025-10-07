import {
  Calendar,
  Check,
  Edit2,
  ExternalLink,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { WishlistItem as WishlistItemType } from '../types';
import {
  formatCurrency,
  formatDateShort,
  getCategoryColor,
} from '../utils/helpers';

interface WishlistItemProps {
  item: WishlistItemType;
  onTogglePurchased: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (item: WishlistItemType) => void;
  onUpdatePrice: (id: string, price: number) => void;
}

export const WishlistItem: React.FC<WishlistItemProps> = ({
  item,
  onTogglePurchased,
  onDelete,
  onEdit,
  onUpdatePrice,
}) => {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState(item.price.toString());

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newPrice);
    if (!isNaN(price) && price > 0) {
      onUpdatePrice(item.id, price);
      setIsEditingPrice(false);
    }
  };

  const getPriceChange = () => {
    if (item.priceHistory.length < 2) return null;

    const current = item.priceHistory[item.priceHistory.length - 1];
    const previous = item.priceHistory[item.priceHistory.length - 2];

    return {
      change: current.price - previous.price,
      percentage: ((current.price - previous.price) / previous.price) * 100,
    };
  };

  const priceChange = getPriceChange();

  return (
    <div className={`card ${item.purchased ? 'opacity-75 bg-gray-50' : ''}`}>
      <div className='flex items-start justify-between'>
        <div className='flex-1 min-w-0'>
          <h3
            className={`font-medium text-lg truncate ${
              item.purchased ? 'line-through text-gray-500' : 'text-gray-900'
            }`}
          >
            {item.name}
          </h3>

          <div className='flex items-center gap-4 mt-2 text-sm text-gray-600'>
            <div className='flex items-center gap-1'>
              <Calendar className='w-4 h-4' />
              <span>{formatDateShort(item.dateAdded)}</span>
            </div>

            {item.category && (
              <span
                className={`px-2 py-1 rounded text-xs border ${
                  getCategoryColor(item.category).bg
                } ${getCategoryColor(item.category).text} ${
                  getCategoryColor(item.category).border
                }`}
              >
                {item.category}
              </span>
            )}
          </div>

          {item.notes && (
            <p className='text-sm text-gray-600 mt-2 line-clamp-2'>
              {item.notes}
            </p>
          )}

          {item.url && (
            <a
              href={item.url}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2'
            >
              <ExternalLink className='w-4 h-4' />
              View Product
            </a>
          )}
        </div>

        <div className='flex flex-col items-end gap-2 ml-4'>
          {isEditingPrice ? (
            <form
              onSubmit={handlePriceSubmit}
              className='flex items-center gap-2'
            >
              <input
                type='number'
                step='0.01'
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className='w-20 px-2 py-1 text-sm border rounded'
                autoFocus
              />
              <button
                type='submit'
                className='btn btn-primary text-xs px-2 py-1'
              >
                <Check className='w-3 h-3' />
              </button>
              <button
                type='button'
                onClick={() => {
                  setIsEditingPrice(false);
                  setNewPrice(item.price.toString());
                }}
                className='btn btn-secondary text-xs px-2 py-1'
              >
                <X className='w-3 h-3' />
              </button>
            </form>
          ) : (
            <div className='text-right'>
              <div
                className='font-semibold text-lg'
                onClick={() => setIsEditingPrice(true)}
              >
                {formatCurrency(item.price, item.currency)}
              </div>
              {priceChange && (
                <div
                  className={`text-xs flex items-center gap-1 ${
                    priceChange.change > 0 ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  <TrendingUp
                    className={`w-3 h-3 ${
                      priceChange.change > 0 ? 'rotate-180' : ''
                    }`}
                  />
                  {priceChange.change > 0 ? '+' : ''}
                  {formatCurrency(Math.abs(priceChange.change), item.currency)}(
                  {priceChange.change > 0 ? '+' : ''}
                  {priceChange.percentage.toFixed(1)}%)
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className='flex items-center justify-between mt-4'>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => onTogglePurchased(item.id)}
            className={`btn ${
              item.purchased
                ? 'btn-secondary'
                : 'bg-green-600 text-white hover:bg-green-700'
            } text-sm px-3 py-1`}
          >
            {item.purchased ? (
              <>
                <Check className='w-4 h-4 mr-1' />
                Purchased
              </>
            ) : (
              'Mark as Purchased'
            )}
          </button>
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={() => onEdit(item)}
            className='btn btn-secondary text-sm px-3 py-1'
            title='Edit item'
          >
            <Edit2 className='w-4 h-4' />
          </button>

          <button
            onClick={() => onDelete(item.id)}
            className='btn btn-danger text-sm px-3 py-1'
            title='Delete item'
          >
            <Trash2 className='w-4 h-4' />
          </button>
        </div>
      </div>

      {item.purchased && item.datePurchased && (
        <div className='mt-2 text-sm text-gray-500'>
          Purchased on {formatDateShort(item.datePurchased)}
        </div>
      )}
    </div>
  );
};
