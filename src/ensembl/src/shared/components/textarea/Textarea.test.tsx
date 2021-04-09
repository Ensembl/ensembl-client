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

import React, { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import faker from 'faker';
import Textarea from './Textarea';

describe('<Textarea />', () => {
  const commonTextareaProps = {
    id: faker.random.word(),
    name: faker.random.word(),
    className: faker.random.word(),
    onChange: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn()
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  const textareaValue = faker.random.words();

  describe('rendering', () => {
    const props = {
      ...commonTextareaProps,
      value: textareaValue
    };

    it('passes relevant props to the Textarea element', () => {
      const { container } = render(<Textarea {...props} />);
      const textarea = container.firstChild as HTMLElement;

      expect(textarea.getAttribute('id')).toBe(commonTextareaProps.id);
      expect(textarea.getAttribute('name')).toBe(commonTextareaProps.name);
      expect(textarea.getAttribute('class')).toMatch(
        commonTextareaProps.className
      );
    });

    it('disables resize when the resizable prop is false', () => {
      const { container } = render(<Textarea {...props} resizable={false} />);
      const textarea = container.firstChild as HTMLElement;

      expect(textarea.classList.contains('disableResize')).toBe(true);
    });
  });

  describe('responding with data', () => {
    it('passes string value to onChange', () => {
      const textareaValue = 'Hello worl';
      const { container } = render(
        <Textarea {...commonTextareaProps} value={textareaValue} />
      );
      const textarea = container.firstChild as HTMLElement;

      userEvent.type(textarea, 'd');
      expect(commonTextareaProps.onChange).toHaveBeenLastCalledWith(
        'Hello world'
      );
    });

    it('passes string value to onFocus', () => {
      const { container } = render(
        <Textarea {...commonTextareaProps} value={textareaValue} />
      );
      const textarea = container.firstChild as HTMLElement;

      fireEvent.focus(textarea);
      expect(commonTextareaProps.onFocus).toHaveBeenLastCalledWith(
        textareaValue
      );
    });

    it('passes string value to onBlur', () => {
      const { container } = render(
        <Textarea {...commonTextareaProps} value={textareaValue} />
      );
      const textarea = container.firstChild as HTMLElement;

      fireEvent.blur(textarea);
      expect(commonTextareaProps.onBlur).toHaveBeenLastCalledWith(
        textareaValue
      );
    });
  });

  describe('responding with events', () => {
    it('passes event to onChange', () => {
      const initialText = 'Hello worl';
      const spy = jest.fn();

      const StatefulTextareaWrapper = () => {
        const [text, setText] = useState(initialText);

        const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const value = e.target.value;
          spy(e);
          setText(value);
        };

        return (
          <Textarea
            {...commonTextareaProps}
            onChange={onChange}
            value={text}
            callbackWithEvent={true}
          />
        );
      };
      const { container } = render(<StatefulTextareaWrapper />);
      const textarea = container.firstChild as HTMLElement;

      // fireEvent.change(textarea, { target: { value: 'd' } });
      userEvent.type(textarea, 'd');
      expect(spy.mock.calls[0][0].target.value).toBe('Hello world');
    });

    it('passes event to onFocus', () => {
      const { container } = render(
        <Textarea
          {...commonTextareaProps}
          value={textareaValue}
          callbackWithEvent={true}
        />
      );
      const textarea = container.firstChild as HTMLElement;

      fireEvent.focus(textarea);

      expect(commonTextareaProps.onFocus.mock.calls[0][0].target.value).toBe(
        textareaValue
      );
    });

    it('passes event to onBlur', () => {
      const { container } = render(
        <Textarea
          {...commonTextareaProps}
          value={textareaValue}
          callbackWithEvent={true}
        />
      );
      const textarea = container.firstChild as HTMLElement;

      fireEvent.blur(textarea);

      expect(commonTextareaProps.onBlur.mock.calls[0][0].target.value).toBe(
        textareaValue
      );
    });
  });
});
