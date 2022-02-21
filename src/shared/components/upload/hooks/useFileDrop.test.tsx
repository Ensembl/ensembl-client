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
import { setTimeout } from 'timers/promises';
import { render, fireEvent, act } from '@testing-library/react';
import noop from 'lodash/noop';
import classNames from 'classnames';

import useFileDrop from './useFileDrop';

import type { FileTransformedToString } from '../types';

const file = new File(['Lorem ipsum'], 'file.txt', {
  type: 'text/plain'
});

const TestComponent = () => {
  const [text, setText] = useState('I am empty component');
  const onUpload = ({ content }: FileTransformedToString) =>
    setText(content as string);

  const { ref, isDraggedOver } = useFileDrop({
    transformTo: 'text',
    onUpload
  });

  const className = classNames({
    fileOver: isDraggedOver
  });

  return (
    <div data-test-id="test-component" ref={ref} className={className}>
      {text}
    </div>
  );
};

describe('useFileDrop', () => {
  const mockDragEvent = {
    preventDefault: noop,
    stopPropagation: noop,
    dataTransfer: {
      items: [{ getAsFile: () => file }],
      types: ['Files']
    }
  };

  it('detects dragenter and dragleave events for a component', async () => {
    const { getByTestId } = render(<TestComponent />);
    const testElement = getByTestId('test-component');

    fireEvent.dragEnter(testElement, mockDragEvent);

    expect(testElement.classList.contains('fileOver')).toBe(true);

    fireEvent.dragLeave(testElement, mockDragEvent);

    expect(testElement.classList.contains('fileOver')).toBe(false);
  });

  it('handles file drop', async () => {
    const { getByTestId } = render(<TestComponent />);
    const testElement = getByTestId('test-component');

    expect(testElement.innerHTML).toBe('I am empty component');

    await act(async () => {
      fireEvent.drop(testElement, mockDragEvent);
      await setTimeout(0); // bump to the end of event loop to give file reader time to read the file, and for React component to update
    });

    expect(testElement.innerHTML).toBe('Lorem ipsum');
  });
});
