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
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import thunk from 'redux-thunk';
import userEvent from '@testing-library/user-event';

import {
  DefaultTranscriptListItem,
  DefaultTranscriptListItemProps
} from './DefaultTranscriptListItem';

import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';
import {
  createGene,
  createRulerTicks
} from 'tests/fixtures/entity-viewer/gene';
import { updateExpandedTranscripts } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';

jest.mock('../transcripts-list-item-info/TranscriptsListItemInfo', () => () => (
  <div data-test-id="transcriptsListItemInfo">TranscriptsListItemInfo</div>
));

jest.mock(
  'src/content/app/entity-viewer/gene-view/components/unspliced-transcript/UnsplicedTranscript',
  () => () => <div data-test-id="unsplicedTranscript">UnsplicedTranscript</div>
);

const mockStore = configureMockStore([thunk]);

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
    }
  }
};

describe('<DefaultTranscriptListItem />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps = {
    gene: createGene(),
    transcript: createTranscript(),
    rulerTicks: createRulerTicks(),
    expandTranscript: false,
    expandDownload: false,
    expandMoreInfo: false
  };

  let store: ReturnType<typeof mockStore>;

  const renderComponent = (props?: Partial<DefaultTranscriptListItemProps>) => {
    store = mockStore(mockState);
    return render(
      <Provider store={store}>
        <DefaultTranscriptListItem {...defaultProps} {...props} />
      </Provider>
    );
  };

  it('displays unspliced transcript', () => {
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('unsplicedTranscript')).toBeTruthy();
  });

  it('toggles transcript item info onClick', () => {
    const { container } = renderComponent();
    const clickableArea = container.querySelector(
      '.clickableTranscriptArea'
    ) as HTMLElement;
    const transcriptLabel = container.querySelector('.right') as HTMLElement;

    userEvent.click(clickableArea);

    expect(
      store
        .getActions()
        .filter((action) => action.type === updateExpandedTranscripts.type)
    ).toHaveLength(1);

    userEvent.click(transcriptLabel);
    expect(
      store
        .getActions()
        .filter((action) => action.type === updateExpandedTranscripts.type)
    ).toHaveLength(2);
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
