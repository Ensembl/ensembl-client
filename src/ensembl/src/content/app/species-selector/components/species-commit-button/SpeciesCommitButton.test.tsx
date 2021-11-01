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
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';
import merge from 'lodash/merge';

import * as speciesSelectorActions from 'src/content/app/species-selector/state/speciesSelectorSlice';

import { SpeciesCommitButton } from './SpeciesCommitButton';
import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import { RootState } from 'src/store';

jest.mock(
  'src/content/app/species-selector/hooks/useSpeciesSelectorAnalytics',
  () =>
    jest.fn(() => ({
      trackCommittedSpecies: jest.fn()
    }))
);

const committedHuman: ReturnType<typeof createSelectedSpecies> = {
  ...createSelectedSpecies(),
  genome_id: 'human'
};

const defaultReduxState = {
  speciesSelector: {
    currentItem: committedHuman as RootState['speciesSelector']['currentItem']
  }
};

const mockStore = configureMockStore([thunk]);

const renderComponent = (state?: {
  speciesSelector: Partial<typeof defaultReduxState['speciesSelector']>;
}) => {
  state = merge({}, defaultReduxState, state);
  return render(
    <Provider store={mockStore(state)}>
      <SpeciesCommitButton />
    </Provider>
  );
};

describe('<SpeciesCommitButton />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows PrimaryButton if a species has been selected', () => {
    const { container } = renderComponent();
    expect(container.querySelector('button.primaryButton')).toBeTruthy();
  });

  it('does not show any button if no species has been selected', () => {
    const stateFragment = { speciesSelector: { currentItem: null } };
    const { container } = renderComponent(stateFragment);
    expect(container.querySelector('button')).toBeFalsy();
  });

  it('calls the onCommit prop if clicked', () => {
    jest
      .spyOn(speciesSelectorActions, 'commitSelectedSpeciesAndSave')
      .mockImplementation(() => jest.fn());
    const { container } = renderComponent();
    const button = container.querySelector('button') as HTMLElement;

    userEvent.click(button);

    expect(
      speciesSelectorActions.commitSelectedSpeciesAndSave
    ).toHaveBeenCalled();
  });
});
