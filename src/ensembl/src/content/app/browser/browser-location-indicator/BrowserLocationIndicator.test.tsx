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
import faker from 'faker';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';

import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';

import { BrowserLocationIndicator } from './BrowserLocationIndicator';
import { toggleBrowserNav } from '../browserActions';

import { ChrLocation } from '../browserState';

jest.mock('../browserActions.ts', () => ({
  toggleBrowserNav: jest.fn(() => ({ type: 'toggle-browser-nav' }))
}));

const chrName = faker.lorem.word();
const startPosition = faker.datatype.number({ min: 1, max: 1000000 });
const endPosition =
  startPosition + faker.datatype.number({ min: 1000, max: 1000000 });

const mockState = {
  browser: {
    browserLocation: {
      actualChrLocations: {
        human: [chrName, startPosition, endPosition] as ChrLocation
      }
    },
    browserEntity: {
      activeGenomeId: 'human'
    }
  }
};

const mockStore = configureMockStore();
const wrapInRedux = (state: typeof mockState = mockState) => {
  return render(
    <Provider store={mockStore(state)}>
      <BrowserLocationIndicator />
    </Provider>
  );
};

describe('BrowserLocationIndicator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('displays chromosome name', () => {
      const { container } = wrapInRedux();
      const renderedName = container.querySelector('.chrCode');
      expect(renderedName?.textContent).toBe(chrName);
    });

    it('displays location', () => {
      const { container } = wrapInRedux();
      const renderedLocation = container.querySelector('.chrRegion');
      expect(renderedLocation?.textContent).toBe(
        `${getCommaSeparatedNumber(startPosition)}-${getCommaSeparatedNumber(
          endPosition
        )}`
      );
    });

    it('adds disabled class when component is disabled', () => {
      const { container, rerender } = wrapInRedux();
      const element = container.firstChild as HTMLDivElement;
      expect(
        element.classList.contains('browserLocationIndicatorDisabled')
      ).toBe(false);

      const wrappedComponent = (
        <Provider store={mockStore(mockState)}>
          <BrowserLocationIndicator disabled={true} />
        </Provider>
      );

      rerender(wrappedComponent);

      expect(
        element.classList.contains('browserLocationIndicatorDisabled')
      ).toBe(true);
    });
  });

  describe('behaviour', () => {
    it('calls toggleBrowserNav when clicked', () => {
      const { container } = wrapInRedux();
      const indicator = container.querySelector('.chrLocationView');

      userEvent.click(indicator as HTMLDivElement);
      expect(toggleBrowserNav).toHaveBeenCalled();
    });

    it('does not call toggleBrowserNav if disabled', () => {
      const { container, rerender } = wrapInRedux();
      const indicator = container.querySelector('.chrLocationView');

      const wrappedComponent = (
        <Provider store={mockStore(mockState)}>
          <BrowserLocationIndicator disabled={true} />
        </Provider>
      );

      rerender(wrappedComponent);
      userEvent.click(indicator as HTMLDivElement);
      expect(toggleBrowserNav).not.toHaveBeenCalled();
    });
  });
});
