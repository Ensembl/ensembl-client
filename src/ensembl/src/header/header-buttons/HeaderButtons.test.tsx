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
import { shallow, ShallowWrapper } from 'enzyme';

import { HeaderButtons } from './HeaderButtons';
import ImageButton from 'src/shared/components/image-button/ImageButton';

import { Status } from 'src/shared/types/status';

describe('<HeaderButtons />', () => {
  let toggleLaunchbarFn: () => void;
  let toggleAccountFn: () => void;
  let shallowWrapper: ShallowWrapper;

  beforeEach(() => {
    toggleLaunchbarFn = jest.fn();
    toggleAccountFn = jest.fn();
    shallowWrapper = shallow(
      <HeaderButtons
        toggleAccount={toggleAccountFn}
        toggleLaunchbar={toggleLaunchbarFn}
      />
    );
  });

  test('contains button for toggling launchbar', () => {
    const launchbarButton = shallowWrapper
      .find(ImageButton)
      .filterWhere(
        (wrapper) => wrapper.prop('description') === 'Ensembl app launchbar'
      );
    expect(launchbarButton.prop('onClick')).toBe(toggleLaunchbarFn);
  });

  test('contains disabled user account button', () => {
    const launchbarButton = shallowWrapper
      .find(ImageButton)
      .filterWhere(
        (wrapper) => wrapper.prop('description') === 'Ensembl account'
      );
    expect(launchbarButton.prop('status')).toBe(Status.DISABLED);
  });
});
