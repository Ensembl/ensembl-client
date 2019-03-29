import React from 'react';
import { mount } from 'enzyme';
import ImageButton, { ImageButtonStatus } from './ImageButton';
import ImageHolder from './ImageHolder';

describe('<ImageButton />', () => {
  it('renders without error', () => {
    expect(() => {
      mount(<ImageButton />);
    }).not.toThrow();
  });

  describe('prop buttonStatus', () => {
    it('has a buttonStatus set by default', () => {
      const wrapper = mount(<ImageButton />);

      expect(wrapper.prop('buttonStatus')).toEqual(ImageButtonStatus.DEFAULT);
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
      expect(wrapper.find(ImageHolder).find('img')).toHaveLength(1);
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
      const wrapper = mount(
        <ImageButton buttonStatus={ImageButtonStatus.ACTIVE} />
      );

      expect(wrapper.find(ImageHolder).find('div.default')).toHaveLength(1);
    });

    it('applies the respective className depending on the button status', () => {
      const wrapper = mount(
        <ImageButton buttonStatus={ImageButtonStatus.ACTIVE} />
      );

      expect(wrapper.find(ImageHolder).find('div.active')).toHaveLength(1);
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
        <ImageButton
          onClick={onClick}
          buttonStatus={ImageButtonStatus.DISABLED}
        />
      );

      wrapper.simulate('click');

      expect(onClick).not.toBeCalled();
    });
  });
});
