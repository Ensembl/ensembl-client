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
import { render, fireEvent, waitFor } from '@testing-library/react';
import faker from 'faker';
import times from 'lodash/times';
import noop from 'lodash/noop';
import Upload, { UploadProps } from './Upload';
import windowService from 'src/services/window-service';

const onChange = jest.fn();

const defaultProps = {
  onChange
};

const event = { preventDefault: noop, stopPropagation: noop };

const renderUpload = (props: Partial<UploadProps> = {}) =>
  render(<Upload {...defaultProps} {...props} />);

const fileContents = faker.random.words();

const generateFile = () => {
  return new File([fileContents], 'file.txt', { type: 'text/plain' });
};

const files = times(faker.datatype.number(10), () => generateFile());

const mockFileReader = {
  onload: jest.fn(),
  readAsText: jest.fn().mockImplementation(function () {
    mockFileReader.onload();
  }),
  readAsArrayBuffer: jest.fn(),
  readAsBinaryString: jest.fn(),
  readAsDataURL: jest.fn(),
  result: fileContents
};

describe('Upload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    windowService.getFileReader = jest.fn(() => mockFileReader) as any;
  });

  describe('using the input', () => {
    const container = renderUpload().container;
    it('always renders an input of type file', () => {
      expect(container.querySelectorAll('input[type="file"]')).toHaveLength(1);
    });

    it('allows multiple files to be selected by default', () => {
      const container = renderUpload().container;
      expect(
        container.querySelector('input')?.getAttribute('multiple')
      ).toEqual('');
    });

    it('disables multiple file selection if allowMultiple is set to false', () => {
      const container = renderUpload({ allowMultiple: false }).container;
      expect(
        container.querySelector('input')?.getAttribute('multiple')
      ).toBeFalsy();
    });

    it('calls the windowService.getFileReader for every file selected', () => {
      const container = renderUpload().container;
      fireEvent.change(container.querySelector('input') as HTMLElement, {
        ...event,
        target: { files: files }
      });
      expect(windowService.getFileReader).toHaveBeenCalledTimes(files.length);
    });

    it('calls the readAsText multiple times based on the number of files', () => {
      const container = renderUpload().container;
      fireEvent.change(container.querySelector('input') as HTMLElement, {
        ...event,
        target: { files: files }
      });
      expect(mockFileReader.readAsText).toHaveBeenCalledTimes(files.length);
    });
  });

  describe('using drag and drop', () => {
    it('changes its appearance when the user drags a file over', () => {
      const item = {};
      const dataTransfer = {
        items: [item]
      };

      const { container } = renderUpload();
      const label = container.querySelector('label') as HTMLElement;

      // before dragging
      expect(label.className.includes('defaultUpload')).toBe(true);
      expect(label.className.includes('defaultUploadActive')).toBe(false);

      fireEvent.dragEnter(label, { dataTransfer });

      expect(label.className.includes('defaultUploadActive')).toBe(true);

      fireEvent.dragLeave(label);

      expect(label.className.includes('defaultUploadActive')).toBe(false);
    });

    it('passes file content to the onChange prop after the file is dropped', async () => {
      const file = generateFile();
      const mockEvent = {
        ...event,
        dataTransfer: { files: [file], clearData: noop }
      };
      const { container } = renderUpload();
      const label = container.querySelector('label') as HTMLElement;

      fireEvent.drop(label, mockEvent);

      await waitFor(() => {
        expect(onChange.mock.calls.length).toBeGreaterThan(0);
      });
      const parsedFiles = onChange.mock.calls[0][0]; // the argument passed to onChange is an array of parsed files
      const parsedFile = parsedFiles[0];
      expect(parsedFile.filename).toBe('file.txt');
      expect(parsedFile.content).toBe(fileContents);
      expect(parsedFile.error).toBe(null);
    });
  });
});
