import { ChevronDown, Plus, X } from 'lucide-react';
import React, { FC, useEffect, useRef, useState } from 'react';

interface CategoryDropdownProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export const CategoryDropdown: FC<CategoryDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select or create categories',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = Array.isArray(value) ? value : value ? [value] : [];

  // Filter options based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  const handleOptionToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((c) => c !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleCreateNew = () => {
    if (searchTerm.trim() && !selected.includes(searchTerm.trim())) {
      onChange([...selected, searchTerm.trim()]);
      setSearchTerm('');
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
    setSearchTerm('');
  };

  const canCreateNew =
    searchTerm.trim() &&
    !selected.includes(searchTerm.trim()) &&
    !options.includes(searchTerm.trim());

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type='button'
        onClick={handleToggle}
        className='input w-full flex items-center justify-between text-left min-h-[42px] cursor-pointer'
      >
        <span
          className={
            selected.length ? 'text-espresso' : 'text-warm-stone-400'
          }
        >
          {selected.length > 0
            ? selected.join(', ')
            : placeholder}
        </span>
        <div className='flex items-center gap-1'>
          {selected.length > 0 && (
            <div
              onClick={handleClear}
              className='p-1 hover:bg-warm-stone-100 rounded cursor-pointer'
            >
              <X className='w-4 h-4 text-warm-stone-400' />
            </div>
          )}
          <ChevronDown
            className={`w-4 h-4 text-warm-stone-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute z-50 w-full mt-1 bg-white border border-warm-stone-200 rounded-lg shadow-lg max-h-60 overflow-hidden'>
          {/* Search Input */}
          <div className='p-2 border-b border-warm-stone-100'>
            <input
              ref={inputRef}
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='input w-full text-sm'
              placeholder='Search or create categories...'
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options List */}
          <div className='max-h-48 overflow-y-auto'>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type='button'
                  onClick={() => handleOptionToggle(option)}
                  className='w-full px-3 py-2 text-left text-sm text-espresso hover:bg-warm-stone-50 flex items-center justify-between transition-colors'
                >
                  <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                  {selected.includes(option) && (
                    <div className='w-2 h-2 bg-brand-500 rounded-full shrink-0' />
                  )}
                </button>
              ))
            ) : (
              <div className='px-3 py-2 text-sm text-warm-stone-500'>
                No categories found
              </div>
            )}

            {/* Create New Option */}
            {canCreateNew && (
              <button
                type='button'
                onClick={handleCreateNew}
                className='w-full px-3 py-2 text-left text-sm text-brand-600 hover:bg-brand-50 flex items-center gap-2 border-t border-warm-stone-100 transition-colors'
              >
                <Plus className='w-4 h-4' />
                Create "{searchTerm.trim()}"
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
