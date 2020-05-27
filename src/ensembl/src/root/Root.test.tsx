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
import { mount } from 'enzyme';

import { Root } from './Root';
import Header from '../header/Header';
import Content from '../content/Content';
import privacyBannerService from '../shared/components/privacy-banner/privacy-banner-service';
import windowService from 'src/services/window-service';

import { mockMatchMedia } from 'tests/mocks/mockWindowService';

jest.mock('../header/Header', () => () => 'Header');
jest.mock('../content/Content', () => () => 'Content');
jest.mock('../shared/components/privacy-banner/PrivacyBanner', () => () => (
  <div className="privacyBanner">PrivacyBanner</div>
));

const updateBreakpointWidth = jest.fn();

describe('<Root />', () => {
  let wrapper: any;

  const defaultProps = {
    breakpointWidth: 0,
    updateBreakpointWidth: updateBreakpointWidth
  };
  const getRenderedRoot = (props: any) => <Root {...props} />;

  beforeEach(() => {
    jest
      .spyOn(windowService, 'getMatchMedia')
      .mockImplementation(mockMatchMedia as any);
    wrapper = mount(getRenderedRoot(defaultProps));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('contains Header', () => {
    expect(wrapper.contains(<Header />)).toBe(true);
  });

  test('contains Content', () => {
    expect(wrapper.contains(<Content />)).toBe(true);
  });

  test('calls updateBreakpointWidth on mount', () => {
    expect(updateBreakpointWidth).toHaveBeenCalled();
  });

  test('shows privacy banner if privacy policy version is not set or if version does not match', () => {
    jest
      .spyOn(privacyBannerService, 'shouldShowBanner')
      .mockImplementation(() => true);
    const wrapper = mount(getRenderedRoot(defaultProps));
    expect(wrapper.find('.privacyBanner').length).toBe(1);
    (privacyBannerService.shouldShowBanner as any).mockRestore();
  });

  test('does not show privacy banner if policy version is set', () => {
    jest
      .spyOn(privacyBannerService, 'shouldShowBanner')
      .mockImplementation(() => false);
    const wrapper = mount(getRenderedRoot(defaultProps));
    expect(wrapper.find('.privacyBanner').length).toBe(0);
    (privacyBannerService.shouldShowBanner as any).mockRestore();
  });
});
