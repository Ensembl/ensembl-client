import faker from 'faker';

import {
  getChrLocationFromStr,
  getChrLocationStr,
  getRegionValidationResult
} from './browserHelper';
import {
  createRegionValidationInfo,
  createChrLocationValues,
  createRegionValidationResult
} from 'tests/fixtures/browser';
import { RegionValidationResponse } from './browserState';
import { RegionErrors } from './browserConfig';

describe('browserHelper', () => {
  describe('getChrLocationFromStr', () => {
    test('outputs ChrLocation when input received as string', () => {
      const chrLocationValues = createChrLocationValues();
      expect(
        getChrLocationFromStr(chrLocationValues.stringValue)
      ).toStrictEqual(chrLocationValues.tupleValue);
    });
  });

  describe('getChrLocationStr', () => {
    const chrLocationValues = createChrLocationValues();
    test('outputs string when input received as ChrLocation', () => {
      expect(getChrLocationStr(chrLocationValues.tupleValue)).toBe(
        chrLocationValues.stringValue
      );
    });
  });

  describe('getRegionValidationResult', () => {
    const mockValidationInfo = createRegionValidationInfo();
    const regionError = faker.lorem.words();
    const startError = faker.lorem.words();
    const endError = faker.lorem.words();
    const invalidRegionInfo: Partial<RegionValidationResponse> = {
      region: {
        error_code: null,
        error_message: regionError,
        is_valid: false,
        region_code: faker.lorem.words(),
        region_name: faker.lorem.words()
      }
    };
    const invalidStartInfo: Partial<RegionValidationResponse> = {
      start: {
        error_code: null,
        error_message: startError,
        is_valid: false,
        value: faker.random.number()
      }
    };
    const invalidEndInfo: Partial<RegionValidationResponse> = {
      end: {
        error_code: null,
        error_message: endError,
        is_valid: false,
        value: faker.random.number()
      }
    };
    const mockValidationResult = createRegionValidationResult(); // all error messages are undefined by default

    test('returns all error messages as undefined', () => {
      expect(getRegionValidationResult(null)).toStrictEqual(
        mockValidationResult
      );
    });

    test('returns all error messages as undefined if all inputs are valid', () => {
      expect(
        getRegionValidationResult(mockValidationInfo).errorMessages
      ).toStrictEqual(mockValidationResult.errorMessages);
    });

    test('returns errors if genome id and/or region missing error messages are in response', () => {
      const genomeIdError = faker.lorem.words();
      const regionParamError = faker.lorem.words();
      const newMockValidationInfo = {
        message: {
          genome_id: genomeIdError,
          region: regionParamError
        }
      };

      expect(
        getRegionValidationResult(newMockValidationInfo).errorMessages
          .genomeIdError
      ).toBe(genomeIdError);

      expect(
        getRegionValidationResult(newMockValidationInfo).errorMessages
          .regionParamError
      ).toBe(regionParamError);
    });

    // this test case needs to be changed once the parse error message becomes available in the validaiton response
    test('returns error if region is not parseable', () => {
      const newMockValidationInfo = {
        ...mockValidationInfo,
        ...{
          is_parseable: false
        }
      };

      expect(
        getRegionValidationResult(newMockValidationInfo).errorMessages
          .regionError
      ).toStrictEqual(RegionErrors.PARSE_ERROR);
    });

    test('returns error if region is invalid', () => {
      const newMockValidationInfo = {
        ...mockValidationInfo,
        ...invalidRegionInfo
      };

      expect(
        getRegionValidationResult(newMockValidationInfo).errorMessages
          .regionError
      ).toStrictEqual(regionError);
    });

    test('returns error if start is invalid', () => {
      const newMockValidationInfo = {
        ...mockValidationInfo,
        ...invalidStartInfo
      };

      expect(
        getRegionValidationResult(newMockValidationInfo).errorMessages
          .startError
      ).toBe(startError);
    });

    test('returns error if end is invalid', () => {
      const newMockValidationInfo = {
        ...mockValidationInfo,
        ...invalidEndInfo
      };

      expect(
        getRegionValidationResult(newMockValidationInfo).errorMessages.endError
      ).toBe(endError);
    });

    test('returns region ID if it exists in response', () => {
      const regionId = faker.lorem.words();
      const newMockValidationInfo = {
        ...mockValidationInfo,
        region_id: regionId
      };

      expect(getRegionValidationResult(newMockValidationInfo).regionId).toBe(
        regionId
      );
    });
  });
});
