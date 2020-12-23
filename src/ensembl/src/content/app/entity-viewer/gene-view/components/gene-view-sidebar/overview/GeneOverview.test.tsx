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
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import GeneOverview from './GeneOverview';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn()
}));

jest.mock('@apollo/client', () => ({
  gql: jest.fn(),
  useQuery: jest.fn()
}));

jest.mock('../publications/GenePublications', () => () => (
  <div className="genePublications" />
));

const genomeId = 'genome_id';
const geneId = 'unversioned_gene_id';
const geneName = 'gene_name';
const geneSymbol = 'gene_symbol';
const stableId = 'gene_stable_id';
const alternativeSymbols = [
  'gene_synonym_1',
  'gene_synonym_2',
  'gene_synonym_3'
];

const completeGeneData = {
  name: geneName,
  stable_id: stableId,
  symbol: geneSymbol,
  alternative_symbols: alternativeSymbols
};

describe('<GeneOverview />', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    (useParams as any).mockImplementation(() => ({
      params: {
        entityId: geneId,
        genomeId
      }
    }));
  });

  describe('loading', () => {
    beforeEach(() => {
      (useQuery as any).mockImplementation(() => ({
        data: null,
        loading: true
      }));
    });

    it('shows the loading indicator', () => {
      const { container } = render(<GeneOverview />);
      const geneOverviewElement = container.firstChild;

      expect(geneOverviewElement?.textContent).toBe('Loading...');
    });
  });

  describe('empty data', () => {
    beforeEach(() => {
      (useQuery as any).mockImplementation(() => ({
        data: null,
        loading: false
      }));
    });

    it('shows the no data message', () => {
      const { container } = render(<GeneOverview />);
      const geneOverviewElement = container.firstChild;

      expect(geneOverviewElement?.textContent).toBe('No data to display');
    });
  });

  describe('full data', () => {
    beforeEach(() => {
      (useQuery as any).mockImplementation(() => ({
        data: { gene: completeGeneData },
        loading: false
      }));
    });

    it('renders all data correctly', () => {
      const { container } = render(<GeneOverview />);

      const geneDetailsElement = container.querySelector('.geneDetails');
      const geneNameElement = container.querySelector('.geneName');
      const synonymsElement = container.querySelector('.synonyms');

      // child components
      const genePublications = container.querySelector('.genePublications');

      expect(geneDetailsElement?.textContent).toMatch(geneSymbol);
      expect(geneDetailsElement?.textContent).toMatch(stableId);
      expect(geneNameElement?.textContent).toMatch(geneName);
      expect(synonymsElement?.textContent).toMatch(
        alternativeSymbols.join(', ')
      );
      expect(genePublications).toBeTruthy();
    });
  });

  describe('partial data', () => {
    it('renders only stable id if gene symbol is not available', () => {
      const geneData = { ...completeGeneData, symbol: null };
      (useQuery as any).mockImplementation(() => ({
        data: { gene: geneData },
        loading: false
      }));

      const { container } = render(<GeneOverview />);

      const geneDetailsElement = container.querySelector('.geneDetails');
      expect(geneDetailsElement?.textContent).toBe(stableId);
    });

    it('does not render gene name section if gene name is not available', () => {
      const geneData = { ...completeGeneData, name: null };
      (useQuery as any).mockImplementation(() => ({
        data: { gene: geneData },
        loading: false
      }));

      const { container } = render(<GeneOverview />);

      const geneNameElement = container.querySelector('.geneName');
      expect(geneNameElement).toBeFalsy();
    });

    it('shows "no synonyms" message for gene without synonyms', () => {
      const geneData = { ...completeGeneData, alternative_symbols: [] };
      (useQuery as any).mockImplementation(() => ({
        data: { gene: geneData },
        loading: false
      }));

      const { container } = render(<GeneOverview />);

      const synonymsElement = container.querySelector('.synonyms');
      expect(synonymsElement?.textContent).toBe('No synonyms');
    });
  });
});
