import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
	{
		ignores: ["node_modules/*", ".next/*", ".out/*"],
	},
	...compat.extends(
		"next",
		"next/core-web-vitals",
		"plugin:prettier/recommended",
		"plugin:@typescript-eslint/recommended",
	),
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		rules: {
			"react/react-in-jsx-scope": "off",
			"@typescript-eslint/no-unused-vars": ["error"],
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-expressions": "off",
			"prettier/prettier": [
				"error",
				{ endOfLine: "auto" },
				{ usePrettierrc: true },
			],
			"@typescript-eslint/explicit-function-return-type": [
				"warn",
				{
					allowExpressions: true,
					allowConciseArrowFunctionExpressionsStartingWithVoid: true,
				},
			],
			"@typescript-eslint/explicit-module-boundary-types": "off",
		},
	},
];

export default eslintConfig;
