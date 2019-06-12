import React from 'react';
import { mount } from 'enzyme';
import Radio, { RadioOptions } from './Radio';

const onChange = jest.fn();

const options: RadioOptions = [
  {
    value: 'one',
    label: 'one'
  },
  {
    value: 'two',
    label: 'two'
  }
];

describe('<Radio />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps = {
    selectedOption: '',
    onChange: onChange,
    radioOptions: options
  };

  let wrapper: any;

  it('renders without error', () => {
    expect(() => {
      mount(<Radio {...defaultProps} />);
    }).not.toThrow();
  });

  it('applies the style "radioInput" by default', () => {
    wrapper = mount(<Radio {...defaultProps} />);
    expect(wrapper.find('.radioInput')).toBeTruthy();
  });

  it('calls the onChange function when radio is changed', () => {
    wrapper = mount(<Radio {...defaultProps} />);

    wrapper
      .find('.radioInput')
      .first()
      .simulate('change');

    expect(onChange).toHaveBeenCalledWith('one');
  });

  it('does not call onChange function if the status is disabled', () => {
    wrapper = mount(<Radio {...defaultProps} disabled={true} />);

    wrapper
      .find('.radioInput')
      .first()
      .simulate('change');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders N number of radios based on the radioOptions passed', () => {
    wrapper = mount(<Radio {...defaultProps} />);

    expect(wrapper.find('.radioInput').length).toBe(options.length);
  });
});
