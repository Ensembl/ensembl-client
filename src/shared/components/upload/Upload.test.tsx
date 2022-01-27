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
import { setTimeout } from 'timers/promises';
import { render, fireEvent, act } from '@testing-library/react';
import noop from 'lodash/noop';
import Upload from './Upload';

import type { FileTransformedToString } from './types';

const file1 = new File(['Lorem ipsum'], 'file1.txt', {
  type: 'text/plain'
});

const file2 = new File(['dolor sit amet'], 'file2.txt', {
  type: 'text/plain'
});

describe('Upload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders an input of type file', () => {
      const { container } = render(<Upload onUpload={noop} />);
      expect(container.querySelectorAll('input[type="file"]')).toHaveLength(1);
    });

    it('allows upload of only a single file by default', () => {
      const { container } = render(<Upload onUpload={noop} />);
      const input = container.querySelector('input');
      expect(input?.hasAttribute('multiple')).toBe(false);
    });

    it('allows upload of multiple files', () => {
      const { container } = render(
        <Upload onUpload={noop} allowMultiple={true} />
      );
      const input = container.querySelector('input');
      expect(input?.hasAttribute('multiple')).toBe(true);
    });
  });

  describe('file uploading via file input', () => {
    const onUpload = jest.fn();

    it('uploads a single file', () => {
      const { container } = render(<Upload onUpload={onUpload} />);

      fireEvent.change(container.querySelector('input') as HTMLElement, {
        ...event,
        target: { files: [file1] }
      });

      const uploadedFile = onUpload.mock.calls[0][0] as File;

      expect(uploadedFile.name).toBe('file1.txt');
    });

    it('uploads multiple files', () => {
      const { container } = render(
        <Upload onUpload={onUpload} allowMultiple={true} />
      );

      fireEvent.change(container.querySelector('input') as HTMLElement, {
        ...event,
        target: { files: [file1, file2] }
      });

      const [uploadedFile1, uploadedFile2] = onUpload.mock
        .calls[0][0] as File[];

      expect(uploadedFile1.name).toBe('file1.txt');
      expect(uploadedFile2.name).toBe('file2.txt');
    });

    // for tests of all possible file transformations, see uploadHelpers.test.ts
    it('can read text contents of a file', async () => {
      // intentionally redefining onUpload to prove
      // that the type of the callback function matches component's expectations
      let textFromFile = '';
      const onUpload = (result: FileTransformedToString) =>
        (textFromFile = result.content as string);

      const { container } = render(
        <Upload onUpload={onUpload} transformTo="text" />
      );

      await act(async () => {
        fireEvent.change(container.querySelector('input') as HTMLElement, {
          ...event,
          target: { files: [file1, file2] }
        });
        // bump to the end of event loop to give file reader time to read the file, and for React component to update
        await setTimeout(0);
      });

      expect(textFromFile).toBe('Lorem ipsum');
    });

    it('can read text contents of several files', async () => {
      // intentionally redefining onUpload;
      // notice how the type of its parameter is different from onUpload in the previous test
      let textFromFile = '';
      const onUpload = (results: FileTransformedToString[]) =>
        (textFromFile = results.map((result) => result.content).join(' '));

      const { container } = render(
        <Upload onUpload={onUpload} allowMultiple={true} transformTo="text" />
      );

      await act(async () => {
        fireEvent.change(container.querySelector('input') as HTMLElement, {
          ...event,
          target: { files: [file1, file2] }
        });
        // bump to the end of event loop to give file reader time to read the file, and for React component to update
        await setTimeout(0);
      });

      expect(textFromFile).toBe('Lorem ipsum dolor sit amet');
    });
  });

  describe('file uploading via drag and drop', () => {
    const mockDragEvent = {
      preventDefault: noop,
      stopPropagation: noop,
      dataTransfer: {
        items: [{ getAsFile: () => file1 }, { getAsFile: () => file2 }],
        types: ['Files']
      }
    };
    const onUpload = jest.fn();

    it('changes drop zone class when a file is dragged over', () => {
      const { container } = render(<Upload onUpload={onUpload} />);
      const label = container.querySelector('label') as HTMLElement;

      fireEvent.dragEnter(label, mockDragEvent);

      expect(label.classList.contains('uploadDragOver')).toBe(true);

      fireEvent.dragLeave(label, mockDragEvent);

      expect(label.classList.contains('uploadDragOver')).toBe(false);
    });

    it('uploads a single file', () => {
      const { container } = render(<Upload onUpload={onUpload} />);
      const label = container.querySelector('label') as HTMLElement;

      fireEvent.drop(label, mockDragEvent);

      const uploadedFile = onUpload.mock.calls[0][0] as File;

      expect(uploadedFile.name).toBe('file1.txt');
    });

    it('uploads multiple files', () => {
      const { container } = render(
        <Upload allowMultiple={true} onUpload={onUpload} />
      );
      const label = container.querySelector('label') as HTMLElement;

      fireEvent.drop(label, mockDragEvent);

      const [uploadedFile1, uploadedFile2] = onUpload.mock
        .calls[0][0] as File[];

      expect(uploadedFile1.name).toBe('file1.txt');
      expect(uploadedFile2.name).toBe('file2.txt');
    });

    // tests for reading contents of one or more dropped files
    // wouldn't really add much compared to what was tested for uploading via file input;
    // and are therefore omitted in this section
  });
});
