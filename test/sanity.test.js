import { network } from 'hardhat';
import { expect } from 'chai';

describe('Environment sanity', function () {
  const {
    ethers,
    networkHelpers: { loadFixture, mine },
  } = network.mocha.connectToSingleton();

  async function fixture() {
    return {};
  }

  beforeEach(async function () {
    Object.assign(this, await loadFixture(fixture));
  });

  describe('snapshot', function () {
    let blockNumberBefore;

    it('cache and mine', async function () {
      blockNumberBefore = await ethers.provider.getBlockNumber();
      await mine();
      expect(await ethers.provider.getBlockNumber()).to.equal(blockNumberBefore + 1);
    });

    it('check snapshot', async function () {
      expect(await ethers.provider.getBlockNumber()).to.equal(blockNumberBefore);
    });
  });
});
