import React from 'react';
import { mount } from 'enzyme';
import CheckboxWithRadios from './CheckboxWithRadios';
import Checkbox from 'src/shared/checkbox/Checkbox';
import { radioOptions } from 'src/shared/radio/Radio';

const onChange = jest.fn();

const radioOptions: radioOptions = [
  {
    value: 'one',
    label: 'one'
  },
  {
    value: 'two',
    label: 'two'
  }
];

describe('<CheckboxWithRadios />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  let wrapper: any;
  const defaultProps = {
    onChange: onChange,
    label: 'foo',
    selectedOption: '',
    radioOptions: radioOptions
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
      radioOptions.length
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

    expect(onChange).toHaveBeenLastCalledWith('one');
  });
});
