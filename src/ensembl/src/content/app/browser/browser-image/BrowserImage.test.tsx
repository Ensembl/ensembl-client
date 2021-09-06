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

import { BrowserImage, BrowserImageProps } from './BrowserImage';

import MockGenomeBrowser from 'tests/mocks/mockGenomeBrowser';

const mockGenomeBrowser = new MockGenomeBrowser();

jest.mock('src/content/app/browser/hooks/useGenomeBrowser', () => () => ({
  genomeBrowser: mockGenomeBrowser,
  activateGenomeBrowser: jest.fn()
}));

jest.mock('../browser-cog/BrowserCogList', () => () => (
  <div id="browserCogList" />
));

jest.mock('src/content/app/browser/zmenu', () => ({
  ZmenuController: () => <div id="zmenuController" />
}));

jest.mock('src/shared/components/loader/Loader', () => ({
  CircleLoader: () => <div id="circleLoader" />
}));

jest.mock('src/shared/components/overlay/Overlay', () => () => (
  <div id="overlay" />
));

describe('<BrowserImage />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: BrowserImageProps = {
    browserCogTrackList: {},
    isNavbarOpen: false,
    activeGenomeId: '',
    isDisabled: false,
    defaultChrLocation: ['', 0, 0],
    browserActivated: false,
    updateBrowserActivated: jest.fn(),
    updateBrowserNavIconStates: jest.fn(),
    updateBrowserActiveEnsObject: jest.fn(),
    setChrLocation: jest.fn(),
    setActualChrLocation: jest.fn(),
    updateDefaultPositionFlag: jest.fn(),
    changeHighlightedTrackId: jest.fn()
  };

  const renderBrowserImage = (props?: Partial<BrowserImageProps>) =>
    render(<BrowserImage {...defaultProps} {...props} />);

  describe('rendering', () => {
    it('renders loader if browser is not activated', () => {
      const { container } = renderBrowserImage();
      expect(container.querySelector('#circleLoader')).toBeTruthy();
    });

    it('renders browser cog list', () => {
      const { container } = renderBrowserImage();
      expect(container.querySelector('#browserCogList')).toBeTruthy();
    });

    it('renders zmenu controller', () => {
      const { container } = renderBrowserImage();
      expect(container.querySelector('#zmenuController')).toBeTruthy();
    });

    it('has an overlay on top when disabled', () => {
      const { container } = renderBrowserImage({ isDisabled: true });
      expect(container.querySelector('#overlay')).toBeTruthy();
    });
  });

  describe('behaviour', () => {
    it('activates browser on mount', () => {
      renderBrowserImage();
      expect(defaultProps.updateBrowserActivated).toHaveBeenCalled();
    });
  });
});
