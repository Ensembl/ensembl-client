import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import faker from 'faker';

import { ImageButton } from './ImageButton';
import ImageHolder from './ImageHolder';

import Tooltip from 'src/shared/components/tooltip/Tooltip';

import { Status } from 'src/shared/types/status';

jest.mock(
  'src/shared/components/tooltip/Tooltip',
  () => ({ children }: { children: any }) => (
    <div className="tooltip">{children}</div>
  )
);

describe('<ImageButton />', () => {
  it('renders without error', () => {
    expect(() => {
      mount(<ImageButton />);
    }).not.toThrow();
  });

  describe('prop buttonStatus', () => {
    it('has a buttonStatus set by default', () => {
      const wrapper = mount(<ImageButton />);

      expect(wrapper.prop('buttonStatus')).toEqual(Status.DEFAULT);
    });
  });

  describe('prop description', () => {
    it('has a description set by default', () => {
      const wrapper = mount(<ImageButton />);

      expect(wrapper.prop('description')).toEqual('');
    });

    it('respects the description prop', () => {
      const wrapper = mount(<ImageButton description={'foo'} />);

      expect(wrapper.prop('description')).toEqual('foo');
    });
  });

  describe('prop image', () => {
    it('has an image set by default', () => {
      const wrapper = mount(<ImageButton />);

      expect(wrapper.prop('image')).toEqual('');
    });

    it('renders an img tag if a path to an image file is passed', () => {
      const wrapper = mount(<ImageButton image={'foo.png'} />);

      expect(typeof wrapper.find(ImageHolder).prop('image')).toBe('string');
      expect(wrapper.find(ImageHolder).find('img[src="foo.png"]')).toHaveLength(
        1
      );
    });

    it('renders the svg file passed in', () => {
      const mockSVG = () => {
        return <svg />;
      };
      const wrapper = mount(<ImageButton image={mockSVG} />);
      expect(wrapper.find(ImageHolder).find(mockSVG)).toHaveLength(1);
    });
  });

  describe('prop classNames', () => {
    it('always has the default className applied', () => {
      const wrapper = mount(<ImageButton buttonStatus={Status.DEFAULT} />);

      expect(wrapper.find(ImageHolder).find('div.default')).toHaveLength(1);
    });

    it('applies the respective className depending on the button status', () => {
      const wrapper = mount(<ImageButton buttonStatus={Status.SELECTED} />);

      expect(wrapper.find(ImageHolder).find('div.selected')).toHaveLength(1);
    });
  });

  describe('prop onClick', () => {
    const onClick = jest.fn();
    afterEach(() => {
      jest.resetAllMocks();
    });
    it('calls the onClick prop when clicked', () => {
      const wrapper = mount(<ImageButton onClick={onClick} />);

      wrapper.simulate('click');

      expect(onClick).toBeCalled();
    });

    it('does not call the onClick prop when clicked if the status is disabled', () => {
      const wrapper = mount(
        <ImageButton onClick={onClick} buttonStatus={Status.DISABLED} />
      );

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
      const wrapper = mount(<ImageButton {...props} />);
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
      const wrapper = mount(<ImageButton {...props} />);

      act(() => {
        const rootNode = wrapper.getDOMNode();
        rootNode.dispatchEvent(mouseEnterEvent);
        rootNode.dispatchEvent(clickEvent);
      });
      wrapper.update();

      expect(wrapper.find(Tooltip).length).toBe(0);
    });

    it('does not show tooltip if description is not provided', () => {
      const wrapper = mount(<ImageButton {...props} description="" />);

      act(() => {
        wrapper.getDOMNode().dispatchEvent(mouseEnterEvent);
      });
      wrapper.update();

      expect(wrapper.find(Tooltip).length).toBe(0);
    });
  });
});
