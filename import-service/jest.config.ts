import type {Config} from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: 'ts-jest',
    testEnvironment: "node",
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    moduleNameMapper: {
      "^@libs/(.*)$": "<rootDir>/src/libs/$1",
    },
    transform: {
      "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest",
    },
    transformIgnorePatterns: ["node_modules/(?!variables/.*)"],
  };
};
