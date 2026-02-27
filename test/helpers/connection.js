import { network } from 'hardhat';

// Connection is created at module scope so that the first test file
// to import this module registers the before/after hooks at whatever
// describe scope is active. ESM module caching ensures connectOnBefore()
// is called exactly once across all test files.
const connection = network.mocha.connectOnBefore();

export function connectOnTestSuiteStart() {
  return connection;
}
