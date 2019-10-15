import {
  getChrLocationFromStr,
  getChrLocationStr,
  getRegionFieldErrorMessages,
  getRegionEditorErrorMessages
} from './browserHelper';
import { createValidationInfo } from 'tests/fixtures/browser';
import { RegionValidationResponse } from './browserState';
import { RegionErrors } from './browserConfig';

describe('browserHelper', () => {
  describe('getChrLocationFromStr', () => {
    test('outputs ChrLocation when input received as string', () => {
      expect(getChrLocationFromStr('10:1-10000')).toStrictEqual([
        '10',
        1,
        10000
      ]);
    });
  });

  describe('getChrLocationStr', () => {
    test('outputs string when input received as ChrLocation', () => {
      expect(getChrLocationStr(['10', 1, 10000])).toBe('10:1-10000');
    });
  });

  const mockValidationInfo = createValidationInfo();
  const invalidRegionInfo: Partial<RegionValidationResponse> = {
    region: {
      error_code: null,
      error_message: 'Could not find region aaa',
      is_valid: false,
      region_code: 'chromosome',
      region_name: 'AAA'
    }
  };
  const invalidStartInfo: Partial<RegionValidationResponse> = {
    start: {
      error_code: null,
      error_message: 'Start should be between 1 and 248956422',
      is_valid: false,
      value: 0
    }
  };
  const invalidEndInfo: Partial<RegionValidationResponse> = {
    end: {
      error_code: null,
      error_message: 'End should be between 1 and 248956422',
      is_valid: false,
      value: 2489564220
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
      const newMockValidationInfo = Object.assign({}, mockValidationInfo, {
        is_parseable: false
      });

      expect(getRegionFieldErrorMessages(newMockValidationInfo)).toBe(
        RegionErrors.PARSE_ERROR
      );
    });

    test('returns error if region is invalid', () => {
      const newMockValidationInfo = Object.assign(
        {},
        mockValidationInfo,
        invalidRegionInfo
      );

      expect(getRegionFieldErrorMessages(newMockValidationInfo)).toBe(
        'Could not find region aaa'
      );
    });

    test('returns error if start is invalid', () => {
      const newMockValidationInfo = Object.assign(
        {},
        mockValidationInfo,
        invalidStartInfo
      );

      expect(getRegionFieldErrorMessages(newMockValidationInfo)).toBe(
        'Start should be between 1 and 248956422'
      );
    });

    test('returns error if end is invalid', () => {
      const newMockValidationInfo = Object.assign(
        {},
        mockValidationInfo,
        invalidEndInfo
      );

      expect(getRegionFieldErrorMessages(newMockValidationInfo)).toBe(
        'End should be between 1 and 248956422'
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
      const newMockValidationInfo = Object.assign(
        {},
        mockValidationInfo,
        invalidStartInfo
      );

      expect(getRegionEditorErrorMessages(newMockValidationInfo)).toStrictEqual(
        {
          locationStartError: 'Start should be between 1 and 248956422',
          locationEndError: null
        }
      );
    });

    test('returns location end error message when start is invalid', () => {
      const newMockValidationInfo = Object.assign(
        {},
        mockValidationInfo,
        invalidEndInfo
      );

      expect(getRegionEditorErrorMessages(newMockValidationInfo)).toStrictEqual(
        {
          locationStartError: null,
          locationEndError: 'End should be between 1 and 248956422'
        }
      );
    });
  });
});
