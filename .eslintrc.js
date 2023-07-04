module.exports = {
	env: {
		browser: true,
		es2021: true,
		jest: true,
	},
	extends: [
		"plugin:prettier/recommended",
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: "latest",
		sourceType: "module",
		project: "./tsconfig.json",
	},
	plugins: ["@typescript-eslint", "react"],
	settings: {
		react: {
			version: "detect",
		},
	},
	rules: {
		indent: ["error", "tab"],
		"linebreak-style": [
			"error",
			process.platform === "win32" ? "windows" : "unix",
		],
		quotes: ["error", "double"],
		semi: ["error", "always"],
	},
};
