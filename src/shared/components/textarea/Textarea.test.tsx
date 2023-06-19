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
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';
import Textarea from './Textarea';

describe('<Textarea />', () => {
  const commonTextareaProps = {
    id: faker.lorem.word(),
    name: faker.lorem.word(),
    className: faker.lorem.word(),
    onChange: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn()
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  const textareaValue = faker.lorem.words();

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

    it('forwards the ref to the textarea element', () => {
      let textareaRef =
        null as MutableRefObject<HTMLTextAreaElement | null> | null;
      const Wrapper = () => {
        textareaRef = useRef<HTMLTextAreaElement | null>(null);
        return <Textarea ref={textareaRef} {...props} />;
      };
      render(<Wrapper />);

      const textareaElement = textareaRef?.current;

      expect(textareaElement?.tagName).toBe('TEXTAREA');
    });
  });

  describe('responding with events', () => {
    it('passes event to onChange', async () => {
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
          <Textarea {...commonTextareaProps} onChange={onChange} value={text} />
        );
      };
      const { container } = render(<StatefulTextareaWrapper />);
      const textarea = container.firstChild as HTMLElement;

      await userEvent.type(textarea, 'd');
      expect(spy.mock.calls[0][0].target.value).toBe('Hello world');
    });

    it('passes event to onFocus', () => {
      const { container } = render(
        <Textarea {...commonTextareaProps} value={textareaValue} />
      );
      const textarea = container.firstChild as HTMLElement;

      fireEvent.focus(textarea);

      expect(commonTextareaProps.onFocus.mock.calls[0][0].target.value).toBe(
        textareaValue
      );
    });

    it('passes event to onBlur', () => {
      const { container } = render(
        <Textarea {...commonTextareaProps} value={textareaValue} />
      );
      const textarea = container.firstChild as HTMLElement;

      fireEvent.blur(textarea);

      expect(commonTextareaProps.onBlur.mock.calls[0][0].target.value).toBe(
        textareaValue
      );
    });
  });
});
