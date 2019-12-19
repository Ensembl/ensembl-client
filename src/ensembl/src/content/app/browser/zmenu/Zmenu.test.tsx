import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import Zmenu, { ZmenuProps } from './Zmenu';
import ZmenuContent from './ZmenuContent';

import { createZmenuContent } from 'tests/fixtures/browser';

jest.mock('./ZmenuContent', () => () => <div>ZmenuContent</div>);

describe('<Zmenu />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: ZmenuProps = {
    anchor_coordinates: {
      x: 490,
      y: 80
    },
    browserRef: {
      current: document.createElement('div')
    },
    content: createZmenuContent(),
    id: faker.lorem.words(),
    onEnter: jest.fn(),
    onLeave: jest.fn()
  };

  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(<Zmenu {...defaultProps} />);
  });

  describe('rendering', () => {
    test('renders zmenu content', () => {
      expect(wrapper.find(ZmenuContent)).toHaveLength(1);
    });
  });

  describe('behaviour', () => {
    test('zmenu action is sent to browser on mouse enter', () => {
      wrapper
        .find('div')
        .first()
        .simulate('mouseenter');
      expect(wrapper.props().onEnter).toHaveBeenCalledTimes(1);
    });

    test('zmenu action is sent to browser on mouse leave', () => {
      wrapper
        .find('div')
        .first()
        .simulate('mouseleave');
      expect(wrapper.props().onLeave).toHaveBeenCalledTimes(1);
    });
  });
});
