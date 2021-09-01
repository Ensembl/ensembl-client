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
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { toggleSpeciesUseAndSave } from 'src/content/app/species-selector/state/speciesSelectorActions';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import SpeciesUsageToggle from './SpeciesUsageToggle';
import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';

jest.mock(
  'src/content/app/species-selector/state/speciesSelectorActions',
  () => ({
    toggleSpeciesUseAndSave: jest.fn(() => ({
      type: 'toggleSpeciesUseAndSave'
    }))
  })
);
jest.mock('src/shared/components/slide-toggle/SlideToggle', () =>
  jest.fn(() => null)
);

jest.mock('src/content/app/species/hooks/useSpeciesAnalytics', () =>
  jest.fn(() => ({
    trackSpeciesUse: jest.fn()
  }))
);

const selectedSpecies = createSelectedSpecies();
const disabledSpecies = {
  ...selectedSpecies,
  isEnabled: false
};

const stateWithEnabledSpecies = {
  speciesPage: {
    general: {
      activeGenomeId: selectedSpecies.genome_id
    }
  },
  speciesSelector: {
    committedItems: [selectedSpecies]
  }
};

const stateWithDisabledSpecies = {
  ...stateWithEnabledSpecies,
  speciesSelector: {
    committedItems: [disabledSpecies]
  }
};

const mockStore = configureMockStore([thunk]);

const wrapInRedux = (
  state: typeof stateWithEnabledSpecies = stateWithEnabledSpecies
) => {
  return render(
    <Provider store={mockStore(state)}>
      <SpeciesUsageToggle />
    </Provider>
  );
};

describe('SpeciesSelectionControls', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows correct controls for enabled species', () => {
    const { container } = wrapInRedux();
    const useLabel = [...container.querySelectorAll('span')].find(
      (element) => element.textContent === 'Use'
    );
    const doNotUseLabel = [...container.querySelectorAll('span')].find(
      (element) => element.textContent === "Don't use"
    );

    expect((SlideToggle as any).mock.calls[0][0]).toMatchObject({ isOn: true });
    expect(useLabel?.classList.contains('clickable')).toBe(false);
    expect(doNotUseLabel?.classList.contains('clickable')).toBe(true);
  });

  it('shows correct controls for disabled species', () => {
    const { container } = wrapInRedux(stateWithDisabledSpecies);

    const useLabel = [...container.querySelectorAll('span')].find(
      (element) => element.textContent === 'Use'
    );
    const doNotUseLabel = [...container.querySelectorAll('span')].find(
      (element) => element.textContent === "Don't use"
    );

    expect((SlideToggle as any).mock.calls[0][0]).toMatchObject({
      isOn: false
    });
    expect(useLabel?.classList.contains('clickable')).toBe(true);
    expect(doNotUseLabel?.classList.contains('clickable')).toBe(false);
  });

  it('changes species status via the toggle', () => {
    wrapInRedux(stateWithDisabledSpecies);
    const { onChange } = (SlideToggle as any).mock.calls[0][0];
    onChange(true);

    expect(toggleSpeciesUseAndSave).toHaveBeenCalledWith(
      disabledSpecies.genome_id
    );

    jest.clearAllMocks();

    onChange(true);
    expect(toggleSpeciesUseAndSave).toHaveBeenCalledWith(
      disabledSpecies.genome_id
    );
  });

  it('disables species by clicking on label', () => {
    const { container } = wrapInRedux();
    const doNotUseLabel = [...container.querySelectorAll('span')].find(
      (element) => element.textContent === "Don't use"
    );

    userEvent.click(doNotUseLabel as HTMLSpanElement);

    expect(toggleSpeciesUseAndSave).toHaveBeenCalledWith(
      selectedSpecies.genome_id
    );
  });

  it('enables species by clicking on label', () => {
    const { container } = wrapInRedux(stateWithDisabledSpecies);
    const useLabel = [...container.querySelectorAll('span')].find(
      (element) => element.textContent === 'Use'
    );

    userEvent.click(useLabel as HTMLSpanElement);

    expect(toggleSpeciesUseAndSave).toHaveBeenCalledWith(
      selectedSpecies.genome_id
    );
  });
});
