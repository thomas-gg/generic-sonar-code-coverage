/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  rootDir: "./",
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  testPathIgnorePatterns: ["<rootDir>/node_modules"],
  coverageReporters: [
    "lcov",
    ["cobertura", { file: "cobertura-output.xml" }],
    ["../../../dist/index.js", { file: "sonar-generic-report.xml" }]
  ],
  transform: {},
};
