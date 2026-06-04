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

import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Launchbar from './Launchbar';

const trackLaunchbarAppChange = vi.fn();

vi.mock('../hooks/useHeaderAnalytics', () => ({
  default: () => ({
    trackLaunchbarAppChange
  })
}));

vi.mock('./SpeciesSelectorLaunchbarButton', () => ({
  default: () => <div>Species selector</div>
}));

vi.mock('./EntityViewerLaunchbarButton', () => ({
  default: () => <div>Entity viewer</div>
}));

vi.mock('./AlignmentsViewerLaunchbarButton', () => ({
  default: () => <div>Alignments viewer</div>
}));

vi.mock('./RegulationViewerLaunchbarButton', () => ({
  default: () => <div>Regulation viewer</div>
}));

vi.mock('./BlastLaunchbarButton', () => ({
  default: () => <div>Blast</div>
}));

vi.mock('./VepLaunchbarButton', () => ({
  default: () => <div>VEP</div>
}));

const renderComponent = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Launchbar />
    </MemoryRouter>
  );

describe('<Launchbar />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a link to site search', async () => {
    renderComponent();

    const siteSearchLink = screen.getByRole('link', { name: 'Site search' });
    expect(siteSearchLink.getAttribute('href')).toBe('/search');

    await userEvent.click(siteSearchLink);
    expect(trackLaunchbarAppChange).toHaveBeenCalledWith('Site search');
  });
});
