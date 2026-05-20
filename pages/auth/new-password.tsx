import { NewPasswordScreen } from 'components/screens';
import AppRoutes from 'const/routes';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

const NewPassword = (): JSX.Element => {
	return <NewPasswordScreen />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);

	if (session?.user) {
		return { redirect: { destination: AppRoutes.HOME, permanent: false } };
	}

	return { props: {} };
};

export default NewPassword;
