import { X } from 'lucide-react';
import { FC, FormEvent, useEffect, useState } from 'react';
import type { Currency } from '../constants/currencies';
import {
	CURRENCY_SYMBOLS
} from '../constants/currencies';
import { NewWishlistItem } from '../types';
import { CategoryDropdown } from './CategoryDropdown';

interface AddItemModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAdd: (item: NewWishlistItem) => void;
	editingItem?: (NewWishlistItem & { id: string }) | null;
	categories: string[];
	defaultCurrency?: string;
}

export const AddItemModal: FC<AddItemModalProps> = ({
	isOpen,
	onClose,
	onAdd,
	editingItem,
	categories,
	defaultCurrency = 'USD',
}) => {
	const [formData, setFormData] = useState<NewWishlistItem>({
		name: editingItem?.name || '',
		price: editingItem?.price || 0,
		currency: editingItem?.currency || 'USD',
		purchased: editingItem?.purchased || false,
		notes: editingItem?.notes || '',
		categories: editingItem?.categories ?? [],
		url: editingItem?.url || '',
	});

	// String display for price input so placeholder shows when empty; avoids "0" sticking
	const [priceDisplay, setPriceDisplay] = useState('');

	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (editingItem) {
			setFormData({
				name: editingItem.name,
				price: editingItem.price,
				currency: editingItem.currency,
				purchased: editingItem.purchased,
				notes: editingItem.notes,
				categories: editingItem.categories ?? [],
				url: editingItem.url,
			});
			setPriceDisplay(editingItem.price > 0 ? String(editingItem.price) : '');
		} else {
			setFormData({
				name: '',
				price: 0,
				currency: defaultCurrency,
				purchased: false,
				notes: '',
				categories: [],
				url: '',
			});
			setPriceDisplay('');
		}
		setErrors({});
	}, [editingItem, isOpen, defaultCurrency]);

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

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;
		onAdd(formData);
		onClose();
	};

	const handleInputChange = (
		field: keyof NewWishlistItem,
		value: string | number | boolean | string[]
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field as string]) {
			setErrors((prev) => ({ ...prev, [field as string]: '' }));
		}
	};

	// Strip leading zeros unless it's a decimal (e.g. 0.99)
	const normalizePriceInput = (raw: string): string => {
		if (!raw) return raw;
		if (raw.includes('.')) {
			const [intPart, decPart] = raw.split('.');
			const normalizedInt = intPart.replace(/^0+/, '') || '0';
			return `${normalizedInt}.${decPart}`;
		}
		// "05" -> "5", "0" stays "0" (user might type 0.99 next)
		return raw.replace(/^0+(?=\d)/, '');
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
			{/* Backdrop */}
			<div
				className='absolute inset-0 bg-espresso/60 backdrop-blur-sm animate-fade-in'
				onClick={onClose}
			/>

			{/* Modal */}
			<div className='relative bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl shadow-espresso/20 animate-fade-up'>
				{/* Header */}
				<div className='flex items-center justify-between px-6 pt-6 pb-4 border-b border-warm-stone-100'>
					<h2 className='font-display text-2xl font-light text-espresso'>
						{editingItem ? 'Edit Item' : 'Add Item'}
					</h2>
					<button
						onClick={onClose}
						className='p-2 rounded-lg text-warm-stone-400 hover:text-espresso hover:bg-warm-stone-100 transition-all'
					>
						<X className='w-4 h-4' />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className='px-6 py-5 space-y-5'>
					{/* Name */}
					<div>
						<label
							htmlFor='name'
							className='block text-xs font-body font-semibold text-warm-stone-500 uppercase tracking-widest mb-2'
						>
							Name *
						</label>
						<input
							type='text'
							id='name'
							value={formData.name}
							onChange={(e) => handleInputChange('name', e.target.value)}
							className={`input ${errors.name ? 'border-red-300 focus:border-red-500' : ''}`}
							placeholder='What are you wishing for?'
							autoFocus
						/>
						{errors.name && (
							<p className='text-red-500 text-xs mt-1 font-body'>
								{errors.name}
							</p>
						)}
					</div>

					{/* Price + Currency */}
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
						<div>
							<label
								htmlFor='price'
								className='block text-xs font-body font-semibold text-warm-stone-500 uppercase tracking-widest mb-2'
							>
								Price *
							</label>
							<div
								className={`flex rounded-lg border bg-white overflow-hidden transition-all duration-200 hover:border-[#cfc0b2] focus-within:ring-[3px] focus-within:ring-[rgba(172,89,11,0.1)] ${errors.price
									? 'border-red-300 focus-within:border-red-500'
									: 'border-[#e3d9cf] focus-within:border-[var(--brand-primary)]'
									}`}
							>
								<span className='flex items-center pl-3 text-sm font-mono text-warm-stone-400'>
									{CURRENCY_SYMBOLS[formData.currency as Currency]}
								</span>
								<input
									type='number'
									id='price'
									step='0.01'
									min='0'
									value={priceDisplay}
									onChange={(e) => {
										const raw = e.target.value;
										const normalized = normalizePriceInput(raw);
										setPriceDisplay(normalized);
										handleInputChange('price', parseFloat(normalized) || 0);
									}}
									className='flex-1 min-w-0 px-3 py-2.5 font-mono border-0 focus:outline-none focus:ring-0'
									placeholder='0.00'
								/>
							</div>
							{errors.price && (
								<p className='text-red-500 text-xs mt-1 font-body'>
									{errors.price}
								</p>
							)}
						</div>

						{/* <div>
							<label
								htmlFor='currency'
								className='block text-xs font-body font-semibold text-warm-stone-500 uppercase tracking-widest mb-2'
							>
								Currency
							</label>
							<select
								id='currency'
								value={formData.currency}
								onChange={(e) => handleInputChange('currency', e.target.value)}
								className='input'
							>
								{CURRENCIES.map((c) => (
									<option key={c} value={c}>
										{getCurrencyLabel(c)}
									</option>
								))}
							</select>
						</div> */}
					</div>

					{/* Category */}
					<div>
						<label
							htmlFor='category'
							className='block text-xs font-body font-semibold text-warm-stone-500 uppercase tracking-widest mb-2'
						>
							Category
						</label>
						<CategoryDropdown
							value={formData.categories ?? []}
							onChange={(value) => handleInputChange('categories', value)}
							options={[
								...categories,
								...(formData.categories ?? []).filter((c) => !categories.includes(c)),
							].sort()}
							placeholder='e.g., Electronics, Clothing'
						/>
					</div>

					{/* URL */}
					<div>
						<label
							htmlFor='url'
							className='block text-xs font-body font-semibold text-warm-stone-500 uppercase tracking-widest mb-2'
						>
							URL
						</label>
						<input
							type='url'
							id='url'
							value={formData.url || ''}
							onChange={(e) => handleInputChange('url', e.target.value)}
							className={`input ${errors.url ? 'border-red-300' : ''}`}
							placeholder='https://nike.com/'
						/>
						{errors.url && (
							<p className='text-red-500 text-xs mt-1 font-body'>
								{errors.url}
							</p>
						)}
					</div>

					{/* Notes */}
					<div>
						<label
							htmlFor='notes'
							className='block text-xs font-body font-semibold text-warm-stone-500 uppercase tracking-widest mb-2'
						>
							Notes
						</label>
						<textarea
							id='notes'
							value={formData.notes || ''}
							onChange={(e) => handleInputChange('notes', e.target.value)}
							className='input min-h-[80px] resize-none'
							placeholder='Any additional details?'
						/>
					</div>

					{/* Purchased toggle (edit mode only) */}
					{editingItem && (
						<div className='flex items-center gap-3 p-3 rounded-xl bg-warm-stone-50 border border-warm-stone-100'>
							<input
								type='checkbox'
								id='purchased'
								checked={formData.purchased}
								onChange={(e) =>
									handleInputChange('purchased', e.target.checked)
								}
								className='w-4 h-4 accent-brand-500 rounded'
							/>
							<label
								htmlFor='purchased'
								className='text-sm font-body text-warm-stone-700'
							>
								Mark as purchased
							</label>
						</div>
					)}

					{/* Actions */}
					<div className='flex gap-3 pt-1'>
						<button
							type='button'
							onClick={onClose}
							className='btn btn-secondary flex-1'
						>
							Cancel
						</button>
						<button type='submit' className='btn btn-primary flex-1'>
							{editingItem ? 'Update' : 'Add Item'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
