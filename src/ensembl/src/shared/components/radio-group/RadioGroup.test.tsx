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

  it('applies the style "radioInput" by default', () => {
    wrapper = mount(<RadioGroup {...defaultProps} />);
    expect(wrapper.find('.radioInput')).toBeTruthy();
  });

  it('calls the onChange function when radio is changed', () => {
    wrapper = mount(<RadioGroup {...defaultProps} />);

    wrapper
      .find('.radioInput')
      .first()
      .simulate('change');

    expect(onChange).toHaveBeenCalledWith(defaultProps.options[0].value);
  });

  it('does not call onChange function if the status is disabled', () => {
    wrapper = mount(<RadioGroup {...defaultProps} disabled={true} />);

    wrapper
      .find('.radioInput')
      .first()
      .simulate('change');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders N number of radios based on the options passed', () => {
    wrapper = mount(<RadioGroup {...defaultProps} />);

    expect(wrapper.find('.radioInput').length).toBe(
      defaultProps.options.length
    );
  });
});
