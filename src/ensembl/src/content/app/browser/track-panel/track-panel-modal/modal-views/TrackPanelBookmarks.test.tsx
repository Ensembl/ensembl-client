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
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import faker from 'faker';
import times from 'lodash/times';
import set from 'lodash/fp/set';

import { TrackPanelBookmarks } from './TrackPanelBookmarks';

import { DrawerView } from 'src/content/app/browser/drawer/drawerState';
import { PreviouslyViewedObject } from '../../trackPanelState';

jest.mock('react-router-dom', () => ({
  Link: (props: any) => (
    <a href={props.to} onClick={props.onClick}>
      {props.children}
    </a>
  )
}));

const genomeId = 'triticum_aestivum_GCA_900519105_1';
const geneSymbol = 'TraesCS3D02G273600';
const region = '3D:2585940-2634711';
const geneObjectId = `${genomeId}:gene:${geneSymbol}`;
const regionObjectId = `${genomeId}:region:${region}`;

const createRandomPreviouslyViewedObject = (): PreviouslyViewedObject => ({
  genome_id: faker.random.word(),
  object_id: `${faker.random.word()}:gene:${faker.random.uuid()}`,
  object_type: 'gene',
  label: faker.random.word()
});

const previouslyViewedObjects = [
  {
    genome_id: genomeId,
    object_id: geneObjectId,
    object_type: 'gene',
    label: geneSymbol
  },
  {
    genome_id: genomeId,
    object_id: regionObjectId,
    object_type: 'region',
    label: region
  }
];

const example_objects = [
  {
    id: geneSymbol,
    type: 'gene'
  },
  {
    id: region,
    type: 'region'
  }
];

const mockState = {
  browser: {
    browserEntity: {
      activeGenomeId: genomeId,
      activeEnsObjectIds: {
        [genomeId]: geneObjectId
      }
    },
    trackPanel: {
      [genomeId]: {
        isTrackPanelModalOpened: true,
        trackPanelModalView: '',
        previouslyViewedObjects
      }
    }
  },
  drawer: {
    isDrawerOpened: { [genomeId]: false },
    drawerView: { [genomeId]: DrawerView.BOOKMARKS },
    activeDrawerTrackIds: {}
  },
  ensObjects: {
    [geneObjectId]: {
      data: {
        description: 'Heat shock protein 101',
        genome_id: genomeId,
        label: geneSymbol,
        location: {
          chromosome: '3D',
          end: 379539827,
          start: 379535906
        },
        stable_id: geneSymbol,
        type: 'gene',
        object_id: geneObjectId
      }
    },
    [regionObjectId]: {
      data: {
        genome_id: genomeId,
        label: region,
        location: {
          chromosome: '3D',
          start: 2585940,
          end: 2634711
        },
        type: 'region',
        object_id: regionObjectId
      }
    }
  },
  genome: {
    genomeInfo: {
      genomeInfoData: {
        [genomeId]: {
          example_objects,
          genome_id: genomeId
        }
      }
    }
  },
  speciesPage: {
    general: {
      activeGenomeId: null
    }
  }
};

const mockStore = configureMockStore([thunk]);
let store: ReturnType<typeof mockStore>;

const wrapInRedux = (state: typeof mockState = mockState) => {
  store = mockStore(state);

  return render(
    <Provider store={store}>
      <TrackPanelBookmarks />
    </Provider>
  );
};

describe('<TrackPanelBookmarks />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders previously viewed links', () => {
    const { container } = wrapInRedux();
    const links = [...container.querySelectorAll('a')] as HTMLElement[];
    const linkTexts = previouslyViewedObjects.map(({ label }) => label);

    expect(
      linkTexts.every((text) =>
        links.find((link) => {
          return link.innerHTML === text;
        })
      )
    ).toBe(true);
  });

  it('closes the bookmarks modal when a bookmark link is clicked', () => {
    const { container } = wrapInRedux();
    const firstLink = container.querySelector('a');

    userEvent.click(firstLink as HTMLElement);

    const trackPanelActions = store.getActions();

    // This is the closest you get to see if closeTrackPanelModalAction has been dispatched as getType doesn't work with thunks
    // This approach is used for the other test cases as well in this file
    const closeTrackPanelModalAction = trackPanelActions.find(
      (action) => action.type === 'track-panel/update-track-panel'
    );

    expect(closeTrackPanelModalAction).toBeTruthy();
  });

  it('shows the ellipsis only when there are more than 20 objects', () => {
    let wrapper = wrapInRedux(
      set(
        `browser.trackPanel.${genomeId}.previouslyViewedObjects`,
        times(20, () => createRandomPreviouslyViewedObject()),
        mockState
      )
    );
    expect(
      wrapper.container.querySelector(
        '.trackPanelBookmarks .sectionTitle button'
      )
    ).toBeFalsy();

    // Add 21 links to see if ellipsis is shown
    wrapper = wrapInRedux(
      set(
        `browser.trackPanel.${genomeId}.previouslyViewedObjects`,
        times(21, () => createRandomPreviouslyViewedObject()),
        mockState
      )
    );

    expect(
      wrapper.container.querySelector(
        '.trackPanelBookmarks .sectionTitle button'
      )
    ).toBeTruthy();
  });

  it('changes drawer view and toggles drawer when the ellipsis is clicked', () => {
    const { container } = wrapInRedux(
      set(
        `browser.trackPanel.${genomeId}.previouslyViewedObjects`,
        times(21, () => createRandomPreviouslyViewedObject()),
        mockState
      )
    );

    const ellipsisButton = container.querySelector(
      '.trackPanelBookmarks .sectionTitle button'
    ) as HTMLElement;

    userEvent.click(ellipsisButton);

    const dispatchedDrawerActions = store.getActions();

    const updateDrawerViewAction = dispatchedDrawerActions.find(
      (action) => action.type === 'drawer/update-drawer-view'
    );
    const toggleDrawerAction = dispatchedDrawerActions.find(
      (action) => action.type === 'drawer/toggle-drawer'
    );

    expect(updateDrawerViewAction.payload[genomeId]).toEqual(
      DrawerView.BOOKMARKS
    );
    expect(toggleDrawerAction.payload[genomeId]).toEqual(true);
  });

  it('renders correct number of links to example objects', () => {
    const { container } = wrapInRedux();

    expect(container.querySelectorAll('.exampleLinks a').length).toBe(
      example_objects.length
    );
  });

  it('calls closeTrackPanelModal when an example object link is clicked', () => {
    const { container } = wrapInRedux();
    const exampleLink = container.querySelector('.exampleLinks a');

    userEvent.click(exampleLink as HTMLElement);

    const dispatchedTrackPanelActions = store.getActions();
    const closeTrackPanelModalAction = dispatchedTrackPanelActions.find(
      (action) => action.type === 'track-panel/update-track-panel'
    );

    expect(closeTrackPanelModalAction).toBeTruthy();
  });
});
