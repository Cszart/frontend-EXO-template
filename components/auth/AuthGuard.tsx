import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AppRoutes from 'const/routes';

interface AuthGuardProps {
	allowedPermissions?: string[];
	allowedRoles?: string[];
	redirectTo?: string;
	children: React.ReactNode;
}

/**
 * Client-side page-level guard.
 *
 * Wrap page content with this component to restrict access based on roles/permissions.
 * If the user is unauthenticated or unauthorized, they are redirected.
 *
 * @example
 * ```tsx
 * <AuthGuard allowedRoles={[RolesEnum.ADMIN]}>
 *   <AdminPage />
 * </AuthGuard>
 * ```
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
	allowedPermissions,
	allowedRoles,
	redirectTo,
	children,
}) => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [authorized, setAuthorized] = useState(false);

	useEffect(() => {
		if (status === 'loading') return;

		// Not logged in
		if (status === 'unauthenticated' || !session?.user) {
			router.push(redirectTo ?? AppRoutes.AUTH_SIGN_IN);
			return;
		}

		const userRoles: string[] = session.user.roles ?? [];
		const userPermissions: string[] = session.user.permissions ?? [];

		// No restrictions — allow
		if (
			(!allowedRoles || allowedRoles.length === 0) &&
			(!allowedPermissions || allowedPermissions.length === 0)
		) {
			setAuthorized(true);
			return;
		}

		const hasRole = allowedRoles?.some((role) => userRoles.includes(role));
		const hasPermission = allowedPermissions?.some((perm) =>
			userPermissions.includes(perm)
		);

		if (hasRole || hasPermission) {
			setAuthorized(true);
		} else {
			router.push(redirectTo ?? AppRoutes.NOT_AUTHORIZED);
		}
	}, [status, session, allowedRoles, allowedPermissions, redirectTo, router]);

	if (status === 'loading' || !authorized) {
		return null;
	}

	return <>{children}</>;
};
