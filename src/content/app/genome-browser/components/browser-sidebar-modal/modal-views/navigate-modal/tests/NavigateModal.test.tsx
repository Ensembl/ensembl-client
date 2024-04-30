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

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NavigateModal from '../../NavigateModal';

jest.mock('../LocationNavigation', () => () => (
  <div data-test-id="location-nav">LocationNavigation</div>
));
jest.mock('../RegionNavigation', () => () => (
  <div data-test-id="region-nav">RegionNavigation</div>
));

describe('<NavigateModal />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('opens location navigation panel', async () => {
    const { getByText, queryByTestId } = render(<NavigateModal />);
    const accordionItem = getByText('Go to new location');

    await userEvent.click(accordionItem);

    const regionNavPanel = queryByTestId('region-nav')
      ?.parentElement as HTMLDivElement;
    const locationNavPanel = queryByTestId('location-nav')
      ?.parentElement as HTMLDivElement;

    expect(regionNavPanel.hasAttribute('hidden')).toBeTruthy();
    expect(locationNavPanel.hasAttribute('hidden')).toBeFalsy();
  });
});
