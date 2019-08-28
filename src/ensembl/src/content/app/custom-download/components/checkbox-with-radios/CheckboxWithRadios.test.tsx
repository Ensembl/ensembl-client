import React from 'react';
import { mount } from 'enzyme';
import CheckboxWithRadios from './CheckboxWithRadios';
import Checkbox from 'src/shared/components/checkbox/Checkbox';

import faker from 'faker';
import times from 'lodash/times';

const onChange = jest.fn();

const createOption = () => ({
  value: faker.random.uuid(),
  label: faker.random.words(5)
});

describe('<CheckboxWithRadios />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  let wrapper: any;
  const defaultProps = {
    onChange: onChange,
    label: 'foo',
    selectedOption: '',
    options: times(5, () => createOption())
  };

  it('renders without error', () => {
    wrapper = mount(<CheckboxWithRadios {...defaultProps} />);
    expect(wrapper.find(CheckboxWithRadios).length).toEqual(1);
  });

  it('does not check the checkbox when there are no options selected', () => {
    wrapper = mount(<CheckboxWithRadios {...defaultProps} />);

    expect(wrapper.find(Checkbox).prop('checked')).toBe(false);
  });

  it('does not display any radios when the checkbox is unchecked', () => {
    wrapper = mount(<CheckboxWithRadios {...defaultProps} />);

    expect(wrapper.find(Checkbox).prop('checked')).toBe(false);
    expect(wrapper.find('input[type="radio"]').length).toBe(0);
  });

  it('displays all the radios when the checkbox is checked', () => {
    wrapper = mount(<CheckboxWithRadios {...defaultProps} />);

    wrapper
      .find(Checkbox)
      .find('.defaultCheckbox')
      .simulate('click');
    expect(wrapper.find('input[type="radio"]').length).toBe(
      defaultProps.options.length
    );
  });

  it('calls the onChange when the radio is changed with the selected option', () => {
    wrapper = mount(<CheckboxWithRadios {...defaultProps} />);

    wrapper
      .find(Checkbox)
      .find('.defaultCheckbox')
      .simulate('click');

    wrapper
      .find('input[type="radio"]')
      .first()
      .simulate('change');

    expect(onChange).toHaveBeenCalledWith(defaultProps.options[0].value);
  });
});
