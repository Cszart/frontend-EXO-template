/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	webpack: (config) => {
		config.resolve.fallback = {
			...config.resolve.fallback,
			accounts: false,
			'@walletconnect/ethereum-provider': false,
		};
		return config;
	},
};

module.exports = nextConfig;
