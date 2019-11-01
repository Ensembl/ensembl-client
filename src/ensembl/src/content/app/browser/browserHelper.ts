import noop from 'lodash/noop';
import apiService from 'src/services/api-service';

import { ChrLocation } from './browserState';
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

export type RegionValidationErrors = {
  genomeIdError: string | null;
  regionParamError: string | null;
  parseError: string | null;
  regionError: string | null;
  startError: string | null;
  endError: string | null;
};

export type RegionValidationMessages = {
  errorMessages: RegionValidationErrors;
  successMessages: {
    regionId: string | null;
  };
};

export type RegionValidationResult = {
  error_code: string | null;
  error_message: string | null;
  is_valid: boolean;
};

export type RegionValidationValueResult = RegionValidationResult & {
  value: string | number;
};

export type RegionValidationStickResult = RegionValidationResult & {
  region_code: string;
  region_name: string;
};

export type RegionValidationGenericResult = Partial<{
  error: string | undefined;
  genome_id: string | undefined;
  parse: string | undefined;
  region: string | undefined;
}>;

export type RegionValidationResponse = Partial<{
  end: RegionValidationValueResult;
  genome_id: RegionValidationValueResult;
  region_id: string;
  region: RegionValidationStickResult;
  start: RegionValidationValueResult;
  message: RegionValidationGenericResult;
}>;

export const getRegionValidationMessages = (
  validationInfo: RegionValidationResponse | null
): RegionValidationMessages => {
  let genomeIdError = null;
  let regionParamError = null;
  let parseError = null;
  let regionError = null;
  let startError = null;
  let endError = null;
  let regionId = null;

  if (validationInfo) {
    if (validationInfo.message) {
      genomeIdError = validationInfo.message.genome_id || null;
      regionParamError = validationInfo.message.region || null;
      parseError = validationInfo.message.parse || null;
    } else {
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

  return {
    errorMessages: {
      genomeIdError,
      regionParamError,
      parseError,
      regionError,
      startError,
      endError
    },
    successMessages: {
      regionId
    }
  };
};

const processValidationMessages = (
  validationMessages: RegionValidationMessages,
  onSuccess: (regionId: string) => void,
  onError: (validationErrors: RegionValidationErrors) => void
) => {
  const { errorMessages, successMessages } = validationMessages;

  if (Object.values(errorMessages).every((value) => !value)) {
    onSuccess(successMessages.regionId as string);
  } else {
    onError(errorMessages);
  }
};

export const validateRegion = async (params: {
  regionInput: string;
  genomeId: string | null;
  onSuccess: (regionId: string) => void;
  onError: (validationErrors: RegionValidationErrors) => void;
}) => {
  const { regionInput, genomeId, onSuccess = noop, onError = noop } = params;

  if (genomeId) {
    try {
      const url = `/api/genome/region/validate?genome_id=${genomeId}&region=${regionInput}`;
      const response: RegionValidationResponse = await apiService.fetch(url);

      processValidationMessages(
        getRegionValidationMessages(response),
        onSuccess,
        onError
      );
    } catch (error) {
      if (error.status === 400) {
        processValidationMessages(
          getRegionValidationMessages(error),
          onSuccess,
          onError
        );
      } else {
        console.error(error);
      }
    }
  }
};
