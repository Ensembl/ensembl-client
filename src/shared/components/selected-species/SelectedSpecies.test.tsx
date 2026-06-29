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
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import set from 'lodash/fp/set';
import createRootReducer from 'src/root/rootReducer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import SelectedSpecies, {
  type Props as SelectedSpeciesProps
} from './SelectedSpecies';
import { TOOLTIP_TIMEOUT } from 'src/shared/components/tooltip/tooltip-constants';
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
  onClick: vi.fn()
};

describe('<SelectedSpecies />', () => {
  const store = configureStore({
    reducer: createRootReducer()
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

    it('has correct classes when inactive and enabled', () => {
      const props = set('isActive', false, minimalProps);
      const { container } = renderSelectedSpecies(props);
      const lozenge = container.firstChild as HTMLElement;
      expect(lozenge.classList.contains('themeBlue')).toBe(true);
    });

    it('has correct classes when disabled', () => {
      const props = { ...minimalProps, disabled: true };
      const { container } = renderSelectedSpecies(props);
      const lozenge = container.firstChild as HTMLElement;
      expect(lozenge.classList.contains('themeGrey')).toBe(true);
    });
  });

  describe('behaviour', () => {
    afterEach(() => {
      vi.resetAllMocks();
      vi.useRealTimers();
    });

    it('responds to clicks when inactive', async () => {
      const props = set('isActive', false, minimalProps);

      const { getByText } = renderSelectedSpecies(props);
      const lozenge = getByText('Human');

      await userEvent.click(lozenge);

      expect(props.onClick).toHaveBeenCalledWith(speciesData);
    });

    it('does not respond to clicks when active', async () => {
      const { container } = renderSelectedSpecies(minimalProps);
      const lozenge = container.firstChild as HTMLElement;

      await userEvent.click(lozenge);

      expect(minimalProps.onClick).not.toHaveBeenCalled();
    });

    it('can remove species without selecting it', async () => {
      const props = {
        ...set('isActive', false, minimalProps),
        onClick: vi.fn(),
        onRemove: vi.fn()
      };

      const { getByRole } = renderSelectedSpecies(props);
      const removeButton = getByRole('button', {
        name: 'Remove this genome from selected genomes'
      });

      await userEvent.click(removeButton);

      expect(props.onRemove).toHaveBeenCalledWith(speciesData);
      expect(props.onClick).not.toHaveBeenCalled();
    });

    it('shows delete tooltip when hovering over the remove button', async () => {
      vi.useFakeTimers();
      const props = {
        ...set('isActive', false, minimalProps),
        onRemove: vi.fn()
      };

      const { getByRole } = renderSelectedSpecies(props);
      const removeButton = getByRole('button', {
        name: 'Remove this genome from selected genomes'
      });

      fireEvent.mouseEnter(removeButton);
      act(() => {
        vi.advanceTimersByTime(TOOLTIP_TIMEOUT);
      });

      expect(screen.getByText('Delete this genome')).toBeTruthy();
    });

    it('does not show remove button when active', () => {
      const props = {
        ...minimalProps,
        onRemove: vi.fn()
      };

      const { queryByRole } = renderSelectedSpecies(props);

      expect(
        queryByRole('button', {
          name: 'Remove this genome from selected genomes'
        })
      ).toBeNull();
    });

    it('does not show remove button when disabled', () => {
      const props = {
        ...set('isActive', false, minimalProps),
        disabled: true,
        onRemove: vi.fn()
      };

      const { queryByRole } = renderSelectedSpecies(props);

      expect(
        queryByRole('button', {
          name: 'Remove this genome from selected genomes'
        })
      ).toBeNull();
    });
  });
});
