module.exports = {
  preset: "ts-jest", // Use ts-jest preset for TypeScript support
  testEnvironment: "node", // Set the test environment to Node.js
  globals: {
    "ts-jest": {
      isolatedModules: true, // Improve performance by not transforming code in modules
    },
  },
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest", // Use ts-jest for transforming TypeScript files
  },
  moduleFileExtensions: ["ts", "js", "json", "node"], // Add the file extensions to consider
  collectCoverageFrom: [
    "src/**/*.{ts,js}", // Collect coverage from all files in src folder
    "!src/main.ts", // Exclude the entry file if needed
  ],
  coverageDirectory: "./coverage", // Directory where the coverage report will be stored
  coverageReporters: ["text", "lcov", "json"], // Report formats (text for terminal, lcov for HTML, json for machine-readable)

  collectCoverage: true, // Enable coverage collection
};
