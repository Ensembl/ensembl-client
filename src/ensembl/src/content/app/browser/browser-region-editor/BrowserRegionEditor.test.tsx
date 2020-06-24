/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
import Overlay from 'src/shared/components/overlay/Overlay';

import { createGenomeKaryotype } from 'tests/fixtures/genomes';
import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';
import {
  createChrLocationValues,
  createRegionValidationMessages
} from 'tests/fixtures/browser';
import * as browserHelper from '../browserHelper';

describe('<BrowserRegionEditor />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const initialChrLocation = createChrLocationValues().tupleValue;
  const defaultProps: BrowserRegionEditorProps = {
    activeGenomeId: faker.lorem.words(),
    chrLocation: initialChrLocation,
    genomeKaryotype: createGenomeKaryotype(),
    isActive: true,
    isDisabled: false,
    changeBrowserLocation: jest.fn(),
    changeFocusObject: jest.fn(),
    toggleRegionEditorActive: jest.fn(),
    replace: jest.fn()
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
    });

    test('has an overlay on top when disabled', () => {
      wrapper.setProps({ isDisabled: true });
      expect(wrapper.find(Overlay).length).toBe(1);
    });
  });

  describe('behaviour', () => {
    test('shows form buttons when focussed', () => {
      wrapper.find('form').simulate('focus');
      expect(wrapper.props().toggleRegionEditorActive).toHaveBeenCalledTimes(1);
    });

    test('validates region input on submit', () => {
      const [stick] = initialChrLocation;
      const locationStartInput = getCommaSeparatedNumber(faker.random.number());
      const locationEndInput = getCommaSeparatedNumber(faker.random.number());
      const validateRegion = jest.fn();

      jest
        .spyOn(browserHelper, 'validateRegion')
        .mockImplementation(validateRegion);

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

      expect(validateRegion).toHaveBeenCalledWith({
        regionInput: `${stick}:${locationStartInput}-${locationEndInput}`,
        genomeId: wrapper.props().activeGenomeId,
        onSuccess: expect.any(Function),
        onError: expect.any(Function)
      });
    });

    // TODO: Test if the form is reset when clicked outside the form. Need to be able to mock useOutsideClick for this.

    describe('on validation failure', () => {
      afterEach(() => {
        jest.restoreAllMocks();
      });

      const locationStartInput = getCommaSeparatedNumber(faker.random.number());
      const locationEndInput = getCommaSeparatedNumber(faker.random.number());
      const startError = faker.lorem.words();
      const endError = faker.lorem.words();
      const mockValidationMessages = createRegionValidationMessages();

      test('displays the start error message', () => {
        const mockErrorMessages = {
          ...mockValidationMessages.errorMessages,
          startError,
          endError
        };

        jest
          .spyOn(browserHelper, 'validateRegion')
          .mockImplementation(
            async (params: {
              regionInput: string;
              genomeId: string | null;
              onSuccess: (regionId: string) => void;
              onError: (
                errorMessages: browserHelper.RegionValidationErrors
              ) => void;
            }) => {
              params.onError(mockErrorMessages);
            }
          );

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

        wrapper.find('form').simulate('submit');

        expect(
          wrapper.find('[role="startInputGroup"]').find(Tooltip).props()
            .children
        ).toBe(startError);
      });

      test('displays the end error message', () => {
        const mockErrorMessages = {
          ...mockValidationMessages.errorMessages,
          endError
        };

        jest
          .spyOn(browserHelper, 'validateRegion')
          .mockImplementation(
            async (params: {
              regionInput: string;
              genomeId: string | null;
              onSuccess: (regionId: string) => void;
              onError: (
                errorMessages: browserHelper.RegionValidationErrors
              ) => void;
            }) => {
              params.onError(mockErrorMessages);
            }
          );

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

        wrapper.find('form').simulate('submit');

        expect(
          wrapper.find('[role="endInputGroup"]').find(Tooltip).props().children
        ).toBe(endError);
      });
    });

    describe('on validation success', () => {
      const locationStartInput = getCommaSeparatedNumber(faker.random.number());
      const locationEndInput = getCommaSeparatedNumber(faker.random.number());
      const regionId = faker.lorem.words();

      beforeEach(() => {
        jest
          .spyOn(browserHelper, 'validateRegion')
          .mockImplementation(
            async (params: {
              regionInput: string;
              genomeId: string | null;
              onSuccess: (regionId: string) => void;
              onError: (
                errorMessages: browserHelper.RegionValidationErrors
              ) => void;
            }) => {
              params.onSuccess(regionId);
            }
          );
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      // TODO:
      // Test focus object change on submission. This can be done if <Select /> value can be changed.

      test('changes the browser location in same region if stick is the same', () => {
        wrapper
          .find(Input)
          .first()
          .simulate('change', { target: { value: locationStartInput } });
        wrapper
          .find(Input)
          .last()
          .simulate('change', { target: { value: locationEndInput } });
        wrapper.find('form').simulate('submit');

        expect(wrapper.props().changeBrowserLocation).toHaveBeenCalled();
      });
    });
  });
});
