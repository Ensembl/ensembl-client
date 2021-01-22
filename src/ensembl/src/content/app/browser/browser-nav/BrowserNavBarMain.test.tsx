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
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BrowserNavBarMain, BrowserNavBarMainProps } from './BrowserNavBarMain';

import { BreakpointWidth } from 'src/global/globalConfig';

jest.mock(
  'src/content/app/browser/chromosome-navigator/ChromosomeNavigator',
  () => () => <div className="chromosomeNavigator" />
);
jest.mock('./BrowserNavBarRegionSwitcher', () => () => (
  <div className="browserNavBarRegionSwitcher" />
));

const props: BrowserNavBarMainProps = {
  viewportWidth: BreakpointWidth.TABLET
};

describe('BrowserNavBarMain', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not render chromosome visualization by default for screens smaller than laptops', () => {
    const { container } = render(<BrowserNavBarMain {...props} />);
    expect(container.querySelector('.chromosomeNavigator')).toBeFalsy();
  });

  it('renders chromosome visualization by default for laptops or bigger screens', () => {
    const { container } = render(
      <BrowserNavBarMain {...props} viewportWidth={BreakpointWidth.LAPTOP} />
    );

    expect(container.querySelector('.chromosomeNavigator')).toBeTruthy();
    expect(container.querySelector('.browserNavBarRegionSwitcher')).toBeFalsy();
  });

  it('renders RegionSwitcher when user clicks on Change', () => {
    const { container } = render(
      <BrowserNavBarMain {...props} viewportWidth={BreakpointWidth.LAPTOP} />
    );

    const changeButton = container.querySelector(
      '.contentSwitcher'
    ) as HTMLSpanElement;
    userEvent.click(changeButton);

    expect(container.querySelector('.chromosomeNavigator')).toBeFalsy();
    expect(
      container.querySelector('.browserNavBarRegionSwitcher')
    ).toBeTruthy();
  });

  it('renders chromosome visualization when user closes RegionSwitcher', () => {
    const { container } = render(
      <BrowserNavBarMain {...props} viewportWidth={BreakpointWidth.LAPTOP} />
    );

    const changeButton = container.querySelector(
      '.contentSwitcher'
    ) as HTMLSpanElement;
    userEvent.click(changeButton);

    const closeButton = container.querySelector(
      '.closeButton'
    ) as HTMLSpanElement;
    userEvent.click(closeButton);

    expect(container.querySelector('.chromosomeNavigator')).toBeTruthy();
    expect(container.querySelector('.browserNavBarRegionSwitcher')).toBeFalsy();
  });
});
