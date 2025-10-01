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

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';
import times from 'lodash/times';
import set from 'lodash/fp/set';
import merge from 'lodash/fp/merge';

import createRootReducer from 'src/root/rootReducer';
import { getActiveDrawerView } from 'src/content/app/genome-browser/state/drawer/drawerSelectors';

import { createMockBrowserState } from 'tests/fixtures/browser';
import MockGenomeBrowser from 'tests/mocks/mockGenomeBrowser';

import { BookmarksModal } from './BookmarksModal';

import { PreviouslyViewedObject } from 'src/content/app/genome-browser/state/browser-bookmarks/browserBookmarksSlice';
import { BrowserSidebarModalView } from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';

const mockGenomeBrowser = vi.fn(() => new MockGenomeBrowser() as any);

const mockGenomeId = 'grch38';

vi.mock('react-router-dom', () => ({
  Link: (props: any) => (
    <a href={props.to} onClick={props.onClick}>
      {props.children}
    </a>
  )
}));

vi.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowserIds',
  () => () => ({
    genomeIdForUrl: mockGenomeId
  })
);

vi.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowser',
  () => () => mockGenomeBrowser
);

vi.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics',
  () => () => ({
    trackPreviouslyViewedObjectClicked: vi.fn(),
    trackBookmarksDrawerOpened: vi.fn()
  })
);

const createRandomPreviouslyViewedObject = (): PreviouslyViewedObject => ({
  genome_id: faker.lorem.word(),
  object_id: `${faker.lorem.word()}:gene:${faker.string.uuid()}`,
  type: 'gene',
  label: [faker.lorem.word(), faker.lorem.word()]
});

const mockState = createMockBrowserState();

const { activeGenomeId } = mockState.browser.browserGeneral;

const renderComponent = (state: typeof mockState = mockState) => {
  const store = configureStore({
    reducer: createRootReducer(),
    preloadedState: state as any
  });

  const renderResult = render(
    <Provider store={store}>
      <BookmarksModal />
    </Provider>
  );

  return {
    ...renderResult,
    store
  };
};

describe('<BookmarksModal />', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders previously viewed links', () => {
    const geneId = 'TraesCS3D02G273600';
    const location = '3D:2585940-2634711';
    const geneObjectId = `${activeGenomeId}:gene:${geneId}`;
    const locationObjectId = `${activeGenomeId}:location:${location}`;
    const previouslyViewedObjects = [
      {
        genome_id: activeGenomeId,
        object_id: geneObjectId,
        type: 'gene',
        label: [geneId, faker.lorem.word()]
      },
      {
        genome_id: activeGenomeId,
        object_id: locationObjectId,
        type: 'location',
        label: [location]
      }
    ];
    const newMockState = merge(mockState, {
      browser: {
        browserBookmarks: {
          previouslyViewedObjects: {
            [activeGenomeId]: previouslyViewedObjects
          }
        }
      }
    });

    renderComponent(newMockState);

    const geneLink = screen.getByText(geneId).closest('a') as HTMLElement;
    const locationLink = screen.getByText(location).closest('a') as HTMLElement;

    const expectedGeneHref = `/genome-browser/${mockGenomeId}?focus=gene:${geneId}`;
    const expectedLocationHref = `/genome-browser/${mockGenomeId}?focus=location:${location}`;

    expect(geneLink.getAttribute('href')).toBe(expectedGeneHref);
    expect(locationLink.getAttribute('href')).toBe(expectedLocationHref);
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
    const { container, store } = renderComponent(
      set(
        `browser.browserBookmarks.previouslyViewedObjects.${activeGenomeId}`,
        times(21, () => createRandomPreviouslyViewedObject()),
        mockState
      )
    );

    const moreLink = container.querySelector(
      '.bookmarksModal .more span'
    ) as HTMLElement;

    expect(getActiveDrawerView(store.getState())).toBe(null); // drawer should be closed

    await userEvent.click(moreLink);

    expect(getActiveDrawerView(store.getState())?.name).toBe('bookmarks'); // drawer should show bookmarks
  });
});
