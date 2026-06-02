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

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

const mockUseAppSelector = vi.fn();
const trackLaunchbarAppChange = vi.fn();

vi.mock('src/store', () => ({
  useAppSelector: (...args: unknown[]) => mockUseAppSelector(...args)
}));

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

const committedSpecies: CommittedItem[] = [
  {
    genome_id: 'homo_sapiens_GCA_000001405_29',
    genome_tag: 'human',
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    species_taxonomy_id: '9606',
    type: null,
    is_reference: true,
    assembly: {
      accession_id: 'GCA_000001405.29',
      name: 'GRCh38'
    },
    release: {
      name: 'Sep 2025',
      type: 'integrated'
    },
    isEnabled: true,
    addedAt: 1
  }
];

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

  it('renders a link to site search when there are no committed species', async () => {
    mockUseAppSelector.mockReturnValue([]);

    renderComponent();

    const siteSearchLink = screen.getByRole('link', { name: 'Site search' });
    expect(siteSearchLink.getAttribute('href')).toBe('/search');

    await userEvent.click(siteSearchLink);
    expect(trackLaunchbarAppChange).toHaveBeenCalledWith('Site search');
  });

  it('renders a link to site search when committed species exist', async () => {
    mockUseAppSelector.mockReturnValue(committedSpecies);

    renderComponent();

    const siteSearchLink = screen.getByRole('link', { name: 'Site search' });
    expect(siteSearchLink.getAttribute('href')).toBe('/search');

    await userEvent.click(siteSearchLink);
    expect(trackLaunchbarAppChange).toHaveBeenCalledWith('Site search');
  });
});
