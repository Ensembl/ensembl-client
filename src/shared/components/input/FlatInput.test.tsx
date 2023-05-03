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

import React, { useRef, MutableRefObject } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FlatInput from './FlatInput';

describe('<FlatInput />', () => {
  it('forwards the ref to the input element', () => {
    let inputRef = null as MutableRefObject<HTMLInputElement | null> | null;
    const Wrapper = () => {
      inputRef = useRef<HTMLInputElement | null>(null);
      return <FlatInput ref={inputRef} />;
    };
    render(<Wrapper />);

    const inputElement = inputRef?.current;
    expect(inputElement?.tagName).toBe('INPUT');
  });

  it('can be disabled', () => {
    let { container } = render(<FlatInput disabled={true} />);
    expect(container.querySelector('.input')?.hasAttribute('disabled')).toBe(
      true
    );

    container = render(<FlatInput disabled={false} />).container;
    expect(container.querySelector('.input')?.hasAttribute('disabled')).toBe(
      false
    );
  });

  describe('help element', () => {
    it('can show help element', () => {
      // no help element rendered if no help text provided
      const { container, rerender } = render(<FlatInput />);
      expect(container.querySelector('.rightCorner')).toBeFalsy();

      rerender(<FlatInput help="More info..." />);
      expect(
        container.querySelector('.rightCorner .questionButton')
      ).toBeTruthy();
    });

    it('does not show the help element if disabled', () => {
      // no help element rendered if no help text provided
      const { container } = render(
        <FlatInput help="More info..." disabled={true} />
      );
      expect(container.querySelector('.rightCorner')).toBeFalsy();
    });
  });

  describe('of type search', () => {
    it('shows clear button if contains text', async () => {
      const { container } = render(<FlatInput type="search" />);
      const inputElement = container.querySelector('input') as HTMLInputElement;

      expect(container.querySelector('.rightCorner')).toBeFalsy();

      await userEvent.type(inputElement, 'Hello world');

      expect(container.querySelector('.rightCorner .closeButton')).toBeTruthy();
    });

    it('prefers clear button over the help element if contains text', async () => {
      const { container } = render(
        <FlatInput type="search" help="More info" />
      );
      const inputElement = container.querySelector('input') as HTMLInputElement;

      expect(
        container.querySelector('.rightCorner .questionButton')
      ).toBeTruthy();
      expect(container.querySelector('.rightCorner .closeButton')).toBeFalsy();

      await userEvent.type(inputElement, 'Hello world');

      expect(container.querySelector('.rightCorner .closeButton')).toBeTruthy();
      expect(
        container.querySelector('.rightCorner .questionButton')
      ).toBeFalsy();
    });

    // NOTE: onChange won't get triggered this way; but onInput will
    it('clears the text if the clear button is pressed', async () => {
      const onInput = jest.fn();
      const { container } = render(
        <FlatInput type="search" onInput={onInput} />
      );
      const inputElement = container.querySelector('input') as HTMLInputElement;

      await userEvent.type(inputElement, 'Hello world');
      expect(inputElement.value).toBe('Hello world');

      const clearButton = container.querySelector(
        '.rightCorner .closeButton'
      ) as HTMLButtonElement;
      onInput.mockClear();
      await userEvent.click(clearButton);
      expect(inputElement.value).toBe('');
      expect(onInput).toHaveBeenCalledTimes(1);
    });
  });
});
