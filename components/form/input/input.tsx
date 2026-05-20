import * as React from 'react';
import clsx from 'clsx';
import { Typography } from '../../common/typography';
import { InputProps } from 'interfaces';
import { CypressI } from 'interfaces/cypress';

export const Input: React.FC<
	InputProps & CypressI & React.InputHTMLAttributes<HTMLInputElement>
> = ({
	id,
	dataCY,
	name,
	title,
	register,
	rules,
	iconRight,
	iconLeft,
	rightClick,
	leftClick,
	customPlaceholder,
	onChangeCustom,
	error,
	className,
	classNameInput,
	...props
}) => {
	const registerAux = register(name, rules);
	return (
		<div className={clsx('relative flex flex-col', className)}>
			<div className="relative">
				<label
					htmlFor="name"
					className={clsx(
						'text-xs',
						error ? 'text-status-error-solid' : 'text-dark-80'
					)}
				>
					{title}
				</label>
				<input
					id={id}
					data-cy={dataCY}
					name={name}
					placeholder={customPlaceholder}
					autoComplete={props.autoComplete || 'off'}
					className={clsx(
						classNameInput,
						{
							'text-status-error-solid border-status-error-solid focus:border-status-error-solid placeholder-status-error-solid focus:ring-status-error-solid':
								error,
						},
						{ 'px-4': !iconLeft && !iconRight },
						{ 'pl-14 pr-4': iconLeft },
						{ 'pl-6 pr-8': iconRight },
						'placeholder-dark-40 py-3 w-full text-xs font-sans border rounded-lg bg-transparent',
						'focus:outline-none focus:ring-offset-transparent',
						'disabled:placeholder-dark-40 disabled:cursor-not-allowed disabled:text-dark-80 disabled:bg-dark-10',
						{
							'focus:ring-dark-80 text-dark-80': !error,
						},
						classNameInput
					)}
					ref={registerAux && registerAux.ref}
					onChange={(e) => {
						registerAux && registerAux.onChange(e); // method from hook form register
						onChangeCustom && onChangeCustom(e); // your method
					}}
					{...props}
				/>
				{iconLeft && (
					<div onClick={leftClick} className="absolute left-4 top-1/2 w-6 h-6">
						{iconLeft}
					</div>
				)}
				{iconRight && (
					<div
						onClick={rightClick}
						className="absolute right-4 top-1/2 w-6 h-6"
					>
						{iconRight}
					</div>
				)}
			</div>
			{error && error.message && (
				<span className="flex items-center mt-1 text-red-600 gap-1">
					<Typography type="caption-1">{error.message}</Typography>
				</span>
			)}
		</div>
	);
};
