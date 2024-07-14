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

import { faker } from '@faker-js/faker';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';
import mockVepFormConfig from './mockVepFormConfig';

import type { VepSubmission } from 'src/content/app/tools/vep/types/vepSubmission';

export const createVepSubmission = (params?: {
  fragment?: Partial<VepSubmission>;
}): VepSubmission => {
  const { fragment = {} } = params ?? {};
  const species = createSelectedSpecies();

  return {
    id: faker.string.uuid(),
    species,
    inputText: '',
    inputFile: null,
    submissionName: '',
    parameters: getDefaultParameters(),
    createdAt: Date.now(),
    submittedAt: Date.now(),
    resultsSeen: false,
    status: 'SUBMITTED',
    ...fragment
  };
};

const getDefaultParameters = () => {
  const parameterNames = Object.keys(mockVepFormConfig.parameters) as Array<
    keyof typeof mockVepFormConfig.parameters
  >;

  return parameterNames.reduce((acc, key) => {
    return {
      ...acc,
      [key]: mockVepFormConfig.parameters[key].default_value
    };
  }, {});
};
