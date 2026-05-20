import React from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useAccount, useConnect, useSignMessage } from 'wagmi';
import { verifyMessage } from 'ethers';

import { FieldValues, useForm } from 'react-hook-form';

import { Button, Separator, Typography } from 'components/common';
import { InputEmail } from 'components/form';
import InputPassword from 'components/form/input-password/input-password';
import { LayoutLogin } from 'components/layout';

import Icons from 'const/icons';
import NextAuthProvidersEnum from 'const/auth';
import AppRoutes from 'const/routes';

import Logger from 'utils/logger';
import { useRouter } from 'next/router';

interface SignInProps {
	providers: NextAuthProvidersEnum[];
}

const messageToSign = 'To proceed with login process please sign this message!';

export const SignInScreen: React.FC<SignInProps> = () => {
	// Utils
	const router = useRouter();
	const { error: errorInfoQuery } = router.query;

	const logger = new Logger({ identifier: 'SignIn' });
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ mode: 'onSubmit' });

	// Inputs rules
	const rules = {
		email: {
			required: { value: true, message: 'This is required' },
		},
		password: {
			required: { value: true, message: 'This is required' },
		},
	};

	// Wallet connection
	const { address, isConnected, connector } = useAccount();
	const {
		connect,
		connectors,
		error,
		isPending: isLoadingWallet,
		variables: connectVariables,
	} = useConnect();
	const pendingConnectorId =
		connectVariables?.connector &&
		typeof connectVariables.connector !== 'function'
			? connectVariables.connector.id
			: undefined;
	const {
		data: signatureData,
		isPending: isLoadingSign,
		error: errorSign,
		signMessage,
	} = useSignMessage();

	// SUBMIT function
	const handleSubmitData = async (
		provider: NextAuthProvidersEnum,
		data?: FieldValues
	): Promise<void> => {
		setIsLoading(true);
		logger.info('Data: ', { data });

		try {
			if (provider === NextAuthProvidersEnum.CREDENTIALS) {
				await signIn(NextAuthProvidersEnum.CREDENTIALS, {
					...data,
					redirect: true,
					callbackUrl: '/',
				});
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

	// DISCLAIMER: this has been done this way since wagmi functions are async
	// So we gotta check when the actual value has changed, is more difficult to do it on a sequence
	/**
	 * Check when the wallet is connected and proceed to sign
	 */
	React.useEffect(() => {
		const triggerSignWithWallet = async (): Promise<void> => {
			if (isConnected && address && signMessage) {
				logger.info('User address: ', { address, connector });
				signMessage({ message: messageToSign });
			}
		};

		triggerSignWithWallet();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address, isConnected]);

	/**
	 * Just after the user has signed we will verify the signature and then
	 * fetch data from backend
	 *
	 * Note: This implementation can change depending on the project
	 */
	React.useEffect(() => {
		const signInWithWallet = async (): Promise<void> => {
			if (signatureData) {
				// Sign and verify address
				const addressThatSigned = verifyMessage(messageToSign, signatureData);

				// Compare connected address with the one that signed
				if (address !== addressThatSigned) {
					alert(
						'The address connected to this app is different from the one that signed'
					);
					return;
				}

				// Call the API to fetch user data attached to this address
				// TODO: Implement own project logic
				try {
					await signIn(NextAuthProvidersEnum.WALLET, {
						redirect: true,
						address,
					});
				} catch (error) {
					logger.error(
						'There has been an error trying to log in with wallet ',
						error
					);
				}
			}
		};

		signInWithWallet();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [signatureData]);

	return (
		<LayoutLogin>
			{errorInfoQuery && (
				<Typography
					text={String(errorInfoQuery)}
					type="custom-p"
					className="text-lg font-medium text-red-500"
				/>
			)}

			<form
				className="w-full space-y-4"
				onSubmit={handleSubmit((data) =>
					handleSubmitData(NextAuthProvidersEnum.CREDENTIALS, data)
				)}
			>
				{/* Login Title */}
				<Typography type="headline-4" className="text-center">
					Sign In
				</Typography>

				{/* Input - email */}
				<InputEmail
					dataCY="email"
					name="email"
					title="Email"
					placeholder="Email"
					register={register}
					rules={rules.email}
					error={errors.email}
				/>

				{/* Input - password */}
				<InputPassword
					dataCY="password"
					name="password"
					title="Password"
					placeholder="Password"
					validate={false}
					register={register}
					rules={rules.password}
					error={errors.password}
				/>

				{/* Actions */}
				<Link href="/auth/forgot-password">
					<Typography type="link-1" className="hover:opacity-60 mt-2">
						Forgot password?
					</Typography>
				</Link>

				{/* Credentials */}
				<Button
					dataCY="signin"
					type="submit"
					size="full"
					decoration="fill"
					label="Sign in"
					loading={isLoading}
					disabled={isLoading || isLoadingWallet || isLoadingSign}
				/>

				<Separator text="Or" />

				{/* Google */}
				<Button
					size="full"
					onClick={() => handleSubmitData(NextAuthProvidersEnum.GOOGLE)}
					disabled={isLoading || isLoadingWallet || isLoadingSign}
					icon={Icons.google}
					iconLeft
					label="Sign in with Google"
				/>

				{/* Facebook */}
				<Button
					size="full"
					onClick={() => handleSubmitData(NextAuthProvidersEnum.FACEBOOK)}
					disabled={isLoading || isLoadingWallet || isLoadingSign}
					icon={Icons.facebook}
					iconLeft
					label="Sign in with Facebook"
				/>

				{/* Wallets */}
				{connectors.map((connector) => (
					<Button
						key={connector.id}
						size="full"
						onClick={() => {
							connect({ connector });
						}}
						loading={isLoadingWallet && connector.id === pendingConnectorId}
						disabled={isLoading || isLoadingWallet || isLoadingSign}
						icon={connector.icon}
						iconLeft
						label={connector.name}
					/>
				))}

				{/* Error messages */}
				{error && (
					<Typography type="body-1" className="text-red-600">
						{error.message}
					</Typography>
				)}
				{errorSign && (
					<Typography type="body-1" className="text-red-600">
						{errorSign.message}
					</Typography>
				)}

				{/* Register */}
				<Typography type="link-1">
					{`Don't have an account? `}
					<Link href={AppRoutes.AUTH_SIGN_UP}>
						<span className="text-blue hover:opacity-60">Sign up</span>
					</Link>
				</Typography>
			</form>
		</LayoutLogin>
	);
};
