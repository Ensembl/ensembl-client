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

import { SpeciesCommitButton } from './SpeciesCommitButton';

jest.mock(
  'src/content/app/species-selector/hooks/useSpeciesSelectorAnalytics',
  () =>
    jest.fn(() => ({
      trackCommitedSpecies: jest.fn()
    }))
);

const onCommit = jest.fn();
const defaultProps = {
  hasCurrentSpecies: true,
  selectedItem: null,
  disabled: false,
  onCommit
};

describe('<SpeciesCommitButton />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows PrimaryButton if a species has been selected', () => {
    const { container } = render(<SpeciesCommitButton {...defaultProps} />);
    expect(container.querySelector('button.primaryButton')).toBeTruthy();
  });

  it('does not show any button if no species has been selected', () => {
    const { container } = render(
      <SpeciesCommitButton {...defaultProps} hasCurrentSpecies={false} />
    );
    expect(container.querySelector('button')).toBeFalsy();
  });

  it('does not register clicks if disabled', () => {
    const { container } = render(
      <SpeciesCommitButton {...defaultProps} disabled={true} />
    );
    const disabledButton = container.querySelector('button') as HTMLElement;
    userEvent.click(disabledButton);

    expect(onCommit).not.toHaveBeenCalled();
  });

  it('calls the onCommit prop if clicked when enabled', () => {
    const { container } = render(<SpeciesCommitButton {...defaultProps} />);
    const button = container.querySelector('button') as HTMLElement;
    userEvent.click(button);

    expect(onCommit).toHaveBeenCalled();
  });
});
