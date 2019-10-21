import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import {
  BrowserRegionEditor,
  BrowserRegionEditorProps
} from './BrowserRegionEditor';
import Input from 'src/shared/components/input/Input';
import Select from 'src/shared/components/select/Select';
import Tooltip from 'src/shared/components/tooltip/Tooltip';

import { createGenomeKaryotypes } from 'tests/fixtures/genomes';
import { getCommaSeparatedNumber } from 'src/shared/helpers/numberFormatter';
import {
  createValidationInfo,
  createChrLocationValues
} from 'tests/fixtures/browser';

describe('<BrowserRegionEditor', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const initialChrLocation = createChrLocationValues().tuppleValue;
  const defaultProps: BrowserRegionEditorProps = {
    activeGenomeId: faker.lorem.words(),
    chrLocation: initialChrLocation,
    genomeKaryotypes: createGenomeKaryotypes(),
    isActive: false,
    isDisabled: false,
    isValidationInfoLoading: false,
    validationInfo: {},
    changeBrowserLocation: jest.fn(),
    replace: jest.fn(),
    resetRegionValidation: jest.fn(),
    toggleRegionEditorActive: jest.fn(),
    validateRegion: jest.fn()
  };

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

    test('contains submit and close buttons', () => {
      expect(wrapper.find('button[type="submit"]')).toHaveLength(1);
      expect(wrapper.find('button[role="closeButton"]')).toHaveLength(1);
    });

    test('has an overlay on top when region field is active', () => {
      wrapper.setProps({ isDisabled: true });
      expect(wrapper.find('.browserOverlay').length).toBe(1);
    });
  });

  describe('behaviour', () => {
    test('shows form buttons when focussed', () => {
      wrapper.find(Select).simulate('focus');
      expect(wrapper.props().toggleRegionEditorActive).toHaveBeenCalledTimes(1);
    });

    test('applies correct value on change', () => {
      const locationStartInput = getCommaSeparatedNumber(faker.random.number());
      const locationEndInput = getCommaSeparatedNumber(faker.random.number());

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
      const [region] = initialChrLocation;
      const locationStartInput = getCommaSeparatedNumber(faker.random.number());
      const locationEndInput = getCommaSeparatedNumber(faker.random.number());

      wrapper
        .find(Input)
        .first()
        .simulate('change', {
          target: { value: locationStartInput }
        });

      wrapper
        .find(Input)
        .last()
        .simulate('change', { target: { value: locationEndInput } });

      wrapper.find('form').simulate('submit');

      expect(wrapper.props().validateRegion).toHaveBeenCalledWith(
        `${region}:${locationStartInput}-${locationEndInput}`
      );
    });

    test('resets region editor form when close button is clicked', () => {
      const [, locationStart, locationEnd] = wrapper.props().chrLocation;
      const locationStartInput = getCommaSeparatedNumber(faker.random.number());
      const locationEndInput = getCommaSeparatedNumber(faker.random.number());

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

      wrapper.find('button[role="closeButton"]').simulate('click');

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

      expect(wrapper.props().toggleRegionEditorActive).toHaveBeenCalledTimes(1);
    });

    test('displays the start error message when validation fails', () => {
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
      expect(
        wrapper
          .find('[role="startInputGroup"]')
          .find(Tooltip)
          .props().children
      ).toBe(startErrorMessage);
    });

    test('displays the end error message when validation fails', () => {
      const endErrorMessage = faker.lorem.words();

      wrapper.setProps({
        isActive: true,
        validationInfo: {
          ...createValidationInfo(),
          ...{
            end: {
              error_code: null,
              error_message: endErrorMessage,
              is_valid: false,
              value: 0
            }
          }
        }
      });

      wrapper.update();
      expect(
        wrapper
          .find('[role="endInputGroup"]')
          .find(Tooltip)
          .props().children
      ).toBe(endErrorMessage);
    });
  });
});
