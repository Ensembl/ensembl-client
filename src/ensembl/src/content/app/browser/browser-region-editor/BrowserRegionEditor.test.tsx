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
import {
  getCommaSeparatedNumber,
  getNumberWithoutCommas
} from 'src/shared/helpers/numberFormatter';
import { createChrLocationValues } from 'tests/fixtures/browser';
import * as browserHelper from '../browserHelper';
import { ChrLocation } from '../browserState';

describe('<BrowserRegionEditor', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const initialChrLocation = createChrLocationValues().tupleValue;
  const defaultProps: BrowserRegionEditorProps = {
    activeGenomeId: faker.lorem.words(),
    chrLocation: initialChrLocation,
    genomeKaryotypes: createGenomeKaryotypes(),
    isActive: true,
    isDisabled: false,
    changeBrowserLocation: jest.fn(),
    changeFocusObject: jest.fn(),
    toggleRegionEditorActive: jest.fn()
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
        regionInput: `${region}:${locationStartInput}-${locationEndInput}`,
        genomeId: wrapper.props().activeGenomeId,
        onSuccess: expect.any(Function),
        onError: expect.any(Function)
      });
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

    describe('on validation failure', () => {
      afterEach(() => {
        jest.restoreAllMocks();
      });

      const locationStartInput = getCommaSeparatedNumber(faker.random.number());
      const locationEndInput = getCommaSeparatedNumber(faker.random.number());
      const startError = faker.lorem.words();
      const endError = faker.lorem.words();

      test('displays the start error message', () => {
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
                startError,
                endError
              });
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
          wrapper
            .find('[role="startInputGroup"]')
            .find(Tooltip)
            .props().children
        ).toBe(startError);
      });

      test('displays the end error message', () => {
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
                endError
              });
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
          wrapper
            .find('[role="endInputGroup"]')
            .find(Tooltip)
            .props().children
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
              onError: (errorMessages: any) => void;
            }) => {
              params.onSuccess(regionId);
            }
          );
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      // TODO: Test for focus object change.
      // This can be done if <Select /> can be tested for change

      test('changes the browser location in same region if stick/chromosome is the same', () => {
        wrapper
          .find(Input)
          .first()
          .simulate('change', { target: { value: locationStartInput } });
        wrapper
          .find(Input)
          .last()
          .simulate('change', { target: { value: locationEndInput } });
        wrapper.find('form').simulate('submit');

        const [stick] = wrapper.props().chrLocation;
        const newChrLocation: ChrLocation = [
          stick,
          getNumberWithoutCommas(locationStartInput),
          getNumberWithoutCommas(locationEndInput)
        ];

        expect(wrapper.props().changeBrowserLocation).toHaveBeenCalledWith(
          wrapper.props().activeGenomeId,
          newChrLocation
        );
      });
    });
  });
});
