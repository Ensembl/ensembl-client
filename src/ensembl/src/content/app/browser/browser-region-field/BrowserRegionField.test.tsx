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
  BrowserRegionField,
  BrowserRegionFieldProps
} from './BrowserRegionField';

import {
  createChrLocationValues,
  createRegionValidationMessages
} from 'tests/fixtures/browser';

import * as browserHelper from '../browserHelper';

import { ChrLocation } from '../browserState';

jest.mock('../browserHelper', () => {
  const originalModule = jest.requireActual('../browserHelper');

  return {
    ...originalModule,
    validateRegion: jest.fn()
  };
});

const mockChangeBrowserLocation = jest.fn();
const mockChangeFocusObject = jest.fn();
jest.mock('src/content/app/browser/hooks/useGenomeBrowser', () => () => ({
  changeBrowserLocation: mockChangeBrowserLocation,
  changeFocusObject: mockChangeFocusObject
}));
describe('<BrowserRegionField />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: BrowserRegionFieldProps = {
    activeGenomeId: faker.lorem.words(),
    chrLocation: createChrLocationValues().tupleValue,
    isActive: false,
    isGhosted: false,
    toggleRegionFieldActive: jest.fn()
  };

  describe('rendering', () => {
    it('contains an input', () => {
      const { container } = render(<BrowserRegionField {...defaultProps} />);
      expect(container.querySelectorAll('input').length).toBe(1);
    });

    it('contains submit button', () => {
      const { container } = render(<BrowserRegionField {...defaultProps} />);
      expect(container.querySelector('button[type="submit"]')).toBeTruthy();
    });
  });

  describe('behaviour', () => {
    it('is set to active when focussed', () => {
      const { container } = render(<BrowserRegionField {...defaultProps} />);
      const input = container.querySelector('input') as HTMLInputElement;

      fireEvent.focus(input);

      // the activateForm function which fires on focus should call toggleRegionFieldActive
      expect(defaultProps.toggleRegionFieldActive).toHaveBeenCalledWith(true);
    });

    it('validates region input on submit', () => {
      const locationString = createChrLocationValues().stringValue;
      const { container } = render(<BrowserRegionField {...defaultProps} />);
      const input = container.querySelector('input') as HTMLInputElement;

      userEvent.clear(input);
      userEvent.type(input, locationString);
      userEvent.type(input, `{enter}`); // to submit the form

      expect(browserHelper.validateRegion).toHaveBeenCalledWith({
        regionInput: locationString,
        genomeId: defaultProps.activeGenomeId,
        onSuccess: expect.any(Function),
        onError: expect.any(Function)
      });
    });

    // TODO: Test if the form is reset when clicked outside the form. Need to be able to mock useOutsideClick for this.

    it('displays error message when validation fails', async () => {
      const startError = 'your start position is wrong';
      const mockErrorMessages = {
        ...createRegionValidationMessages().errorMessages,
        startError
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

      const { container } = render(<BrowserRegionField {...defaultProps} />);
      const input = container.querySelector('input') as HTMLInputElement;

      userEvent.clear(input);
      userEvent.type(input, 'foo{enter}');

      const errorMessageElement = await screen.findByText(startError);
      expect(errorMessageElement).toBeTruthy();
      expect(errorMessageElement.classList.contains('tooltip')).toBe(true);
    });

    describe('on validation success', () => {
      const regionId = 'new_chromosome';

      beforeEach(() => {
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

      it('switches to a different chromosome if it exists in the input', () => {
        const oldChrLocation = ['13', 1, 1000] as ChrLocation;
        const newChrLocation = ['12', 1, 1000];
        const { container } = render(
          <BrowserRegionField {...defaultProps} chrLocation={oldChrLocation} />
        );
        const input = container.querySelector('input') as HTMLInputElement;

        userEvent.type(
          input,
          `${newChrLocation[0]}:${newChrLocation[1]}-${newChrLocation[2]}{enter}`
        );

        expect(mockChangeFocusObject).toHaveBeenCalledWith(regionId);
      });

      it('preserves the same chromosome if input contains only new start and end coordinates', () => {
        const oldChrLocation = ['13', 1, 1000] as ChrLocation;
        const newChrLocation = ['13', 500, 1000];

        const { container } = render(
          <BrowserRegionField {...defaultProps} chrLocation={oldChrLocation} />
        );
        const input = container.querySelector('input') as HTMLInputElement;

        userEvent.clear(input);
        userEvent.type(
          input,
          `${newChrLocation[1]}-${newChrLocation[2]}{enter}`
        );
        expect(mockChangeBrowserLocation).toHaveBeenCalledWith({
          genomeId: defaultProps.activeGenomeId,
          ensObjectId: null,
          chrLocation: newChrLocation
        });
      });
    });
  });
});
