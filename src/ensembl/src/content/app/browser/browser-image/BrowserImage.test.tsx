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

import { BrowserImage, BrowserImageProps } from './BrowserImage';
import BrowserCogList from '../browser-cog/BrowserCogList';
import { ZmenuController } from 'src/content/app/browser/zmenu';
import { CircleLoader } from 'src/shared/components/loader/Loader';
import Overlay from 'src/shared/components/overlay/Overlay';

jest.mock('../browser-cog/BrowserCogList', () => () => (
  <div>BrowserCogList</div>
));

jest.mock('src/content/app/browser/zmenu', () => ({
  ZmenuController: () => <div>ZmenuController</div>
}));

jest.mock('src/shared/components/loader/Loader', () => ({
  CircleLoader: () => <div>CircleLoader</div>
}));

jest.mock('src/shared/components/overlay/Overlay', () => () => (
  <div>Overlay</div>
));

describe('<BrowserImage />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: BrowserImageProps = {
    browserCogTrackList: {},
    browserNavOpened: false,
    isDisabled: false,
    browserActivated: false,
    activateBrowser: jest.fn(),
    updateBrowserNavStates: jest.fn(),
    updateBrowserActivated: jest.fn(),
    updateBrowserActiveEnsObject: jest.fn(),
    setChrLocation: jest.fn(),
    setActualChrLocation: jest.fn(),
    updateDefaultPositionFlag: jest.fn(),
    changeHighlightedTrackId: jest.fn()
  };

  const mountBrowserImageComponent = (props?: Partial<BrowserImageProps>) =>
    mount(<BrowserImage {...defaultProps} {...props} />);

  describe('rendering', () => {
    test('renders loader if browser is not activated', () => {
      const wrapper = mountBrowserImageComponent();
      expect(wrapper.find(CircleLoader)).toHaveLength(1);
    });

    test('renders browser cog list', () => {
      const wrapper = mountBrowserImageComponent();
      expect(wrapper.find(BrowserCogList).length).toBe(1);
    });

    test('renders zmenu controller', () => {
      const wrapper = mountBrowserImageComponent();
      expect(wrapper.find(ZmenuController).length).toBe(1);
    });

    test('has an overlay on top when disabled', () => {
      const wrapper = mountBrowserImageComponent({ isDisabled: true });
      expect(wrapper.find(Overlay).length).toBe(1);
    });
  });

  describe('behaviour', () => {
    test('activates browser on mount', () => {
      const wrapper = mountBrowserImageComponent();
      expect(wrapper.props().activateBrowser).toHaveBeenCalled();
    });
  });
});
