import { NavigationOptions } from 'interfaces';
import AppRoutes from './routes';
import RolesEnum from './role';
import {
	HomeIcon,
	Cog6ToothIcon,
	EnvelopeIcon,
	EyeIcon,
} from '@heroicons/react/20/solid';

/**
 * This file will hold the possible navigation options for the sidebar
 * like the header const file, initially can be only one const
 * that will be filtered based on user roles/permissions but
 * you can have other const and filter them
 */
const cmsSidebarNavigation: NavigationOptions[] = [
	{
		name: 'dashboard',
		label: 'Dashboard',
		href: AppRoutes.HOME,
		icon: <HomeIcon className="w-4 h-4 text-white" />,
	},
	{
		name: 'settings',
		label: 'Settings',
		roles: [RolesEnum.ADMIN, RolesEnum.MODERATOR],
		icon: <Cog6ToothIcon className="w-4 h-4 text-white" />,
		subOptions: [
			{
				name: 'roles',
				label: 'Roles',
				href: AppRoutes.SETTINGS_ROLES,
			},
			{
				name: 'permissions',
				label: 'Permissions',
				href: AppRoutes.SETTINGS_PERMISSIONS,
			},
			{
				name: 'users',
				label: 'Users',
				href: AppRoutes.SETTINGS_USER,
			},
		],
	},
	{
		name: 'email',
		label: 'Email',
		roles: [RolesEnum.ADMIN, RolesEnum.MODERATOR],
		icon: <EnvelopeIcon className="w-4 h-4 text-white" />,
		subOptions: [
			{
				name: 'emailEditor',
				label: 'Editor',
				href: AppRoutes.EMAIL_CONTENT_EDITOR,
				roles: [RolesEnum.ADMIN],
			},
			{
				name: 'emailTemplates',
				label: 'Templates',
				href: AppRoutes.EMAIL_TEMPLATES_LIST,
				roles: [RolesEnum.ADMIN, RolesEnum.MODERATOR],
			},
		],
	},
	{
		name: 'guide-styles',
		label: 'Guide styles',
		href: '/guide-styles',
		icon: <EyeIcon className="w-4 h-4 text-white" />,
	},

	// THESE ARE FOR TESTING ROLES AND PERMISSIONS
	{
		name: 'misc1',
		label: 'Only [Admin]',
		roles: [RolesEnum.ADMIN],
		subOptions: [
			{
				name: 'submisc1',
				label: 'Admin sub option 1',
				href: '#',
			},
		],
	},
	{
		name: 'misc2',
		label: 'Only [Moderator] and [Admin]',
		roles: [RolesEnum.MODERATOR, RolesEnum.ADMIN],
		subOptions: [
			{
				name: 'submisc2',
				label: 'Moderator sub option 1',
				href: '#',
			},
		],
	},
	{
		name: 'misc3',
		label: 'Only [User][Moderator][Admin]',
		roles: [RolesEnum.USER, RolesEnum.MODERATOR, RolesEnum.ADMIN],
		subOptions: [
			{
				name: 'submisc3',
				label: 'User sub option 1',
				href: '#',
			},
		],
	},
	{
		name: 'misc4',
		label: 'Menu with filtered options',
		roles: [RolesEnum.USER, RolesEnum.MODERATOR, RolesEnum.ADMIN],
		subOptions: [
			{
				name: 'submisc4User',
				label: 'User-Mod-Admn',
				href: '#',
				roles: [RolesEnum.USER, RolesEnum.MODERATOR, RolesEnum.ADMIN],
			},
			{
				name: 'submisc4Moderator',
				label: 'Mod-Admn',
				href: '#',
				roles: [RolesEnum.MODERATOR, RolesEnum.ADMIN],
			},
			{
				name: 'submisc4Admin',
				label: '-Admn-',
				href: '#',
				roles: [RolesEnum.ADMIN],
			},
		],
	},
];

export default cmsSidebarNavigation;
