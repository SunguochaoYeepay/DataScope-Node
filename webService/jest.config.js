module.exports = {
  "preset": "ts-jest",
  "testEnvironment": "node",
  "roots": [
    "<rootDir>/src/",
    "<rootDir>/tests/"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?|js)$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "collectCoverageFrom": [
    "src/**/*.{ts,tsx}",
    "!src/index.ts",
    "!src/config/**/*",
    "!**/node_modules/**"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 10,
      "functions": 20,
      "lines": 25,
      "statements": 25
    }
  },
  "setupFilesAfterEnv": [
    "<rootDir>/tests/setup.ts"
  ]
};