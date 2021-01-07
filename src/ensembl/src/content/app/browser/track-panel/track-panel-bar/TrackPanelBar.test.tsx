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

import { TrackPanelBar, TrackPanelBarProps } from './TrackPanelBar';

jest.mock(
  'src/shared/components/image-button/ImageButton',
  () => (props: { description: string; onClick: () => void }) => (
    <button onClick={props.onClick}>{props.description}</button>
  )
);

describe('<TrackPanelBar />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: TrackPanelBarProps = {
    isTrackPanelModalOpened: true,
    isTrackPanelOpened: true,
    trackPanelModalView: 'foo',
    closeTrackPanelModal: jest.fn(),
    openTrackPanelModal: jest.fn(),
    toggleTrackPanel: jest.fn()
  };

  describe('rendering', () => {
    it('displays correct number of buttons', () => {
      const { container } = render(<TrackPanelBar {...defaultProps} />);
      expect(container.querySelectorAll('button').length).toBe(6);
    });

    it('passes correct data to callbacks when buttons are clicked', () => {
      const { container } = render(<TrackPanelBar {...defaultProps} />);
      const bookmarksButton = [...container.querySelectorAll('button')].find(
        (button) => button.innerHTML === 'Bookmarks'
      ) as HTMLButtonElement;

      userEvent.click(bookmarksButton);
      expect(defaultProps.openTrackPanelModal).toHaveBeenCalledWith(
        'bookmarks'
      );
    });

    it('opens the track panel if it is closed when a button is clicked', () => {
      const props = { ...defaultProps, isTrackPanelOpened: false };
      const { container } = render(<TrackPanelBar {...props} />);
      const bookmarksButton = [...container.querySelectorAll('button')].find(
        (button) => button.innerHTML === 'Bookmarks'
      ) as HTMLButtonElement;

      userEvent.click(bookmarksButton);
      expect(defaultProps.toggleTrackPanel).toHaveBeenCalledWith(true);
    });

    it('causes track panel modal to close if a pressed button is clicked again', () => {
      const props = { ...defaultProps, trackPanelModalView: 'bookmarks' }; // the modal is open and is showing bookmarks
      const { container } = render(<TrackPanelBar {...props} />);
      const bookmarksButton = [...container.querySelectorAll('button')].find(
        (button) => button.innerHTML === 'Bookmarks'
      ) as HTMLButtonElement;

      userEvent.click(bookmarksButton);
      expect(defaultProps.closeTrackPanelModal).toHaveBeenCalled();
    });
  });
});
