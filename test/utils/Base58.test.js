import { network } from 'hardhat';
import { expect } from 'chai';
import { randomBytes, hexlify, encodeBase58, isHexString, getBytes, toUtf8Bytes, Interface } from 'ethers';

describe('Base58', function () {
  const {
    ethers,
    networkHelpers: { loadFixture },
  } = network.mocha.connectToSingleton();

  async function fixture() {
    return { mock: await ethers.deployContract('$Base58') };
  }

  beforeEach(async function () {
    Object.assign(this, await loadFixture(fixture));
  });

  describe('base58', function () {
    describe('encode/decode random buffers', function () {
      // length 512 runs out of gas.
      // this checks are very slow when running coverage, causing CI to timeout.
      for (const length of [0, 1, 2, 3, 4, 32, 42, 128, 384])
        it(
          [length > 32 && '[skip-on-coverage]', `buffer of length ${length}`].filter(Boolean).join(' '),
          async function () {
            const buffer = randomBytes(length);
            const hex = hexlify(buffer);
            const b58 = encodeBase58(buffer);

            await expect(this.mock.$encode(hex)).to.eventually.equal(b58);
            await expect(this.mock.$decode(b58)).to.eventually.equal(hex);
          },
        );
    });

    // Tests case from section 5 of the (no longer active) Base58 Encoding Scheme RFC
    // https://datatracker.ietf.org/doc/html/draft-msporny-base58-03
    describe('test vectors', function () {
      for (const { raw, b58 } of [
        { raw: 'Hello World!', b58: '2NEpo7TZRRrLZSi2U' },
        {
          raw: 'The quick brown fox jumps over the lazy dog.',
          b58: 'USm3fpXnKG5EUBx2ndxBDMPVciP5hGey2Jh4NDv6gmeo1LkMeiKrLJUUBk6Z',
        },
        { raw: '0x0000287fb4cd', b58: '11233QC4' },
      ])
        it(raw, async function () {
          const buffer = (isHexString(raw) ? getBytes : ethers.toUtf8Bytes)(raw);
          const hex = hexlify(buffer);

          await expect(this.mock.$encode(hex)).to.eventually.equal(b58);
          await expect(this.mock.$decode(b58)).to.eventually.equal(hex);
        });
    });

    describe('decode invalid format', function () {
      for (const chr of ['I', '-', '~'])
        it(`Invalid base58 char ${chr}`, async function () {
          const getHexCode = str => hexlify(toUtf8Bytes(str));
          const helper = { interface: Interface.from(['error InvalidBase58Char(bytes1)']) };

          await expect(this.mock.$decode(`VYRWKp${chr}pnN7`))
            .to.be.revertedWithCustomError(helper, 'InvalidBase58Char')
            .withArgs(getHexCode(chr));
        });
    });
  });
});
