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

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import createRootReducer from 'src/root/rootReducer';
import { getExpandedTranscriptIds } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSelectors';

import {
  DefaultTranscriptListItem,
  DefaultTranscriptListItemProps
} from './DefaultTranscriptListItem';

import { createProteinCodingTranscript } from 'tests/fixtures/entity-viewer/transcript';
import {
  createGene,
  createRulerTicks
} from 'tests/fixtures/entity-viewer/gene';

vi.mock('../transcripts-list-item-info/TranscriptsListItemInfo', () => ({
  default: () => (
    <div data-test-id="transcriptsListItemInfo">TranscriptsListItemInfo</div>
  )
}));

vi.mock(
  'src/content/app/entity-viewer/gene-view/components/unspliced-transcript/UnsplicedTranscript',
  () => ({
    default: () => (
      <div data-test-id="unsplicedTranscript">UnsplicedTranscript</div>
    )
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

const defaultProps = {
  transcriptPosition: 1,
  gene: createGene(),
  transcript: createProteinCodingTranscript(),
  rulerTicks: createRulerTicks(),
  expandTranscript: false,
  expandDownload: false,
  expandMoreInfo: false
};

const renderComponent = (props?: Partial<DefaultTranscriptListItemProps>) => {
  const store = configureStore({
    reducer: createRootReducer(),
    preloadedState: mockState as any
  });

  const renderResult = render(
    <Provider store={store}>
      <DefaultTranscriptListItem {...defaultProps} {...props} />
    </Provider>
  );

  return {
    ...renderResult,
    store
  };
};

describe('<DefaultTranscriptListItem />', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('displays unspliced transcript', () => {
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('unsplicedTranscript')).toBeTruthy();
  });

  it('toggles transcript item info onClick', async () => {
    const { container, store } = renderComponent();
    const clickableArea = container.querySelector(
      '.clickableTranscriptArea'
    ) as HTMLElement;
    const transcriptLabel = container.querySelector('.right') as HTMLElement;

    const transcriptId = defaultProps.transcript.stable_id;
    let expandedTranscriptIds: string[];

    expandedTranscriptIds = getExpandedTranscriptIds(store.getState());
    expect(expandedTranscriptIds).toEqual([]);

    await userEvent.click(clickableArea);

    expandedTranscriptIds = getExpandedTranscriptIds(store.getState());
    expect(expandedTranscriptIds).toEqual([transcriptId]);

    await userEvent.click(transcriptLabel);

    expandedTranscriptIds = getExpandedTranscriptIds(store.getState());
    expect(expandedTranscriptIds).toEqual([]);
  });

  it('hides transcript info by default', () => {
    const { queryByTestId } = renderComponent();

    expect(queryByTestId('transcriptsListItemInfo')).toBeFalsy();
  });

  it('displays transcript info if expandTranscript is true', () => {
    const { queryByTestId } = renderComponent({ expandTranscript: true });

    expect(queryByTestId('transcriptsListItemInfo')).toBeTruthy();
  });
});
