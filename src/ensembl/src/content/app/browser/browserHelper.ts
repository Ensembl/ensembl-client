import noop from 'lodash/noop';
import apiService from 'src/services/api-service';

import { ChrLocation, RegionValidationResponse } from './browserState';
import { RegionErrors } from './browserConfig';
import { getNumberWithoutCommas } from 'src/shared/helpers/numberFormatter';

export function getChrLocationFromStr(chrLocationStr: string): ChrLocation {
  const [chrCode, chrRegion] = chrLocationStr.split(':');
  const [startBp, endBp] = chrRegion.split('-');

  return [
    chrCode,
    getNumberWithoutCommas(startBp),
    getNumberWithoutCommas(endBp)
  ] as ChrLocation;
}

export function getChrLocationStr(
  chrLocation: ChrLocation = ['', 0, 0]
): string {
  const [chrCode, startBp, endBp] = chrLocation;

  return `${chrCode}:${startBp}-${endBp}`;
}

export type ErrorMessages = {
  genomeIdError: string | undefined;
  regionParamError: string | undefined;
  regionError: string | undefined;
  startError: string | undefined;
  endError: string | undefined;
};

export type ValidationResult = {
  errorMessages: ErrorMessages;
  regionId: string | undefined;
};

export const getRegionValidationResult = (
  validationInfo: RegionValidationResponse | null
) => {
  let genomeIdError,
    regionParamError,
    parseError,
    regionError,
    startError,
    endError,
    regionId;

  if (validationInfo) {
    if (validationInfo.message) {
      genomeIdError = validationInfo.message.genome_id;
      regionParamError = validationInfo.message.region;
    } else {
      if (!validationInfo.is_parseable) {
        parseError = RegionErrors.PARSE_ERROR;
      }
      if (validationInfo.region && !validationInfo.region.is_valid) {
        regionError = validationInfo.region.error_message;
      }
      if (validationInfo.start && !validationInfo.start.is_valid) {
        startError = validationInfo.start.error_message;
      }
      if (validationInfo.end && !validationInfo.end.is_valid) {
        endError = validationInfo.end.error_message;
      }
      if (validationInfo.region_id) {
        regionId = validationInfo.region_id;
      }
    }
  }

  // this is till parse error is properly returned in the response
  regionError = parseError || regionError;

  return {
    errorMessages: {
      genomeIdError,
      regionParamError,
      regionError,
      startError,
      endError
    },
    regionId
  };
};

export const validateRegion = async (params: {
  regionInput: string;
  genomeId: string | null;
  onSuccess: (regionId: string) => void;
  onError: (validationResult: ErrorMessages) => void;
}) => {
  const { regionInput, genomeId, onSuccess = noop, onError = noop } = params;

  if (genomeId) {
    try {
      const url = `/api/genome/region/validate?genome_id=${genomeId}&region=${regionInput}`;
      const response: RegionValidationResponse = await apiService.fetch(url);
      const { errorMessages, regionId } = getRegionValidationResult(response);

      if (Object.values(errorMessages).every((value) => !value)) {
        onSuccess(regionId as string);
      } else {
        onError(errorMessages);
      }
    } catch (error) {
      console.error(error);
    }
  }
};
