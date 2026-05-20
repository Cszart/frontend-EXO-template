import { Redirect } from 'next';
import { Session } from 'next-auth';
import AppRoutes from 'const/routes';

interface RequireAuthProps {
	session: Session | null;
	allowedPermissions?: string[];
	allowedRoles?: string[];
	redirectTo?: string;
}

/**
 * Server-side authorization check for use in `getServerSideProps`.
 *
 * Returns a `Redirect` object if the user is unauthorized, or `undefined` if allowed.
 *
 * @example
 * ```tsx
 * export const getServerSideProps: GetServerSideProps = async (context) => {
 *   const session = await getSession(context);
 *   const redirect = requireAuth({
 *     session,
 *     allowedRoles: [RolesEnum.ADMIN],
 *   });
 *   if (redirect) return { redirect };
 *   return { props: {} };
 * };
 * ```
 */
export const requireAuth = ({
	session,
	allowedPermissions,
	allowedRoles,
	redirectTo,
}: RequireAuthProps): Redirect | undefined => {
	if (!session?.user) {
		return {
			destination: redirectTo ?? AppRoutes.AUTH_SIGN_IN,
			permanent: false,
		};
	}

	const userRoles: string[] = session.user.roles ?? [];
	const userPermissions: string[] = session.user.permissions ?? [];

	// No restrictions specified — allow by default
	if (
		(!allowedRoles || allowedRoles.length === 0) &&
		(!allowedPermissions || allowedPermissions.length === 0)
	) {
		return undefined;
	}

	const hasRole = allowedRoles?.some((role) => userRoles.includes(role));
	const hasPermission = allowedPermissions?.some((perm) =>
		userPermissions.includes(perm)
	);

	if (hasRole || hasPermission) {
		return undefined;
	}

	return {
		destination: redirectTo ?? AppRoutes.NOT_AUTHORIZED,
		permanent: false,
	};
};
