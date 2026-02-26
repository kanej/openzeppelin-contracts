import { network } from 'hardhat';
import { shouldBehaveLikeNonces } from './Nonces.behavior';

describe('Nonces', function () {
  const {
    ethers,
    networkHelpers: { loadFixture },
  } = network.mocha.connectOnBefore();

  async function fixture() {
    return { mock: await ethers.deployContract('$Nonces') };
  }

  beforeEach(async function () {
    Object.assign(this, await loadFixture(fixture));
  });

  shouldBehaveLikeNonces();
});
