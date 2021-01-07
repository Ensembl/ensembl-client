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

import { TrackPanelModal, TrackPanelModalProps } from './TrackPanelModal';

jest.mock('./modal-views/TrackPanelSearch', () => () => (
  <div className="trackPanelSearch" />
));

jest.mock('./modal-views/TrackPanelDownloads', () => () => (
  <div className="trackPanelDownloads" />
));

jest.mock(
  'src/shared/components/close-button/CloseButton',
  () => (props: { onClick: () => void }) => (
    <button className="closeButton" onClick={props.onClick}></button>
  )
);

describe('<TrackPanelModal />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: TrackPanelModalProps = {
    trackPanelModalView: 'search',
    closeTrackPanelModal: jest.fn(),
    closeDrawer: jest.fn()
  };

  describe('rendering', () => {
    it('displays track pane modal view for search', () => {
      const { container } = render(<TrackPanelModal {...defaultProps} />);
      expect(container.querySelector('.trackPanelSearch')).toBeTruthy();
    });

    it('displays track pane modal view for downloads', () => {
      const { container } = render(
        <TrackPanelModal {...defaultProps} trackPanelModalView="downloads" />
      );
      expect(container.querySelector('.trackPanelDownloads')).toBeTruthy();
    });
  });

  describe('behaviour', () => {
    it('closes modal when close button is clicked', () => {
      const { container } = render(<TrackPanelModal {...defaultProps} />);
      const closeButton = container.querySelector('button.closeButton');

      userEvent.click(closeButton as HTMLElement);
      expect(defaultProps.closeTrackPanelModal).toHaveBeenCalledTimes(1);
    });
  });
});
