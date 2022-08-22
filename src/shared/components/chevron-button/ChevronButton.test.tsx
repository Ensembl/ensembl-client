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
import userEvent from '@testing-library/user-event';

import ChevronButton from './ChevronButton';

describe('<ChevronButton />', () => {
  describe('default', () => {
    it('renders correctly', () => {
      const { container } = render(
        <ChevronButton
          direction="down"
          onClick={jest.fn()}
          className="componentClass"
        />
      );

      const chevronButton = container.firstChild as HTMLElement;

      expect(chevronButton.tagName.toLowerCase()).toBe('button');

      expect(chevronButton.classList.contains('componentClass')).toBe(true);
    });

    it('registers clicks', async () => {
      const clickHandler = jest.fn();
      const { container } = render(
        <ChevronButton direction="down" onClick={clickHandler} />
      );

      const chevronButton = container.firstChild as HTMLElement;
      await userEvent.click(chevronButton);

      expect(clickHandler).toHaveBeenCalledTimes(1);
    });

    it('ignores clicks if disabled', async () => {
      const clickHandler = jest.fn();
      const { container } = render(
        <ChevronButton
          direction="down"
          onClick={clickHandler}
          disabled={true}
        />
      );

      const chevronButton = container.firstChild as HTMLElement;
      await userEvent.click(chevronButton);

      expect(clickHandler).not.toHaveBeenCalled();
    });
  });
});
