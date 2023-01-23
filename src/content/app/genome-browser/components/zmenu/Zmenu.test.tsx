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
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, act } from '@testing-library/react';

import Zmenu, { ZmenuProps } from './Zmenu';

import MockGenomeBrowser from 'tests/mocks/mockGenomeBrowser';

import { createZmenuPayload } from 'tests/fixtures/browser';

import type { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import * as browserGeneralSlice from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

const mockSetZmenus = jest.fn();

const mockGenomeBrowser = new MockGenomeBrowser();
jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowser',
  () => () => ({
    genomeBrowser: mockGenomeBrowser,
    zmenus: { 1: {} },
    setZmenus: mockSetZmenus
  })
);

jest.mock(
  'src/content/app/genome-browser/state/track-panel/trackPanelSlice.ts',
  () => ({
    changeHighlightedTrackId: jest.fn(() => ({
      type: 'change-track-highlight'
    }))
  })
);

jest.mock('./ZmenuContent', () => () => (
  <div data-test-id="zmenuContent">ZmenuContent</div>
));
jest.mock('./ZmenuInstantDownload', () => () => (
  <div>ZmenuInstantDownload</div>
));

const chrName = faker.lorem.word();
const startPosition = faker.datatype.number({ min: 1, max: 1000000 });
const endPosition =
  startPosition + faker.datatype.number({ min: 1000, max: 1000000 });

const initialState = {
  browser: {
    browserGeneral: {
      activeGenomeId: 'human',
      chrLocations: {
        ['human']: [chrName, startPosition, endPosition] as ChrLocation
      },
      actualChrLocations: {
        human: [chrName, startPosition, endPosition] as ChrLocation
      }
    }
  }
};

const renderComponent = (state: typeof initialState = initialState) => {
  const rootReducer = combineReducers({
    browser: combineReducers({
      browserGeneral: browserGeneralSlice.default
    })
  });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: state as any
  });

  const renderResult = render(
    <Provider store={store}>
      <Zmenu {...defaultProps} />
    </Provider>
  );

  return {
    ...renderResult,
    store
  };
};

const defaultProps: ZmenuProps = {
  containerRef: {
    current: document.createElement('div')
  },
  zmenuId: '1',
  payload: createZmenuPayload()
};

describe('<Zmenu />', () => {
  describe('rendering', () => {
    it('renders zmenu content', () => {
      const { queryByTestId } = renderComponent();
      expect(queryByTestId('zmenuContent')).toBeTruthy();
    });
  });

  describe('behaviour', () => {
    it('sends a signal to be closed when genome browser’s location changes', () => {
      const { store } = renderComponent();
      expect(mockSetZmenus).not.toHaveBeenCalled();
      act(() => {
        store.dispatch(
          browserGeneralSlice.updateActualChrLocation([
            chrName,
            startPosition + 10,
            endPosition
          ])
        );
      });
      expect(mockSetZmenus).toHaveBeenCalledWith({}); // the new zmenu object will not have the id of the current zmenu
    });
  });
});
