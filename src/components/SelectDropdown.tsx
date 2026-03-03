import { ChevronDown } from 'lucide-react';
import React, { FC, useEffect, useRef, useState } from 'react';

interface SelectOption {
	value: string;
	label: string;
}

interface SelectDropdownProps {
	value: string;
	onChange: (value: string) => void;
	options: SelectOption[];
	placeholder?: string;
	className?: string;
}

export const SelectDropdown: FC<SelectDropdownProps> = ({
	value,
	onChange,
	options,
	placeholder = 'Select...',
	className = '',
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const selectedOption = options.find((o) => o.value === value);
	const displayLabel = selectedOption?.label ?? placeholder;

	return (
		<div className={`relative ${className}`} ref={dropdownRef}>
			<button
				type='button'
				onClick={() => setIsOpen(!isOpen)}
				className='input w-full flex items-center justify-between text-left min-h-[42px] cursor-pointer'
			>
				<span
					className={
						value ? 'text-espresso' : 'text-warm-stone-400'
					}
				>
					{displayLabel}
				</span>
				<ChevronDown
					className={`w-4 h-4 text-warm-stone-400 transition-transform ${
						isOpen ? 'rotate-180' : ''
					}`}
				/>
			</button>

			{isOpen && (
				<div className='absolute z-50 w-full mt-1 bg-white border border-warm-stone-200 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
					{options.map((option) => (
						<button
							key={option.value}
							type='button'
							onClick={() => {
								onChange(option.value);
								setIsOpen(false);
							}}
							className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between transition-colors ${
								option.value === value
									? 'bg-brand-50 text-brand-700'
									: 'text-espresso hover:bg-warm-stone-50'
							}`}
						>
							<span>{option.label}</span>
							{option.value === value && (
								<div className='w-2 h-2 bg-brand-500 rounded-full shrink-0' />
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
};
