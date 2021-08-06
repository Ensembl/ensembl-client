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

import {
  BrowserTrackConfig,
  BrowserTrackConfigProps
} from './BrowserTrackConfig';

import {
  createTrackConfigLabel,
  createTrackConfigNames,
  createCogTrackList
} from 'tests/fixtures/browser';

describe('<BrowserTrackConfig />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: BrowserTrackConfigProps = {
    applyToAll: false,
    browserCogTrackList: createCogTrackList(),
    selectedCog: 'track:gc',
    trackConfigLabel: createTrackConfigLabel(),
    trackConfigNames: createTrackConfigNames(),
    updateApplyToAll: jest.fn(),
    updateTrackConfigLabel: jest.fn(),
    updateTrackConfigNames: jest.fn(),
    onClose: jest.fn()
  };

  describe('behaviour', () => {
    it('can update all tracks', () => {
      const { container } = render(<BrowserTrackConfig {...defaultProps} />);
      const allTracksLabel = [...container.querySelectorAll('label')].find(
        (el) => el.textContent === 'All tracks'
      );
      const allTracksInputElement = allTracksLabel?.querySelector(
        'input'
      ) as HTMLElement;

      userEvent.click(allTracksInputElement);

      expect(defaultProps.updateApplyToAll).toHaveBeenCalledTimes(1);
    });

    it('toggles track name', () => {
      const { container } = render(<BrowserTrackConfig {...defaultProps} />);
      const toggle = [...container.querySelectorAll('label')]
        .find((element) => element.textContent === 'Track name')
        ?.parentElement?.querySelector('svg') as SVGElement;

      userEvent.click(toggle);

      expect(defaultProps.updateTrackConfigNames).toHaveBeenCalledTimes(1);
      expect(defaultProps.updateTrackConfigNames).toHaveBeenCalledWith(
        defaultProps.selectedCog,
        false
      );
    });

    it('toggles feature labels on the track', () => {
      const { container } = render(<BrowserTrackConfig {...defaultProps} />);
      const toggle = [...container.querySelectorAll('label')]
        .find((element) => element.textContent === 'Feature labels')
        ?.parentElement?.querySelector('svg') as SVGElement;

      userEvent.click(toggle);

      expect(defaultProps.updateTrackConfigLabel).toHaveBeenCalledTimes(1);
      expect(defaultProps.updateTrackConfigLabel).toHaveBeenCalledWith(
        defaultProps.selectedCog,
        false
      );
    });
  });
});
