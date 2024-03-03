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
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import set from 'lodash/fp/set';

import createRootReducer from 'src/root/rootReducer';
import { getSortingRule } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSelectors';

import { Status } from 'src/shared/types/status';
import {
  createProteinCodingTranscript,
  createNonCodingTranscript
} from 'tests/fixtures/entity-viewer/transcript';
import TranscriptsFilter from './TranscriptsFilter';

jest.mock(
  'src/content/app/entity-viewer/hooks/useEntityViewerAnalytics',
  () => () => ({
    trackAppliedFilters: jest.fn(),
    trackAppliedSorting: jest.fn()
  })
);

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

const mockToggleFilterPanel = jest.fn();

const wrapInRedux = (
  state: typeof mockState = mockState,
  transcripts = defaultTranscripts
) => {
  const store = configureStore({
    reducer: createRootReducer(),
    preloadedState: state as any
  });

  const renderResult = render(
    <Provider store={store}>
      <TranscriptsFilter
        transcripts={transcripts}
        toggleFilterPanel={mockToggleFilterPanel}
      />
    </Provider>
  );

  return {
    ...renderResult,
    store
  };
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
      'entityViewer.geneView.transcripts.human.human:gene:brca2.sortingRule',
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

  it('correctly changes the sorting order', async () => {
    const { container, store } = wrapInRedux();
    const label = [...container.querySelectorAll('label')].find(
      (el) => el.textContent === 'Combined exon length: longest – shortest'
    );

    expect(getSortingRule(store.getState())).toBe('default');

    await userEvent.click(label as HTMLElement);

    expect(getSortingRule(store.getState())).toBe('spliced_length_desc');
  });
});
