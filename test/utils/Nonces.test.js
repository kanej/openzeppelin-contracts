import { connectOnTestSuiteStart } from '../helpers/connection.js';
import { shouldBehaveLikeNonces } from './Nonces.behavior';

describe('Nonces', function () {
  const {
    ethers,
    networkHelpers: { loadFixture },
  } = connectOnTestSuiteStart();

  async function fixture() {
    return { mock: await ethers.deployContract('$Nonces') };
  }

  beforeEach(async function () {
    Object.assign(this, await loadFixture(fixture));
  });

  shouldBehaveLikeNonces();
});
