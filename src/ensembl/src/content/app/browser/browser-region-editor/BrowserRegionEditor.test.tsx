import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import faker from 'faker';

import { BrowserRegionEditor } from './BrowserRegionEditor';
import Input from 'src/shared/components/input/Input';
import Select from 'src/shared/components/select/Select';

import { ChrLocation } from '../browserState';
import genomeKaryotypes from 'tests/data/browser/karyotypes';

import { getCommaSeparatedNumber } from 'src/shared/helpers/numberFormatter';

import styles from '../browser-nav/BrowserNavBar.scss';
import Tooltip from 'src/shared/components/tooltip/Tooltip';

const defaultProps = {
  activeGenomeId: faker.lorem.words(),
  chrLocation: ['13', 2315086, 32400266] as ChrLocation,
  genomeKaryotypes,
  regionEditorActive: false,
  regionFieldActive: false,
  regionValidationInfo: {},
  changeBrowserLocation: jest.fn(),
  replace: jest.fn(),
  toggleBrowserRegionEditorActive: jest.fn()
};

describe('<BrowserRegionEditor', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter>
        <BrowserRegionEditor {...defaultProps} />
      </MemoryRouter>
    );
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
      wrapper.setProps({ browserRegionFieldActive: true });
      expect(wrapper.find('#region-field-overlay').length).toBe(1);
    });
  });

  describe('behaviour', () => {
    const locationStartInput = getCommaSeparatedNumber(10);
    const locationEndInput = getCommaSeparatedNumber(10500);

    test('shows form buttons when focussed', () => {
      wrapper.find(Select).simulate('focus');

      expect(
        wrapper.props().toggleBrowserRegionEditorActive
      ).toHaveBeenCalledTimes(1);
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

      expect(wrapper.props().changeBrowserLocation).not.toHaveBeenCalledTimes(
        1
      );
      expect(wrapper.find('#location-start-input').find(Tooltip).length).toBe(
        1
      );
    });

    test('resets region editor form when close button is clicked', () => {
      const [
        region,
        locationStart,
        locationEnd
      ] = wrapper.props().actualChrLocation;

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

      // first time toggleBrowserRegionEditorActive is called is when the input is focussed
      // and the second time is when the form is closed
      expect(
        wrapper.props().toggleBrowserRegionEditorActive
      ).toHaveBeenCalledTimes(2);
    });
  });
});
