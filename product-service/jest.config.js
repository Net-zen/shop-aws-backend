module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleNameMapper: {
    "^@libs/(.*)$": "<rootDir>/src/libs/$1",
  },
  testEnvironment: "node",
  testMatch: [
    "**/__tests__/**/*.test.ts"
  ],
};
