/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import clsx from 'clsx';

const DEFAULT_AVATAR = '/icons/svg/avatar.svg';

type AvatarProps = {
	photoUrl: string;
	size?: 'small' | 'medium' | 'large';
	className?: string;
};

export const Avatar: React.FC<AvatarProps> = ({
	photoUrl,
	size,
	className,
}) => {
	return (
		<div
			className={clsx(
				'rounded-full ring-2 ring-white',
				{ 'w-8 h-8': size === 'small' },
				{ 'w-12 h-12': size === 'medium' },
				{ 'w-16 h-16': size === 'large' },
				className
			)}
		>
			<img
				src={photoUrl || DEFAULT_AVATAR}
				alt="avatar"
				className="object-cover w-full h-full rounded-full bg-dark-10"
			/>
		</div>
	);
};
