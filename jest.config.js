module.exports = {
  transform: {
    "^.+\\.tsx?$": [
      /* "ts-jest" */ "@swc/jest",
    ] /* https://swc.rs/docs/usage/jest#usage */,
  },
  testEnvironment: "node",
  testRegex: "/__tests__/.*\\.(test|spec)?\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  /*setupFilesAfterEnv: [
   "<rootDir>/src/ts/tests/jest/config/matchers.ts"
  ],*/
};
