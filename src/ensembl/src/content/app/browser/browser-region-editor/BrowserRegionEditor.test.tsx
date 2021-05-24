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
import { screen, render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import faker from 'faker';

import {
  BrowserRegionEditor,
  BrowserRegionEditorProps
} from './BrowserRegionEditor';

import { createGenomeKaryotype } from 'tests/fixtures/genomes';
import {
  getCommaSeparatedNumber,
  getNumberWithoutCommas
} from 'src/shared/helpers/formatters/numberFormatter';
import {
  createChrLocationValues,
  createRegionValidationMessages
} from 'tests/fixtures/browser';
import * as browserHelper from '../browserHelper';

jest.mock('src/shared/components/select/Select', () => () => (
  <div className="select" />
));
jest.mock('src/shared/components/overlay/Overlay', () => () => (
  <div className="overlay" />
));

jest.mock('../browserHelper');

describe('<BrowserRegionEditor />', () => {
  const initialChrLocation = createChrLocationValues().tupleValue;
  const defaultProps: BrowserRegionEditorProps = {
    activeGenomeId: faker.lorem.words(),
    chrLocation: initialChrLocation,
    genomeKaryotype: createGenomeKaryotype(),
    isActive: true,
    isDisabled: false,
    changeBrowserLocation: jest.fn(),
    changeFocusObject: jest.fn(),
    toggleRegionEditorActive: jest.fn()
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('contains Select', () => {
      const { container } = render(<BrowserRegionEditor {...defaultProps} />);
      expect(container.querySelector('.select')).toBeTruthy();
    });

    it('contains two input elements', () => {
      const { container } = render(<BrowserRegionEditor {...defaultProps} />);
      expect(container.querySelectorAll('input').length).toBe(2);
    });

    it('contains submit and close buttons', () => {
      const { container } = render(<BrowserRegionEditor {...defaultProps} />);
      expect(container.querySelector('button[type="submit"]')).toBeTruthy();
    });

    it('has an overlay on top when disabled', () => {
      const { container } = render(
        <BrowserRegionEditor {...defaultProps} isDisabled={true} />
      );
      expect(container.querySelector('.overlay')).toBeTruthy();
    });
  });

  describe('behaviour', () => {
    it('shows form buttons when focussed', () => {
      const { container } = render(<BrowserRegionEditor {...defaultProps} />);
      const form = container.querySelector('form') as HTMLFormElement;

      fireEvent.focus(form);

      expect(defaultProps.toggleRegionEditorActive).toHaveBeenCalledTimes(1);
    });

    it('validates region input on submit', () => {
      const [stick] = initialChrLocation;
      const locationStartInput = getCommaSeparatedNumber(
        faker.datatype.number()
      );
      const locationEndInput = getCommaSeparatedNumber(faker.datatype.number());

      const { container } = render(<BrowserRegionEditor {...defaultProps} />);
      const [firstInput, secondInput] = container.querySelectorAll('input');
      const submitButton = container.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;

      userEvent.clear(firstInput);
      userEvent.type(firstInput, locationStartInput);

      userEvent.clear(secondInput);
      userEvent.type(secondInput, locationEndInput);

      userEvent.click(submitButton);

      expect(browserHelper.validateRegion).toHaveBeenCalledWith({
        regionInput: `${stick}:${locationStartInput}-${locationEndInput}`,
        genomeId: defaultProps.activeGenomeId,
        onSuccess: expect.any(Function),
        onError: expect.any(Function)
      });
    });

    // TODO: Test if the form is reset when clicked outside the form. Need to be able to mock useOutsideClick for this.

    describe('on validation failure', () => {
      afterEach(() => {
        jest.restoreAllMocks();
      });

      const locationStartInput = getCommaSeparatedNumber(
        faker.datatype.number()
      );
      const locationEndInput = getCommaSeparatedNumber(faker.datatype.number());
      const startError = 'start error message';
      const endError = 'end error message';
      const mockValidationMessages = createRegionValidationMessages();

      it('displays the start error message', async () => {
        const mockErrorMessages = {
          ...mockValidationMessages.errorMessages,
          startError,
          endError
        };

        jest
          .spyOn(browserHelper, 'validateRegion')
          .mockImplementation(
            async ({
              onError
            }: {
              onError: (arg: typeof mockErrorMessages) => void;
            }): Promise<void> => onError(mockErrorMessages)
          );

        const { container } = render(<BrowserRegionEditor {...defaultProps} />);
        const [firstInput, secondInput] = container.querySelectorAll('input');
        const submitButton = container.querySelector(
          'button[type="submit"]'
        ) as HTMLButtonElement;

        userEvent.clear(firstInput);
        userEvent.type(firstInput, locationStartInput);

        userEvent.clear(secondInput);
        userEvent.type(secondInput, locationEndInput);

        userEvent.click(submitButton);

        const errorMessageElement = await screen.findByText(startError);
        expect(errorMessageElement).toBeTruthy();
        expect(errorMessageElement.classList.contains('tooltip')).toBe(true);
      });

      it('displays the end error message', async () => {
        const mockErrorMessages = {
          ...mockValidationMessages.errorMessages,
          endError
        };

        jest
          .spyOn(browserHelper, 'validateRegion')
          .mockImplementation(
            async ({
              onError
            }: {
              onError: (arg: typeof mockErrorMessages) => void;
            }): Promise<void> => onError(mockErrorMessages)
          );

        const { container } = render(<BrowserRegionEditor {...defaultProps} />);
        const [firstInput, secondInput] = container.querySelectorAll('input');
        const submitButton = container.querySelector(
          'button[type="submit"]'
        ) as HTMLButtonElement;

        userEvent.clear(firstInput);
        userEvent.type(firstInput, locationStartInput);

        userEvent.clear(secondInput);
        userEvent.type(secondInput, locationEndInput);

        userEvent.click(submitButton);

        const errorMessageElement = await screen.findByText(endError);
        expect(errorMessageElement).toBeTruthy();
        expect(errorMessageElement.classList.contains('tooltip')).toBe(true);
      });
    });

    describe('on validation success', () => {
      const locationStartInput = getCommaSeparatedNumber(
        faker.datatype.number()
      );
      const locationEndInput = getCommaSeparatedNumber(faker.datatype.number());
      const regionId = faker.lorem.words();

      beforeEach(() => {
        jest.resetAllMocks();
        jest
          .spyOn(browserHelper, 'validateRegion')
          .mockImplementation(
            async ({
              onSuccess
            }: {
              onSuccess: (arg: string) => void;
            }): Promise<void> => onSuccess(regionId)
          );
      });

      // TODO:
      // Test focus object change on submission. This can be done if <Select /> value can be changed.

      it('changes the browser location in same region if stick is the same', () => {
        const { container } = render(<BrowserRegionEditor {...defaultProps} />);
        const [firstInput, secondInput] = container.querySelectorAll('input');
        const submitButton = container.querySelector(
          'button[type="submit"]'
        ) as HTMLButtonElement;

        userEvent.clear(firstInput);
        userEvent.type(firstInput, locationStartInput);

        userEvent.clear(secondInput);
        userEvent.type(secondInput, locationEndInput);

        userEvent.click(submitButton);

        expect(defaultProps.changeBrowserLocation).toHaveBeenCalled();

        const {
          ensObjectId,
          chrLocation
        } = (defaultProps.changeBrowserLocation as any).mock.calls[0][0];
        const [, start, end] = chrLocation;
        expect(ensObjectId).toBe(null);
        expect(start).toBe(getNumberWithoutCommas(locationStartInput));
        expect(end).toBe(getNumberWithoutCommas(locationEndInput));
      });
    });
  });
});
