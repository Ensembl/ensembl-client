import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import {
  BrowserRegionField,
  BrowserRegionFieldProps
} from './BrowserRegionField';
import Input from 'src/shared/components/input/Input';
import Tooltip from 'src/shared/components/tooltip/Tooltip';

import {
  createValidationInfo,
  createChrLocationValues
} from 'tests/fixtures/browser';

describe('<BrowserRegionField', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: BrowserRegionFieldProps = {
    activeGenomeId: faker.lorem.words(),
    chrLocation: createChrLocationValues().tuppleValue,
    isActive: false,
    isDisabled: false,
    isValidationInfoLoading: false,
    validationInfo: null,
    changeBrowserLocation: jest.fn(),
    replace: jest.fn(),
    resetRegionValidation: jest.fn(),
    toggleRegionFieldActive: jest.fn(),
    validateRegion: jest.fn()
  };

  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(<BrowserRegionField {...defaultProps} />);
  });

  describe('rendering', () => {
    test('contains Input', () => {
      expect(wrapper.find(Input).length).toBe(1);
    });

    test('contains submit and close buttons', () => {
      expect(wrapper.find('button[type="submit"]')).toHaveLength(1);
      expect(wrapper.find('button[role="closeButton"]')).toHaveLength(1);
    });

    test('has an overlay on top when region editor is active', () => {
      wrapper.setProps({ isDisabled: true });
      expect(wrapper.find('.browserOverlay').length).toBe(1);
    });
  });

  describe('behaviour', () => {
    test('region field is set to active when focussed', () => {
      wrapper.find(Input).simulate('focus');

      // the activateForm function which fires on focus should call toggleRegionFieldActive
      expect(wrapper.props().toggleRegionFieldActive).toHaveBeenCalledTimes(1);
    });

    test('applies correct value on change', () => {
      const regionInput = createChrLocationValues().stringValue;
      wrapper
        .find(Input)
        .simulate('change', { target: { value: regionInput } });

      expect(wrapper.find(Input).props().value).toBe(regionInput);
    });

    test('validates region input on submit', () => {
      const regionInput = createChrLocationValues().stringValue;
      wrapper
        .find(Input)
        .simulate('change', { target: { value: regionInput } });

      wrapper.find('form').simulate('submit');

      expect(wrapper.props().validateRegion).toHaveBeenCalled();
    });

    test('resets region field when close button is clicked', () => {
      const regionInput = createChrLocationValues().stringValue;
      wrapper
        .find(Input)
        .simulate('change', { target: { value: regionInput } });
      jest.resetAllMocks();

      wrapper.find('button[role="closeButton"]').simulate('click');
      expect(wrapper.find(Input).props().value).toBe('');
      expect(wrapper.props().toggleRegionFieldActive).toHaveBeenCalledTimes(1);
      expect(wrapper.props().resetRegionValidation).toHaveBeenCalledTimes(1);
    });

    test('displays error message when validation fails', () => {
      const startErrorMessage = faker.lorem.words();

      wrapper.setProps({
        isActive: true,
        validationInfo: {
          ...createValidationInfo(),
          ...{
            start: {
              error_code: null,
              error_message: startErrorMessage,
              is_valid: false,
              value: 0
            }
          }
        }
      });

      wrapper.update();
      expect(wrapper.find(Tooltip).props().children).toBe(startErrorMessage);
    });
  });
});
