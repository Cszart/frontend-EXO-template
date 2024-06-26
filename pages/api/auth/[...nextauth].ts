/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuthProvidersEnum from 'const/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';

const options: NextAuthOptions = {
	// Configure one or more authentication providers
	providers: [
		FacebookProvider({
			id: NextAuthProvidersEnum.FACEBOOK,
			name: NextAuthProvidersEnum.FACEBOOK,
			clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || '',
			clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET || '',
			profile: (data) => {
				console.log(data);
				console.log(data.picture.data);
				return {
					provider: 'facebook',
					roles: ['user'], // You can change it if you want to follow another way of assigning a role
					permissions: [
						'user:management:view',
						'user:management:create',
						'user:management:edit',
						'user:management:delete',
						'role:management:view',
						'role:management:create',
						'role:management:edit',
						'role:management:delete',
						'permission:management:view',
						'permission:management:create',
						'permission:management:edit',
						'permission:management:delete',
					],
					...data,
				};
			},
		}),

		GoogleProvider({
			id: NextAuthProvidersEnum.GOOGLE,
			name: NextAuthProvidersEnum.GOOGLE,
			clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
			clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '',
			profile: (data) => ({
				provider: 'google',
				id: data.sub,
				roles: ['user'], // You can change it if you want to follow another way of assigning a role
				image: data.picture,
				permissions: [
					'user:management:view',
					'user:management:create',
					'user:management:edit',
					'user:management:delete',
					'role:management:view',
					'role:management:create',
					'role:management:edit',
					'role:management:delete',
					'permission:management:view',
					'permission:management:create',
					'permission:management:edit',
					'permission:management:delete',
				],
				...data,
			}),
		}),

		CredentialsProvider({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			id: NextAuthProvidersEnum.CREDENTIALS,
			name: NextAuthProvidersEnum.CREDENTIALS,
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				email: { label: 'email', type: 'text' },
				password: { label: 'password', type: 'password' },
			},
			async authorize(credentials) {
				// You need to provide your own logic here that takes the credentials
				// submitted and returns either a object representing a user or value that is false/null if the credentials are invalid.
				// e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }

				try {
					const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/login`, {
						method: 'POST',
						body: JSON.stringify(credentials),
						headers: { 'Content-Type': 'application/json' },
					});

					// CHECK out for other type of responses
					// This might change depending on your project
					const response_json = await res.json();

					// If no error and we have user data, return it
					if (response_json.status == 200 && response_json) {
						const user = response_json.data;
						return Promise.resolve(user);
					}

					// If no error and we have user data, return it
					// Return null if user data could not be retrieved
					return Promise.reject(new Error(response_json.message));
				} catch (error) {
					return Promise.resolve(error);
				}
			},
		}),

		/**
		 * This credentials provider has a different ID and name
		 * this will serve as a trick to store new information to the session
		 * for the first time. Since the connection to the wallet implies a
		 * different flow to fetch the user information from address
		 */
		CredentialsProvider({
			id: NextAuthProvidersEnum.WALLET,
			name: NextAuthProvidersEnum.WALLET,
			// These credentials represent the object to be stored in session
			credentials: {
				address: { label: 'address', type: 'text' },
			},
			async authorize(credentials) {
				if (!credentials) return null;

				try {
					// Get user data from database based on its address
					const response_login = await fetch(
						`${process.env.NEXT_PUBLIC_API}/auth/login/wallet`,
						{
							method: 'POST',
							body: JSON.stringify(credentials),
							headers: { 'Content-Type': 'application/json' },
						}
					);

					const response_json = await response_login.json();

					// If no error and we have user data, return it
					if (response_json.status == 200 && response_json) {
						const user = response_json.data;
						return Promise.resolve(user);
					}

					// If no error and we have user data, return it
					// Return null if user data could not be retrieved
					return Promise.reject(new Error(response_json.message));
				} catch (error) {
					return Promise.resolve(error);
				}
			},
		}),
	],

	pages: {
		signIn: '/auth/signin',
		signOut: '/auth/signout',
		error: '/auth/signin', // Error code passed in query string as ?error=
		verifyRequest: '/auth/verify-request', // (used for check email message)
		newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
	},

	callbacks: {
		// SignIn Callback
		async signIn() {
			// You could add some more complex logic here
			const isAllowedToSignIn = true;
			if (isAllowedToSignIn) {
				return true;
			} else {
				// Return false to display a default error message
				return false;
				// Or you can return a URL to redirect to:
				// return '/unauthorized'
			}
		},

		// Redirect Callback
		async redirect({ url, baseUrl }) {
			// Allows relative callback URLs
			if (url.startsWith('/')) return `${baseUrl}${url}`;
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		},

		// Session Callback
		async session({ session, token }) {
			// Send properties to the client, like an accessToken and user id from a provider.

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { accessToken, ...userData } = token.user as any;
			session.user = userData;
			(session as any).accessToken = token.accessToken;

			return session;
		},

		// JWT Callback
		async jwt({ token, user }) {
			// Persist the OAuth accessToken and or the user id to the token right after signin
			if (user) {
				token.user = user;
				token.accessToken = (user as any).accessToken;
			}
			return Promise.resolve(token);
		},
	},
	// A database is optional, but required to persist accounts in a database
	// database: process.env.DATABASE_URL,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse): any =>
	NextAuth(req, res, options);
