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

import { rest } from 'msw';
import { setupServer } from 'msw/node';

const validRegionName = '2';
const invalidRegionName = '30';
const startCoordinate = 100;
const endCoordinate = 1000;

export const validLocationInput = `${validRegionName}:${startCoordinate}-${endCoordinate}`;
export const invalidLocationInput = `${invalidRegionName}:${startCoordinate}-${endCoordinate}`;

export const getMockServer = () =>
  setupServer(
    rest.get(
      'http://location-validation-api/genome/region/validate',
      (req, res, ctx) => {
        const region = req.url.searchParams.get('region');
        if (region === validLocationInput) {
          return res(ctx.json(validLocationResponse));
        } else if (region === invalidLocationInput) {
          return res(ctx.json(invalidLocationResponse));
        }
      }
    )
  );

const validLocationResponse = {
  end: {
    error_code: null,
    error_message: null,
    is_valid: true,
    value: endCoordinate
  },
  genome_id: {
    error_code: null,
    error_message: null,
    is_valid: true,
    value: 'a7335667-93e7-11ec-a39d-005056b38ce3'
  },
  region: {
    error_code: null,
    error_message: null,
    is_valid: true,
    region_code: 'chromosome',
    region_name: validRegionName
  },
  region_id: `${validRegionName}:${startCoordinate}-${endCoordinate}`,
  start: {
    error_code: null,
    error_message: null,
    is_valid: true,
    value: startCoordinate
  }
};

export const invalidLocationResponse = {
  end: {
    error_code: null,
    error_message: null,
    is_valid: false,
    value: endCoordinate
  },
  genome_id: {
    error_code: null,
    error_message: null,
    is_valid: true,
    value: 'a7335667-93e7-11ec-a39d-005056b38ce3'
  },
  region: {
    error_code: null,
    error_message: 'Could not find region 30',
    is_valid: false,
    region_code: null,
    region_name: '30'
  },
  region_id: null,
  start: {
    error_code: null,
    error_message: null,
    is_valid: false,
    value: startCoordinate
  }
};
