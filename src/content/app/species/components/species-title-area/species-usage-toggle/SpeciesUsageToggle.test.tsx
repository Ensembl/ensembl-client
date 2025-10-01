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

import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import createRootReducer from 'src/root/rootReducer';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

// import { toggleSpeciesUseAndSave } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSlice';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import SpeciesUsageToggle from './SpeciesUsageToggle';

vi.mock(
  'src/content/app/species-selector/services/speciesSelectorStorageService',
  () => ({
    saveMultipleSelectedSpecies: vi.fn()
  })
);

vi.mock('src/content/app/species/hooks/useSpeciesAnalytics', () =>
  vi.fn(() => ({
    trackSpeciesUse: vi.fn()
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
    general: {
      committedItems: [selectedSpecies]
    }
  }
};

const stateWithDisabledSpecies = {
  ...stateWithEnabledSpecies,
  speciesSelector: {
    general: {
      committedItems: [disabledSpecies]
    }
  }
};

const renderComponent = (
  state: typeof stateWithEnabledSpecies = stateWithEnabledSpecies
) => {
  const store = configureStore({
    reducer: createRootReducer(),
    preloadedState: state as any
  });

  const renderResult = render(
    <Provider store={store}>
      <SpeciesUsageToggle />
    </Provider>
  );

  return {
    ...renderResult,
    store
  };
};

describe('SpeciesSelectionControls', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows correct controls for enabled species', () => {
    const { container } = renderComponent();
    const useLabel = [...container.querySelectorAll('span')].find(
      (element) => element.textContent === 'Use'
    );
    const doNotUseLabel = [...container.querySelectorAll('span')].find(
      (element) => element.textContent === "Don't use"
    );

    expect(useLabel?.classList.contains('clickable')).toBe(false);
    expect(doNotUseLabel?.classList.contains('clickable')).toBe(true);
  });

  it('shows correct controls for disabled species', () => {
    const { container } = renderComponent(stateWithDisabledSpecies);

    const useLabel = [...container.querySelectorAll('span')].find(
      (element) => element.textContent === 'Use'
    );
    const doNotUseLabel = [...container.querySelectorAll('span')].find(
      (element) => element.textContent === "Don't use"
    );

    expect(useLabel?.classList.contains('clickable')).toBe(true);
    expect(doNotUseLabel?.classList.contains('clickable')).toBe(false);
  });

  it('changes species status via the toggle', async () => {
    const { container, store } = renderComponent();
    const toggle = container.querySelector('button') as HTMLElement;

    // start with an enabled species
    let committedSpecies = getCommittedSpecies(store.getState())[0];
    expect(committedSpecies.isEnabled).toBe(true);

    await userEvent.click(toggle);

    // the species should have been disabled
    committedSpecies = getCommittedSpecies(store.getState())[0];
    expect(committedSpecies.isEnabled).toBe(false);

    await userEvent.click(toggle);

    // the species should have been re-enabled
    committedSpecies = getCommittedSpecies(store.getState())[0];
    expect(committedSpecies.isEnabled).toBe(true);
  });

  it('disables species by clicking on label', async () => {
    const { container, store } = renderComponent();
    const doNotUseLabel = [...container.querySelectorAll('span')].find(
      (element) => element.textContent === "Don't use"
    );

    // start with an enabled species
    let committedSpecies = getCommittedSpecies(store.getState())[0];
    expect(committedSpecies.isEnabled).toBe(true);

    await userEvent.click(doNotUseLabel as HTMLSpanElement);

    // the species should have been disabled
    committedSpecies = getCommittedSpecies(store.getState())[0];
    expect(committedSpecies.isEnabled).toBe(false);
  });

  it('enables species by clicking on label', async () => {
    const { container, store } = renderComponent(stateWithDisabledSpecies);
    const useLabel = [...container.querySelectorAll('span')].find(
      (element) => element.textContent === 'Use'
    );

    // start with a disabled species
    let committedSpecies = getCommittedSpecies(store.getState())[0];
    expect(committedSpecies.isEnabled).toBe(false);

    await userEvent.click(useLabel as HTMLSpanElement);

    // the species should have been enabled
    committedSpecies = getCommittedSpecies(store.getState())[0];
    expect(committedSpecies.isEnabled).toBe(true);
  });
});
