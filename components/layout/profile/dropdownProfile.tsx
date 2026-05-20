import * as React from 'react';
import {
	Menu,
	MenuButton,
	MenuItems,
	MenuItem,
	Transition,
} from '@headlessui/react';
import { Option } from 'interfaces';
import Link from 'next/link';
import { Avatar, Typography } from 'components/common';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Icons from 'const/icons';

interface DropdownProfileProps {
	links: Option[];
}

export const DropdownProfile: React.FC<DropdownProfileProps> = ({ links }) => {
	return (
		<Menu as="div" className="relative">
			<MenuButton className="inline-flex space-x-2 items-center justify-center focus:outline-none">
				<Avatar photoUrl={Icons.avatar} size="small" />
				<ChevronDownIcon width={20} height={20} className="text-white" />
			</MenuButton>

			<Transition
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<MenuItems className="absolute z-10 bg-white mt-1 right-0 origin-top-right shadow-lg rounded-lg w-40 hover:bg-dark-10">
					{links.map((link, index) => (
						<MenuItem key={`headerNavbar-${index}`}>
							<div className="flex justify-start items-center py-2 px-4 cursor-pointer">
								{/* Link option */}
								{link.href != undefined && link.href != null && (
									<Link href={link.href}>
										<Typography type="link-1">{link.label}</Typography>
									</Link>
								)}

								{/* Clickable option */}
								{link.onClick != undefined && link.onClick != null && (
									<button type="button" onClick={link.onClick}>
										<Typography type="link-1">{link.label}</Typography>
									</button>
								)}
							</div>
						</MenuItem>
					))}
				</MenuItems>
			</Transition>
		</Menu>
	);
};
