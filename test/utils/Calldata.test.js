import { connectOnTestSuiteStart } from '../helpers/connection.js';
import { expect } from 'chai';

describe('Calldata utilities', function () {
  const {
    ethers,
    networkHelpers: { loadFixture },
  } = connectOnTestSuiteStart();

  async function fixture() {
    return { mock: await ethers.deployContract('$Calldata') };
  }

  beforeEach(async function () {
    Object.assign(this, await loadFixture(fixture));
  });

  it('emptyBytes', async function () {
    await expect(this.mock.$emptyBytes()).to.eventually.equal('0x');
  });

  it('emptyString', async function () {
    await expect(this.mock.$emptyString()).to.eventually.equal('');
  });
});
