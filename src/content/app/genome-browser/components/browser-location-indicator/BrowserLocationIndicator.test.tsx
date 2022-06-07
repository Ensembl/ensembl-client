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
import { faker } from '@faker-js/faker';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';
import set from 'lodash/fp/set';

import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';

import { BrowserLocationIndicator } from './BrowserLocationIndicator';

import { toggleBrowserNav } from 'src/content/app/genome-browser/state/browser-nav/browserNavSlice';

import { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

jest.mock(
  'src/content/app/genome-browser/state/browser-nav/browserNavSlice.ts',
  () => ({
    toggleBrowserNav: jest.fn(() => ({ type: 'toggle-browser-nav' }))
  })
);

const chrName = faker.lorem.word();
const startPosition = faker.datatype.number({ min: 1, max: 1000000 });
const endPosition =
  startPosition + faker.datatype.number({ min: 1000, max: 1000000 });

const circularChrName = faker.lorem.word();

const mockState = {
  browser: {
    browserGeneral: {
      actualChrLocations: {
        human: [chrName, startPosition, endPosition] as ChrLocation,
        ecoli: [circularChrName, startPosition, endPosition] as ChrLocation
      },
      activeGenomeId: 'human'
    }
  },
  genome: {
    genomeKaryotype: {
      genomeKaryotypeData: {
        human: [{ is_circular: false, name: chrName }],
        ecoli: [{ is_circular: true, name: circularChrName }]
      }
    }
  }
};

const mockStore = configureMockStore();
const renderComponent = (state: typeof mockState = mockState) => {
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
      const { container } = renderComponent();
      const renderedName = container.querySelector('.chrCode');
      expect(renderedName?.textContent).toBe(chrName);
    });

    it('displays circular chromosome', () => {
      const newstate = set(
        'browser.browserGeneral.activeGenomeId',
        'ecoli',
        mockState
      );
      const { container } = renderComponent(newstate);
      const circularIndicator = container.querySelector('.circularIndicator');
      expect(circularIndicator).toBeTruthy();
    });

    it('displays location', () => {
      const { container } = renderComponent();
      const renderedLocation = container.querySelector('.chrRegion');
      expect(renderedLocation?.textContent).toBe(
        `${getCommaSeparatedNumber(startPosition)}-${getCommaSeparatedNumber(
          endPosition
        )}`
      );
    });

    it('adds disabled class when component is disabled', () => {
      const { container, rerender } = renderComponent();
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
    it('calls toggleBrowserNav when clicked', async () => {
      const { container } = renderComponent();
      const indicator = container.querySelector('.chrLocationView');

      await userEvent.click(indicator as HTMLDivElement);
      expect(toggleBrowserNav).toHaveBeenCalled();
    });

    it('does not call toggleBrowserNav if disabled', async () => {
      const { container, rerender } = renderComponent();
      const indicator = container.querySelector('.chrLocationView');

      const wrappedComponent = (
        <Provider store={mockStore(mockState)}>
          <BrowserLocationIndicator disabled={true} />
        </Provider>
      );

      rerender(wrappedComponent);

      await userEvent.click(indicator as HTMLDivElement);
      expect(toggleBrowserNav).not.toHaveBeenCalled();
    });
  });
});
