import { network } from 'hardhat';
import { shouldBehaveLikeRegularContext } from './Context.behavior';

describe('Context', function () {
  const {
    ethers,
    networkHelpers: { loadFixture },
  } = network.mocha.connectOnBefore();

  async function fixture() {
    const [sender] = await ethers.getSigners();
    const context = await ethers.deployContract('ContextMock', []);
    const contextHelper = await ethers.deployContract('ContextMockCaller', []);
    return { sender, context, contextHelper };
  }

  beforeEach(async function () {
    Object.assign(this, await loadFixture(fixture));
  });

  shouldBehaveLikeRegularContext();
});
