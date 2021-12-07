/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import noop from 'lodash/noop';
import apiService from 'src/services/api-service';

import { getNumberWithoutCommas } from 'src/shared/helpers/formatters/numberFormatter';
import {
  parseEnsObjectId,
  buildEnsObjectId
} from 'src/shared/state/ens-object/ensObjectHelpers';

import JSONValue from 'src/shared/types/JSON';
import { ChrLocation } from 'src/content/app/genome-browser/state/browser-location/browserLocationSlice';

type GenomeBrowserFocusIdConstituents = {
  genomeId: string;
  type: string;
  objectId: string;
};

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

export const stringifyGenomeBrowserFocusId = (
  params: GenomeBrowserFocusIdConstituents
) => buildEnsObjectId(params);

// Genome browser sends focus feature id in the format <genome_id>:<feature_type>:<feature_id>.
export const parseFeatureId = (id: string): GenomeBrowserFocusIdConstituents =>
  parseEnsObjectId(id);

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
      const url = `/api/genomesearch/genome/region/validate?genome_id=${genomeId}&region=${regionInput}`;
      const response: RegionValidationResponse = await apiService.fetch(url);
      const regionId = buildEnsObjectId({
        genomeId,
        type: 'region',
        objectId: response.region_id as string
      });
      response.region_id = regionId;

      processValidationMessages(
        getRegionValidationMessages(response),
        onSuccess,
        onError
      );
    } catch (error) {
      const processibleError =
        error &&
        typeof error === 'object' &&
        'status' in error &&
        (error as JSONValue).status === 400;
      if (processibleError) {
        processValidationMessages(
          getRegionValidationMessages(error as RegionValidationResponse),
          onSuccess,
          onError
        );
      } else {
        console.error(error);
      }
    }
  }
};
