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

import { TrackPanelTabs, TrackPanelTabsProps } from './TrackPanelTabs';

import { TrackSet } from '../trackPanelConfig';
import { createEnsObject } from 'tests/fixtures/ens-object';

describe('<TrackPanelTabs />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: TrackPanelTabsProps = {
    closeDrawer: jest.fn(),
    ensObject: createEnsObject(),
    isDrawerOpened: true,
    selectTrackPanelTab: jest.fn(),
    selectedTrackPanelTab: TrackSet.GENOMIC,
    toggleTrackPanel: jest.fn(),
    isTrackPanelModalOpened: false,
    isTrackPanelOpened: false
  };

  describe('rendering', () => {
    it('contains all track panel tabs', () => {
      const { container } = render(<TrackPanelTabs {...defaultProps} />);
      const tabValues = Object.values(TrackSet);
      const tabs = [...container.querySelectorAll('.trackPanelTab')];

      tabValues.forEach((text) => {
        expect(tabs.some((tab) => tab.innerHTML === text)).toBeTruthy();
      });
    });
  });

  describe('behaviour', () => {
    describe('on track panel tab click', () => {
      it('selects track panel tab', () => {
        const { container } = render(<TrackPanelTabs {...defaultProps} />);
        const tab = container.querySelector('.trackPanelTab') as HTMLElement;

        userEvent.click(tab);
        expect(defaultProps.selectTrackPanelTab).toHaveBeenCalledWith(
          Object.values(TrackSet)[0]
        );
      });

      it('opens track panel if it is closed', () => {
        const { container, rerender } = render(
          <TrackPanelTabs {...defaultProps} isTrackPanelOpened={true} />
        );
        const tab = container.querySelector('.trackPanelTab') as HTMLElement;

        userEvent.click(tab);
        expect(defaultProps.toggleTrackPanel).not.toHaveBeenCalled();

        rerender(
          <TrackPanelTabs {...defaultProps} isTrackPanelOpened={false} />
        );
        userEvent.click(tab);
        expect(defaultProps.toggleTrackPanel).toHaveBeenCalledWith(true);
      });

      it('closes drawer if it is opened', () => {
        const { container, rerender } = render(
          <TrackPanelTabs {...defaultProps} isDrawerOpened={false} />
        );
        const tab = container.querySelector('.trackPanelTab') as HTMLElement;

        userEvent.click(tab);
        expect(defaultProps.closeDrawer).not.toHaveBeenCalled();

        rerender(<TrackPanelTabs {...defaultProps} isDrawerOpened={true} />);
        userEvent.click(tab);
        expect(defaultProps.closeDrawer).toHaveBeenCalledTimes(1);
      });
    });
  });
});
