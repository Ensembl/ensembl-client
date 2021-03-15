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
import { screen, render } from '@testing-library/react';
import faker from 'faker';

import { BrowserNavBarControls } from './BrowserNavBarControls';
import { BrowserNavAction, BrowserNavIconStates } from '../browserState';
import { BrowserNavItem } from 'src/content/app/browser/browserConfig';

jest.mock(
  './BrowserNavAction',
  () => (props: { enabled: boolean; browserNavItem: BrowserNavItem }) => {
    const className = props.enabled
      ? 'browserNavIcon enabled'
      : 'browserNavIcon';
    return (
      <div className={className} data-test-id={props.browserNavItem.name} />
    );
  }
);

jest.mock('src/shared/components/overlay/Overlay', () => () => (
  <div className="overlay" />
));

const browserNavIconStates: { [key: string]: boolean } = {
  [BrowserNavAction.NAVIGATE_UP]: faker.random.boolean(),
  [BrowserNavAction.NAVIGATE_RIGHT]: faker.random.boolean(),
  [BrowserNavAction.NAVIGATE_DOWN]: faker.random.boolean(),
  [BrowserNavAction.NAVIGATE_LEFT]: faker.random.boolean(),
  [BrowserNavAction.ZOOM_OUT]: faker.random.boolean(),
  [BrowserNavAction.ZOOM_IN]: faker.random.boolean()
};

describe('BrowserNavBarControls', () => {
  it('has an overlay on top when browser nav bar controls are disabled', () => {
    const { container } = render(
      <BrowserNavBarControls
        browserNavIconStates={browserNavIconStates as BrowserNavIconStates}
        isDisabled={true}
      />
    );
    expect(container.querySelector('.overlay')).toBeTruthy();
  });

  it('disables buttons if corresponding actions are not possible', () => {
    // browserNavIconStates are a set of booleans that indicate whether the button
    // has already caused maximum corresponding effect, and will have no further effect if pressed
    render(
      <BrowserNavBarControls
        browserNavIconStates={browserNavIconStates as BrowserNavIconStates}
        isDisabled={false}
      />
    );

    Object.keys(browserNavIconStates).forEach((icon) => {
      const navIcon = screen.getByTestId(icon);
      expect(navIcon.classList.contains('enabled')).toBe(
        browserNavIconStates[icon]
      );
    });
  });
});
