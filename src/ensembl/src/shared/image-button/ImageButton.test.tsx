import React from 'react';
import { mount } from 'enzyme';
import ImageButton, { ImageButtonStatus } from './ImageButton';

describe('<ImageButton />', () => {
  it('renders without error', () => {
    expect(() => {
      mount(<ImageButton />);
    }).not.toThrow();
  });

  describe('prop buttonStatus', () => {
    it('has a buttonStatus set by default', () => {
      const wrapper = mount(<ImageButton />);

      expect(wrapper.props().buttonStatus).toEqual(ImageButtonStatus.DEFAULT);
    });

    it('respects the buttonStatus prop', () => {
      const wrapper = mount(
        <ImageButton buttonStatus={ImageButtonStatus.ACTIVE} />
      );

      expect(wrapper.props().buttonStatus).toEqual(ImageButtonStatus.ACTIVE);
    });
  });

  describe('prop description', () => {
    it('has a description set by default', () => {
      const wrapper = mount(<ImageButton />);

      expect(wrapper.props().description).toEqual('');
    });

    it('respects the description prop', () => {
      const wrapper = mount(<ImageButton description={'foo'} />);

      expect(wrapper.props().description).toEqual('foo');
    });
  });

  describe('prop image', () => {
    it('has a image set by default', () => {
      const wrapper = mount(<ImageButton />);

      expect(wrapper.props().image).toEqual('');
    });

    it('respects the image prop', () => {
      const wrapper = mount(<ImageButton image={'foo.svg'} />);

      expect(wrapper.props().image).toEqual('foo.svg');
    });
  });

  describe('prop classNames', () => {
    it('respects the classNames prop', () => {
      const wrapper = mount(<ImageButton classNames={'foo'} />);

      expect(wrapper.props().classNames).toEqual('foo');
    });
  });

  describe('prop onClick', () => {
    const onClick = jest.fn();
    it('respects the onClick prop', () => {
      const wrapper = mount(<ImageButton onClick={onClick} />);

      wrapper.simulate('click');

      expect(onClick).toBeCalled();
    });
  });
});
