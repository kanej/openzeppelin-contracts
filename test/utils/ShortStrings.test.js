import { connectOnTestSuiteStart } from '../helpers/connection.js';
import { expect } from 'chai';
import { concat, encodeBytes32String, toBeArray, toUtf8String, zeroPadValue } from 'ethers';

const FALLBACK_SENTINEL = zeroPadValue('0xFF', 32);

const length = sstr => parseInt(sstr.slice(64), 16);
const decode = sstr => toUtf8String(sstr).slice(0, length(sstr));
const encode = str =>
  str.length < 32
    ? concat([encodeBytes32String(str).slice(0, -2), zeroPadValue(toBeArray(str.length), 1)])
    : FALLBACK_SENTINEL;

describe('ShortStrings', function () {
  const {
    ethers,
    networkHelpers: { loadFixture },
  } = connectOnTestSuiteStart();

  async function fixture() {
    const mock = await ethers.deployContract('$ShortStrings');
    return { mock };
  }

  beforeEach(async function () {
    Object.assign(this, await loadFixture(fixture));
  });

  for (const str of [0, 1, 16, 31, 32, 64, 1024].map(length => 'a'.repeat(length))) {
    describe(`with string length ${str.length}`, function () {
      it('encode / decode', async function () {
        if (str.length < 32) {
          const encoded = await this.mock.$toShortString(str);
          expect(encoded).to.equal(encode(str));
          expect(decode(encoded)).to.equal(str);

          expect(await this.mock.$byteLength(encoded)).to.equal(str.length);
          expect(await this.mock.$toString(encoded)).to.equal(str);
        } else {
          await expect(this.mock.$toShortString(str))
            .to.be.revertedWithCustomError(this.mock, 'StringTooLong')
            .withArgs(str);
        }
      });

      it('set / get with fallback', async function () {
        const short = await this.mock
          .$toShortStringWithFallback(str, 0)
          .then(tx => tx.wait())
          .then(receipt => receipt.logs.find(ev => ev.fragment.name == 'return$toShortStringWithFallback').args[0]);

        expect(short).to.equal(encode(str));

        const promise = this.mock.$toString(short);
        if (str.length < 32) {
          expect(await promise).to.equal(str);
        } else {
          await expect(promise).to.be.revertedWithCustomError(this.mock, 'InvalidShortString');
        }

        expect(await this.mock.$byteLengthWithFallback(short, 0)).to.equal(str.length);
        expect(await this.mock.$toStringWithFallback(short, 0)).to.equal(str);
      });
    });
  }
});
