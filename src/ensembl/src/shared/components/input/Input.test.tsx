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
import { mount, render } from 'enzyme';

import Input from './Input';

describe('<Input />', () => {
  const commonInputProps = {
    id: 'testId',
    name: 'testInputName',
    className: 'testInputClass',
    onChange: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn()
  };

  const getWrappedInput = (props: any) => mount(<Input {...props} />);

  const getStaticallyWrappedInput = (props: any) =>
    render(<Input {...props} />);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    const inputValue = 'foo';
    const props = {
      ...commonInputProps,
      value: inputValue
    };

    test('passes relevant props to the input element', () => {
      const wrappedInput = getStaticallyWrappedInput(props);

      expect(wrappedInput.attr('id')).toBe(commonInputProps.id);
      expect(wrappedInput.attr('name')).toBe(commonInputProps.name);
      expect(wrappedInput.attr('class')).toMatch(commonInputProps.className);
    });
  });

  describe('responding with data', () => {
    test('passes string value to onChange', () => {
      const inputValue = 'foo';
      const changedValue = inputValue + '1';
      const wrappedInput = getWrappedInput({
        ...commonInputProps,
        value: inputValue
      });

      wrappedInput.simulate('change', { target: { value: changedValue } });
      expect(commonInputProps.onChange).toHaveBeenLastCalledWith(changedValue);
    });

    test('passes string value to onFocus', () => {
      const inputValue = 'foo';
      const wrappedInput = getWrappedInput({
        ...commonInputProps,
        value: inputValue
      });

      wrappedInput.simulate('focus');
      expect(commonInputProps.onFocus).toHaveBeenLastCalledWith(inputValue);
    });

    test('passes string value to onBlur', () => {
      const inputValue = 'foo';
      const wrappedInput = getWrappedInput({
        ...commonInputProps,
        value: inputValue
      });

      wrappedInput.simulate('blur');
      expect(commonInputProps.onBlur).toHaveBeenLastCalledWith(inputValue);
    });
  });

  describe('responding with events', () => {
    test('passes event to onChange', () => {
      const inputValue = 'foo';
      const changedValue = inputValue + '1';
      const wrappedInput = getWrappedInput({
        ...commonInputProps,
        value: inputValue,
        callbackWithEvent: true
      });

      wrappedInput.simulate('change', { target: { value: changedValue } });
      expect(commonInputProps.onChange.mock.calls[0][0].target.value).toBe(
        changedValue
      );
    });

    test('passes event to onFocus', () => {
      const inputValue = 'foo';
      const wrappedInput = getWrappedInput({
        ...commonInputProps,
        value: inputValue,
        callbackWithEvent: true
      });

      wrappedInput.simulate('focus');
      expect(commonInputProps.onFocus.mock.calls[0][0].target.value).toBe(
        inputValue
      );
    });

    test('passes event to onBlur', () => {
      const inputValue = 'foo';
      const wrappedInput = getWrappedInput({
        ...commonInputProps,
        value: inputValue,
        callbackWithEvent: true
      });

      wrappedInput.simulate('blur');
      expect(commonInputProps.onBlur.mock.calls[0][0].target.value).toBe(
        inputValue
      );
    });
  });
});
