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
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';

import { getReverseComplement } from 'src/shared/helpers/sequenceHelpers';

import createRootReducer from 'src/root/rootReducer';
import restApiSlice from 'src/shared/state/api-slices/restSlice';

import {
  createProteinCodingTranscript,
  createNonCodingTranscript
} from 'tests/fixtures/entity-viewer/transcript';

import TranscriptSequenceView, { type Props } from './TranscriptSequenceView';

vi.mock('config', () => ({
  default: {
    refgetBaseUrl: 'http://refget-api' // need to provide absolute urls to the fetch running in Node
  }
}));
vi.mock(
  'src/shared/components/blast-sequence-button/BlastSequenceButton',
  () => ({
    default: () => <button className="blast-sequence-button" />
  })
);

vi.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics',
  () => ({
    default: () => ({
      trackDrawerSequenceViewed: vi.fn()
    })
  })
);

const renderTranscriptSequenceView = (props: Props) => {
  const genomeId = 'human';
  const initialState = {
    browser: {
      browserGeneral: {
        activeGenomeId: genomeId
      },
      drawer: {
        sequence: {
          [genomeId]: {
            isVisible: true,
            features: {}
          }
        }
      }
    }
  };

  const store = configureStore({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([restApiSlice.middleware]),
    preloadedState: initialState as any
  });

  const renderResult = render(
    <Provider store={store}>
      <TranscriptSequenceView {...props} />
    </Provider>
  );

  return {
    ...renderResult,
    store
  };
};

const mockGenomicSequence = 'ACTGACTGACTG';
const mockCDNASequence = 'CTGACTGA';
const mockCDSSequence = 'TGACTG';
const mockProteinSequence = 'QS';

const proteinCodingTranscript = createProteinCodingTranscript();
const nonCodingTranscript = createNonCodingTranscript();

const server = setupServer(
  http.get('http://refget-api/sequence/:checksum', ({ params }) => {
    const checksum = params.checksum as string;
    if (
      [
        proteinCodingTranscript.slice.region.sequence.checksum,
        nonCodingTranscript.slice.region.sequence.checksum
      ].includes(checksum)
    ) {
      return HttpResponse.text(mockGenomicSequence);
    } else if (
      [
        proteinCodingTranscript.product_generating_contexts[0].cdna.sequence
          .checksum,
        nonCodingTranscript.product_generating_contexts[0].cdna.sequence
          .checksum
      ].includes(checksum)
    ) {
      return HttpResponse.text(mockCDNASequence);
    } else if (
      [
        proteinCodingTranscript.product_generating_contexts[0].cds.sequence
          .checksum
      ].includes(checksum)
    ) {
      return HttpResponse.text(mockCDSSequence);
    } else if (
      [
        proteinCodingTranscript.product_generating_contexts[0].product.sequence
          .checksum
      ].includes(checksum)
    ) {
      return HttpResponse.text(mockProteinSequence);
    }
  })
);

beforeAll(() =>
  server.listen({
    onUnhandledRequest(req) {
      const errorMessage = `Found an unhandled ${req.method} request to ${req.url}`;
      throw new Error(errorMessage);
    }
  })
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<TranscriptSequenceView />', () => {
  describe('sequence options', () => {
    it('displays correct list of sequence options for a protein-coding transcript', () => {
      const { container } = renderTranscriptSequenceView({
        transcript: proteinCodingTranscript
      });

      const renderedLabels = [
        ...container.querySelectorAll('.radioGroup .label')
      ].map((el) => el.innerHTML);
      expect(renderedLabels).toEqual([
        'Genomic sequence',
        'cDNA',
        'CDS',
        'Protein sequence'
      ]);
    });

    it('displays correct list of sequence options for a non-coding transcript', () => {
      const { container } = renderTranscriptSequenceView({
        transcript: nonCodingTranscript
      });

      const renderedLabels = [
        ...container.querySelectorAll('.radioGroup .label')
      ].map((el) => el.innerHTML);
      expect(renderedLabels).toEqual(['Genomic sequence', 'cDNA']);
    });
  });

  describe('sequence fetching', () => {
    it('fetches different sequences', async () => {
      const { container, getByLabelText } = renderTranscriptSequenceView({
        transcript: proteinCodingTranscript
      });

      await waitFor(() => {
        const sequenceContainer = container.querySelector('.sequence');
        expect(sequenceContainer?.textContent).toBe(mockGenomicSequence);
      });

      const cdsSequenceLabel = getByLabelText('CDS');

      await userEvent.click(cdsSequenceLabel);

      await waitFor(() => {
        const sequenceContainer = container.querySelector('.sequence');
        expect(sequenceContainer?.textContent).toBe(mockCDSSequence);
      });
    });
  });

  describe('reverse complement', () => {
    it('only shows the reverse complement checkbox for the genomic sequence', async () => {
      const { getByLabelText, queryByLabelText } = renderTranscriptSequenceView(
        {
          transcript: proteinCodingTranscript
        }
      );

      const reverseComplementLabel = queryByLabelText('Reverse complement');

      expect(reverseComplementLabel).not.toBe(null);

      const otherLabels = ['cDNA', 'CDS', 'Protein sequence'];

      for (const labelText of otherLabels) {
        const label = getByLabelText(labelText);
        await userEvent.click(label);
        const reverseComplementLabel = queryByLabelText('Reverse complement');
        expect(reverseComplementLabel).toBe(null);
      }
    });

    it('produces a reverse complement of the sequence', async () => {
      const { container, getByLabelText } = renderTranscriptSequenceView({
        transcript: proteinCodingTranscript
      });

      await waitFor(() => {
        const sequenceContainer = container.querySelector('.sequence');
        expect(sequenceContainer?.textContent).toBe(mockGenomicSequence);
      });

      await userEvent.click(getByLabelText('Reverse complement'));

      await waitFor(() => {
        const sequenceContainer = container.querySelector('.sequence');
        expect(sequenceContainer?.textContent).toBe(
          getReverseComplement(mockGenomicSequence)
        );
      });
    });
  });
});
