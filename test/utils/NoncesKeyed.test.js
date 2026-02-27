import { connectOnTestSuiteStart } from '../helpers/connection.js';
import { shouldBehaveLikeNonces, shouldBehaveLikeNoncesKeyed } from './Nonces.behavior';

describe('NoncesKeyed', function () {
  const {
    ethers,
    networkHelpers: { loadFixture },
  } = connectOnTestSuiteStart();

  async function fixture() {
    return { mock: await ethers.deployContract('$NoncesKeyed') };
  }

  beforeEach(async function () {
    Object.assign(this, await loadFixture(fixture));
  });

  shouldBehaveLikeNonces();
  shouldBehaveLikeNoncesKeyed();
});
