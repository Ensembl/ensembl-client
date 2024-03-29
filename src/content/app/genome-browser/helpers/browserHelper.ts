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

import apiService from 'src/services/api-service';

import config from 'config';

import {
  parseFocusObjectId,
  buildFocusObjectId
} from 'src/shared/helpers/focusObjectHelpers';

import { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

type GenomeBrowserFocusIdConstituents = {
  genomeId: string;
  type: string;
  objectId: string;
};

// A valid location string has a format of "regionName:start-end"
export function getChrLocationFromStr(chrLocationStr: string): ChrLocation {
  const [regionName, coordinates] = chrLocationStr.split(':');
  const splitCoordinates = coordinates.split('-');

  if (splitCoordinates.length !== 2) {
    throw new Error(
      'There can only be a start and an end coordinate in a location string'
    );
  }

  const [startBp, endBp] = coordinates.split('-');

  // We should only allow digits in start and end coordinates of location strings
  // Anything else (commas, white spaces, whatever) will be validated by the backend
  const invalidCoordinateRegex = /[^\d]/;

  if (
    startBp.match(invalidCoordinateRegex) ||
    endBp.match(invalidCoordinateRegex)
  ) {
    throw new Error(
      'Start and end coordinates of a region must consist of digits only'
    );
  }

  return [
    regionName,
    parseInt(startBp, 10),
    parseInt(endBp, 10)
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
) => buildFocusObjectId(params);

// Genome browser sends focus feature id in the format <genome_id>:<feature_type>:<feature_id>.
export const parseFeatureId = (id: string): GenomeBrowserFocusIdConstituents =>
  parseFocusObjectId(id);

export type LocationValidationCommonFields = {
  error_code: string | null;
  error_message: string | null;
  is_valid: boolean;
};

export type ValueValidationResult = LocationValidationCommonFields & {
  value: string | number;
};

export type RegionValidationResult = LocationValidationCommonFields & {
  region_name: string;
};

export type LocationValidationResponse = Partial<{
  end: ValueValidationResult;
  location: string | null; // location being null means that it failed validation
  region: RegionValidationResult;
  start: ValueValidationResult;
}>;

export const validateGenomicLocation = async (params: {
  location: string;
  genomeId: string;
}) => {
  const { location, genomeId } = params;
  const url = `${config.metadataApiBaseUrl}/validate_location?genome_id=${genomeId}&location=${location}`;

  let response: LocationValidationResponse;

  try {
    response = await apiService.fetch(url);
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'status' in error &&
      error.status === 400
    ) {
      // the server failed to parse user's input
      response = { region_id: null } as unknown as LocationValidationResponse; // lying to typescript
    } else {
      throw error;
    }
  }

  if (response.location === null) {
    // the backend service thinks that the submitted location is invalid
    throw response;
  }

  return response;
};
