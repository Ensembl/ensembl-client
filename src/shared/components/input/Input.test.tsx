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

import React, { useState, useRef, MutableRefObject } from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';

import Input, { Props as InputProps } from './Input';

describe('<Input />', () => {
  const commonInputProps = {
    value: '',
    id: 'testId',
    name: 'testInputName',
    placeholder: 'type here',
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
    const props = commonInputProps;

    it('passes relevant props to the input element', () => {
      const { container } = render(<Input {...props} />);

      const inputElement = container.querySelector('input') as HTMLInputElement;

      expect(inputElement.getAttribute('id')).toBe(commonInputProps.id);
      expect(inputElement.getAttribute('name')).toBe(commonInputProps.name);
    });

    it('updates the input value when the props change', () => {
      const inputValue = 'foo';
      const { container, rerender } = getRenderedInputContainer({
        ...props,
        value: inputValue
      });

      const inputElement = container.querySelector('input') as HTMLInputElement;

      expect(inputElement.value).toBe(inputValue);

      const newValue = faker.lorem.words();
      rerender(<Input {...props} value={newValue} />);

      expect(inputElement.value).toBe(newValue);
    });

    it('forwards the ref to the input element', () => {
      let inputRef = null as MutableRefObject<HTMLInputElement | null> | null;
      const Wrapper = () => {
        inputRef = useRef<HTMLInputElement | null>(null);
        return <Input ref={inputRef} {...props} />;
      };
      render(<Wrapper />);

      const inputElement = inputRef?.current;

      expect(inputElement?.tagName).toBe('INPUT');
    });
  });

  describe('responding with events', () => {
    it('passes event to onChange', async () => {
      const initialInputValue = 'foo';

      const StatefulWrapper = () => {
        const [inputValue, setInputValue] = useState(initialInputValue);

        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          commonInputProps.onChange(value);
          setInputValue(value);
        };

        return (
          <Input {...commonInputProps} onChange={onChange} value={inputValue} />
        );
      };

      const { container } = render(<StatefulWrapper />);

      const inputNode = container.querySelector('input') as HTMLInputElement;

      await userEvent.type(inputNode, '1');

      const lastCallArg = commonInputProps.onChange.mock.calls[0].pop();
      expect(lastCallArg).toBe('foo1');
    });

    it('passes event to onFocus', () => {
      const inputValue = 'foo';
      const { container } = getRenderedInputContainer({
        ...commonInputProps,
        value: inputValue
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
        value: inputValue
      });

      const inputNode = container.querySelector('input') as HTMLInputElement;

      fireEvent.blur(inputNode);
      expect(commonInputProps.onBlur.mock.calls[0][0].target.value).toBe(
        inputValue
      );
    });
  });
});
