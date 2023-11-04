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

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import type { LocationValidationResponse } from 'src/content/app/genome-browser/helpers/browserHelper';

const validRegionName = '2';
const invalidRegionName = '30';
const startCoordinate = 100;
const endCoordinate = 1000;

export const validLocationInput = `${validRegionName}:${startCoordinate}-${endCoordinate}`;
export const invalidLocationInput = `${invalidRegionName}:${startCoordinate}-${endCoordinate}`;

export const getMockServer = () =>
  setupServer(
    http.get(
      'http://location-validation-api/validate_location',
      ({ request }) => {
        const url = new URL(request.url);
        const location = url.searchParams.get('location');
        if (location === validLocationInput) {
          return HttpResponse.json(validLocationResponse);
        } else if (location === invalidLocationInput) {
          return HttpResponse.json(invalidLocationResponse);
        }
      }
    )
  );

const validLocationResponse: LocationValidationResponse = {
  end: {
    error_code: null,
    error_message: null,
    is_valid: true,
    value: endCoordinate
  },
  region: {
    error_code: null,
    error_message: null,
    is_valid: true,
    region_name: validRegionName
  },
  location: `${validRegionName}:${startCoordinate}-${endCoordinate}`,
  start: {
    error_code: null,
    error_message: null,
    is_valid: true,
    value: startCoordinate
  }
};

export const invalidLocationResponse: LocationValidationResponse = {
  end: {
    error_code: null,
    error_message: null,
    is_valid: false,
    value: endCoordinate
  },
  region: {
    error_code: null,
    error_message: 'Could not find region 30',
    is_valid: false,
    region_name: '30'
  },
  location: null,
  start: {
    error_code: null,
    error_message: null,
    is_valid: false,
    value: startCoordinate
  }
};
