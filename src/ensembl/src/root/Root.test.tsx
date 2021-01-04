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
import { MemoryRouter, Redirect, useLocation } from 'react-router-dom';

import { Root, Props as RootProps } from './Root';
import privacyBannerService from '../shared/components/privacy-banner/privacy-banner-service';
import windowService from 'src/services/window-service';

import { mockMatchMedia } from 'tests/mocks/mockWindowService';

jest.mock('../content/app/App', () => () => <div id="app" />);
jest.mock('../shared/components/privacy-banner/PrivacyBanner', () => () => (
  <div className="privacyBanner">PrivacyBanner</div>
));

const updateBreakpointWidth = jest.fn();

describe('<Root />', () => {
  const defaultProps = {
    updateBreakpointWidth: updateBreakpointWidth
  };

  const getRenderedRoot = (props: Partial<RootProps> = {}) =>
    render(
      <MemoryRouter>
        <Root {...defaultProps} {...props} />
      </MemoryRouter>
    );

  beforeEach(() => {
    jest
      .spyOn(windowService, 'getMatchMedia')
      .mockImplementation(mockMatchMedia as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('contains App', () => {
    const { container } = getRenderedRoot();
    expect(container.querySelector('#app')).toBeTruthy();
  });

  it('calls updateBreakpointWidth on mount', () => {
    getRenderedRoot();
    expect(updateBreakpointWidth).toHaveBeenCalled();
  });

  it('shows privacy banner if privacy policy version is not set or if version does not match', () => {
    jest
      .spyOn(privacyBannerService, 'shouldShowBanner')
      .mockImplementation(() => true);
    const { container } = getRenderedRoot();
    expect(container.querySelector('.privacyBanner')).toBeTruthy();
    (privacyBannerService.shouldShowBanner as any).mockRestore();
  });

  it('does not show privacy banner if policy version is set', () => {
    jest
      .spyOn(privacyBannerService, 'shouldShowBanner')
      .mockImplementation(() => false);
    const { container } = getRenderedRoot();
    expect(container.querySelector('.privacyBanner')).toBeFalsy();
    (privacyBannerService.shouldShowBanner as any).mockRestore();
  });

  it('displays 404 screen if no route was matched', () => {
    const Redirect404 = () => {
      const location = useLocation();

      return <Redirect to={{ ...location, state: { is404: true } }} />;
    };

    const { container } = render(
      <MemoryRouter>
        <Root {...defaultProps} />
        <Redirect404 />
      </MemoryRouter>
    );

    expect(container.querySelector('#app')).toBeFalsy();
    expect(container.textContent).toContain('page not found');
  });
});
