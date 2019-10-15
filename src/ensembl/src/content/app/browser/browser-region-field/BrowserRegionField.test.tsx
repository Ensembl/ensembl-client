import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import { BrowserRegionField } from './BrowserRegionField';
import Input from 'src/shared/components/input/Input';
import Tooltip from 'src/shared/components/tooltip/Tooltip';

import { ChrLocation } from '../browserState';
import { LoadingState } from 'src/shared/types/loading-state';
import genomeKaryotypes from 'tests/data/browser/karyotypes';
import { createValidationInfo } from 'tests/fixtures/browser';

const defaultProps = {
  activeGenomeId: faker.lorem.words(),
  chrLocation: ['13', 2315086, 32400266] as ChrLocation,
  genomeKaryotypes: genomeKaryotypes,
  isDrawerOpened: false,
  regionEditorActive: false,
  regionFieldActive: false,
  regionValidationInfo: null,
  regionValidationLoadingStatus: LoadingState.NOT_REQUESTED,
  changeBrowserLocation: jest.fn(),
  replace: jest.fn(),
  resetRegionValidation: jest.fn(),
  toggleRegionFieldActive: jest.fn(),
  validateRegion: jest.fn()
};

describe('<BrowserRegionField', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  let wrapper: any;
  const regionInput = '1:1-1000';

  beforeEach(() => {
    wrapper = mount(<BrowserRegionField {...defaultProps} />);
  });

  describe('rendering', () => {
    test('contains Input', () => {
      expect(wrapper.find(Input).length).toBe(1);
    });

    test('contains submit and close buttons', () => {
      expect(wrapper.find('.submitButton')).toHaveLength(1);
      expect(wrapper.find('.closeButton')).toHaveLength(1);
    });

    test('has an overlay on top when region editor is active', () => {
      wrapper.setProps({ regionEditorActive: true });
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

      expect(wrapper.props().validateRegion).toHaveBeenCalled();
    });

    test('resets region field when close button is clicked', () => {
      wrapper
        .find(Input)
        .simulate('change', { target: { value: regionInput } });
      jest.resetAllMocks();

      wrapper.find('.closeButton').simulate('click');
      expect(wrapper.find(Input).props().value).toBe('');
      expect(wrapper.props().toggleRegionFieldActive).toHaveBeenCalledTimes(1);
      expect(wrapper.props().resetRegionValidation).toHaveBeenCalledTimes(1);
    });

    test('displays error message when validation fails', () => {
      wrapper.setProps({
        regionFieldActive: true,
        regionValidationInfo: Object.assign({}, createValidationInfo(), {
          start: {
            error_code: null,
            error_message: 'Start should be between 1 and 248956422',
            is_valid: false,
            value: 0
          }
        })
      });

      wrapper.update();
      expect(wrapper.find(Tooltip)).toHaveLength(1);
    });
  });
});
