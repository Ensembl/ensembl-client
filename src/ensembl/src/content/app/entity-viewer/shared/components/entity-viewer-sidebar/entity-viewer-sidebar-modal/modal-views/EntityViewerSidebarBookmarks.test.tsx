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

import { EntityViewerSidebarBookmarks } from './EntityViewerSidebarBookmarks';

jest.mock('react-router-dom', () => ({
  Link: (props: any) => (
    <a className={'link'} href={props.to}>
      {props.children}
    </a>
  )
}));

const mockStore = configureMockStore();

const exampleObjects = [
  {
    id: 'human-brca2',
    type: 'gene'
  }
];

const previouslyViewedEntities = [
  {
    stable_id: 'human-fry',
    label: 'FRY',
    type: 'gene'
  },
  {
    stable_id: 'human-tp53',
    label: 'TP53',
    type: 'gene'
  }
];

const mockState = {
  genome: {
    genomeInfo: {
      genomeInfoData: {
        human: {
          example_objects: exampleObjects
        }
      }
    }
  },
  entityViewer: {
    general: {
      activeGenomeId: 'human',
      activeEnsObjectIds: {
        human: 'human:gene:braf'
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

  it('shows example links if they are present', () => {
    wrapInRedux();
    const exampleLinksSection = screen.getByTestId('example links');
    const links = exampleLinksSection.querySelectorAll('a');

    expect(links.length).toBe(exampleObjects.length);
  });

  it('shows previously viewed objects if present', () => {
    wrapInRedux();
    const previouslyViewedSection = screen.getByTestId(
      'previously viewed links'
    );
    const links = previouslyViewedSection.querySelectorAll('a');

    expect(links.length).toBe(previouslyViewedEntities.length);
  });
});
