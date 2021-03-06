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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import faker from 'faker';
import times from 'lodash/times';
import set from 'lodash/fp/set';

import { TrackPanelBookmarks } from './TrackPanelBookmarks';

import { DrawerView } from 'src/content/app/browser/drawer/drawerState';
import { PreviouslyViewedObject } from '../../trackPanelState';
import * as trackPanelActions from '../../trackPanelActions';

jest.mock('react-router-dom', () => ({
  Link: (props: any) => (
    <a href={props.to} onClick={props.onClick}>
      {props.children}
    </a>
  )
}));

const genomeId = 'triticum_aestivum_GCA_900519105_1';
const geneId = 'TraesCS3D02G273600';
const versionedStableId = 'TraesCS3D02G273600.1';
const region = '3D:2585940-2634711';
const geneObjectId = `${genomeId}:gene:${geneId}`;
const regionObjectId = `${genomeId}:region:${region}`;

const createRandomPreviouslyViewedObject = (): PreviouslyViewedObject => ({
  genome_id: faker.random.word(),
  object_id: `${faker.random.word()}:gene:${faker.datatype.uuid()}`,
  type: 'gene',
  label: [faker.random.word(), faker.random.word()]
});

const previouslyViewedObjects = [
  {
    genome_id: genomeId,
    object_id: geneObjectId,
    type: 'gene',
    label: [geneId, versionedStableId]
  },
  {
    genome_id: genomeId,
    object_id: regionObjectId,
    type: 'region',
    label: [region]
  }
];

const example_objects = [
  {
    id: geneId,
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
        label: geneId,
        location: {
          chromosome: '3D',
          end: 379539827,
          start: 379535906
        },
        stable_id: geneId,
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
    wrapInRedux();
    const geneLink = screen.getByText(geneId).closest('a') as HTMLElement;
    const regionLink = screen.getByText(region).closest('a') as HTMLElement;

    const expectedGeneHref = `/genome-browser/${genomeId}?focus=gene:${geneId}`;
    const expectedRegionHref = `/genome-browser/${genomeId}?focus=region:${region}`;

    expect(geneLink.getAttribute('href')).toBe(expectedGeneHref);
    expect(regionLink.getAttribute('href')).toBe(expectedRegionHref);
  });

  it('closes the bookmarks modal when a bookmark link is clicked', () => {
    jest.spyOn(trackPanelActions, 'closeTrackPanelModal');
    const { container } = wrapInRedux();
    const firstLink = container.querySelector('a');

    userEvent.click(firstLink as HTMLElement);

    expect(trackPanelActions.closeTrackPanelModal).toHaveBeenCalled();

    (trackPanelActions.closeTrackPanelModal as any).mockRestore();
  });

  it('shows link to view more only when there are more than 20 objects', () => {
    let wrapper = wrapInRedux(
      set(
        `browser.trackPanel.${genomeId}.previouslyViewedObjects`,
        times(20, () => createRandomPreviouslyViewedObject()),
        mockState
      )
    );

    expect(
      wrapper.container.querySelector('.trackPanelBookmarks .more')
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
      wrapper.container.querySelector('.trackPanelBookmarks .more')
    ).toBeTruthy();
  });

  it('changes drawer view and toggles drawer when the "more" link is clicked', () => {
    const { container } = wrapInRedux(
      set(
        `browser.trackPanel.${genomeId}.previouslyViewedObjects`,
        times(21, () => createRandomPreviouslyViewedObject()),
        mockState
      )
    );

    const moreLink = container.querySelector(
      '.trackPanelBookmarks .more span'
    ) as HTMLElement;

    userEvent.click(moreLink);

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
});
