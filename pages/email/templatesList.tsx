import { requireAuth } from 'components/auth/requireAuth';
import EmailTemplatesListScreen from 'components/screens/email/templatesList';
import RolesEnum from 'const/role';
import AppRoutes from 'const/routes';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

const EmailTemplatesList = (): JSX.Element => {
	return <EmailTemplatesListScreen />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	const redirect = requireAuth({
		session,
		allowedRoles: [RolesEnum.MODERATOR, RolesEnum.ADMIN],
		redirectTo: AppRoutes.HOME,
	});

	if (redirect) return { redirect };
	return { props: {} };
};

export default EmailTemplatesList;
