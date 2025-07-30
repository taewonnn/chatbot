module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    // project: ['tsconfig.json'],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
    ".eslintrc.js", //
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    quotes: "off", // 따옴표 규칙 비활성화
    "object-curly-spacing": "off", // 공백 규칙 비활성화
    "arrow-parens": "off", // 화살표 함수 괄호 규칙 비활성화
    "import/no-unresolved": 0,
    indent: ["error", 2],
    "max-len": "off",
  },
};
