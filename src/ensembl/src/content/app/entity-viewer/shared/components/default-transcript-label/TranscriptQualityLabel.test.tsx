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

import React from 'react';
import faker from 'faker';
import { render } from '@testing-library/react';

import { TranscriptQualityLabel } from './TranscriptQualityLabel';

const createMANETranscriptMetadata = () => {
  return {
    metadata: {
      canonical: {
        label: 'Ensembl canonical',
        value: true,
        definition: faker.lorem.sentence()
      },
      mane: {
        label: 'MANE Select',
        value: 'select',
        definition: faker.lorem.sentence()
      }
    }
  };
};

const createCanonicalTranscriptMetadata = () => {
  return {
    metadata: {
      canonical: {
        label: 'Ensembl canonical',
        value: true,
        definition: faker.lorem.sentence()
      },
      mane: null
    }
  };
};

const createOtherMANETranscriptMetadata = () => {
  return {
    metadata: {
      canonical: null,
      mane: {
        label: 'MANE Plus Clinical',
        value: 'plus_clinical',
        definition: faker.lorem.sentence()
      }
    }
  };
};

describe('<TranscriptQualityLabel />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('displays correct labels for transcript metadata', () => {
    const { queryByText, rerender } = render(
      <TranscriptQualityLabel {...createMANETranscriptMetadata()} />
    );
    let label = queryByText('MANE Select');
    expect(label).toBeTruthy();

    rerender(
      <TranscriptQualityLabel {...createCanonicalTranscriptMetadata()} />
    );
    label = queryByText('Ensembl canonical');
    expect(label).toBeTruthy();

    rerender(
      <TranscriptQualityLabel {...createOtherMANETranscriptMetadata()} />
    );
    label = queryByText('MANE Plus Clinical');
    expect(label).toBeTruthy();
  });
});
