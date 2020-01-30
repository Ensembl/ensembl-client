import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import faker from 'faker';

import { ImageButton, Props as ImageButtonProps } from './ImageButton';

import Tooltip from 'src/shared/components/tooltip/Tooltip';

import { Status } from 'src/shared/types/status';

jest.mock(
  'src/shared/components/tooltip/Tooltip',
  () => ({ children }: { children: any }) => (
    <div className="tooltip">{children}</div>
  )
);

const defaultProps = {
  image: ''
};

describe('<ImageButton />', () => {
  const renderImageButton = (props: Partial<ImageButtonProps> = {}) =>
    mount(<ImageButton {...defaultProps} {...props} />);

  it('renders without error', () => {
    expect(() => renderImageButton()).not.toThrow();
  });

  describe('prop status', () => {
    it('has a status set by default', () => {
      const wrapper = renderImageButton();

      expect(wrapper.prop('status')).toEqual(Status.DEFAULT);
    });
  });

  describe('prop description', () => {
    it('has a description set by default', () => {
      const wrapper = renderImageButton();

      expect(wrapper.prop('description')).toEqual('');
    });

    it('respects the description prop', () => {
      const wrapper = renderImageButton({ description: 'foo' });

      expect(wrapper.prop('description')).toEqual('foo');
    });
  });

  describe('prop image', () => {
    it('has an image set by default', () => {
      const wrapper = renderImageButton();

      expect(wrapper.prop('image')).toEqual('');
    });

    it('renders an img tag if a path to an image file is passed', () => {
      const wrapper = renderImageButton({ image: 'foo.png' });

      expect(wrapper.find('button').find('img[src="foo.png"]')).toHaveLength(1);
    });

    it('renders the svg file passed in', () => {
      const mockSVG = () => {
        return <svg />;
      };

      const wrapper = renderImageButton({ image: mockSVG });
      expect(wrapper.find('button').find(mockSVG)).toHaveLength(1);
    });
  });

  describe('prop classNames', () => {
    it('applies the default className when no status is provided', () => {
      const wrapper = renderImageButton();

      expect(wrapper.find('.default')).toHaveLength(1);
    });

    it('applies the respective className depending on the button status', () => {
      const wrapper = renderImageButton({ status: Status.SELECTED });

      expect(wrapper.find('.selected')).toHaveLength(1);
    });
  });

  describe('prop onClick', () => {
    const onClick = jest.fn();
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('calls the onClick prop when clicked', () => {
      const wrapper = renderImageButton({ onClick });

      wrapper.simulate('click');

      expect(onClick).toBeCalled();
    });

    it('does not call the onClick prop when clicked if the status is disabled', () => {
      const wrapper = renderImageButton({
        onClick,
        status: Status.DISABLED
      });

      wrapper.simulate('click');

      expect(onClick).not.toBeCalled();
    });
  });

  describe('tooltip on hover', () => {
    const mockSVG = () => {
      return <svg />;
    };
    const description = faker.lorem.words();
    const props = {
      image: mockSVG,
      description
    };
    const mouseEnterEvent = new Event('mouseenter');
    const clickEvent = new Event('click');

    it('shows tooltip when moused over', () => {
      const wrapper = renderImageButton(props);
      expect(wrapper.find(Tooltip).length).toBe(0);

      act(() => {
        wrapper.getDOMNode().dispatchEvent(mouseEnterEvent);
      });
      wrapper.update();

      const tooltip = wrapper.find(Tooltip);
      expect(tooltip.length).toBe(1);
      expect(tooltip.text()).toBe(description);
    });

    it('does not show tooltip if clicked', () => {
      const wrapper = renderImageButton(props);

      act(() => {
        const rootNode = wrapper.getDOMNode();
        rootNode.dispatchEvent(mouseEnterEvent);
        rootNode.dispatchEvent(clickEvent);
      });
      wrapper.update();

      expect(wrapper.find(Tooltip).length).toBe(0);
    });

    it('does not show tooltip if description is not provided', () => {
      const wrapper = renderImageButton({ ...props, description: '' });

      act(() => {
        wrapper.getDOMNode().dispatchEvent(mouseEnterEvent);
      });
      wrapper.update();

      expect(wrapper.find(Tooltip).length).toBe(0);
    });
  });
});
