import React from 'react';
import faker from 'faker';
import times from 'lodash/times';
import { mount } from 'enzyme';

import Select from './Select';
import SelectOptionsPanel from './SelectOptionsPanel';

const createOption = (isSelected: boolean = false) => ({
  value: faker.random.uuid(),
  label: faker.random.words(5),
  isSelected
});

const createOptionGroup = (number: number = 5) => {
  const options = times(number, () => createOption());
  return {
    options
  };
};

const defaultProps = {
  optionGroups: [createOptionGroup()]
};

describe('<Select />', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(<Select {...defaultProps} />);
  });

  test('is closed by default', () => {
    expect(wrapper.find('.selectClosed').length).toBe(1);
  });

  test('opens options panel on click', async () => {
    const closedSelect = wrapper.find('.selectClosed');
    closedSelect.simulate('click');

    wrapper.update();

    // the element visible during closed state is still there
    expect(wrapper.find('.selectClosed').length).toBe(1);
    expect(wrapper.find(SelectOptionsPanel).length).toBe(1);
  });
});
