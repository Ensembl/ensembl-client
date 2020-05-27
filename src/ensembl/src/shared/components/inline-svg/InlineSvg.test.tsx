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
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import faker from 'faker';

import apiService from 'src/services/api-service';

import InlineSVG from './InlineSvg';

const sampleSVG = `
<svg viewBox="0 0 32 32">
  <rect width="1" height="1" />
</svg>
`;

describe('<InlineSVG />', () => {
  beforeEach(() => {
    jest
      .spyOn(apiService, 'fetch')
      .mockImplementation(() => Promise.resolve(sampleSVG));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches an svg and sets it as inline element', async () => {
    const src = faker.random.image();
    const wrapper = mount(<InlineSVG src={src} />);

    await act(async () => {
      // here, the component should execute the useEffect hook requesting the svg,
      // and update the state
      wrapper.update();
    });

    const mockedFetch: any = apiService.fetch;
    const [requestedUrl] = mockedFetch.mock.calls[0];
    expect(requestedUrl).toBe(src);

    expect(wrapper.render().find('svg').length).toBe(1);
  });
});
