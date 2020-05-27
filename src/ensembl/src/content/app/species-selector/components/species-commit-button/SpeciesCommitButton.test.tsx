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
import { mount } from 'enzyme';

import { SpeciesCommitButton } from './SpeciesCommitButton';

import { PrimaryButton } from 'src/shared/components/button/Button';

const onCommit = jest.fn();
const defaultProps = {
  hasCurrentSpecies: true,
  disabled: false,
  onCommit
};

describe('<SpeciesCommitButton />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows PrimaryButton if a species has been selected', () => {
    const wrapper = mount(<SpeciesCommitButton {...defaultProps} />);

    expect(wrapper.find(PrimaryButton).length).toBe(1);
  });

  it('does not show any button if no species has been selected', () => {
    const props = {
      ...defaultProps,
      hasCurrentSpecies: false
    };
    const wrapper = mount(<SpeciesCommitButton {...props} />);
    expect(wrapper.find(PrimaryButton).length).toBe(0);
  });

  it('passes disabled prop to the button', () => {
    const enabledProps = defaultProps;
    const disabledProps = { ...defaultProps, disabled: true };
    const enabledButton = mount(<SpeciesCommitButton {...enabledProps} />).find(
      PrimaryButton
    );
    const disabledButton = mount(
      <SpeciesCommitButton {...disabledProps} />
    ).find(PrimaryButton);

    expect(enabledButton.prop('isDisabled')).toBe(false);
    expect(disabledButton.prop('isDisabled')).toBe(true);
  });

  it('calls the onCommit prop if clicked when enabled', () => {
    const wrapper = mount(<SpeciesCommitButton {...defaultProps} />);
    const button = wrapper.find(PrimaryButton);

    button.simulate('click');
    expect(onCommit).toHaveBeenCalled();
  });

  it('does not call the onCommit prop if clicked when disabled', () => {
    const props = { ...defaultProps, disabled: true };
    const wrapper = mount(<SpeciesCommitButton {...props} />);
    const button = wrapper.find(PrimaryButton);

    button.simulate('click');
    expect(onCommit).not.toHaveBeenCalled();
  });
});
