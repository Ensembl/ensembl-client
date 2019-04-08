import React from 'react';
import { mount } from 'enzyme';
import Checkbox, { CheckboxStatus } from './Checkbox';
import faker from 'faker';

const onClick = jest.fn();

describe('<Checkbox />', () => {
  it('renders without error', () => {
    expect(() => {
      mount(<Checkbox />);
    }).not.toThrow();
  });

  it('applies the style "unchecked" by default', () => {
    const wrapper = mount(<Checkbox />);
    expect(wrapper.find('div.unchecked')).toHaveLength(1);
  });

  describe('prop label', () => {
    it('does not display any lable by default', () => {
      const wrapper = mount(<Checkbox />);
      expect(wrapper.find('div.label')).toHaveLength(0);
    });

    it('displays the label if it is passed in', () => {
      const label = faker.lorem.words();
      const wrapper = mount(<Checkbox label={label} />);

      expect(wrapper.find('div.label').text()).toBe(label);
    });
  });
});
