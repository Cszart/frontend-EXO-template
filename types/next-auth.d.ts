import { UserI } from 'interfaces';
/**
 * Extend Next Auth config
 */

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: UserI;
		accessToken: string;
	}
}
