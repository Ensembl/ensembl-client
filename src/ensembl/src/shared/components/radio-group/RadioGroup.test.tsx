import React from 'react';
import { mount } from 'enzyme';
import RadioGroup from './RadioGroup';

import faker from 'faker';
import times from 'lodash/times';

const onChange = jest.fn();

const createOption = () => ({
  value: faker.random.uuid(),
  label: faker.random.words(5)
});

describe('<RadioGroup />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps = {
    selectedOption: '',
    onChange: onChange,
    options: times(5, () => createOption())
  };

  let wrapper: any;

  it('renders without error', () => {
    expect(() => {
      mount(<RadioGroup {...defaultProps} />);
    }).not.toThrow();
  });

  it('does not call the onChange function when clicking on already selected option', () => {
    const selectedOption = defaultProps.options[0].value;
    wrapper = mount(
      <RadioGroup {...defaultProps} selectedOption={selectedOption} />
    );

    wrapper
      .find('.radio')
      .first()
      .simulate('click');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls the onChange function when option is changed', () => {
    const selectedOption = defaultProps.options[1].value;
    wrapper = mount(
      <RadioGroup {...defaultProps} selectedOption={selectedOption} />
    );

    wrapper
      .find('.radio')
      .first()
      .simulate('click');

    expect(onChange).toHaveBeenCalledWith(defaultProps.options[0].value);
  });

  it('does not call onChange function if the status is disabled', () => {
    wrapper = mount(<RadioGroup {...defaultProps} disabled={true} />);

    wrapper
      .find('.radio')
      .first()
      .simulate('change');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders as many radio buttons as the number of passed options', () => {
    wrapper = mount(<RadioGroup {...defaultProps} />);

    expect(wrapper.find('.radio').length).toBe(defaultProps.options.length);
  });
});
