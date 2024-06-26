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

import { configureStore } from '@reduxjs/toolkit';
import { faker } from '@faker-js/faker';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';

import createRootReducer from 'src/root/rootReducer';

import {
  TranscriptsListItemInfo,
  TranscriptsListItemInfoProps
} from './TranscriptsListItemInfo';

import { createGene } from 'tests/fixtures/entity-viewer/gene';
import {
  createProteinCodingTranscript,
  createTranscriptMetadata
} from 'tests/fixtures/entity-viewer/transcript';
import { createExternalReference } from 'tests/fixtures/entity-viewer/external-reference';

jest.mock(
  'src/content/app/entity-viewer/gene-view/hooks/useGeneViewIds',
  () => () => ({
    activeGenomeId: 'human',
    genomeIdInUrl: 'grch38',
    entityIdInUrl: 'some_gene'
  })
);

jest.mock('src/shared/components/view-in-app/ViewInApp', () => () => (
  <div data-test-id="viewInApp">ViewInApp</div>
));

jest.mock('src/shared/components/instant-download', () => ({
  InstantDownloadTranscript: () => (
    <div data-test-id="instantDownloadTranscript">
      InstantDownloadTranscript
    </div>
  )
}));

const transcript = createProteinCodingTranscript();
const gene = createGene({ transcripts: [transcript] });
const expandDownload = false;
const expandMoreInfo = false;

const createGencodeBasicTranscript = () => {
  const metadata = createTranscriptMetadata({
    gencode_basic: {
      label: 'gencode basic',
      value: faker.lorem.word(),
      definition: faker.lorem.sentence()
    }
  });

  const transcript = createProteinCodingTranscript({ metadata });
  return transcript;
};

const createMANETranscript = () => {
  const metadata = createTranscriptMetadata({
    mane: {
      label: 'MANE Select',
      value: 'select',
      definition: faker.lorem.sentence(),
      ncbi_transcript: {
        id: faker.lorem.word(),
        url: faker.lorem.sentence()
      }
    }
  });

  const transcript = createProteinCodingTranscript({ metadata });
  return transcript;
};

const createCCDSXrefTranscript = () => {
  const xref = {
    source: {
      name: 'CCDS',
      id: faker.string.uuid(),
      url: faker.internet.url()
    }
  };
  const transcript = createProteinCodingTranscript({
    external_references: [createExternalReference(xref)]
  });
  return transcript;
};

const defaultProps = {
  gene,
  transcript,
  expandDownload,
  expandMoreInfo
};

const mockState = {
  entityViewer: {
    general: {
      activeGenomeId: 'human',
      activeEntityIds: {
        human: 'human:gene:brca2'
      }
    },
    geneView: {
      transcripts: {
        human: {
          'human:gene:brca2': {
            expandedIds: [],
            expandedDownloadIds: [],
            expandedMoreInfoIds: [],
            filters: [],
            sortingRule: 'default'
          }
        }
      }
    }
  },
  speciesSelector: {
    general: {
      committedItems: [
        {
          genome_id: 'human',
          common_name: 'human',
          assembly: {
            name: 'grch38'
          }
        }
      ]
    }
  }
};
const renderComponent = (props?: Partial<TranscriptsListItemInfoProps>) => {
  const store = configureStore({
    reducer: createRootReducer(),
    preloadedState: mockState as any
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <TranscriptsListItemInfo {...defaultProps} {...props} />
      </MemoryRouter>
    </Provider>
  );
};

describe('<TranscriptsListItemInfo />', () => {
  it('displays amino acid length when transcript has a protein product', () => {
    const { queryByTestId } = renderComponent();
    const expectedProteinLength =
      defaultProps.transcript.product_generating_contexts[0].product?.length;
    const currentProteinLength = queryByTestId('proteinLength')
      ?.textContent?.split(/\s/)[0]
      ?.replace(/,/g, '');
    expect(currentProteinLength).toMatch(`${expectedProteinLength}`);
  });

  it('contains the download link', () => {
    const { container } = renderComponent();
    expect(container.querySelector('.downloadLink')).toBeTruthy();
  });

  it('renders ViewInApp component', () => {
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('viewInApp')).toBeTruthy();
  });

  it('hides Download component by default', () => {
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('instantDownloadTranscript')).toBeFalsy();
  });

  it('shows Download component if expandDownload is true', () => {
    const { queryByTestId } = renderComponent({
      expandDownload: true
    });
    expect(queryByTestId('instantDownloadTranscript')).toBeTruthy();
  });

  it('displays metadata when it is available', () => {
    const { queryByText } = renderComponent({
      transcript: createGencodeBasicTranscript(),
      expandMoreInfo: true
    });
    const metadataLabel = queryByText('gencode basic');
    expect(metadataLabel).toBeTruthy();
  });

  it('displays CCDS when it is available in external references', () => {
    const { queryByText } = renderComponent({
      transcript: createCCDSXrefTranscript(),
      expandMoreInfo: true
    });
    const CCDSLabel = queryByText('CCDS');
    expect(CCDSLabel).toBeTruthy();
  });

  it('displays the Refseq with a link', () => {
    const MANETranscript = createMANETranscript();
    const refseqId = MANETranscript.metadata.mane?.ncbi_transcript?.id;
    const refseqUrl = MANETranscript.metadata.mane?.ncbi_transcript?.url;
    const { container, queryByText } = renderComponent({
      transcript: MANETranscript,
      expandMoreInfo: true
    });
    const refseqLabel = queryByText('RefSeq match');
    expect(refseqLabel).toBeTruthy();

    const refseqLink = [...container.querySelectorAll('a')].find(
      (link) => link.textContent === refseqId
    ) as HTMLElement;

    expect(refseqLink.getAttribute('href')).toBe(refseqUrl);
  });
});
