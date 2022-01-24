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
import { render, fireEvent } from '@testing-library/react';
import noop from 'lodash/noop';
import classNames from 'classnames';

import useFileDrop from './useFileDrop';

// const generateFile = () => {
//   const fileContents = 'This is my file. There are many like it, but this one is mine';
//   return new File([fileContents], 'file.txt', { type: 'text/plain' });
// };

const TestComponent = () => {
  const { ref, isDraggedOver } = useFileDrop({
    allowMultiple: true,
    onUpload: (files: File[]) => noop(files)
  });

  const className = classNames({
    fileOver: isDraggedOver
  });

  return (
    <div data-test-id="test-component" ref={ref} className={className}>
      I am a test component
    </div>
  );
};

describe('useFileDrop', () => {
  it('works', () => {
    // const file = generateFile();
    const mockEvent = {
      preventDefault: noop,
      stopPropagation: noop
      // dataTransfer: { files: [file], clearData: noop }
    };
    const { getByTestId } = render(<TestComponent />);
    const testElement = getByTestId('test-component');

    fireEvent.dragEnter(testElement, mockEvent);

    expect(testElement.classList.contains('fileOver')).toBe(true);

    fireEvent.dragLeave(testElement, mockEvent);

    expect(testElement.classList.contains('fileOver')).toBe(false);
    // fireEvent.drop(testElement, mockEvent);
  });

  it.todo('detects when the file is dragged over');

  it.todo('handles file drop');

  // QUESTION: should there be tests for different file reader options,
  // or is it sufficient to just test this for upload helpers?
});
