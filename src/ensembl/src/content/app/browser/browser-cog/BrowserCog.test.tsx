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

import BrowserCog, { BrowserCogProps } from './BrowserCog';

jest.mock('../browser-track-config/BrowserTrackConfig', () => () => (
  <div id="browserTrackConfig">BrowserTrackConfig</div>
));

describe('<BrowserCog />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: BrowserCogProps = {
    cogActivated: true,
    trackId: faker.lorem.words(),
    updateSelectedCog: jest.fn()
  };

  describe('rendering', () => {
    test('renders browser track config', () => {
      const { container } = render(<BrowserCog {...defaultProps} />);
      expect(container.querySelector('#browserTrackConfig')).toBeTruthy();
    });
  });

  describe('behaviour', () => {
    test('toggles cog on click', () => {
      const { container } = render(<BrowserCog {...defaultProps} />);
      const cogButton = container.querySelector('button');
      userEvent.click(cogButton as HTMLButtonElement);
      expect(defaultProps.updateSelectedCog).toHaveBeenCalledTimes(1);
    });
  });
});
