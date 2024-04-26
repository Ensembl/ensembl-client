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

import { faker } from '@faker-js/faker';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import set from 'lodash/fp/set';
import merge from 'lodash/fp/merge';
import createRootReducer from 'src/root/rootReducer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import SelectedSpecies, {
  type Props as SelectedSpeciesProps
} from './SelectedSpecies';
import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

const speciesData = {
  genome_id: faker.string.uuid(),
  common_name: 'Human',
  scientific_name: 'Homo sapiens',
  assembly: {
    name: 'GRCh38'
  },
  isEnabled: true
};

const minimalProps = {
  species: speciesData as CommittedItem,
  isActive: true,
  onClick: jest.fn()
};

const mockState = {
  committedItems: [],
  speciesNameDisplayOption: 'assembly-accession-id'
};

describe('<SelectedSpecies />', () => {
  const store = configureStore({
    reducer: createRootReducer(),
    preloadedState: mockState as any
  });
  const renderSelectedSpecies = (props: SelectedSpeciesProps) =>
    render(
      <Provider store={store}>
        <SelectedSpecies {...speciesData} {...props} />
      </Provider>
    );

  describe('lozenge', () => {
    it('has correct classes when active and enabled', () => {
      const { container } = renderSelectedSpecies(minimalProps);
      const lozenge = container.firstChild as HTMLElement;
      expect(lozenge.classList.contains('themeBlack')).toBe(true);
    });

    it('has correct classes when active and not enabled', () => {
      const props = set('species.isEnabled', false, minimalProps);
      const { container } = renderSelectedSpecies(props);
      const lozenge = container.firstChild as HTMLElement;
      expect(lozenge.classList.contains('themeGrey')).toBe(true);
    });

    it('has correct classes when inactive and enabled', () => {
      const props = set('isActive', false, minimalProps);
      const { container } = renderSelectedSpecies(props);
      const lozenge = container.firstChild as HTMLElement;
      expect(lozenge.classList.contains('themeBlue')).toBe(true);
    });

    it('has correct classes when inactive and not enabled', () => {
      const props = merge(minimalProps, {
        isActive: false,
        species: { isEnabled: false }
      });
      const { container } = renderSelectedSpecies(props);
      const lozenge = container.firstChild as HTMLElement;
      expect(lozenge.classList.contains('themeIceBlue')).toBe(true);
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

      expect(props.onClick).toHaveBeenCalledWith(speciesData);
    });

    it('does not respond to clicks when active', async () => {
      const { container } = renderSelectedSpecies(minimalProps);
      const lozenge = container.firstChild as HTMLElement;

      await userEvent.click(lozenge);

      expect(minimalProps.onClick).not.toHaveBeenCalled();
    });
  });
});
