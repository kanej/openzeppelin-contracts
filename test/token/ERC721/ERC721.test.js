import { network } from 'hardhat';
import { shouldBehaveLikeERC721, shouldBehaveLikeERC721Metadata } from './ERC721.behavior';

const name = 'Non Fungible Token';
const symbol = 'NFT';

describe('ERC721', function () {
  const connection = network.mocha.connectToSingleton();
  const {
    ethers,
    networkHelpers: { loadFixture },
  } = connection;

  async function fixture() {
    return {
      accounts: await ethers.getSigners(),
      token: await ethers.deployContract('$ERC721', [name, symbol]),
    };
  }

  beforeEach(async function () {
    Object.assign(this, connection, await loadFixture(fixture));
  });

  shouldBehaveLikeERC721();
  shouldBehaveLikeERC721Metadata(name, symbol);
});
