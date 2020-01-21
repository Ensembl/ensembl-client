import React from 'react';
import { mount, render } from 'enzyme';
import faker from 'faker';

import SlideToggle from './SlideToggle';

const defaultProps = {
  isOn: false,
  onChange: jest.fn()
};

describe('SlideToggle', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('has proper class when off', () => {
      const renderedComponent = render(<SlideToggle {...defaultProps} />);
      expect(renderedComponent.hasClass('slideToggleOff')).toBe(true);
    });

    it('has proper class when on', () => {
      const props = {
        ...defaultProps,
        isOn: true
      };
      const renderedComponent = render(<SlideToggle {...props} />);
      expect(renderedComponent.hasClass('slideToggleOn')).toBe(true);
    });

    it('adds class received from parent', () => {
      const externalClassName = faker.random.word();
      const props = {
        ...defaultProps,
        className: externalClassName
      };
      const renderedComponent = render(<SlideToggle {...props} />);
      expect(renderedComponent.hasClass(externalClassName)).toBe(true);
    });
  });

  describe('behaviour', () => {
    test('correctly calls callback when switched on', () => {
      const wrapper = mount(<SlideToggle {...defaultProps} />);
      wrapper.simulate('click');

      expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
      expect(defaultProps.onChange).toHaveBeenCalledWith(true);
    });

    test('correctly calls callback when switched off', () => {
      const props = {
        ...defaultProps,
        isOn: true
      };
      const wrapper = mount(<SlideToggle {...props} />);
      wrapper.simulate('click');

      expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
      expect(defaultProps.onChange).toHaveBeenCalledWith(false);
    });
  });
});
