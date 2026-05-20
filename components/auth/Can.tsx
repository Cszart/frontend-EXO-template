import { useSession } from 'next-auth/react';
import React from 'react';

interface CanProps {
	allowedPermissions?: string[];
	allowedRoles?: string[];
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

/**
 * Component-level permission guard.
 *
 * Renders `children` if the current user has any of the required roles or permissions.
 * Otherwise renders `fallback` (or nothing).
 *
 * @example
 * ```tsx
 * <Can allowedPermissions={[PermissionsEnum.USER_MANAGEMENT_DELETE]}>
 *   <DeleteButton />
 * </Can>
 * ```
 */
export const Can: React.FC<CanProps> = ({
	allowedPermissions,
	allowedRoles,
	children,
	fallback = null,
}) => {
	const { data: session } = useSession();

	if (!session?.user) {
		return <>{fallback}</>;
	}

	const userRoles: string[] = session.user.roles ?? [];
	const userPermissions: string[] = session.user.permissions ?? [];

	// No restrictions — allow
	if (
		(!allowedRoles || allowedRoles.length === 0) &&
		(!allowedPermissions || allowedPermissions.length === 0)
	) {
		return <>{children}</>;
	}

	const hasRole = allowedRoles?.some((role) => userRoles.includes(role));
	const hasPermission = allowedPermissions?.some((perm) =>
		userPermissions.includes(perm)
	);

	if (hasRole || hasPermission) {
		return <>{children}</>;
	}

	return <>{fallback}</>;
};
