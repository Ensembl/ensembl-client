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

import { BrowserNavIcon } from './BrowserNavIcon';
import GenomeBrowserService from 'src/content/app/browser/browser-messaging-service';
import { browserNavConfig } from '../browserConfig';

const genomeBrowserService = new GenomeBrowserService('foo');

describe('<BrowserNavAction />', () => {
  const browserNavItem = browserNavConfig[0];

  test('sends navigation message when clicked', () => {
    jest.spyOn(genomeBrowserService, 'send');

    const { container } = render(
      <BrowserNavIcon browserNavItem={browserNavItem} enabled={true} />
    );
    const button = container.querySelector('button') as HTMLButtonElement;

    userEvent.click(button);
    expect(genomeBrowserService.send).toHaveBeenCalledTimes(1);
    expect(genomeBrowserService.send).toHaveBeenCalledWith(
      'bpane',
      browserNavItem.detail
    );

    (genomeBrowserService.send as any).mockRestore();
  });
});
