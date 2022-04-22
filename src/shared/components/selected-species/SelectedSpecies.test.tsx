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
import faker from '@faker-js/faker';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import set from 'lodash/fp/set';
import merge from 'lodash/fp/merge';

import SelectedSpecies, {
  Props as SelectedSpeciesProps
} from './SelectedSpecies';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

const speciesData = {
  genome_id: faker.datatype.uuid(),
  reference_genome_id: null,
  common_name: 'Human',
  scientific_name: 'Homo sapiens',
  assembly_name: 'GRCh38',
  isEnabled: true
};

const minimalProps = {
  species: speciesData as CommittedItem,
  isActive: true,
  onClick: jest.fn()
};

describe('<SelectedSpecies />', () => {
  const renderSelectedSpecies = (props: SelectedSpeciesProps) =>
    render(<SelectedSpecies {...speciesData} {...props} />);

  describe('lozenge', () => {
    it('has correct classes when active and enabled', () => {
      const { container } = renderSelectedSpecies(minimalProps);
      const lozenge = container.firstChild as HTMLElement;
      expect(lozenge.classList.contains('inUseActive')).toBe(true);
    });

    it('has correct classes when active and not enabled', () => {
      const props = set('species.isEnabled', false, minimalProps);
      const { container } = renderSelectedSpecies(props);
      const lozenge = container.firstChild as HTMLElement;
      expect(lozenge.classList.contains('notInUseActive')).toBe(true);
    });

    it('has correct classes when inactive and enabled', () => {
      const props = set('isActive', false, minimalProps);
      const { container } = renderSelectedSpecies(props);
      const lozenge = container.firstChild as HTMLElement;
      expect(lozenge.classList.contains('inUseInactive')).toBe(true);
    });

    it('has correct classes when inactive and disabled', () => {
      const props = merge(minimalProps, {
        isActive: false,
        species: { isEnabled: false }
      });
      const { container } = renderSelectedSpecies(props);
      const lozenge = container.firstChild as HTMLElement;
      expect(lozenge.classList.contains('notInUseInactive')).toBe(true);
    });
  });

  describe('behaviour', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('responds to clicks when inactive', async () => {
      const props = set('isActive', false, minimalProps);
      const { container } = renderSelectedSpecies(props);
      const lozenge = container.firstChild as HTMLElement;

      await userEvent.click(lozenge);

      expect(props.onClick).toHaveBeenCalledWith(speciesData.genome_id);
    });

    it('does not respond to clicks when active', async () => {
      const { container } = renderSelectedSpecies(minimalProps);
      const lozenge = container.firstChild as HTMLElement;

      await userEvent.click(lozenge);

      expect(minimalProps.onClick).not.toHaveBeenCalled();
    });
  });
});
