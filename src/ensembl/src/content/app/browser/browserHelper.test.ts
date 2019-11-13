import faker from 'faker';

import {
  getChrLocationFromStr,
  getChrLocationStr,
  getRegionValidationMessages
} from './browserHelper';
import {
  createRegionValidationInfo,
  createChrLocationValues,
  createRegionValidationMessages
} from 'tests/fixtures/browser';
import { RegionValidationResponse } from './browserHelper';

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

  describe('getRegionValidationMessages', () => {
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
    const mockValidationMessages = createRegionValidationMessages(); // all error messages are null by default

    test('returns all error messages as null', () => {
      expect(getRegionValidationMessages(null)).toStrictEqual(
        mockValidationMessages
      );
    });

    test('returns all error messages as null if all inputs are valid', () => {
      expect(
        getRegionValidationMessages(mockValidationInfo).errorMessages
      ).toStrictEqual(mockValidationMessages.errorMessages);
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
        getRegionValidationMessages(newMockValidationInfo).errorMessages
          .genomeIdError
      ).toBe(genomeIdError);

      expect(
        getRegionValidationMessages(newMockValidationInfo).errorMessages
          .regionParamError
      ).toBe(regionParamError);
    });

    // this test case needs to be changed once the parse error message becomes available in the validaiton response
    test('returns error if region is not parseable', () => {
      const parseError = faker.lorem.words();
      const newMockValidationInfo = {
        message: {
          parse: parseError
        }
      };

      expect(
        getRegionValidationMessages(newMockValidationInfo).errorMessages
          .parseError
      ).toBe(parseError);
    });

    test('returns error if region is invalid', () => {
      const newMockValidationInfo = {
        ...mockValidationInfo,
        ...invalidRegionInfo
      };

      expect(
        getRegionValidationMessages(newMockValidationInfo).errorMessages
          .regionError
      ).toStrictEqual(regionError);
    });

    test('returns error if start is invalid', () => {
      const newMockValidationInfo = {
        ...mockValidationInfo,
        ...invalidStartInfo
      };

      expect(
        getRegionValidationMessages(newMockValidationInfo).errorMessages
          .startError
      ).toBe(startError);
    });

    test('returns error if end is invalid', () => {
      const newMockValidationInfo = {
        ...mockValidationInfo,
        ...invalidEndInfo
      };

      expect(
        getRegionValidationMessages(newMockValidationInfo).errorMessages
          .endError
      ).toBe(endError);
    });

    test('returns region ID if it exists in response', () => {
      const regionId = faker.lorem.words();
      const newMockValidationInfo = {
        ...mockValidationInfo,
        region_id: regionId
      };

      expect(
        getRegionValidationMessages(newMockValidationInfo).successMessages
          .regionId
      ).toBe(regionId);
    });
  });
});
