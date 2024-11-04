module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "babel-jest",
    "^.+\\.mjs$": "babel-jest", // Add this line to support ECMAScript modules
  },
  transformIgnorePatterns: [
    "/node_modules/(?!chai|supertest)" // Add this line to transform specific node_modules
  ],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy'
  },
  maxWorkers: 1,

};