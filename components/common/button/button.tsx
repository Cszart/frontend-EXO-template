import * as React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { Typography } from '../typography';
import { Spinner } from '../spinner';
import { CypressI } from 'interfaces/cypress';

export interface ButtonProps {
	type?: 'submit' | 'reset' | 'button';
	className?: string;
	disabled?: boolean;
	decoration?: 'fill' | 'not-fill' | 'line-primary' | 'none';
	size?: 'extra-small' | 'small' | 'medium' | 'large' | 'full' | 'fit';
	onClick?: () => void;
	label?: string;
	icon?: React.ReactNode;
	href?: string;
	loading?: boolean;
	iconLeft?: boolean;
	iconRight?: boolean;
}

/**
 * Primary UI component for user interaction
 */
const ButtonContent: React.FC<
	ButtonProps & CypressI & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({
	dataCY,
	type = 'button',
	className,
	disabled = false,
	decoration,
	size,
	onClick,
	children,
	label,
	icon,
	iconLeft,
	iconRight,
	loading,
}): JSX.Element => {
	return (
		<button
			data-cy={dataCY}
			type={type}
			disabled={disabled}
			onClick={onClick}
			className={clsx(
				//size
				{ 'w-fit': size === 'fit' },
				{ 'w-full': size === 'full' },
				{ 'w-80': size === 'large' },
				{ 'w-60': size === 'medium' },
				{ 'w-48': size === 'small' },
				{ 'w-36': size === 'extra-small' },

				// fill
				{
					'text-white bg-blue border-blue': decoration === 'fill',
				},
				{
					'hover:text-blue hover:border-blue hover:bg-transparent':
						decoration === 'fill' && !disabled,
				},

				// not fill white
				{
					'text-blue border-blue': decoration === 'not-fill',
				},
				{
					'hover:bg-blue hover:text-white hover:border-blue':
						decoration === 'not-fill' && !disabled,
				},

				// not fill primary
				{
					'text-primary border-primary': decoration === 'line-primary',
				},
				{
					'hover:bg-primary hover:text-white hover:border-primary':
						decoration === 'line-primary' && !disabled,
				},

				// none
				{
					'text-gray-800 font-medium hover:bg-dark-10': !decoration,
				},

				// global
				'group flex items-center justify-center border rounded-lg px-4 py-2',
				'outline-none transition-colors duration-200',
				'focus:outline-none disabled:cursor-not-allowed disabled:opacity-30',
				className
			)}
		>
			{label ? (
				<div className="flex items-center justify-end">
					{icon && iconLeft && <span className="w-6 h-6 mr-2">{icon}</span>}
					<Typography type="link-1">
						<span>{label}</span>
					</Typography>{' '}
					{loading && <Spinner className="mx-2" />}
					{icon && iconRight && <span className="w-6 h-6 ml-2">{icon}</span>}
				</div>
			) : (
				children
			)}
		</button>
	);
};

export const Button: React.FC<
	ButtonProps & CypressI & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({
	size = 'full',
	label,
	disabled,
	onClick,
	href,
	icon,
	children,
	iconLeft,
	iconRight,
	loading,
	...props
}) => {
	return (
		<>
			{href ? (
				<Link href={href}>
					<ButtonContent
						size={size}
						label={label}
						disabled={disabled}
						icon={icon}
						iconLeft={iconLeft}
						iconRight={iconRight}
						loading={loading}
						{...props}
					>
						{children}
					</ButtonContent>
				</Link>
			) : (
				<ButtonContent
					size={size}
					label={label}
					disabled={disabled}
					icon={icon}
					iconLeft={iconLeft}
					iconRight={iconRight}
					loading={loading}
					onClick={onClick}
					{...props}
				>
					{children}
				</ButtonContent>
			)}
		</>
	);
};
