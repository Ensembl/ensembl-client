import React from 'react';
import { mount } from 'enzyme';

import { Drawer, DrawerProps } from './Drawer';

import { createEnsObject } from 'tests/fixtures/ens-object';

describe('<Drawer />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: DrawerProps = {
    drawerView: 'gene-pc-fwd',
    ensObject: createEnsObject(),
    closeDrawer: jest.fn()
  };

  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(<Drawer {...defaultProps} />);
  });

  describe('rendering', () => {
    test('renders drawer view button', () => {
      expect(wrapper.find('.closeButton')).toHaveLength(1);
    });
  });

  describe('behaviour', () => {
    test('closes drawer when close button is clicked', () => {
      wrapper.find('.closeButton').simulate('click');
      expect(wrapper.props().closeDrawer).toHaveBeenCalledTimes(1);
    });
  });
});
