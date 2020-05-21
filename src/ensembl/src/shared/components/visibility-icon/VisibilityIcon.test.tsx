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

import { VisibilityIcon } from './VisibilityIcon';
import ImageButton from 'src/shared/components/image-button/ImageButton';
import { Status } from 'src/shared/types/status';

describe('<VisibilityIcon />', () => {
  it('renders ImageButton with DEFAULT status when partially selected', () => {
    const onClick = jest.fn();
    const wrapper = mount(
      <VisibilityIcon status={Status.PARTIALLY_SELECTED} onClick={onClick} />
    );
    expect(wrapper.find(ImageButton).prop('status')).toBe(Status.DEFAULT);
  });
});
