import { network } from 'hardhat';
import { expect } from 'chai';
import {
  shouldBehaveLikeAccessControl,
  shouldBehaveLikeAccessControlDefaultAdminRules,
} from '../AccessControl.behavior';

describe('AccessControlDefaultAdminRules', function () {
  const connection = network.mocha.connectToSingleton();
  const {
    ethers,
    helpers,
    networkHelpers: { loadFixture },
  } = connection;

  async function fixture() {
    const delay = helpers.time.duration.hours(10);
    const [defaultAdmin, ...accounts] = await ethers.getSigners();
    const mock = await ethers.deployContract('$AccessControlDefaultAdminRules', [delay, defaultAdmin]);
    return { mock, defaultAdmin, delay, accounts };
  }

  beforeEach(async function () {
    Object.assign(this, connection, await loadFixture(fixture));
  });

  it('initial admin not zero', async function () {
    await expect(ethers.deployContract('$AccessControlDefaultAdminRules', [this.delay, ethers.ZeroAddress]))
      .to.be.revertedWithCustomError(this.mock, 'AccessControlInvalidDefaultAdmin')
      .withArgs(ethers.ZeroAddress);
  });

  shouldBehaveLikeAccessControl();
  shouldBehaveLikeAccessControlDefaultAdminRules({ helpers });
});
