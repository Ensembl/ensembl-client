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
import faker from 'faker';

import { TrackPanel, TrackPanelProps } from './TrackPanel';

import MockGenomeBrowser from 'tests/mocks/mockGenomeBrowser';

import { createEnsObject } from 'tests/fixtures/ens-object';

const mockGenomeBrowser = new MockGenomeBrowser();
jest.mock('src/content/app/browser/hooks/useGenomeBrowser', () => () => ({
  genomeBrowser: mockGenomeBrowser,
  restoreBrowserTrackStates: jest.fn()
}));

jest.mock('./track-panel-bar/TrackPanelBar', () => () => (
  <div className="trackPanel" />
));
jest.mock('./track-panel-list/TrackPanelList', () => () => (
  <div className="trackPanelList" />
));
jest.mock('./track-panel-modal/TrackPanelModal', () => () => (
  <div className="trackPanelModal" />
));
jest.mock('../drawer/Drawer', () => () => <div className="drawer" />);

describe('<TrackPanel />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: TrackPanelProps = {
    activeGenomeId: null,
    browserActivated: false,
    activeEnsObject: null,
    isTrackPanelModalOpened: false
  };

  const renderTrackPanel = (props?: Partial<TrackPanelProps>) =>
    render(<TrackPanel {...defaultProps} {...props} />);

  describe('rendering', () => {
    it('does not render anything when not all rendering requirements are satisfied', () => {
      // defaultProps are insufficient for rendering anything useful
      // TODO: in the future, it might be a good idea to at least render a spinner here
      const { container } = renderTrackPanel();
      expect(container.firstChild).toBeFalsy();
    });

    it('renders TrackPanelList when necessary requirements are satisfied', () => {
      const { container } = renderTrackPanel({
        browserActivated: true,
        activeEnsObject: createEnsObject(),
        activeGenomeId: faker.lorem.words()
      });
      expect(container.querySelector('.trackPanelList')).toBeTruthy();
    });

    it('renders track panel modal when necessary requirements are satisfied', () => {
      const { container } = renderTrackPanel({
        activeGenomeId: faker.lorem.words(),
        browserActivated: true,
        activeEnsObject: createEnsObject(),
        isTrackPanelModalOpened: true
      });
      expect(container.querySelector('.trackPanelModal')).toBeTruthy();
    });
  });
});
