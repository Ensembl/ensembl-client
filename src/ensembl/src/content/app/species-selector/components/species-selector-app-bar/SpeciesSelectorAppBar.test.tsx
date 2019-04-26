import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';
import times from 'lodash/times';

import {
  SpeciesSelectorAppBar,
  PlaceholderMessage
} from './SpeciesSelectorAppBar';

const createSelectedSpecies = () => ({
  genome_id: faker.lorem.word(),
  reference_genome_id: null,
  common_name: null,
  scientific_name: faker.lorem.words(),
  assembly_name: faker.lorem.word(),
  isEnabled: true
});

const toggleSpeciesUse = jest.fn();
const onSpeciesDelete = jest.fn();

const defaultProps = {
  selectedSpecies: times(2, () => createSelectedSpecies()),
  toggleSpeciesUse,
  onSpeciesDelete
};

describe('<SpeciesSelectorAppBar />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows placeholder message if no species are selected', () => {
    const props = { ...defaultProps, selectedSpecies: [] };
    const wrapper = mount(<SpeciesSelectorAppBar {...props} />);
    expect(wrapper.find(PlaceholderMessage).length).toBe(1);
  });

  it('does not show placeholder message if there are selected species', () => {
    const wrapper = mount(<SpeciesSelectorAppBar {...defaultProps} />);
    expect(wrapper.find(PlaceholderMessage).length).toBe(0);
  });
});
