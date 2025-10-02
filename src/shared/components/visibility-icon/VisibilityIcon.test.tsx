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

import { VisibilityIcon } from './VisibilityIcon';

import { Status } from 'src/shared/types/status';

describe('<VisibilityIcon />', () => {
  const onClick = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders ImageButton', () => {
    const { container } = render(
      <VisibilityIcon status={Status.SELECTED} onClick={onClick} />
    );
    expect(container.querySelector('.imageButton')).toBeTruthy();
  });

  it('passes appropriate class to ImageButton when partially selected', () => {
    const { container } = render(
      <VisibilityIcon status={Status.PARTIALLY_SELECTED} onClick={onClick} />
    );

    const imageButton = container.querySelector('.imageButton');

    expect(imageButton?.classList.contains('default')).toBe(true); // this css class is determined by the button's default status
    expect(
      imageButton?.classList.contains('visibilityIconPartiallySelected')
    ).toBe(true); // this css class is passed to the image button from the visibility icon component
  });
});
