import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import { BrowserRegionEditor } from './BrowserRegionEditor';
import Input from 'src/shared/components/input/Input';
import Select from 'src/shared/components/select/Select';

import { ChrLocation } from '../browserState';
import genomeKaryotypes from 'tests/data/browser/karyotypes';

import { getCommaSeparatedNumber } from 'src/shared/helpers/numberFormatter';
import Tooltip from 'src/shared/components/tooltip/Tooltip';
import { LoadingState } from 'src/shared/types/loading-state';

import styles from '../browser-nav/BrowserNavBar.scss';

const defaultProps = {
  activeGenomeId: faker.lorem.words(),
  chrLocation: ['13', 2315086, 32400266] as ChrLocation,
  genomeKaryotypes,
  regionEditorActive: false,
  regionFieldActive: false,
  regionValidationInfo: {},
  regionValidationLoadingStatus: LoadingState.NOT_REQUESTED,
  changeBrowserLocation: jest.fn(),
  replace: jest.fn(),
  resetRegionValidation: jest.fn(),
  toggleRegionEditorActive: jest.fn(),
  validateRegion: jest.fn()
};

describe('<BrowserRegionEditor', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(<BrowserRegionEditor {...defaultProps} />);
  });

  describe('rendering', () => {
    test('contains Select', () => {
      expect(wrapper.find(Select).length).toBe(1);
    });

    test('contains two Input elements', () => {
      expect(wrapper.find(Input).length).toBe(2);
    });

    test('does not show form buttons when not focussed', () => {
      expect(wrapper.find(styles.browserNavBarButtons).length).toBe(0);
    });

    test('has an overlay on top when region field is active', () => {
      wrapper.setProps({ regionFieldActive: true });
      expect(wrapper.find('#region-field-overlay').length).toBe(1);
    });
  });

  describe('behaviour', () => {
    const locationStartInput = getCommaSeparatedNumber(10);
    const locationEndInput = getCommaSeparatedNumber(10500);

    test('shows form buttons when focussed', () => {
      wrapper.find(Select).simulate('focus');

      expect(wrapper.props().toggleRegionEditorActive).toHaveBeenCalledTimes(1);
    });

    test('applies correct value on change', () => {
      // TODO:
      // Couldn't find a good way to test this for <Select />. So write tests once it is figured out.

      wrapper
        .find(Input)
        .first()
        .simulate('change', { target: { value: locationStartInput } });

      expect(
        wrapper
          .find(Input)
          .first()
          .props().value
      ).toBe(locationStartInput);

      wrapper
        .find(Input)
        .last()
        .simulate('change', { target: { value: locationEndInput } });

      expect(
        wrapper
          .find(Input)
          .last()
          .props().value
      ).toBe(locationEndInput);
    });

    test('validates region input on submit', () => {
      wrapper
        .find(Input)
        .first()
        .simulate('change', { target: { value: getCommaSeparatedNumber(0) } });

      wrapper.find('form').simulate('submit');

      expect(wrapper.props().validateRegion).toHaveBeenCalled();
    });

    test('resets region editor form when close button is clicked', () => {
      const [, locationStart, locationEnd] = wrapper.props().chrLocation;

      wrapper
        .find(Input)
        .first()
        .simulate('change', { target: { value: locationStartInput } });

      wrapper
        .find(Input)
        .last()
        .simulate('change', {
          target: { value: locationEndInput }
        });

      wrapper.find('#close-button').simulate('click');

      expect(
        wrapper
          .find(Input)
          .first()
          .props().value
      ).toBe(getCommaSeparatedNumber(locationStart));

      expect(
        wrapper
          .find(Input)
          .last()
          .props().value
      ).toBe(getCommaSeparatedNumber(locationEnd));

      // first time toggleRegionEditorActive is called is when the input is focussed
      // and the second time is when the form is closed
      expect(wrapper.props().toggleRegionEditorActive).toHaveBeenCalledTimes(2);
    });
  });
});
