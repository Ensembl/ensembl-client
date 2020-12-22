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
import { render, findByText } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import times from 'lodash/times';
import faker from 'faker';

import GeneOverview, { GENE_OVERVIEW_QUERY } from './GeneOverview';

const genomeId = faker.random.words();
const geneId = faker.random.words();
const geneName = faker.random.words();
const geneSymbol = faker.random.words();
const stableId = faker.random.words();
const alternativeSymbols = times(6, () => faker.random.word());

const dataMocks = [
  {
    request: {
      query: GENE_OVERVIEW_QUERY,
      variables: {
        genomeId,
        geneId
      }
    },
    result: {
      data: {
        post: {
          name: geneName,
          stableId,
          symbol: geneSymbol,
          alternative_symbols: alternativeSymbols
        }
      }
    }
  }
];

describe('<GeneOverview />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const history = createMemoryHistory();
  const router = { ...jest.requireActual('react-router-dom') };

  jest.mock('react-router-dom', () => ({
    router,
    useParams: () => ({
      genomeId,
      geneId
    })
  }));

  it('should render post title', async () => {
    const { container } = render(
      <Router history={history}>
        <MockedProvider mocks={dataMocks} addTypename={false}>
          <GeneOverview />
        </MockedProvider>
      </Router>
    );

    const geneSymbolNode = await findByText(container, geneSymbol);
    const geneNameNode = await findByText(container, geneName);

    expect(geneSymbolNode).toHaveTextContent(geneSymbol);
    expect(geneNameNode).toHaveTextContent(geneName);
  });
});
