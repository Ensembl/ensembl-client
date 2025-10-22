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

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';

import BrowserCog, { BrowserCogProps } from './BrowserCog';

import { TrackType } from 'src/content/app/genome-browser/state/track-settings/trackSettingsConstants';

vi.mock('../track-settings-panel/TrackSettingsPanel', () => ({
  default: () => <div id="trackSettingsPanel">TrackSettingsPanel</div>
}));

vi.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics',
  () => ({
    default: () => ({
      reportTrackSettingsOpened: vi.fn()
    })
  })
);

describe('<BrowserCog />', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const defaultProps: BrowserCogProps = {
    trackId: faker.lorem.words(),
    trackType: TrackType.GENE
  };

  describe('rendering', () => {
    it('renders browser track settings panel', async () => {
      const { container } = render(<BrowserCog {...defaultProps} />);
      await userEvent.click(
        container.querySelector('button') as HTMLButtonElement
      );
      expect(container.querySelector('#trackSettingsPanel')).toBeTruthy();
    });

    it('renders close button when track settings panel is open', async () => {
      const { container } = render(<BrowserCog {...defaultProps} />);
      await userEvent.click(
        container.querySelector('button') as HTMLButtonElement
      );
      expect(container.querySelector('.closeButton')).toBeTruthy();
    });
  });

  describe('behaviour', () => {
    it('renders cog on clicking close button', async () => {
      const { container } = render(<BrowserCog {...defaultProps} />);
      await userEvent.click(
        container.querySelector('button') as HTMLButtonElement
      );
      await userEvent.click(
        container.querySelector('.closeButton') as HTMLButtonElement
      );
      expect(container.querySelector('.browserCog')).toBeTruthy();
    });
  });
});
