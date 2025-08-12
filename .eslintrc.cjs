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
    "no-restricted-imports": ["error", { patterns: ["../*", "../../*", "../../../*"] }]
  },
  settings: {
    "import/resolver": {
      typescript: true
    }
  }
};
