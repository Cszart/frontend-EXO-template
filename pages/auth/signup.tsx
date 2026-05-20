import { SignUpScreen } from 'components/screens';
import NextAuthProvidersEnum from 'const/auth';
import AppRoutes from 'const/routes';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

const SignUp = (): JSX.Element => {
	return (
		<SignUpScreen
			providers={[
				NextAuthProvidersEnum.CREDENTIALS,
				NextAuthProvidersEnum.FACEBOOK,
				NextAuthProvidersEnum.GOOGLE,
			]}
		/>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);

	if (session?.user) {
		return { redirect: { destination: AppRoutes.HOME, permanent: false } };
	}

	return { props: {} };
};

export default SignUp;
