import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{files: ["**/*.{js,mjs,cjs,ts}"]},
	{ignores: ["dist", "eslint.config.mjs"]},
	{languageOptions: { globals: globals.node }},
	pluginJs.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.es2025
			},
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname
			}
		}
	},
	{
		rules: {
			indent: ["error", "tab"],
			semi: ["error", "always"],
			quotes: ["warn", "double"]
		}
	}
];