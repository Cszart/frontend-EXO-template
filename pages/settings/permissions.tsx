import { requireAuth } from 'components/auth/requireAuth';
import PermissionsScreen from 'components/screens/settings/permissions';
import RolesEnum from 'const/role';
import AppRoutes from 'const/routes';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { crudPermissions } from 'utils';

const PermissionsPage = (): JSX.Element => {
	return <PermissionsScreen />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	const redirect = requireAuth({
		session,
		allowedPermissions: crudPermissions(),
		allowedRoles: [RolesEnum.ADMIN, RolesEnum.MODERATOR],
		redirectTo: AppRoutes.HOME,
	});

	if (redirect) return { redirect };
	return { props: {} };
};

export default PermissionsPage;
