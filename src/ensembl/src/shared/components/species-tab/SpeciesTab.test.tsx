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
import { render, mount } from 'enzyme';
import faker from 'faker';
import set from 'lodash/fp/set';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import SpeciesTab from './SpeciesTab';

const onActivate = jest.fn();

const defaultProps = {
  species: createSelectedSpecies(),
  isActive: true,
  onActivate
};

describe('<SpeciesTab />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('displays species’ common name (if present) and assembly name', () => {
    const commonName = faker.lorem.words();
    const props = set('species.common_name', commonName, defaultProps);
    const wrapper = render(<SpeciesTab {...props} />);
    const nameElement = wrapper.find(`.name`);
    const assemblyElement = wrapper.find(`.assembly`);

    expect(nameElement.text()).toMatch(commonName);
    expect(assemblyElement.text()).toMatch(props.species.assembly_name);
  });

  it('displays species’ scientific name (if species does not have a common name), and assembly name', () => {
    const wrapper = render(<SpeciesTab {...defaultProps} />);
    const nameElement = wrapper.find(`.name`);
    const assemblyElement = wrapper.find(`.assembly`);

    expect(nameElement.text()).toMatch(defaultProps.species.scientific_name);
    expect(assemblyElement.text()).toMatch(defaultProps.species.assembly_name);
  });

  it('uses appropriate classes', () => {
    const inactiveProps = { ...defaultProps, isActive: false };

    const renderedInactiveTab = mount(<SpeciesTab {...inactiveProps} />);
    const renderedActiveTab = mount(<SpeciesTab {...defaultProps} />);

    expect(renderedInactiveTab.render().hasClass('speciesTabActive')).toBe(
      false
    );
    expect(renderedActiveTab.render().hasClass('speciesTabActive')).toBe(true);

    expect(renderedInactiveTab.render().hasClass('speciesTabFullSize')).toBe(
      false
    );
    expect(renderedActiveTab.render().hasClass('speciesTabFullSize')).toBe(
      true
    );

    // simulate hover
    renderedInactiveTab.simulate('mouseenter');
    renderedInactiveTab.update();

    expect(renderedInactiveTab.render().hasClass('speciesTabActive')).toBe(
      false
    );
    expect(renderedInactiveTab.render().hasClass('speciesTabFullSize')).toBe(
      true
    );

    // simulate mouse leave
    renderedInactiveTab.simulate('mouseleave');
    renderedInactiveTab.update();

    expect(renderedInactiveTab.render().hasClass('speciesTabActive')).toBe(
      false
    );
    expect(renderedInactiveTab.render().hasClass('speciesTabFullSize')).toBe(
      false
    );
  });

  it('calls the onActivate prop when clicked if inactive', () => {
    const props = { ...defaultProps, isActive: false };
    const wrapper = mount(<SpeciesTab {...props} />);
    wrapper.simulate('click');

    expect(onActivate).toHaveBeenCalledWith(defaultProps.species.genome_id);
  });

  it('does not call the onActivate prop when clicked if already active', () => {
    // with defaultProps, the tab is active
    const wrapper = mount(<SpeciesTab {...defaultProps} />);
    wrapper.simulate('click');

    expect(onActivate).not.toHaveBeenCalled();
  });
});
