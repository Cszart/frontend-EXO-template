import React, { PropsWithChildren, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Footer from '../footer/footer';
import HeaderNavbar from '../header/header';
import { SidebarDesktop } from '../sidebars';
import { headerNavbarOptions, brand } from 'const';
import cmsSidebarNavigation from 'const/sideBarNavigation';
import { NavigationOptions } from 'interfaces';
import { filterNavigationOptionsByRolesOrPermissions } from 'utils/options';
import { Button, Typography } from 'components/common';
import { Can } from 'components/auth/Can';
import { CypressI } from 'interfaces/cypress';

export interface Layout_Props {
	title?: string;
	classNameTitle?: string;

	withHeader?: boolean;
	customHeader?: React.ReactNode;

	withFooter?: boolean;
	customFooter?: React.ReactNode;

	withSidebar?: boolean;
	customSidebar?: React.ReactNode;

	buttonTitle?: string;
	classNameButton?: string;
	hrefButton?: string;
	onClickButton?: () => void;

	classNameChildren?: string;
	classNameLayout?: string;

	allowedPermissions?: string[];
	allowedRoles?: string[];
}

/**
 * This is the main layout component to render a page
 * It has a default behaviour/style but it also considers when a custom component is meant to be rendered
 *
 * @param props they will handle the behaviour of the layout and the styles
 * @returns JSX element for the layout container
 */
export const Layout: React.FC<PropsWithChildren<Layout_Props & CypressI>> = ({
	dataCY,
	title,
	classNameTitle,

	withHeader = true,
	customHeader = undefined,

	withFooter = false,
	customFooter = undefined,

	withSidebar = true,
	customSidebar = undefined,

	buttonTitle,
	classNameButton = undefined,
	hrefButton,
	onClickButton,

	children,
	classNameChildren,
	classNameLayout,

	allowedPermissions,
	allowedRoles,
}) => {
	const { data: session } = useSession();
	const logoUrl = brand.logo;

	const [sideBarOptions, setSideBarOptions] = useState<NavigationOptions[]>([]);
	const [showSidebar, setShowSidebar] = React.useState<boolean>(false);

	useEffect(() => {
		const filteredOptions = filterNavigationOptionsByRolesOrPermissions(
			cmsSidebarNavigation,
			session?.user
		);
		setSideBarOptions(filteredOptions);
	}, [session]);

	return (
		<div
			data-cy={`${dataCY}-layout`}
			className={clsx('w-full h-screen overflow-hidden', classNameLayout)}
		>
			{/* Header */}
			{withHeader && !customHeader && (
				<HeaderNavbar
					dataCY={`${dataCY}-header`}
					navBarOptions={headerNavbarOptions}
					logoUrl={logoUrl}
					showSidebar={showSidebar}
					setShowSidebar={setShowSidebar}
				/>
			)}
			{withHeader && customHeader && <>{customHeader}</>}

			{/* Content of the layout */}
			<div className={clsx('flex h-screen overflow-hidden', classNameChildren)}>
				{/* Sidebar */}
				{withSidebar && !customSidebar && (
					<SidebarDesktop
						dataCY={`${dataCY}-sidebar`}
						itemOptions={sideBarOptions}
						showSidebar={showSidebar}
					/>
				)}
				{withSidebar && customSidebar && <>{customSidebar}</>}

				{/* Right container for actual page content */}
				<div
					className={clsx({
						'relative w-full mb-10 overflow-y-scroll scroll-custom':
							withSidebar,
					})}
				>
					{/* Content - Children */}
					<main
						className={clsx({
							'relative w-full px-9 md:px-16 py-10 mb-10': withSidebar,
							'-z-10': showSidebar,
						})}
					>
						<div className="flex gap-x-2 justify-between items-center mb-10">
							{title && (
								<Typography
									type="custom-h1"
									text={title}
									className={clsx(
										'text-md lg:text-xl font-bold text-gray-800',
										classNameTitle
									)}
								/>
							)}
							{buttonTitle && (
								<Can
									allowedPermissions={allowedPermissions}
									allowedRoles={allowedRoles}
								>
									<Button
										label={buttonTitle}
										decoration="fill"
										size="fit"
										className={classNameButton}
										onClick={onClickButton}
										href={hrefButton}
									/>
								</Can>
							)}
						</div>

						{children}
					</main>

					{/* Footer */}
					{withFooter && !customFooter && (
						<Footer
							dataCY={`${dataCY}-footer`}
							companyName={brand.name}
							rightsYear={brand.rightsYear}
						/>
					)}
					{withFooter && customFooter && <>{customFooter}</>}
				</div>
			</div>
		</div>
	);
};
