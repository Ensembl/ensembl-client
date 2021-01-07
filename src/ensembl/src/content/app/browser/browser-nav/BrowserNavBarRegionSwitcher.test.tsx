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

import { BrowserNavBarRegionSwitcher } from './BrowserNavBarRegionSwitcher';

import { BreakpointWidth } from 'src/global/globalConfig';

jest.mock(
  'src/content/app/browser/browser-region-editor/BrowserRegionEditor',
  () => () => <div className="browserRegionEditor" />
);
jest.mock(
  'src/content/app/browser/browser-region-field/BrowserRegionField',
  () => () => <div className="browserRegionField" />
);

const props = {
  viewportWidth: BreakpointWidth.TABLET,
  toggleRegionEditorActive: jest.fn(),
  toggleRegionFieldActive: jest.fn()
};

describe('BrowserNavBarRegionSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders only region field on smaller screens', () => {
      const { container } = render(<BrowserNavBarRegionSwitcher {...props} />);

      expect(container.querySelector('.browserRegionField')).toBeTruthy();
      expect(container.querySelector('.browserRegionEditor')).toBeFalsy();
    });

    it('renders both region field and region editor on big desktop screens', () => {
      const { container } = render(
        <BrowserNavBarRegionSwitcher
          {...props}
          viewportWidth={BreakpointWidth.BIG_DESKTOP}
        />
      );

      expect(container.querySelector('.browserRegionField')).toBeTruthy();
      expect(container.querySelector('.browserRegionEditor')).toBeTruthy();
    });
  });

  it('calls cleanup functions on unmount', () => {
    const { unmount } = render(<BrowserNavBarRegionSwitcher {...props} />);

    expect(props.toggleRegionEditorActive).not.toHaveBeenCalled();
    expect(props.toggleRegionFieldActive).not.toHaveBeenCalled();

    unmount();

    expect(props.toggleRegionEditorActive).toHaveBeenCalledWith(false);
    expect(props.toggleRegionFieldActive).toHaveBeenCalledWith(false);
  });
});
