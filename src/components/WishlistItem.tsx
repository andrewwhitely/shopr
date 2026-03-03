import {
  Check,
  Edit2,
  ExternalLink,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import React, { FC, useState } from 'react';
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

export const WishlistItem: FC<WishlistItemProps> = ({
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
    <div
      className={`group px-5 py-4 transition-colors duration-150 hover:bg-warm-stone-50 ${
        item.purchased ? 'opacity-55' : ''
      }`}
    >
      <div className='flex items-start gap-4 justify-between'>
        {/* Left: Content */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-baseline gap-3 flex-wrap'>
            <h3
              className={`font-display text-xl font-light tracking-wide leading-tight ${
                item.purchased
                  ? 'line-through text-warm-stone-400'
                  : 'text-espresso'
              }`}
            >
              {item.name}
            </h3>

            {(item.categories ?? []).length > 0 && (
              <div className='flex flex-wrap gap-1 shrink-0'>
                {(item.categories ?? []).map((cat) => {
                  const { bg, text } = getCategoryColor(cat);
                  return (
                    <span
                      key={cat}
                      className={`text-xs font-body font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${bg} ${text}`}
                    >
                      {cat}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className='flex items-center gap-3 mt-1.5 flex-wrap'>
            <span className='text-xs font-mono text-warm-stone-400'>
              {formatDateShort(item.dateAdded)}
            </span>
            {item.purchased && item.datePurchased && (
              <span className='text-xs font-body text-green-600'>
                · Bought {formatDateShort(item.datePurchased)}
              </span>
            )}
          </div>

          {item.notes && (
            <p className='text-sm font-body text-warm-stone-500 mt-2 line-clamp-1 font-light'>
              {item.notes}
            </p>
          )}
        </div>

        {/* Right: Price */}
        <div className='flex flex-col items-end gap-1 shrink-0'>
          {isEditingPrice ? (
            <form
              onSubmit={handlePriceSubmit}
              className='flex items-center gap-1.5'
            >
              <input
                type='number'
                step='0.01'
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className='w-20 px-2 py-1 text-sm font-mono border border-warm-stone-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20'
                autoFocus
              />
              <button
                type='submit'
                className='p-1.5 rounded-lg bg-brand-500 text-white hover:bg-brand-400 transition-colors'
              >
                <Check className='w-3 h-3' />
              </button>
              <button
                type='button'
                onClick={() => {
                  setIsEditingPrice(false);
                  setNewPrice(item.price.toString());
                }}
                className='p-1.5 rounded-lg bg-warm-stone-100 text-warm-stone-600 hover:bg-warm-stone-200 transition-colors'
              >
                <X className='w-3 h-3' />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsEditingPrice(true)}
              className='text-right group/price'
              title='Click to update price'
            >
              <div className='font-mono text-lg font-medium text-espresso group-hover/price:text-brand-500 transition-colors duration-150'>
                {formatCurrency(item.price, item.currency)}
              </div>
              {priceChange && (
                <div
                  className={`flex items-center justify-end gap-0.5 text-xs font-mono ${
                    priceChange.change > 0 ? 'text-red-500' : 'text-green-600'
                  }`}
                >
                  {priceChange.change > 0 ? (
                    <TrendingUp className='w-3 h-3' />
                  ) : (
                    <TrendingDown className='w-3 h-3' />
                  )}
                  {Math.abs(priceChange.percentage).toFixed(1)}%
                </div>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Actions row */}
      <div className='flex items-center justify-between mt-3'>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => onTogglePurchased(item.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200 border ${
              item.purchased
                ? 'bg-warm-stone-100 text-warm-stone-600 border-warm-stone-200 hover:bg-warm-stone-200'
                : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300'
            }`}
          >
            {item.purchased && <Check className='w-3 h-3' />}
            {item.purchased ? 'Bought' : 'Mark Bought'}
          </button>

          {item.url && (
            <a
              href={item.url}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-body text-warm-stone-500 hover:text-brand-500 border border-warm-stone-200 hover:border-brand-200 transition-all duration-200'
            >
              <ExternalLink className='w-3 h-3' />
              View
            </a>
          )}
        </div>

        <div className='flex items-center gap-0.5'>
          <button
            onClick={() => onEdit(item)}
            className='p-1.5 rounded-lg text-warm-stone-400 hover:text-espresso hover:bg-warm-stone-100 transition-all duration-150'
            title='Edit item'
          >
            <Edit2 className='w-3.5 h-3.5' />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className='p-1.5 rounded-lg text-warm-stone-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150'
            title='Delete item'
          >
            <Trash2 className='w-3.5 h-3.5' />
          </button>
        </div>
      </div>
    </div>
  );
};
