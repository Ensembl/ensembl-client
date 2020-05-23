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
import { shallow } from 'enzyme';

import { Header } from './Header';
import Account from './account/Account';
import LaunchbarContainer from './launchbar/LaunchbarContainer';
import HeaderButtons from './header-buttons/HeaderButtons';

describe('<Header />', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<Header />);
  });

  describe('contains', () => {
    test('Account', () => {
      expect(wrapper.contains(<Account />)).toBe(true);
    });

    test('Launchbar', () => {
      expect(wrapper.contains(<LaunchbarContainer />)).toBe(true);
    });

    test('HeaderButtons', () => {
      expect(wrapper.contains(<HeaderButtons />)).toBe(true);
    });
  });
});
