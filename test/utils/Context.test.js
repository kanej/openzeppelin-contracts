import { connectOnTestSuiteStart } from '../helpers/connection.js';
import { shouldBehaveLikeRegularContext } from './Context.behavior';

describe('Context', function () {
  const {
    ethers,
    networkHelpers: { loadFixture },
  } = connectOnTestSuiteStart();

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
