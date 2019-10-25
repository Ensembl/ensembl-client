import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import {
  BrowserRegionField,
  BrowserRegionFieldProps
} from './BrowserRegionField';
import Input from 'src/shared/components/input/Input';
import Tooltip from 'src/shared/components/tooltip/Tooltip';

import { ChrLocation } from '../browserState';
import { createChrLocationValues } from 'tests/fixtures/browser';

import * as browserHelper from '../browserHelper';

describe('<BrowserRegionField', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: BrowserRegionFieldProps = {
    activeGenomeId: faker.lorem.words(),
    chrLocation: createChrLocationValues().tupleValue,
    isActive: false,
    isDisabled: false,
    changeBrowserLocation: jest.fn(),
    changeFocusObject: jest.fn(),
    toggleRegionFieldActive: jest.fn()
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
      expect(wrapper.props().toggleRegionFieldActive).toHaveBeenCalledWith(
        true
      );
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
      const validateRegion = jest.fn();

      jest
        .spyOn(browserHelper, 'validateRegion')
        .mockImplementation(validateRegion);

      wrapper
        .find(Input)
        .simulate('change', { target: { value: regionInput } });
      wrapper.find('form').simulate('submit');

      expect(validateRegion).toHaveBeenCalledWith({
        regionInput,
        genomeId: wrapper.props().activeGenomeId,
        onSuccess: expect.any(Function),
        onError: expect.any(Function)
      });

      jest.restoreAllMocks();
    });

    test('resets region field when close button is clicked', () => {
      const regionInput = createChrLocationValues().stringValue;

      wrapper
        .find(Input)
        .simulate('change', { target: { value: regionInput } });
      wrapper.find('button[role="closeButton"]').simulate('click');

      expect(wrapper.find(Input).props().value).toBe('');
      expect(wrapper.props().toggleRegionFieldActive).toHaveBeenCalledWith(
        false
      );
    });

    test('displays error message when validation fails', () => {
      const regionInput = faker.lorem.words();
      const startError = faker.lorem.words();

      jest
        .spyOn(browserHelper, 'validateRegion')
        .mockImplementation(
          async (params: {
            regionInput: string;
            genomeId: string | null;
            onSuccess: (regionId: string) => void;
            onError: (errorMessages: any) => void;
          }) => {
            params.onError({
              startError
            });
          }
        );

      wrapper
        .find(Input)
        .simulate('change', { target: { value: regionInput } });
      wrapper.find('form').simulate('submit');

      expect(wrapper.find(Tooltip).props().children).toBe(startError);

      jest.restoreAllMocks();
    });

    describe('on validation success', () => {
      const regionId = faker.lorem.words();

      beforeEach(() => {
        jest
          .spyOn(browserHelper, 'validateRegion')
          .mockImplementation(
            async (params: {
              regionInput: string;
              genomeId: string | null;
              onSuccess: (regionId: string) => void;
              onError: (errorMessages: any) => void;
            }) => {
              params.onSuccess(regionId);
            }
          );
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      test('changes the focus object if regionInput has a stick/chromosome', () => {
        const stick = faker.random.number();
        const start = faker.random.number();
        const end = faker.random.number();
        const regionInput = `${stick}:${start}-${end}`;

        wrapper
          .find(Input)
          .simulate('change', { target: { value: regionInput } });
        wrapper.find('form').simulate('submit');

        expect(wrapper.props().changeFocusObject).toHaveBeenCalledWith(
          regionId
        );
      });

      test('changes the browser location in same region if regionInput has only start and end (no stick/chromosome)', () => {
        const start = faker.random.number();
        const end = faker.random.number();
        const regionInput = `${start}-${end}`;
        const { activeGenomeId, chrLocation } = wrapper.props();
        const [stick] = chrLocation;

        wrapper
          .find(Input)
          .simulate('change', { target: { value: regionInput } });
        wrapper.find('form').simulate('submit');

        const newChrLocation: ChrLocation = [stick, start, end];

        expect(wrapper.props().changeBrowserLocation).toHaveBeenCalledWith(
          activeGenomeId,
          newChrLocation
        );
      });
    });
  });
});
