import { connectOnTestSuiteStart } from '../../helpers/connection.js';
import { shouldSupportInterfaces } from './SupportsInterface.behavior';

describe('ERC165', function () {
  const {
    ethers,
    networkHelpers: { loadFixture },
  } = connectOnTestSuiteStart();

  async function fixture() {
    return { mock: await ethers.deployContract('$ERC165') };
  }

  beforeEach(async function () {
    Object.assign(this, await loadFixture(fixture));
  });

  shouldSupportInterfaces();
});
