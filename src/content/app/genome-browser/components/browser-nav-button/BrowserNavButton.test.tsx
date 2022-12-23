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
import { OutgoingActionType } from '@ensembl/ensembl-genome-browser';

import MockGenomeBrowser from 'tests/mocks/mockGenomeBrowser';

import { BrowserNavButton } from './BrowserNavButton';

import { BrowserNavAction } from 'src/content/app/genome-browser/state/browser-nav/browserNavSlice';

import NavigateLeftIcon from 'static/icons/navigate-left.svg';

const mockGenomeBrowser = new MockGenomeBrowser();

jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowser',
  () => () => ({
    genomeBrowser: mockGenomeBrowser
  })
);

describe('<BrowserNavButton />', () => {
  test('sends navigation message when clicked', async () => {
    jest.spyOn(mockGenomeBrowser, 'send');

    const { container } = render(
      <BrowserNavButton
        name={BrowserNavAction.MOVE_LEFT}
        description="navigate left"
        detail={{ move_left_px: 50 }}
        enabled={true}
        icon={NavigateLeftIcon}
      />
    );
    const button = container.querySelector('button') as HTMLButtonElement;

    await userEvent.click(button);

    expect(mockGenomeBrowser.send).toHaveBeenCalledTimes(1);
    expect(mockGenomeBrowser.send).toHaveBeenCalledWith({
      payload: { move_left_px: 50 },
      type: OutgoingActionType.MOVE_LEFT
    });

    (mockGenomeBrowser.send as any).mockRestore();
  });
});