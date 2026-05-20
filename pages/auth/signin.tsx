import { SignInScreen } from 'components/screens';
import NextAuthProvidersEnum from 'const/auth';
import AppRoutes from 'const/routes';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

const SignIn = (): JSX.Element => {
	return <SignInScreen providers={[NextAuthProvidersEnum.CREDENTIALS]} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);

	if (session?.user) {
		return { redirect: { destination: AppRoutes.HOME, permanent: false } };
	}

	return { props: {} };
};

export default SignIn;
