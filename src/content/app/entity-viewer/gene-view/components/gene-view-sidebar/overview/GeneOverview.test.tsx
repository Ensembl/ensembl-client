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

import { useGeneOverviewQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';

import GeneOverview from './GeneOverview';

const genomeId = 'genome_id';
const geneId = 'unversioned_gene_id';

const mockGenomeId = genomeId; // for jest to be able to pick it up
const mockGeneId = geneId; // for jest to be able to pick it up

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({
    params: {
      entityId: geneId,
      genomeId
    }
  }))
}));

jest.mock(
  'src/content/app/entity-viewer/state/api/entityViewerThoasSlice',
  () => ({
    useGeneOverviewQuery: jest.fn()
  })
);

jest.mock('src/store', () => ({ useAppDispatch: jest.fn() }));

jest.mock('../publications/GenePublications', () => () => (
  <div className="genePublications" />
));

jest.mock(
  'src/content/app/entity-viewer/gene-view/hooks/useGeneViewIds',
  () => () => ({
    genomeId: mockGenomeId,
    geneId: mockGeneId
  })
);

jest.mock(
  'src/content/app/entity-viewer/hooks/useEntityViewerAnalytics',
  () => () => ({})
);

const geneName = 'gene_name';
const geneSymbol = 'gene_symbol';
const stableId = 'gene_stable_id';
const alternativeSymbols = [
  'gene_synonym_1',
  'gene_synonym_2',
  'gene_synonym_3'
];

const metadata = {
  name: {
    accession_id: 'name_accession_id',
    url: 'name_url'
  }
};

const completeGeneData = {
  name: geneName,
  stable_id: stableId,
  symbol: geneSymbol,
  alternative_symbols: alternativeSymbols,
  metadata: metadata
};

describe('<GeneOverview />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loading', () => {
    beforeEach(() => {
      (useGeneOverviewQuery as any).mockImplementation(() => ({
        currentData: null,
        isFetching: true
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
      (useGeneOverviewQuery as any).mockImplementation(() => ({
        currentData: null,
        isFetching: false
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
      (useGeneOverviewQuery as any).mockImplementation(() => ({
        currentData: { gene: completeGeneData },
        isFetching: false
      }));
    });

    it('renders all data correctly', () => {
      const { container, queryByTestId } = render(<GeneOverview />);

      const geneSymbolElement = container.querySelector('.geneSymbol');
      const stableIdElement = queryByTestId('stableId');
      const geneNameElement = container.querySelector('.geneName');
      const synonymsElement = container.querySelector('.synonyms');
      const xrefElement = container.querySelector(
        '.externalLinkContainer .link'
      );

      // child components
      const genePublications = container.querySelector('.genePublications');

      expect(geneSymbolElement?.textContent).toMatch(geneSymbol);
      expect(stableIdElement?.textContent).toMatch(stableId);
      expect(geneNameElement?.textContent).toMatch(geneName);
      expect(xrefElement?.textContent).toMatch(metadata.name.accession_id);
      expect(synonymsElement?.textContent).toMatch(
        alternativeSymbols.join(', ')
      );
      expect(genePublications).toBeTruthy();
    });
  });

  describe('partial data', () => {
    it('renders only stable id if gene symbol is not available', () => {
      const geneData = { ...completeGeneData, symbol: null };

      (useGeneOverviewQuery as any).mockImplementation(() => ({
        currentData: { gene: geneData },
        isFetching: false
      }));

      const { queryByTestId } = render(<GeneOverview />);

      const stableIdElement = queryByTestId('stableId');
      expect(stableIdElement?.textContent).toMatch(stableId);
    });

    it('shows that the gene does not have a name', () => {
      const geneData = { ...completeGeneData, name: null };

      (useGeneOverviewQuery as any).mockImplementation(() => ({
        currentData: { gene: geneData },
        isFetching: false
      }));

      const { container } = render(<GeneOverview />);

      const geneNameElement = container.querySelector('.geneName');
      expect(geneNameElement?.textContent).toBe('None');
    });

    it('shows that the gene does not have synonyms', () => {
      const geneData = { ...completeGeneData, alternative_symbols: [] };

      (useGeneOverviewQuery as any).mockImplementation(() => ({
        currentData: { gene: geneData },
        isFetching: false
      }));

      const { container } = render(<GeneOverview />);

      const synonymsElement = container.querySelector('.synonyms');
      expect(synonymsElement?.textContent).toBe('None');
    });
  });
});
