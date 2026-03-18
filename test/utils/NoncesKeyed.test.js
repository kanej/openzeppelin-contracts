import { network } from 'hardhat';
import { shouldBehaveLikeNonces, shouldBehaveLikeNoncesKeyed } from './Nonces.behavior';

describe('NoncesKeyed', function () {
  const {
    ethers,
    networkHelpers: { loadFixture },
  } = network.mocha.connectToSingleton();

  async function fixture() {
    return { mock: await ethers.deployContract('$NoncesKeyed') };
  }

  beforeEach(async function () {
    Object.assign(this, await loadFixture(fixture));
  });

  shouldBehaveLikeNonces();
  shouldBehaveLikeNoncesKeyed();
});
