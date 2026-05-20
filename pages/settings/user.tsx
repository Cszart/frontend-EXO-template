import { requireAuth } from 'components/auth/requireAuth';
import UsersScreen from 'components/screens/settings/user';
import RolesEnum from 'const/role';
import AppRoutes from 'const/routes';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { crudPermissions } from 'utils';

const UsersPage = (): JSX.Element => {
	return <UsersScreen />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	const redirect = requireAuth({
		session,
		allowedPermissions: crudPermissions(),
		allowedRoles: [RolesEnum.ADMIN],
		redirectTo: AppRoutes.HOME,
	});

	if (redirect) return { redirect };
	return { props: {} };
};

export default UsersPage;
