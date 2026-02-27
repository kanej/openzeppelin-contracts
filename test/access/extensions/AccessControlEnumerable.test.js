import { connectOnTestSuiteStart } from '../../helpers/connection.js';
import {
  DEFAULT_ADMIN_ROLE,
  shouldBehaveLikeAccessControl,
  shouldBehaveLikeAccessControlEnumerable,
} from '../AccessControl.behavior';

describe('AccessControlEnumerable', function () {
  const connection = connectOnTestSuiteStart();
  const {
    ethers,
    networkHelpers: { loadFixture },
  } = connection;

  async function fixture() {
    const [defaultAdmin, ...accounts] = await ethers.getSigners();
    const mock = await ethers.deployContract('$AccessControlEnumerable');
    await mock.$_grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    return { mock, defaultAdmin, accounts };
  }

  beforeEach(async function () {
    Object.assign(this, connection, await loadFixture(fixture));
  });

  shouldBehaveLikeAccessControl();
  shouldBehaveLikeAccessControlEnumerable();
});
