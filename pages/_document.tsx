import { Html, Head, Main, NextScript } from 'next/document';
import { brand } from 'const';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="description" content={`${brand.name} application`} />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
