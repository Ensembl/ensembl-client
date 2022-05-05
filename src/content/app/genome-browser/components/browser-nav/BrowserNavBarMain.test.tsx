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
import configureMockStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import set from 'lodash/fp/set';

import { createMockBrowserState } from 'tests/fixtures/browser';

import { BrowserNavBarMain } from './BrowserNavBarMain';

import { BreakpointWidth } from 'src/global/globalConfig';

jest.mock(
  'src/content/app/genome-browser/components/chromosome-navigator/ChromosomeNavigator',
  () => () => <div className="chromosomeNavigator" />
);
jest.mock('./BrowserNavBarRegionSwitcher', () => () => (
  <div className="browserNavBarRegionSwitcher" />
));

const mockState = createMockBrowserState();

const mockStore = configureMockStore([thunk]);

let store: ReturnType<typeof mockStore>;

const renderComponent = (state: typeof mockState = mockState) => {
  store = mockStore(state);
  return render(
    <Provider store={store}>
      <BrowserNavBarMain />
    </Provider>
  );
};

describe('BrowserNavBarMain', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not render chromosome visualization by default for screens smaller than laptops', () => {
    const { container } = renderComponent(
      set('global.breakpointWidth', BreakpointWidth.TABLET, mockState)
    );
    expect(container.querySelector('.chromosomeNavigator')).toBeFalsy();
  });

  it('renders chromosome visualization by default for laptops or bigger screens', () => {
    const { container } = renderComponent(
      set('global.breakpointWidth', BreakpointWidth.LAPTOP, mockState)
    );

    expect(container.querySelector('.chromosomeNavigator')).toBeTruthy();
    expect(container.querySelector('.browserNavBarRegionSwitcher')).toBeFalsy();
  });

  it('renders RegionSwitcher when user clicks on Change', async () => {
    const { container } = renderComponent(
      set('global.breakpointWidth', BreakpointWidth.LAPTOP, mockState)
    );

    const changeButton = container.querySelector(
      '.contentSwitcher'
    ) as HTMLSpanElement;
    await userEvent.click(changeButton);

    expect(container.querySelector('.chromosomeNavigator')).toBeFalsy();
    expect(
      container.querySelector('.browserNavBarRegionSwitcher')
    ).toBeTruthy();
  });

  it('renders chromosome visualization when user closes RegionSwitcher', async () => {
    const { container } = renderComponent(
      set('global.breakpointWidth', BreakpointWidth.LAPTOP, mockState)
    );

    const changeButton = container.querySelector(
      '.contentSwitcher'
    ) as HTMLSpanElement;
    await userEvent.click(changeButton);

    const closeButton = container.querySelector(
      '.closeButton'
    ) as HTMLSpanElement;
    await userEvent.click(closeButton);

    expect(container.querySelector('.chromosomeNavigator')).toBeTruthy();
    expect(container.querySelector('.browserNavBarRegionSwitcher')).toBeFalsy();
  });
});
