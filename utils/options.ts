import { NavigationOptions, RowOptions, UserI } from 'interfaces';

/**
 * Filter navigation options based on user roles and permissions.
 */
export function filterNavigationOptionsByRolesOrPermissions(
	baseOptions: NavigationOptions[],
	user?: UserI | null
): NavigationOptions[] {
	return baseOptions.reduce<NavigationOptions[]>((acc, option) => {
		const hasNoRestrictions =
			(!option.roles || option.roles.length === 0) &&
			(!option.permissions || option.permissions.length === 0);

		if (hasNoRestrictions) {
			acc.push({
				...option,
				...(option.subOptions && option.subOptions.length > 0
					? {
							subOptions: filterNavigationOptionsByRolesOrPermissions(
								option.subOptions,
								user
							),
						}
					: {}),
			});
			return acc;
		}

		const userRoles: string[] = user?.roles ?? [];
		const userPermissions: string[] = user?.permissions ?? [];

		const hasRole = option.roles?.some((role) => userRoles.includes(role));
		const hasPermission = option.permissions?.some((perm) =>
			userPermissions.includes(perm)
		);

		if (hasRole || hasPermission) {
			acc.push({
				...option,
				...(option.subOptions && option.subOptions.length > 0
					? {
							subOptions: filterNavigationOptionsByRolesOrPermissions(
								option.subOptions,
								user
							),
						}
					: {}),
			});
		}

		return acc;
	}, []);
}

/**
 * Filter table row action options based on user roles and permissions.
 */
export function filterRowOptionsByRolesOrPermissions<T>(
	baseOptions: RowOptions<T>[],
	user?: UserI | null
): RowOptions<T>[] {
	return baseOptions.filter((option) => {
		if (
			(!option.roles || option.roles.length === 0) &&
			(!option.permissions || option.permissions.length === 0)
		) {
			return true;
		}

		const userRoles: string[] = user?.roles ?? [];
		const userPermissions: string[] = user?.permissions ?? [];

		const hasRole = option.roles?.some((role) => userRoles.includes(role));
		const hasPermission = option.permissions?.some((perm) =>
			userPermissions.includes(perm)
		);

		return hasRole || hasPermission;
	});
}
