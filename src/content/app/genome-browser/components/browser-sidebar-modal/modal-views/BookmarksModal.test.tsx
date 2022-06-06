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
import { faker } from '@faker-js/faker';
import times from 'lodash/times';
import set from 'lodash/fp/set';
import merge from 'lodash/fp/merge';

import { changeDrawerViewForGenome } from 'src/content/app/genome-browser/state/drawer/drawerSlice';

import { createMockBrowserState } from 'tests/fixtures/browser';

import { BookmarksModal } from './BookmarksModal';

import { PreviouslyViewedObject } from 'src/content/app/genome-browser/state/browser-bookmarks/browserBookmarksSlice';
import { BrowserSidebarModalView } from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';

jest.mock('react-router-dom', () => ({
  Link: (props: any) => (
    <a href={props.to} onClick={props.onClick}>
      {props.children}
    </a>
  )
}));

const createRandomPreviouslyViewedObject = (): PreviouslyViewedObject => ({
  genome_id: faker.random.word(),
  object_id: `${faker.random.word()}:gene:${faker.datatype.uuid()}`,
  type: 'gene',
  label: [faker.random.word(), faker.random.word()]
});

const mockState = createMockBrowserState();
const mockStore = configureMockStore([thunk]);
let store: ReturnType<typeof mockStore>;

const { activeGenomeId } = mockState.browser.browserGeneral;

const renderComponent = (state: typeof mockState = mockState) => {
  store = mockStore(state);

  return render(
    <Provider store={store}>
      <BookmarksModal />
    </Provider>
  );
};

describe.skip('<BookmarksModal />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders previously viewed links', () => {
    const geneId = 'TraesCS3D02G273600';
    const region = '3D:2585940-2634711';
    const geneObjectId = `${activeGenomeId}:gene:${geneId}`;
    const regionObjectId = `${activeGenomeId}:region:${region}`;
    const nonRandomPreviouslyViewedObjects = [
      {
        genome_id: activeGenomeId,
        object_id: geneObjectId,
        type: 'gene',
        label: [geneId, faker.random.word()]
      },
      {
        genome_id: activeGenomeId,
        object_id: regionObjectId,
        type: 'region',
        label: [region]
      }
    ];
    const newMockState = merge(mockState, {
      browser: {
        browserBookmarks: {
          previouslyViewedObjects: {
            [activeGenomeId]: nonRandomPreviouslyViewedObjects
          }
        }
      }
    });

    renderComponent(newMockState);

    const geneLink = screen.getByText(geneId).closest('a') as HTMLElement;
    const regionLink = screen.getByText(region).closest('a') as HTMLElement;

    const expectedGeneHref = `/genome-browser/${activeGenomeId}?focus=gene:${geneId}`;
    const expectedRegionHref = `/genome-browser/${activeGenomeId}?focus=region:${region}`;

    expect(geneLink.getAttribute('href')).toBe(expectedGeneHref);
    expect(regionLink.getAttribute('href')).toBe(expectedRegionHref);
  });

  it('shows link to view more only when there are more than 20 objects', () => {
    const newMockState = merge(mockState, {
      browser: {
        browserSidebarModal: {
          [activeGenomeId]: {
            browserSidebarModalView: BrowserSidebarModalView.BOOKMARKS
          }
        },
        browserBookmarks: {
          previouslyViewedObjects: {
            [activeGenomeId]: times(20, () =>
              createRandomPreviouslyViewedObject()
            )
          }
        }
      }
    });
    let wrapper = renderComponent(newMockState);

    expect(
      wrapper.container.querySelector('.bookmarksModal .more')
    ).toBeFalsy();

    // Add 21 links to see if ellipsis is shown
    wrapper = renderComponent(
      set(
        `browser.browserBookmarks.previouslyViewedObjects.${activeGenomeId}`,
        times(21, () => createRandomPreviouslyViewedObject()),
        newMockState
      )
    );

    expect(
      wrapper.container.querySelector('.bookmarksModal .more')
    ).toBeTruthy();
  });

  it('changes drawer view and toggles drawer when the "more" link is clicked', async () => {
    const { container } = renderComponent(
      set(
        `browser.browserBookmarks.previouslyViewedObjects.${activeGenomeId}`,
        times(21, () => createRandomPreviouslyViewedObject()),
        mockState
      )
    );

    const moreLink = container.querySelector(
      '.bookmarksModal .more span'
    ) as HTMLElement;

    await userEvent.click(moreLink);

    const dispatchedDrawerActions = store.getActions();

    const updateDrawerViewAction = dispatchedDrawerActions.find(
      (action) => action.type === changeDrawerViewForGenome.toString()
    );

    expect(updateDrawerViewAction.payload).toEqual({
      genomeId: activeGenomeId,
      drawerView: { name: 'bookmarks' }
    });
  });
});
