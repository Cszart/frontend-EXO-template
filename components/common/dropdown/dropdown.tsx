import {
	Menu,
	MenuButton,
	MenuItems,
	MenuItem,
	Transition,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { Typography } from '../typography';
import { Option } from 'interfaces';
import {
	itemIsNotNullAndNotUndefined,
	itemIsNullOrUndefined,
} from 'utils/common';
import { CypressI } from 'interfaces/cypress';

export interface DropdownProps {
	buttonContent: string | JSX.Element;
	showChevronDownIcon?: boolean;
	items?: Option[];
	customItems?: JSX.Element;

	// Styles
	classNameButton?: string;
	classNameMenuItems?: string;
	classNameMenuItem?: string;
	classNameItem?: string;
}

export const Dropdown: React.FC<DropdownProps & CypressI> = ({
	showChevronDownIcon = true,

	// Styles
	classNameButton = 'w-auto rounded-md p-1',
	classNameMenuItems = 'w-max bg-white rounded-lg',
	classNameMenuItem = 'flex items-center gap-x-2 p-2 hover:bg-dark-10 rounded-lg',
	classNameItem = 'text-gray-800 text-left text-sm rounded-lg w-full',
	...props
}): JSX.Element => {
	return (
		<Menu data-cy={props.dataCY} as="div" className="relative w-fit">
			<MenuButton
				data-cy={`${props.dataCY}-button`}
				className={clsx(
					'flex justify-center items-center',
					'focus:outline-none relative z-0',
					'focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-opacity-75',
					classNameButton
				)}
			>
				{props.buttonContent}
				{showChevronDownIcon && (
					<ChevronDownIcon
						className="ml-1 -mr-1 h-5 w-5 text-gray-500 hover:text-gray-700"
						aria-hidden="true"
					/>
				)}
			</MenuButton>

			<Transition
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<MenuItems
					as="div"
					className={clsx(
						'absolute right-0 mt-1 z-50 min-w-[100px]',
						'origin-top-right shadow-lg',
						'focus:outline-none',
						classNameMenuItems
					)}
				>
					{props.customItems != undefined && props.customItems != null && (
						<>{props.customItems}</>
					)}
					{(props.customItems == undefined || props.customItems == null) &&
						props.items?.map((item, index) => {
							return (
								<MenuItem
									as="div"
									data-cy={`${props.dataCY}-option-${item.label}`}
									key={`dropDown-option-${item.label}-${index}`}
									className={classNameMenuItem}
								>
									{item.icon && (
										<div className="max-w-4 max-h-4">{item.icon}</div>
									)}

									{/* If it's a link */}
									{item.href && itemIsNullOrUndefined(item.onClick) && (
										<Link href={item.href}>
											<Typography
												type="subtitle-2"
												className={clsx(classNameItem)}
											>
												{item.label}
											</Typography>
										</Link>
									)}

									{/* If it's a onClick */}
									{itemIsNotNullAndNotUndefined(item.onClick) &&
										itemIsNullOrUndefined(item.href) && (
											<button
												type="button"
												className={clsx('cursor-pointer', classNameItem)}
												onClick={item.onClick}
											>
												{item.label}
											</button>
										)}
								</MenuItem>
							);
						})}
				</MenuItems>
			</Transition>
		</Menu>
	);
};
