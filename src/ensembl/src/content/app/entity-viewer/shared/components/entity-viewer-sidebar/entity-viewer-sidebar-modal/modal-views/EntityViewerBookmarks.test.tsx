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
import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { EntityViewerSidebarBookmarks } from './EntityViewerBookmarks';
import set from 'lodash/fp/set';

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
    trackPreviouslyViewedLinkClick: jest.fn()
  })
);

const mockStore = configureMockStore();

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
        human: {
          example_objects: exampleEntities
        }
      }
    }
  },
  entityViewer: {
    general: {
      activeGenomeId: 'human',
      activeEntityIds: {
        human: `human:gene:${currentEntityId}`
      }
    },
    bookmarks: {
      previouslyViewed: {
        human: previouslyViewedEntities
      }
    }
  }
};

const wrapInRedux = (state: typeof mockState = mockState) => {
  return render(
    <Provider store={mockStore(state)}>
      <EntityViewerSidebarBookmarks />
    </Provider>
  );
};

describe('<EntityViewerSidebarBookmarks />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('shows previously viewed entities if present', () => {
    wrapInRedux();
    const previouslyViewedSection = screen.getByTestId(
      'previously viewed links'
    );
    const links = previouslyViewedSection.querySelectorAll('a');

    expect(links.length).toBe(previouslyViewedEntities.length);
  });

  it('does not display any link if there is only one previously viewed entity', () => {
    const { container } = wrapInRedux(
      set(
        'entityViewer.bookmarks.previouslyViewed.human',
        [previouslyViewedEntities[0]],
        mockState
      )
    );

    const links = container.querySelectorAll('a');

    expect(links.length).toBe(0);
  });
});
