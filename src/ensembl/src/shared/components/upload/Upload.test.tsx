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
import { mount } from 'enzyme';
import faker from 'faker';
import times from 'lodash/times';
import noop from 'lodash/noop';
import Upload from './Upload';
import windowService from 'src/services/window-service';

const onChange = jest.fn();

const defaultProps = {
  onChange
};

const event = { preventDefault: noop, stopPropagation: noop };

const renderUpload = (props: any) => mount(<Upload {...props} />);

const fileContents = faker.random.words();

const generateFile = () => {
  return new Blob([fileContents], { type: 'text/plain' });
};

const files = times(faker.random.number(10), () => generateFile());
const addEventListener = jest.fn((_, evtHandler) => {
  evtHandler();
});
const mockFileReader = {
  addEventListener,
  readAsText: jest.fn(),
  readAsArrayBuffer: jest.fn(),
  readAsBinaryString: jest.fn(),
  readAsDataURL: jest.fn(),
  result: fileContents
};

describe('Upload', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = renderUpload(defaultProps);
    windowService.getFileReader = jest.fn(() => mockFileReader) as any;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('using the input', () => {
    it('always renders an input of type file', () => {
      expect(wrapper.find('input[type="file"]')).toHaveLength(1);
    });

    it('allows multiple files to be selected by default', () => {
      expect(wrapper.find('input').prop('multiple')).toBeTruthy();
    });

    it('disables multiple file selection if allowMultiple is set to false', () => {
      wrapper = renderUpload({ ...defaultProps, allowMultiple: false });
      expect(wrapper.find('input').prop('multiple')).toBeFalsy();
    });

    it('calls the windowService.getFileReader for every file selected', () => {
      wrapper.find('input').prop('onChange')({
        ...event,
        target: { files: files }
      });

      expect(windowService.getFileReader).toHaveBeenCalledTimes(files.length);
    });

    it('calls the readAsText multiple times based on the number of files', () => {
      wrapper.find('input').prop('onChange')({
        ...event,
        target: { files: files }
      });

      expect(mockFileReader.readAsText).toHaveBeenCalledTimes(files.length);
    });
  });

  describe('using drag and drop', () => {
    it('has the necessary event listeners added', () => {
      const labelProps = wrapper.find('label').props();

      expect(labelProps.onDragEnter).toBeTruthy();
      expect(labelProps.onDragLeave).toBeTruthy();
      expect(labelProps.onDrop).toBeTruthy();
    });

    it('does not call the windowService.getFileReader when a file is just dragged in ', () => {
      const mockEvent = {
        ...event,
        dataTransfer: { files: files, clearData: noop }
      };
      wrapper.find('label').prop('onDragEnter')(mockEvent);
      expect(windowService.getFileReader).not.toHaveBeenCalled();
    });
  });
});
