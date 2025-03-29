module.exports = {
  testEnvironment: 'node',
  roots: [
    '<rootDir>/src/',
    '<rootDir>/tests/',
  ],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,  // 隔离模块加快编译速度
        diagnostics: {
          ignoreCodes: [2345, 2322, 2339, 2352, 18046]  // 忽略一些常见类型错误
        }
      },
    ],
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?|js)$',
  moduleFileExtensions: [
    'js',
    'json',
    'jsx',
    'node',
    'ts',
    'tsx',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/index.ts',
    '!src/config/**/*',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 20,
      lines: 25,
      statements: 25,
    },
  },
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.ts',
  ],
}