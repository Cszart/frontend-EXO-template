import { requireAuth } from 'components/auth/requireAuth';
import EmailContentEditorScreen from 'components/screens/email/contentEditor';
import RolesEnum from 'const/role';
import AppRoutes from 'const/routes';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

const EmailContentEditor = (): JSX.Element => {
	return <EmailContentEditorScreen />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	const redirect = requireAuth({
		session,
		allowedRoles: [RolesEnum.ADMIN],
		redirectTo: AppRoutes.HOME,
	});

	if (redirect) return { redirect };
	return { props: {} };
};

export default EmailContentEditor;
