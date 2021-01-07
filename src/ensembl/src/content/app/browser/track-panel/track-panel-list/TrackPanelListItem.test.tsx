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
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import faker from 'faker';

import {
  TrackPanelListItem,
  TrackPanelListItemProps
} from './TrackPanelListItem';

import { createMainTrackInfo } from 'tests/fixtures/track-panel';
import { Status } from 'src/shared/types/status';

describe('<TrackPanelListItem />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: TrackPanelListItemProps = {
    categoryName: faker.lorem.words(),
    trackStatus: Status.SELECTED,
    defaultTrackStatus: Status.SELECTED,
    track: createMainTrackInfo(),
    activeGenomeId: faker.lorem.words(),
    activeEnsObjectId: faker.lorem.words(),
    isDrawerOpened: false,
    drawerView: 'bookmarks',
    highlightedTrackId: faker.lorem.words(),
    isCollapsed: false,
    changeDrawerView: jest.fn(),
    toggleDrawer: jest.fn(),
    updateTrackStatesAndSave: jest.fn(),
    updateCollapsedTrackIds: jest.fn()
  };

  describe('rendering', () => {
    it('renders the track buttons', () => {
      const { container } = render(<TrackPanelListItem {...defaultProps} />);
      expect(container.querySelector('.ellipsisHolder')).toBeTruthy();
      expect(container.querySelector('.eyeHolder')).toBeTruthy();
    });
  });

  describe('behaviour', () => {
    describe('when clicked', () => {
      it('updates drawer view if drawer already opened', () => {
        const { container } = render(
          <TrackPanelListItem {...defaultProps} isDrawerOpened={true} />
        );
        const track = container.querySelector('.track') as HTMLElement;

        userEvent.click(track);
        expect(defaultProps.changeDrawerView).toHaveBeenCalledWith(
          defaultProps.track.track_id
        );
      });

      it('does not update drawer view if drawer is closed', () => {
        const { container } = render(<TrackPanelListItem {...defaultProps} />);
        const track = container.querySelector('.track') as HTMLElement;

        userEvent.click(track);
        expect(defaultProps.changeDrawerView).not.toHaveBeenCalled();
      });
    });

    it('toggles the expanded/collapsed state of the track when clicked on the expand button', () => {
      const { container } = render(<TrackPanelListItem {...defaultProps} />);
      const expandButton = container.querySelector('.expandBtn') as HTMLElement;

      userEvent.click(expandButton);
      expect(defaultProps.updateCollapsedTrackIds).toHaveBeenCalledWith({
        trackId: defaultProps.track.track_id,
        isCollapsed: !defaultProps.isCollapsed
      });
    });

    it('opens/updates drawer view when clicked on the open track button', () => {
      const { container } = render(<TrackPanelListItem {...defaultProps} />);
      const ellipsisButton = container.querySelector(
        '.ellipsisHolder button'
      ) as HTMLElement;

      userEvent.click(ellipsisButton);
      expect(defaultProps.changeDrawerView).toHaveBeenCalledWith(
        defaultProps.track.track_id
      );
    });

    it('toggles the track when clicked on the toggle track button', () => {
      const { container } = render(<TrackPanelListItem {...defaultProps} />);
      const eyeButton = container.querySelector(
        '.eyeHolder button'
      ) as HTMLElement;

      userEvent.click(eyeButton);
      expect(defaultProps.updateTrackStatesAndSave).toHaveBeenCalledWith({
        [defaultProps.activeGenomeId as string]: {
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
