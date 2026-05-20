/* eslint-disable @next/next/no-img-element */
import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { NavigationOptions } from 'interfaces';
import AppRoutes from 'const/routes';
import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Transition,
} from '@headlessui/react';
import { Icon, Typography } from 'components/common';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { itemIsNotNullAndNotUndefined } from 'utils';
import { useRouter } from 'next/router';
import { CypressI } from 'interfaces/cypress';

interface SidebarDesktopProps {
	itemOptions: NavigationOptions[];
	logoUrl?: string;
	collapsible?: boolean;

	classNameContainer?: string; // Container classes
	classNameItem?: string; // Typography classes
	classNameItemButton?: string; // Dropdown button classes

	showSidebar?: boolean;
}

/**
 * This component is meant to handle a side navbar
 *
 * @param itemOptions The options to be rendered in the navbar
 * @param logoUrl image to show in the sidebar
 * @param collapsible to make the sidebar able to collapse
 * @param showSidebar to show sidebar when it's mobile screen
 * @returns
 */
export const SidebarDesktop: React.FC<SidebarDesktopProps & CypressI> = ({
	dataCY,
	itemOptions,
	logoUrl,

	classNameContainer = 'bg-primary',
	classNameItem = 'text-white',
	classNameItemButton = '',

	showSidebar,
}) => {
	const router = useRouter();
	/**
	 * This function is to render the proper Element based on the item
	 * features, this will render the basic elements, the dropdown element will
	 * be rendered with a condition outside this function for readibility
	 *
	 * @param item The item that will be evaluated
	 * @returns The proper JSX.Element (Link, Text with onClick, Custom)
	 */
	const handleRenderItem = (item: NavigationOptions): JSX.Element | null => {
		switch (true) {
			// If the item to be rendered is custom
			case itemIsNotNullAndNotUndefined(item.customRender):
				return <>{item.customRender}</>;

			// Item to be rendered is link
			case item.href != undefined && item.href != null:
				return (
					<Link
						data-cy={`${dataCY}-option-${item.name}`}
						href={item.href ?? '#'}
					>
						<Typography
							type="subtitle-2"
							className={clsx(
								{
									'border-b-2 border-white': router.pathname === item.href,
								},
								classNameItem
							)}
						>
							{item.label}
						</Typography>
					</Link>
				);

			// Item to be rendered is an action
			case itemIsNotNullAndNotUndefined(item.onClick):
				return (
					<Typography
						data-cy={`${dataCY}-option-${item.name}`}
						type="subtitle-2"
						onClick={item.onClick}
						className={clsx(classNameItem)}
					>
						{item.label}
					</Typography>
				);

			// no case inside the item
			default:
				return null;
		}
	};

	const getDefaultOpen = (item: NavigationOptions): boolean => {
		const hrefs = item.subOptions?.map((elem) => elem.href);
		return hrefs?.includes(router.pathname) || false;
	};

	return (
		<div
			className={clsx(
				'-translate-x-full transition-transform', // general
				'absolute w-full h-full z-10', // mobile
				'md:relative md:flex md:flex-shrink-0 md:z-0', // desktop
				'md:w-max md:min-w-[250px] md:max-w-[350px] md:translate-x-0', // desktop
				{ '-translate-x-full': !showSidebar },
				{ 'translate-x-0': showSidebar },
				classNameContainer
			)}
		>
			<nav
				data-cy={dataCY}
				className={clsx(
					'h-full overflow-y-auto',
					'flex flex-col flex-1',
					'py-4 md:py-8',
					classNameContainer
				)}
			>
				{logoUrl && (
					<Link href={AppRoutes.HOME}>
						<img src={logoUrl} alt="Logo" className="h-8 max-h-8 px-6" />
					</Link>
				)}

				{/* Render each item */}
				{itemOptions.map((item) => {
					return (
						<div
							key={`sideNavbar-item-${item.name}`}
							className="flex flex-wrap gap-2 w-full items-center py-3 px-6"
						>
							{/* Icon */}
							{item.icon && !item.subOptions && (
								<div className="w-4">
									<Icon {...item.iconProps} src={item.icon} />
								</div>
							)}

							{/* Render handler (Link, OnClick, Custom) */}
							{handleRenderItem(item)}

							{/* Dropdown item */}
							{item.subOptions && (
								<Disclosure
									as="div"
									className="w-full"
									defaultOpen={getDefaultOpen(item)}
								>
									<DisclosureButton
										data-cy={`${dataCY}-option-${item.name}`}
										className={clsx(
											'flex justify-between items-center w-full',
											classNameItemButton
										)}
									>
										<div className="flex items-center gap-2">
											{/* Icon */}
											{item.icon && (
												<div className="w-4">
													<Icon {...item.iconProps} src={item.icon} />
												</div>
											)}

											{/* Label */}
											<Typography
												type="subtitle-2"
												className={clsx(classNameItem)}
											>
												{item.label}
											</Typography>
										</div>

										{/* Arrow Icon */}
										<ChevronRightIcon className="text-white w-6 ui-open:rotate-90 ui-open:transform" />
									</DisclosureButton>

									{item.subOptions.map((subItem) => {
										return (
											<Transition
												key={`sideNavbar-item-${item.name}-subItem-${subItem.name}`}
												enter="transition duration-100 ease-out"
												enterFrom="transform scale-95 opacity-0"
												enterTo="transform scale-100 opacity-100"
												leave="transition duration-75 ease-out"
												leaveFrom="transform scale-100 opacity-100"
												leaveTo="transform scale-95 opacity-0"
											>
												<DisclosurePanel className="flex flex-wrap gap-2 w-full justify-start items-center pl-6 mt-3">
													{/* SubItem Icon */}
													{subItem.icon && typeof subItem.icon == 'string' && (
														<div className="w-4">
															<Icon src={subItem.icon} />
														</div>
													)}
													{subItem.icon && typeof subItem.icon != 'string' && (
														<>{item.icon}</>
													)}

													{/* Render handler */}
													{handleRenderItem(subItem)}
												</DisclosurePanel>
											</Transition>
										);
									})}
								</Disclosure>
							)}
						</div>
					);
				})}
			</nav>
		</div>
	);
};
