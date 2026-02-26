import { network } from 'hardhat';
import { shouldSupportInterfaces } from './SupportsInterface.behavior';

describe('ERC165', function () {
  const {
    ethers,
    networkHelpers: { loadFixture },
  } = network.mocha.connectOnBefore();

  async function fixture() {
    return { mock: await ethers.deployContract('$ERC165') };
  }

  beforeEach(async function () {
    Object.assign(this, await loadFixture(fixture));
  });

  shouldSupportInterfaces();
});
