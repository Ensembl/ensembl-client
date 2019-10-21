import faker from 'faker';

import {
  getChrLocationFromStr,
  getChrLocationStr,
  getRegionFieldErrorMessages,
  getRegionEditorErrorMessages
} from './browserHelper';
import {
  createValidationInfo,
  createChrLocationValues
} from 'tests/fixtures/browser';
import {
  RegionValidationResponse,
  RegionValidationRegionResult,
  RegionValidationValueResult
} from './browserState';
import { RegionErrors } from './browserConfig';

describe('browserHelper', () => {
  describe('getChrLocationFromStr', () => {
    test('outputs ChrLocation when input received as string', () => {
      const chrLocationValues = createChrLocationValues();
      expect(
        getChrLocationFromStr(chrLocationValues.stringValue)
      ).toStrictEqual(chrLocationValues.tuppleValue);
    });
  });

  describe('getChrLocationStr', () => {
    const chrLocationValues = createChrLocationValues();
    test('outputs string when input received as ChrLocation', () => {
      expect(getChrLocationStr(chrLocationValues.tuppleValue)).toBe(
        chrLocationValues.stringValue
      );
    });
  });

  const mockValidationInfo = createValidationInfo();
  const invalidRegionInfo: Partial<RegionValidationResponse> = {
    region: {
      error_code: null,
      error_message: faker.lorem.words(),
      is_valid: false,
      region_code: faker.lorem.words(),
      region_name: faker.lorem.words()
    }
  };
  const invalidStartInfo: Partial<RegionValidationResponse> = {
    start: {
      error_code: null,
      error_message: faker.lorem.words(),
      is_valid: false,
      value: faker.random.number()
    }
  };
  const invalidEndInfo: Partial<RegionValidationResponse> = {
    end: {
      error_code: null,
      error_message: faker.lorem.words(),
      is_valid: false,
      value: faker.random.number()
    }
  };

  describe('getRegionFieldErrorMessages', () => {
    test('returns no error message if validation is null', () => {
      expect(getRegionFieldErrorMessages(null)).toBe(null);
    });

    test('returns no error message if all inputs are valid', () => {
      expect(getRegionFieldErrorMessages(mockValidationInfo)).toBe(null);
    });

    // this test case needs to be changed once the parse error message becomes available in the validaiton response
    test('returns error if region is not parseable', () => {
      const newMockValidationInfo = {
        ...mockValidationInfo,
        ...{
          is_parseable: false
        }
      };

      expect(getRegionFieldErrorMessages(newMockValidationInfo)).toBe(
        RegionErrors.PARSE_ERROR
      );
    });

    test('returns error if region is invalid', () => {
      const newMockValidationInfo = {
        ...mockValidationInfo,
        invalidRegionInfo
      };

      expect(getRegionFieldErrorMessages(newMockValidationInfo)).toBe(
        (newMockValidationInfo.region as RegionValidationRegionResult)
          .error_message
      );
    });

    test('returns error if start is invalid', () => {
      const newMockValidationInfo = {
        ...mockValidationInfo,
        ...invalidStartInfo
      };

      expect(getRegionFieldErrorMessages(newMockValidationInfo)).toBe(
        (newMockValidationInfo.start as RegionValidationValueResult)
          .error_message
      );
    });

    test('returns error if end is invalid', () => {
      const newMockValidationInfo = {
        ...mockValidationInfo,
        ...invalidEndInfo
      };

      expect(getRegionFieldErrorMessages(newMockValidationInfo)).toBe(
        (newMockValidationInfo.end as RegionValidationValueResult).error_message
      );
    });
  });

  describe('getRegionEditorErrorMessages', () => {
    test('returns no error messages if validation is null', () => {
      expect(getRegionEditorErrorMessages(null)).toStrictEqual({
        locationStartError: null,
        locationEndError: null
      });
    });

    test('returns no error messages if all inputs are valid', () => {
      expect(getRegionEditorErrorMessages(mockValidationInfo)).toStrictEqual({
        locationStartError: null,
        locationEndError: null
      });
    });

    test('returns location start error message when start is invalid', () => {
      const newMockValidationInfo = {
        ...mockValidationInfo,
        ...invalidStartInfo
      };

      expect(getRegionEditorErrorMessages(newMockValidationInfo)).toStrictEqual(
        {
          locationStartError: (newMockValidationInfo.start as RegionValidationValueResult)
            .error_message,
          locationEndError: null
        }
      );
    });

    test('returns location end error message when start is invalid', () => {
      const newMockValidationInfo = {
        ...mockValidationInfo,
        ...invalidEndInfo
      };

      expect(getRegionEditorErrorMessages(newMockValidationInfo)).toStrictEqual(
        {
          locationStartError: null,
          locationEndError: (newMockValidationInfo.end as RegionValidationValueResult)
            .error_message
        }
      );
    });
  });
});
