import { network } from 'hardhat';
import { shouldBehaveLikeProxy } from '../Proxy.behaviour';

describe('ERC1967Proxy', function () {
  const connection = network.mocha.connectOnBefore();
  const {
    ethers,
    networkHelpers: { loadFixture },
  } = connection;

  const fixture = async () => {
    const [nonContractAddress] = await ethers.getSigners();

    const implementation = await ethers.deployContract('DummyImplementation');

    return { nonContractAddress, implementation };
  };

  beforeEach(async function () {
    Object.assign(this, connection, await loadFixture(fixture));
  });

  describe('(default) allowUninitialized is false', function () {
    before(function () {
      this.createProxy = (implementation, initData, opts) =>
        ethers.deployContract('ERC1967Proxy', [implementation, initData], opts);
    });

    shouldBehaveLikeProxy(false);
  });

  describe('(unsafe) allowUninitialized is true', function () {
    before(function () {
      this.createProxy = (implementation, initData, opts) =>
        ethers.deployContract('ERC1967ProxyUnsafe', [implementation, initData], opts);
    });

    shouldBehaveLikeProxy(true);
  });
});
