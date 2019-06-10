import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';
import times from 'lodash/times';
import random from 'lodash/random';

import { AssemblySelector } from './AssemblySelector';
import Select from 'src/shared/select/Select';

const createAssembly = () => ({
  genome_id: faker.random.uuid(),
  assembly_name: faker.lorem.words()
});

const assemblies = times(5, () => createAssembly());
const onSelect = jest.fn();

const defaultProps = {
  genomeId: assemblies[0].genome_id,
  assemblies,
  onSelect
};

describe('<AssemblySelector />', () => {
  it('does not render anything if genomeId is null', () => {
    const props = { ...defaultProps, genomeId: null };
    const wrapper = mount(<AssemblySelector {...props} />);

    expect(wrapper.isEmptyRender()).toBe(true);
  });

  it('does not render anything if assemblies array is empty', () => {
    const props = { ...defaultProps, assemblies: [] };
    const wrapper = mount(<AssemblySelector {...props} />);

    expect(wrapper.isEmptyRender()).toBe(true);
  });

  it('renders only the name of the selected assembly if it is the only one', () => {
    const assemblies = defaultProps.assemblies.slice(0, 1);
    const props = { ...defaultProps, assemblies };
    const wrapper = mount(<AssemblySelector {...props} />);

    expect(wrapper.find(Select).length).toBe(0);
    expect(wrapper.text()).toMatch(assemblies[0].assembly_name);
  });

  it('renders Select component if multiple assemblies are available', () => {
    const wrapper = mount(<AssemblySelector {...defaultProps} />);

    const selectElement = wrapper.find(Select);
    expect(selectElement.length).toBe(1);

    const options: any = selectElement.prop('options');
    const selectedOption = options.find(
      ({ isSelected }: { isSelected: boolean }) => isSelected
    );
    const selectedOptionIndex = options.findIndex(
      ({ isSelected }: { isSelected: boolean }) => isSelected
    );

    expect(options.length).toEqual(defaultProps.assemblies.length);
    expect(selectedOption.value).toBe(selectedOptionIndex);
  });

  it('calls the onSelect prop passing to it the selected assembly', () => {
    const wrapper = mount(<AssemblySelector {...defaultProps} />);
    const selectElement = wrapper.find(Select);
    const selectHandler = selectElement.prop('onSelect');

    const assemblyIndex = random(0, assemblies.length - 1);
    const randomAssembly = assemblies[assemblyIndex];

    selectHandler(assemblyIndex);

    expect(onSelect.mock.calls[0][0]).toEqual(randomAssembly);
  });
});
