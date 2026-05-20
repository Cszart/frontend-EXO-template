import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';

// Styles
import '../styles/home.css';
import '../styles/global-tailwind.css';
import '../styles/globals.scss';
import '../styles/globals.css';

// Lexical styles
import '../components/text-editor/themes/default_theme.css';

// Wagmi Connect
import { http, createConfig, WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected, coinbaseWallet } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Icons from 'const/icons';

// Set up wagmi config
const wagmiConfig = createConfig({
	chains: [mainnet],
	connectors: [
		injected(),
		coinbaseWallet({
			appName: 'EXO Template',
			appLogoUrl: Icons.coinbase,
		}),
	],
	transports: {
		[mainnet.id]: http(),
	},
});

const queryClient = new QueryClient();

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
AppProps): any {
	return (
		<>
			<Head>
				<title>Frontend template</title>
			</Head>
			<SessionProvider session={session}>
				<WagmiProvider config={wagmiConfig}>
					<QueryClientProvider client={queryClient}>
						<Component {...pageProps} />
					</QueryClientProvider>
				</WagmiProvider>
			</SessionProvider>
		</>
	);
}
