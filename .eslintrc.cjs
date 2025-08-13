module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "next/core-web-vitals"
  ],
  rules: {
    // Forbid ../../ style upward imports across domains
    "no-restricted-imports": ["warn", { patterns: ["../*", "../../*", "../../../*"] }],
    // Keep CI green during migration
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "off",
    // Allow temporary use of require() in Node contexts
    "@typescript-eslint/no-require-imports": "warn"
  },
  settings: {
    "import/resolver": {
      typescript: true
    }
  },
  overrides: [
    {
      files: ["scripts/**/*.js"],
      rules: {
        "@typescript-eslint/no-require-imports": "off"
      }
    }
  ]
};
