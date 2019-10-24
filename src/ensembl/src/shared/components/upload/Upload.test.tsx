import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';
import times from 'lodash/times';
import noop from 'lodash/noop';
import Upload from './Upload';

const onChange = jest.fn();

const defaultProps = {
  onChange
};

const event = { preventDefault: noop, stopPropagation: noop };

const renderUpload = (props: any = defaultProps) =>
  mount(<Upload {...props} />);

const fileContents = faker.random.words();

const generateFile = () => {
  return new Blob([fileContents], { type: 'text/plain' });
};

const files = times(faker.random.number(10), () => generateFile());
const readAsText = jest.fn();
const addEventListener = jest.fn((_, evtHandler) => {
  evtHandler();
});
const dummyFileReader = { addEventListener, readAsText, result: fileContents };

describe('Upload', () => {
  let wrapper: any;

  beforeEach(() => {
    jest.resetAllMocks();
    window.FileReader = jest.fn(() => dummyFileReader) as any;
    wrapper = renderUpload();
  });

  describe('using the input', () => {
    it('always renders an input of type file', () => {
      expect(wrapper.find('input')).toHaveLength(1);
    });

    it('allows multiple files to be selected by default', () => {
      expect(wrapper.find('input').prop('multiple')).toBeTruthy();
    });

    it('disabled multiple file selection if allowMultiple is set to false', () => {
      wrapper = renderUpload({ allowMultiple: false });
      expect(wrapper.find('input').prop('multiple')).toBeFalsy();
    });

    it('calls the FileReader when a file is selected', () => {
      wrapper.find('input').prop('onChange')({ target: { files: [files[0]] } });
      expect(FileReader).toHaveBeenCalled();
      expect(readAsText).toHaveBeenCalledWith(files[0]);
    });
  });

  describe('using drag and drop', () => {
    it('has the necessary event listeners added', () => {
      const spanProps = wrapper.find('span').props();

      expect(spanProps.onDragEnter).toBeTruthy();
      expect(spanProps.onDragLeave).toBeTruthy();
      expect(spanProps.onDrop).toBeTruthy();
    });

    it('calls FileReader when a file is dropped ', () => {
      const mockEvent = {
        ...event,
        dataTransfer: { files: files, clearData: noop }
      };
      wrapper.find('span').prop('onDrop')(mockEvent);
      expect(FileReader).toHaveBeenCalled();
    });

    it('calls FileReader multiple times based on the number of files', () => {
      const mockEvent = {
        ...event,
        dataTransfer: { files: files, clearData: noop }
      };
      wrapper.find('span').prop('onDrop')(mockEvent);
      expect(FileReader).toHaveBeenCalledTimes(files.length);
    });

    it('does not call the FileReader when a file is just dragged in ', () => {
      const mockEvent = {
        ...event,
        dataTransfer: { files: files, clearData: noop }
      };
      wrapper.find('span').prop('onDragEnter')(mockEvent);
      expect(FileReader).not.toHaveBeenCalled();
    });
  });
});
