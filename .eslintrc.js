module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react-native/all",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // Typescript
    "@typescript-eslint/semi": ["error", "never"],
    "@typescript-eslint/no-use-before-define":  ["error", { "functions": false, "classes": false,"variables": false, "typedefs": true }],
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/prefer-interface": 0,
    "@typescript-eslint/interface-name-prefix": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/camelcase": 0,
    "@typescript-eslint/class-name-casing": "error",
    "@typescript-eslint/explicit-member-accessibility": 0,
    "@typescript-eslint/ban-ts-ignore": 0,
    // React Native
    "react-native/no-inline-styles": 0,
    "react-native/no-color-literals": 0,
    // React
    "react/jsx-uses-vars": "error",
    // Eslint
    "semi": "off",
    "arrow-parens": ["error", "as-needed"],
    "no-use-before-define":  ["error", { "functions": false, "classes": false,"variables": false }],
    "prefer-arrow-callback": 1,
    "eqeqeq": "error",
    "max-len": ["warn", {"code": 100, "ignoreComments": true }],
    "new-parens": "error",
    "no-bitwise": "error",
    "no-console": ["warn", { allow: ["warn", "info", "error"] }],
    "no-caller": "error",
    "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1, "maxBOF": 0 }],
    "quote-props": ["error", "as-needed"],
    "sort-imports-es6-autofix/sort-imports-es6": [2, {
      "ignoreCase": false,
      "ignoreMemberSort": false,
      "memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
    }],
    "no-irregular-whitespace": "warn",
  },
  plugins: [
    "sort-imports-es6-autofix",
    "react",
    "react-native"
  ],
}
