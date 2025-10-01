import { ChevronDown, Plus, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface CategoryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select or create a category',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleOptionSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleCreateNew = () => {
    if (searchTerm.trim() && !options.includes(searchTerm.trim())) {
      onChange(searchTerm.trim());
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  const canCreateNew =
    searchTerm.trim() && !options.includes(searchTerm.trim());

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type='button'
        onClick={handleToggle}
        className='input w-full flex items-center justify-between text-left'
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        <div className='flex items-center gap-1'>
          {value && (
            <div
              onClick={handleClear}
              className='p-1 hover:bg-gray-100 rounded cursor-pointer'
            >
              <X className='w-4 h-4 text-gray-400' />
            </div>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-hidden'>
          {/* Search Input */}
          <div className='p-2 border-b border-gray-100'>
            <input
              ref={inputRef}
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='input w-full text-sm'
              placeholder='Search categories...'
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
                  onClick={() => handleOptionSelect(option)}
                  className='w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between'
                >
                  <span>{option}</span>
                  {value === option && (
                    <div className='w-2 h-2 bg-blue-500 rounded-full' />
                  )}
                </button>
              ))
            ) : (
              <div className='px-3 py-2 text-sm text-gray-500'>
                No categories found
              </div>
            )}

            {/* Create New Option */}
            {canCreateNew && (
              <button
                type='button'
                onClick={handleCreateNew}
                className='w-full px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 border-t border-gray-100'
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
