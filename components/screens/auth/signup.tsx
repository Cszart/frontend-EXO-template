import { authService } from 'api_services';
import { Button, Separator, Typography } from 'components/common';
import { Input, InputEmail } from 'components/form';
import InputPassword from 'components/form/input-password/input-password';
import { LayoutLogin } from 'components/layout';
import NextAuthProvidersEnum from 'const/auth';
import { toast } from 'sonner';
import RolesEnum from 'const/role';
import AppRoutes from 'const/routes';
import { UserI } from 'interfaces';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import Logger from 'utils/logger';

interface SignUpProps {
	providers: NextAuthProvidersEnum[];
}

export const SignUpScreen: React.FC<SignUpProps> = () => {
	const router = useRouter();
	const logger = new Logger({ identifier: 'SignUp' });
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ mode: 'onChange' });

	// Loading flag
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	// Inputs rules
	const rules = {
		email: {
			required: { value: true, message: 'This is required' },
		},
		name: {
			required: { value: true, message: 'This is required' },
		},
		username: {
			required: { value: true, message: 'This is required' },
		},
		password: {
			required: { value: true, message: 'This is required' },
		},
	};

	// SUBMIT function
	const handleSubmitData = async (
		provider: NextAuthProvidersEnum,
		data?: FieldValues
	): Promise<void> => {
		setIsLoading(true);
		logger.info('Data: ', { data });

		try {
			// Register with credentials
			if (provider === NextAuthProvidersEnum.CREDENTIALS && data) {
				// Build payload
				const userPayload: UserI = {
					id: 0,
					email: data.email,
					username: data.username,
					name: data.name,
					image:
						'https://i.pinimg.com/736x/3f/94/70/3f9470b34a8e3f526dbdb022f9f19cf7.jpg',
					roles: [RolesEnum.USER],
					permissions: [],
				};

				const signUpResponse = await authService.signUp(userPayload);

				// User created succesfully
				if (signUpResponse.status === 201) {
					toast.success('Your user has been created!');
					await signIn(NextAuthProvidersEnum.CREDENTIALS, {
						email: data.email,
						password: data.email,
						redirect: true,
						callbackUrl: '/',
					});
					router.push(AppRoutes.AUTH_SIGN_IN);
				} else {
					logger.error(signUpResponse);
				}
			} else {
				await signIn(provider, {
					redirect: true,
					callbackUrl: '/',
				});
			}
		} catch (error) {
			logger.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<LayoutLogin>
			<form
				className="w-full space-y-4"
				onSubmit={handleSubmit((data) =>
					handleSubmitData(NextAuthProvidersEnum.CREDENTIALS, data)
				)}
			>
				<Typography type="headline-4" className="text-center">
					Sign Up
				</Typography>

				<InputEmail
					name="email"
					title="Email"
					placeholder="Write an email"
					register={register}
					rules={rules.email}
					error={errors.email}
				/>
				<Input
					name="name"
					title="Name"
					placeholder="Write your name"
					register={register}
					rules={rules.name}
					error={errors.name}
				/>
				<Input
					name="username"
					title="Username"
					placeholder="Write your username"
					register={register}
					rules={rules.username}
					error={errors.username}
				/>
				<InputPassword
					name="password"
					title="Password"
					placeholder="Input your password"
					register={register}
					rules={rules.password}
					error={errors.password}
				/>

				<Button
					type="submit"
					size="full"
					decoration="fill"
					label="Sign up"
					loading={isLoading}
				/>

				<Separator text="Or" />

				<Button
					size="full"
					onClick={() => handleSubmitData(NextAuthProvidersEnum.GOOGLE)}
					disabled={isLoading}
					icon={
						<img src="/icons/svg/google.svg" alt="Google" className="w-6 h-6" />
					}
					iconLeft
					label="Sign up with Google"
				/>
				<Button
					size="full"
					onClick={() => handleSubmitData(NextAuthProvidersEnum.FACEBOOK)}
					disabled={isLoading}
					icon={
						<img
							src="/icons/svg/facebook.svg"
							alt="Facebook"
							className="w-6 h-6"
						/>
					}
					iconLeft
					label="Sign up with Facebook"
				/>
				<Typography type="link-1">
					{`You already have an account?`}
					<Link href={AppRoutes.AUTH_SIGN_IN}>
						{' '}
						<span className="text-blue hover:text-dark-30 hover:underline">
							Sign in
						</span>
					</Link>
				</Typography>
			</form>
		</LayoutLogin>
	);
};
