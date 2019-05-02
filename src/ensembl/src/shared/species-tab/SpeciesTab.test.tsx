import React from 'react';
import { render, mount } from 'enzyme';
import faker from 'faker';
import set from 'lodash/fp/set';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import SpeciesTab from './SpeciesTab';

const defaultProps = {
  species: createSelectedSpecies(),
  isActive: true
};

describe('<SpeciesTab />', () => {
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
});
