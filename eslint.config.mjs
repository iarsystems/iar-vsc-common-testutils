// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
    {
        ignores: ["dist/**"],
    },
    {
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
        ],
        files: ["**/*.ts"],
        languageOptions: {
            globals: globals.node,
            parserOptions: {
                project: ["./tsconfig.json"],
            },
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }], // Same as in tsconfig. Allow such vars if they start with an underscore.
            "require-await": "error",                                   // Helps catch missing awaits
            "strict": "error",                                          // Disallows use of e.g. reserved keywords
            "prefer-promise-reject-errors": "error",                    // Throwing real Errors helps traceability
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/prefer-readonly": "error",
            "@typescript-eslint/consistent-type-definitions": "error",  // Prefer 'interface' over 'type'
            "@typescript-eslint/no-non-null-assertion": "warn",
            "no-empty": "off",                                          // Empty catch blocks can be useful
            "no-inner-declarations": "off",                             // Seems to break when using TS namespaces
            "eqeqeq": "error",                                          // == can be obscure/unintuitive, so use ===
            "@typescript-eslint/no-deprecated": "warn",
            // CODE FORMATTING =================
            "semi": "warn",
            "camelcase": "warn",
            "indent": ["warn", 4],
            "space-before-blocks": "warn",
            "keyword-spacing": "warn",
            "space-before-function-paren": ["warn", "never"],
            "dot-location": "warn",
            "quotes": ["warn", "double", { "allowTemplateLiterals": true }],  // Disallows single quote strings
            "comma-spacing": "warn",
            "brace-style": "warn",
            "no-trailing-spaces": "warn",
        },
    },
);
