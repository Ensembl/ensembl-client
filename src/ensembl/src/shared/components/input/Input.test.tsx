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
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Input, { Props as InputProps } from './Input';

describe('<Input />', () => {
  const commonInputProps = {
    value: '',
    id: 'testId',
    name: 'testInputName',
    className: 'testInputClass',
    onChange: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn(),
    onKeyUp: jest.fn(),
    onKeyDown: jest.fn(),
    onKeyPress: jest.fn()
  };

  const getRenderedInputContainer = (props: InputProps) => {
    return render(<Input {...props} />);
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    const inputValue = 'foo';
    const props = {
      ...commonInputProps,
      value: inputValue,
      callbackWithEvent: false
    };

    it('passes relevant props to the input element', () => {
      const { container } = getRenderedInputContainer(props);

      const inputElement = container.querySelector('input') as HTMLInputElement;

      expect(inputElement.getAttribute('id')).toBe(commonInputProps.id);
      expect(inputElement.getAttribute('name')).toBe(commonInputProps.name);
      expect(inputElement.getAttribute('class')).toMatch(
        commonInputProps.className
      );
    });
  });

  describe('responding with data', () => {
    it('passes string value to onChange', () => {
      const inputValue = 'foo';
      const { container } = getRenderedInputContainer({
        ...commonInputProps,
        value: inputValue,
        callbackWithEvent: false
      });
      const inputNode = container.querySelector('input') as HTMLInputElement;

      userEvent.type(inputNode, '1');
      expect(commonInputProps.onChange).toHaveBeenLastCalledWith('foo1');
    });

    it('passes string value to onFocus', () => {
      const inputValue = 'foo';
      const { container } = getRenderedInputContainer({
        ...commonInputProps,
        value: inputValue,
        callbackWithEvent: false
      });
      const inputNode = container.querySelector('input') as HTMLInputElement;

      fireEvent.focus(inputNode);
      expect(commonInputProps.onFocus).toHaveBeenLastCalledWith(inputValue);
    });

    it('passes string value to onBlur', () => {
      const inputValue = 'foo';
      const { container } = getRenderedInputContainer({
        ...commonInputProps,
        value: inputValue,
        callbackWithEvent: false
      });
      const inputNode = container.querySelector('input') as HTMLInputElement;

      fireEvent.blur(inputNode);

      expect(commonInputProps.onBlur).toHaveBeenLastCalledWith(inputValue);
    });
  });

  describe('responding with events', () => {
    it('passes event to onChange', () => {
      const inputValue = 'foo';
      const { container } = getRenderedInputContainer({
        ...commonInputProps,
        value: inputValue,
        callbackWithEvent: true
      });

      const inputNode = container.querySelector('input') as HTMLInputElement;

      userEvent.type(inputNode, '1');
      const lastCallArg = commonInputProps.onChange.mock.calls[0].pop();
      expect(lastCallArg.target.value).toBe('foo1');
    });

    it('passes event to onFocus', () => {
      const inputValue = 'foo';
      const { container } = getRenderedInputContainer({
        ...commonInputProps,
        value: inputValue,
        callbackWithEvent: true
      });

      const inputNode = container.querySelector('input') as HTMLInputElement;

      fireEvent.focus(inputNode);
      expect(commonInputProps.onFocus.mock.calls[0][0].target.value).toBe(
        inputValue
      );
    });

    it('passes event to onBlur', () => {
      const inputValue = 'foo';
      const { container } = getRenderedInputContainer({
        ...commonInputProps,
        value: inputValue,
        callbackWithEvent: true
      });

      const inputNode = container.querySelector('input') as HTMLInputElement;

      fireEvent.blur(inputNode);
      expect(commonInputProps.onBlur.mock.calls[0][0].target.value).toBe(
        inputValue
      );
    });
  });
});
