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
import userEvent from '@testing-library/user-event';
import faker from 'faker';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import set from 'lodash/fp/set';

import {
  TrackPanelListItem,
  TrackPanelListItemProps
} from './TrackPanelListItem';

import { createMainTrackInfo } from 'tests/fixtures/track-panel';
import { Status } from 'src/shared/types/status';
import { DrawerView } from 'src/content/app/browser/drawer/drawerState';

import * as drawerActions from '../../drawer/drawerActions';
import * as browserActions from 'src/content/app/browser/browserActions';
import * as trackPanelActions from 'src/content/app/browser/track-panel/trackPanelActions';
import { isTrackCollapsed } from 'src/content/app/browser/track-panel/trackPanelSelectors';

jest.mock('../../drawer/drawerActions');

jest.mock('src/content/app/browser/browserActions');

jest.mock('src/content/app/browser/track-panel/trackPanelActions');

const fakeGenomeId = faker.lorem.words();

const mockState = {
  drawer: {
    isDrawerOpened: { [fakeGenomeId]: true },
    drawerView: { [fakeGenomeId]: DrawerView.BOOKMARKS },
    activeDrawerTrackIds: {}
  },
  browser: {
    browserEntity: {
      activeGenomeId: fakeGenomeId,
      activeEnsObjectIds: {
        [fakeGenomeId]: faker.lorem.words()
      }
    },
    trackPanel: {
      [fakeGenomeId]: {
        highlightedTrackId: faker.lorem.words(),
        collapsedTrackIds: []
      }
    }
  }
};

jest.mock('react-redux', () => {
  const originalModule = jest.requireActual('react-redux');
  return {
    ...originalModule,
    useDispatch: () => jest.fn(),
    useSelector: (selector: any) => {
      return selector(mockState);
    }
  };
});

const mockStore = configureMockStore([thunk]);

const defaultProps: TrackPanelListItemProps = {
  categoryName: faker.lorem.words(),
  trackStatus: Status.SELECTED,
  defaultTrackStatus: Status.SELECTED,
  track: createMainTrackInfo()
};

const wrapInRedux = (state: typeof mockState = mockState) => {
  return render(
    <Provider store={mockStore(state)}>
      <TrackPanelListItem {...defaultProps} />
    </Provider>
  );
};

describe('<TrackPanelListItem />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('renders the track buttons', () => {
      const { container } = wrapInRedux();

      expect(container.querySelector('.ellipsisHolder')).toBeTruthy();
      expect(container.querySelector('.eyeHolder')).toBeTruthy();
    });
  });

  describe('behaviour', () => {
    describe('when clicked', () => {
      it('updates the active track id if the drawer is opened', () => {
        const { container } = wrapInRedux(
          set(`drawer.isDrawerOpened.${fakeGenomeId}`, true, mockState)
        );

        const track = container.querySelector('.track') as HTMLElement;

        userEvent.click(track);

        expect(drawerActions.setActiveDrawerTrackId).toHaveBeenCalledWith({
          [fakeGenomeId]: defaultProps.track.track_id
        });
      });

      it('does not update the active track id if the drawer is closed', () => {
        const { container } = wrapInRedux();
        const track = container.querySelector('.track') as HTMLElement;

        userEvent.click(track);
        expect(drawerActions.changeDrawerView).not.toHaveBeenCalled();
      });
    });

    it('toggles the expanded/collapsed state of the track when clicked on the expand button', () => {
      const { container } = wrapInRedux();
      const expandButton = container.querySelector('.expandBtn') as HTMLElement;

      const isCollapsed = isTrackCollapsed(
        mockState as any,
        defaultProps.track.track_id
      );

      userEvent.click(expandButton);
      expect(trackPanelActions.updateCollapsedTrackIds).toHaveBeenCalledWith({
        trackId: defaultProps.track.track_id,
        isCollapsed: !isCollapsed
      });
    });

    it('opens/updates drawer view when clicked on the open track button', () => {
      const { container } = wrapInRedux();
      const ellipsisButton = container.querySelector(
        '.ellipsisHolder button'
      ) as HTMLElement;

      userEvent.click(ellipsisButton);
      expect(drawerActions.changeDrawerView).toHaveBeenCalledWith(
        DrawerView.TRACK_DETAILS
      );
    });

    it('toggles the track when clicked on the toggle track button', () => {
      const { container } = wrapInRedux();
      const eyeButton = container.querySelector(
        '.eyeHolder button'
      ) as HTMLElement;

      userEvent.click(eyeButton);
      expect(browserActions.updateTrackStatesAndSave).toHaveBeenCalledWith({
        [fakeGenomeId as string]: {
          commonTracks: {
            [defaultProps.categoryName]: {
              [defaultProps.track.track_id]: Status.UNSELECTED
            }
          }
        }
      });
    });
  });
});
