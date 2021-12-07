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
import configureMockStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import userEvent from '@testing-library/user-event';
import set from 'lodash/fp/set';

import { TrackPanelBar } from './TrackPanelBar';

import * as drawerActions from 'src/content/app/genome-browser/state/drawer/drawerSlice';
import * as trackPanelActions from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';

jest.mock(
  'src/shared/components/image-button/ImageButton',
  () => (props: { description: string; onClick: () => void }) =>
    <button onClick={props.onClick}>{props.description}</button>
);

const fakeGenomeId = 'human';

const mockState = {
  browser: {
    drawer: {
      [fakeGenomeId]: {
        isDrawerOpened: false,
        drawerView: { name: 'bookmarks' }
      }
    },
    browserEntity: {
      activeGenomeId: fakeGenomeId
    },
    trackPanel: {
      [fakeGenomeId]: {
        isTrackPanelOpened: true,
        trackPanelModalView: 'bookmarks'
      }
    }
  }
};

const mockStore = configureMockStore([thunk]);
let store: ReturnType<typeof mockStore>;

const renderComponent = (state: typeof mockState = mockState) => {
  store = mockStore(state);
  return render(
    <Provider store={store}>
      <TrackPanelBar />
    </Provider>
  );
};

describe('<TrackPanelBar />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('displays correct number of buttons', () => {
      const { container } = renderComponent();
      expect(container.querySelectorAll('button').length).toBe(6);
    });

    it('passes correct data to callbacks when buttons are clicked', () => {
      const { container } = renderComponent(
        set(
          `browser.trackPanel.${fakeGenomeId}.trackPanelModalView`,
          '',
          mockState
        )
      );
      const bookmarksButton = [...container.querySelectorAll('button')].find(
        (button) => button.innerHTML === 'Previously viewed'
      ) as HTMLButtonElement;

      userEvent.click(bookmarksButton);

      const toggleTrackPanelAction = store
        .getActions()
        .find(
          (action) =>
            action.type === trackPanelActions.updateTrackPanelForGenome.type
        );

      const expectedPayload = {
        activeGenomeId: fakeGenomeId,
        data: {
          ...mockState.browser.trackPanel[fakeGenomeId],
          trackPanelModalView: 'bookmarks',
          isTrackPanelModalOpened: true
        }
      };

      expect(toggleTrackPanelAction.payload).toEqual(expectedPayload);
    });

    it('opens the track panel if it is closed when a button is clicked', () => {
      const { container } = renderComponent(
        set(
          `browser.trackPanel.${fakeGenomeId}.isTrackPanelOpened`,
          false,
          mockState
        )
      );
      const bookmarksButton = [...container.querySelectorAll('button')].find(
        (button) => button.innerHTML === 'Previously viewed'
      ) as HTMLButtonElement;

      userEvent.click(bookmarksButton);
      const toggleTrackPanelAction = store
        .getActions()
        .find(
          (action) =>
            action.type === trackPanelActions.updateTrackPanelForGenome.type
        );

      const expectedPayload = {
        activeGenomeId: fakeGenomeId,
        data: {
          ...mockState.browser.trackPanel[fakeGenomeId],
          isTrackPanelOpened: true
        }
      };

      expect(toggleTrackPanelAction.payload).toEqual(expectedPayload);
    });

    it('causes track panel modal to close if a pressed button is clicked again', () => {
      const { container } = renderComponent();
      const bookmarksButton = [...container.querySelectorAll('button')].find(
        (button) => button.innerHTML === 'Previously viewed'
      ) as HTMLButtonElement;

      userEvent.click(bookmarksButton);

      const toggleTrackPanelAction = store
        .getActions()
        .find(
          (action) =>
            action.type === trackPanelActions.updateTrackPanelForGenome.type
        );

      const expectedPayload = {
        activeGenomeId: fakeGenomeId,
        data: {
          ...mockState.browser.trackPanel[fakeGenomeId],
          isTrackPanelModalOpened: false,
          isTrackPanelOpened: true,
          trackPanelModalView: ''
        }
      };

      expect(toggleTrackPanelAction.payload).toEqual(expectedPayload);
    });

    it('closes drawer view when the modal view changes', () => {
      jest.spyOn(drawerActions, 'closeDrawer');
      const { container } = renderComponent(
        set(`browser.drawer.${fakeGenomeId}.isDrawerOpened`, true, mockState)
      );
      const bookmarksButton = [...container.querySelectorAll('button')].find(
        (button) => button.innerHTML === 'Previously viewed'
      ) as HTMLButtonElement;

      userEvent.click(bookmarksButton);

      expect(drawerActions.closeDrawer).toHaveBeenCalled();
    });
  });
});
