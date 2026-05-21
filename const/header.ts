import { NavigationOptions } from 'interfaces';
import { toast } from 'sonner';

/**
 * In this const file should be placed all const related to header,
 * for example the options that should be rendered
 *
 * At first, header can have a single default options array as they will be filtered
 * by roles/permissions. But you can have more than one possible header options
 * (for this case you should make a builder function like the ones that were provided)
 *
 * An example of having multiple const options for header is when you have two different
 * sections on the page, lets say a web2 and web3 for example
 */

// Options to show on the user profile menu in the navbar header
export const headerUserProfileOptions: NavigationOptions[] = [];

// Normal navbar options, normally just text
// NOTE: These are placeholder entries for development. Replace with
// client-specific navigation when starting a new project.
export const headerNavbarOptions: NavigationOptions[] = [
	{
		name: 'home',
		label: 'Home',
		href: '#',
	},
	{
		name: 'about',
		label: 'About',
		href: '#',
	},
	{
		name: 'section',
		label: 'Section',
		subOptions: [
			{
				name: 'section1',
				label: 'Section 1',
				href: '#',
			},
			{
				name: 'section2',
				label: 'Section 2',
				href: '#',
			},
		],
	},
	{
		name: 'click',
		label: 'Click',
		onClick: () => {
			toast('Header click action');
		},
	},
];
