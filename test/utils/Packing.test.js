import { network } from 'hardhat';
import { expect } from 'chai';
import { hexlify, randomBytes, concat, toNumber } from 'ethers';
import { product } from '../helpers/iterate';
import { SIZES } from '../../scripts/generate/templates/Packing.opts';

describe('Packing', function () {
  const {
    ethers,
    networkHelpers: { loadFixture },
  } = network.mocha.connectOnBefore();

  async function fixture() {
    return { mock: await ethers.deployContract('$Packing') };
  }

  beforeEach(async function () {
    Object.assign(this, await loadFixture(fixture));
  });

  describe('pack', function () {
    for (const [size1, size2] of product(SIZES, SIZES).filter(([size1, size2]) => SIZES.includes(size1 + size2))) {
      const value1 = hexlify(randomBytes(size1));
      const value2 = hexlify(randomBytes(size2));
      const packed = concat([value1, value2]);

      it(`pack bytes${size1} + bytes${size2} => bytes${size1 + size2}`, async function () {
        expect(await this.mock[`$pack_${size1}_${size2}`](value1, value2)).to.equal(packed);
        expect(await this.mock[`$extract_${size1 + size2}_${size1}`](packed, 0)).to.equal(value1);
        expect(await this.mock[`$extract_${size1 + size2}_${size2}`](packed, size1)).to.equal(value2);
      });
    }
  });

  describe('extract / replace', function () {
    for (const [size1, size2] of product(SIZES, SIZES).filter(([size1, size2]) => size1 > size2)) {
      const MAX_OFFSET = size1 - size2;
      const offset = toNumber(randomBytes(1)) % (MAX_OFFSET + 1);
      const outer = randomBytes(size1);
      const value = randomBytes(size2);

      it(`extract bytes${size2} from bytes${size1}`, async function () {
        expect(await this.mock[`$extract_${size1}_${size2}`](outer, offset)).to.equal(
          hexlify(outer.slice(offset, offset + size2)),
        );

        await expect(this.mock[`$extract_${size1}_${size2}`](outer, MAX_OFFSET)).to.not.be.revertedWithCustomError(
          this.mock,
          'OutOfRangeAccess',
        );

        await expect(this.mock[`$extract_${size1}_${size2}`](outer, MAX_OFFSET + 1)).to.be.revertedWithCustomError(
          this.mock,
          'OutOfRangeAccess',
        );
      });

      it(`replace bytes${size2} from bytes${size1}`, async function () {
        expect(await this.mock[`$replace_${size1}_${size2}`](outer, value, offset)).to.equal(
          concat([outer.slice(0, offset), value, outer.slice(offset + size2)]),
        );

        await expect(
          this.mock[`$replace_${size1}_${size2}`](outer, value, MAX_OFFSET),
        ).to.not.be.revertedWithCustomError(this.mock, 'OutOfRangeAccess');

        await expect(
          this.mock[`$replace_${size1}_${size2}`](outer, value, MAX_OFFSET + 1),
        ).to.be.revertedWithCustomError(this.mock, 'OutOfRangeAccess');
      });
    }
  });
});
