import { useAuth0 } from '@auth0/auth0-react';
import { LogOut, PenSquare, Save, X } from 'lucide-react';
import React, { FC, useEffect, useRef } from 'react';
import {
	CURRENCIES,
	getCurrencyLabel,
	getDefaultCurrencyLabel,
} from '../constants/currencies';
import { useProfileEdit } from '../hooks/useProfileEdit';

interface ProfilePopoverProps {
	user: any;
	isOpen: boolean;
	onClose: () => void;
	triggerRef: React.RefObject<HTMLElement>;
}

const getInitials = (name?: string) =>
	(name ?? '')
		.split(' ')
		.slice(0, 2)
		.map((w) => w[0]?.toUpperCase() ?? '')
		.join('');

export const ProfilePopover: FC<ProfilePopoverProps> = ({
	user,
	isOpen,
	onClose,
	triggerRef,
}) => {
	const popoverRef = useRef<HTMLDivElement>(null);
	const { logout } = useAuth0();
	// const { itemCount, totalValue } = useWishlistStats();
	const {
		isEditing,
		isSaving,
		saveError,
		saveSuccess,
		editedUser,
		setEditedUser,
		setIsEditing,
		handleSave,
		handleCancel,
	} = useProfileEdit(user);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				popoverRef.current &&
				!popoverRef.current.contains(event.target as Node) &&
				triggerRef.current &&
				!triggerRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, onClose, triggerRef]);

	const handleLogout = () => {
		logout({ logoutParams: { returnTo: window.location.origin } });
	};

	if (!isOpen) return null;

	const initials = getInitials(user?.name);

	return (
		<div
			ref={popoverRef}
			className='absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl shadow-espresso/10 border border-warm-stone-100 z-50 animate-fade-up overflow-hidden'
		>
			{/* Header bar */}
			<div className='flex items-center justify-between px-4 pt-4 pb-3 border-b border-warm-stone-100'>
				<h3 className='font-display text-xl font-light text-espresso tracking-wide'>
					Profile
				</h3>
				<button
					onClick={onClose}
					className='text-warm-stone-400 hover:text-espresso transition-colors p-1 -mr-1 rounded-lg hover:bg-warm-stone-50'
					aria-label='Close profile'
				>
					<X className='w-4 h-4' />
				</button>
			</div>

			<div className='p-4 space-y-4'>
				{/* Avatar + name/username */}
				<div className='flex items-center gap-3'>
					{user?.picture ? (
						<img
							src={user.picture}
							alt={user?.name ?? 'Profile'}
							className='w-12 h-12 rounded-full ring-2 ring-warm-stone-100 ring-offset-1 flex-shrink-0'
						/>
					) : (
						<div className='w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-warm-stone-100 ring-offset-1'>
							<span className='font-body font-semibold text-brand-600 text-sm'>
								{initials || '?'}
							</span>
						</div>
					)}

					<div className='flex-1 min-w-0'>
						{isEditing ? (
							<div className='space-y-3'>
								<label className='block'>
									<span className='font-body text-xs font-medium text-warm-stone-600 block mb-1'>
										Full name
									</span>
									<input
										type='text'
										id='profile-popover-name'
										value={editedUser.name}
										onChange={(e) =>
											setEditedUser({ ...editedUser, name: e.target.value })
										}
										className='input w-full text-sm'
										placeholder='Full name'
										autoFocus
									/>
								</label>
								<label className='block'>
									<span className='font-body text-xs font-medium text-warm-stone-600 block mb-1'>
										Username
									</span>
									<div className='flex rounded-lg border border-[#e3d9cf] bg-white overflow-hidden transition-all duration-200 hover:border-[#cfc0b2] focus-within:border-[var(--brand-primary)] focus-within:ring-[3px] focus-within:ring-[rgba(172,89,11,0.1)]'>
										<span className='flex items-center pl-3 text-xs font-mono text-warm-stone-400'>
											@
										</span>
										<input
											type='text'
											id='profile-popover-username'
											value={editedUser.username}
											onChange={(e) =>
												setEditedUser({
													...editedUser,
													username: e.target.value.replace(/^@+/, ''),
												})
											}
											className='flex-1 min-w-0 px-3 py-2.5 text-xs font-body border-0 focus:outline-none focus:ring-0'
											placeholder='username'
										/>
									</div>
								</label>
								<label className='block'>
									<span className='font-body text-xs font-medium text-warm-stone-600 block mb-1'>
										Current currency
									</span>
									<select
										id='profile-popover-currency'
										value={editedUser.defaultCurrency}
										onChange={(e) =>
											setEditedUser({
												...editedUser,
												defaultCurrency: e.target.value as typeof editedUser.defaultCurrency,
											})
										}
										className='input w-full text-xs'
									>
										{CURRENCIES.map((c) => (
											<option key={c} value={c}>
												{getCurrencyLabel(c)}
											</option>
										))}
									</select>
								</label>
							</div>
						) : (
							<>
								<p className='font-display text-lg font-light text-espresso leading-tight truncate'>
									{user?.name || 'No name'}
								</p>
								<p className='font-mono text-xs text-warm-stone-400 truncate'>
									@{user?.nickname ?? user?.username ?? user?.email?.split('@')[0] ?? '—'}
								</p>
								<p className='font-mono text-xs text-warm-stone-500 mt-1'>
									Default:{' '}
									{getDefaultCurrencyLabel(
										user?.user_metadata?.default_currency
									)}
								</p>
							</>
						)}
					</div>

					{!isEditing && (
						<button
							onClick={() => setIsEditing(true)}
							className='text-warm-stone-400 hover:text-brand-500 transition-colors p-1.5 rounded-lg hover:bg-warm-stone-50 flex-shrink-0'
							title='Edit profile'
						>
							<PenSquare className='w-4 h-4' />
						</button>
					)}
				</div>

				{/* Email — read only */}
				{/* {user?.email && (
					<div className='flex items-center gap-2.5 text-warm-stone-500'>
						<Mail className='w-3.5 h-3.5 flex-shrink-0' />
						<span className='font-body text-xs truncate'>{user.email}</span>
					</div>
				)} */}

				{/* Wishlist stats
				<div className='flex items-center gap-2.5 py-2.5 px-3 bg-warm-stone-50 rounded-xl'>
					<ShoppingBag className='w-3.5 h-3.5 text-brand-500 flex-shrink-0' />
					<span className='font-mono text-xs text-warm-stone-600'>
						{itemCount} {itemCount === 1 ? 'item' : 'items'}
						{totalValue > 0 && (
							<> · <span className='text-espresso'>{formatCurrency(totalValue)}</span> tracked</>
						)}
					</span>
				</div> */}

				{/* Feedback messages */}
				{saveSuccess && (
					<div className='p-3 bg-green-50 border border-green-200 rounded-xl'>
						<p className='font-body text-xs text-green-700'>
							✓ Profile updated successfully.
						</p>
					</div>
				)}
				{saveError && (
					<div className='p-3 bg-red-50 border border-red-200 rounded-xl'>
						<p className='font-body text-xs text-red-700'>{saveError}</p>
					</div>
				)}

				{/* Action buttons */}
				<div className='space-y-2 pt-1'>
					{isEditing ? (
						<div className='flex gap-2'>
							<button
								onClick={() => handleSave(onClose)}
								disabled={isSaving}
								className='flex-1 btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								<Save className='w-3.5 h-3.5' />
								{isSaving ? 'Saving...' : 'Save'}
							</button>
							<button
								onClick={handleCancel}
								disabled={isSaving}
								className='flex-1 btn btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								<X className='w-3.5 h-3.5' />
								Cancel
							</button>
						</div>
					) : (
						<button
							onClick={handleLogout}
							className='btn btn-danger w-full flex items-center justify-center gap-2'
						>
							<LogOut className='w-3.5 h-3.5' />
							Sign out
						</button>
					)}
				</div>
			</div>
		</div>
	);
};
