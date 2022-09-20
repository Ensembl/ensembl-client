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
import { render } from '@testing-library/react';

import SpeciesSearchMatch from './SpeciesSearchMatch';

import { MatchedFieldName } from 'src/content/app/species-selector/types/species-search';

const matchTemplate = {
  genome_id: 'homo_sapiens_38',
  common_name: 'Human',
  scientific_name: 'Homo sapiens',
  assembly_name: 'GRCh38.p12',
  matched_substrings: [
    {
      length: 3,
      offset: 0,
      match: MatchedFieldName.COMMON_NAME
    }
  ],
  genome_tag: null
};

describe('<SpeciesSearchMatch />', () => {
  it('highlights a single match in the description field', () => {
    const { container } = render(<SpeciesSearchMatch match={matchTemplate} />);
    const highlightedFragments = container.querySelectorAll('.matched');
    expect(highlightedFragments.length).toBe(1);
    // highlighting Hum in Human
    expect(highlightedFragments[0].textContent).toBe('Hum');
  });

  it('highlights a single match in the scientific_name field', () => {
    const match = {
      ...matchTemplate,
      matched_substrings: [
        {
          length: 3,
          offset: 0,
          match: MatchedFieldName.SCIENTIFIC_NAME
        }
      ]
    };
    const { container } = render(<SpeciesSearchMatch match={match} />);
    const renderedScientificName = container.querySelector(
      '.scientificName'
    ) as HTMLElement;
    const highlightedFragments =
      renderedScientificName.querySelectorAll('.matched');

    expect(highlightedFragments.length).toBe(1);
    // highlighting Hom in Homo sapiens
    expect(highlightedFragments[0].textContent).toBe('Hom');
  });

  it('can highlight multiple matches', () => {
    const match = {
      ...matchTemplate,
      common_name: null,
      scientific_name: 'Bacillus subtilis',
      subtype: 'ASM904v1',
      matched_substrings: [
        {
          length: 3,
          offset: 0,
          match: MatchedFieldName.SCIENTIFIC_NAME
        },
        {
          length: 3,
          offset: 9,
          match: MatchedFieldName.SCIENTIFIC_NAME
        }
      ]
    };

    const { container } = render(<SpeciesSearchMatch match={match} />);

    const highlightedFragments = container.querySelectorAll('.matched');
    expect(highlightedFragments.length).toBe(2);
    // highlighting Bac in Bacillus and sub in subtilis
    expect(highlightedFragments[0].textContent).toBe('Bac');
    expect(highlightedFragments[1].textContent).toBe('sub');
  });
});
