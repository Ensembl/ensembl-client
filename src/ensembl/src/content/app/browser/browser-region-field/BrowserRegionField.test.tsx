import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import { BrowserRegionField } from './BrowserRegionField';
import Input from 'src/shared/components/input/Input';

import styles from '../browser-nav/BrowserNavBar.scss';

const defaultProps = {
  activeGenomeId: faker.lorem.words(),
  browserRegionEditorActive: false,
  browserRegionFieldActive: false,
  browserRegionFieldErrors: null,
  genomeKaryotypes: [],
  isDrawerOpened: false,
  changeBrowserLocation: jest.fn(),
  resetBrowserRegionValidaion: jest.fn(),
  toggleBrowserRegionFieldActive: jest.fn(),
  validateBrowserRegion: jest.fn()
};

describe('<BrowserRegionField', () => {
  let wrapper: any;
  const regionInput = '1:1-1000';

  beforeEach(() => {
    wrapper = mount(<BrowserRegionField {...defaultProps} />);
  });

  describe('rendering', () => {
    test('contains Input', () => {
      expect(wrapper.find(Input).length).toBe(1);
    });

    test('does not show form buttons when not focussed', () => {
      expect(wrapper.find(styles.browserNavBarButtons).length).toBe(0);
    });

    test('has an overlay on top when region editor is active', () => {
      wrapper.setProps({ browserRegionEditorActive: true });
      expect(wrapper.find('#region-field-overlay').length).toBe(1);
    });
  });

  describe('behaviour', () => {
    test('shows form buttons when focussed', () => {
      wrapper.find(Input).simulate('focus');

      // the activateForm function which fires on focus should call toggleBrowserRegionFieldActive
      expect(
        wrapper.props().toggleBrowserRegionFieldActive
      ).toHaveBeenCalledTimes(1);
    });

    test('applies correct value on change', () => {
      wrapper
        .find(Input)
        .simulate('change', { target: { value: regionInput } });

      expect(wrapper.find(Input).props().value).toBe(regionInput);
    });

    test('validates region input on submit', () => {
      wrapper
        .find(Input)
        .simulate('change', { target: { value: regionInput } });

      wrapper.find('form').simulate('submit');

      expect(wrapper.props().validateBrowserRegion).toHaveBeenCalled();
    });

    test('resets region field after when close button is clicked', () => {
      wrapper
        .find(Input)
        .simulate('change', { target: { value: regionInput } });
      wrapper.find('#close-button').simulate('click');

      expect(wrapper.find(Input).props().value).toBe('');

      // first time toggleBrowserRegionFieldActive is called is when the input is focussed
      // and the second time is when the form is closed
      expect(
        wrapper.props().toggleBrowserRegionFieldActive
      ).toHaveBeenCalledTimes(2);
      expect(wrapper.props().resetBrowserRegionValidaion).toHaveBeenCalledTimes(
        1
      );
    });
  });
});
