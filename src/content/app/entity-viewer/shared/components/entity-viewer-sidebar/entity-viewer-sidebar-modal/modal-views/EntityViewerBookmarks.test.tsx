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
import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';

import createRootReducer from 'src/root/rootReducer';

import { EntityViewerSidebarBookmarks } from './EntityViewerBookmarks';

const mockGenomeId = 'human'; // to be picked up by jest

jest.mock('react-router-dom', () => ({
  Link: (props: any) => (
    <a className="link" href={props.to}>
      {props.children}
    </a>
  )
}));

jest.mock(
  'src/content/app/entity-viewer/hooks/useEntityViewerAnalytics',
  () => () => ({
    trackPreviouslyViewedObjectClicked: jest.fn()
  })
);

jest.mock(
  'src/content/app/entity-viewer/hooks/useEntityViewerIds',
  () => () => ({
    genomeIdForUrl: mockGenomeId
  })
);

const exampleEntities = [
  {
    id: 'human-brca2',
    type: 'gene'
  }
];

const currentEntityId = `braf`;
const currentEntityLabel = `BRAF`;

const previouslyViewedEntities = [
  {
    entity_id: 'human-fry',
    label: 'FRY',
    type: 'gene'
  },
  {
    entity_id: 'human-tp53',
    label: 'TP53',
    type: 'gene'
  },
  {
    entity_id: currentEntityId,
    label: currentEntityLabel,
    type: 'gene'
  }
];

const mockState = {
  genome: {
    genomeInfo: {
      genomeInfoData: {
        [mockGenomeId]: {
          example_objects: exampleEntities
        }
      }
    }
  },
  entityViewer: {
    general: {
      activeGenomeId: mockGenomeId,
      activeEntityIds: {
        [mockGenomeId]: `${mockGenomeId}:gene:${currentEntityId}`
      }
    },
    bookmarks: {
      previouslyViewed: {
        [mockGenomeId]: previouslyViewedEntities
      }
    }
  }
};

const renderComponent = (state: typeof mockState = mockState) => {
  const store = configureStore({
    reducer: createRootReducer(),
    preloadedState: state as any
  });

  return render(
    <Provider store={store}>
      <EntityViewerSidebarBookmarks />
    </Provider>
  );
};

describe('<EntityViewerSidebarBookmarks />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('shows previously viewed entities if present', () => {
    renderComponent();
    const previouslyViewedSection = screen.getByTestId(
      'previously viewed links'
    );
    const links = previouslyViewedSection.querySelectorAll('a');

    expect(links.length).toBe(previouslyViewedEntities.length);
  });
});
