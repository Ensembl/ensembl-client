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
import configureMockStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import set from 'lodash/fp/set';

import { Status } from 'src/shared/types/status';
import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';
import TranscriptsFilter from './TranscriptsFilter';

const mockState = {
  entityViewer: {
    general: {
      activeGenomeId: 'human',
      activeEntityIds: {
        human: 'gene:brca2'
      }
    },
    geneView: {
      transcripts: {
        human: {
          'gene:brca2': {
            expandedIds: [],
            expandedDownloadIds: [],
            filters: [],
            sortingRule: 'default'
          }
        }
      }
    },
    sidebar: {
      human: {
        status: Status.OPEN
      }
    }
  }
};

const mockStore = configureMockStore([thunk]);

const createProteinCodingTranscript = () => createTranscript();
const createNonCodingTranscript = () => {
  const transcript = createTranscript();
  transcript.product_generating_contexts = [];
  return transcript;
};

const proteinCodingTranscript1 = createProteinCodingTranscript();
const proteinCodingTranscript2 = createProteinCodingTranscript();
const nonCodingTranscript1 = createNonCodingTranscript();
const nonCodingTranscript2 = createNonCodingTranscript();

const defaultTranscripts = [
  proteinCodingTranscript1,
  proteinCodingTranscript2,
  nonCodingTranscript1,
  nonCodingTranscript2
];

const mockToggleFilter = jest.fn();
let store: ReturnType<typeof mockStore>;

const wrapInRedux = (
  state: typeof mockState = mockState,
  transcripts = defaultTranscripts
) => {
  store = mockStore(state);
  return render(
    <Provider store={store}>
      <TranscriptsFilter
        transcripts={transcripts}
        toggleFilter={mockToggleFilter}
        genomeId={'mock_genome_id'}
        entityId={'mock_entity_id'}
      />
    </Provider>
  );
};

describe('<TranscriptsFilter />', () => {
  it('shows correct sorting option as selected', () => {
    // default sorting option
    let { container } = wrapInRedux();
    const defaultSortingLabel = [...container.querySelectorAll('label')].find(
      (el) => el.textContent === 'Default'
    );
    const defaultSortingRadioButton =
      defaultSortingLabel?.querySelector('input');
    expect(defaultSortingRadioButton?.checked).toBe(true);

    // after we change sorting option
    const updatedState = set(
      'entityViewer.geneView.transcripts.human.gene:brca2.sortingRule',
      'spliced_length_desc',
      mockState
    );
    container = wrapInRedux(updatedState).container;

    const secondSortingLabel = [...container.querySelectorAll('label')].find(
      (el) => el.textContent === 'Combined exon length: longest – shortest'
    );
    const secondSortingRadioButton = secondSortingLabel?.querySelector('input');

    expect(secondSortingRadioButton?.checked).toBe(true);
  });

  it('correctly changes the sorting order', () => {
    const { container } = wrapInRedux();
    const label = [...container.querySelectorAll('label')].find(
      (el) => el.textContent === 'Combined exon length: longest – shortest'
    );

    userEvent.click(label as HTMLElement);

    const sortingActions = store
      .getActions()
      .filter(
        (action) =>
          action.type ===
          'entity-viewer-gene-view-transcripts/updateSortingRule'
      );

    expect(sortingActions.length).toBe(1);
    expect(sortingActions[0].payload.sortingRule).toBe('spliced_length_desc');
  });
});
