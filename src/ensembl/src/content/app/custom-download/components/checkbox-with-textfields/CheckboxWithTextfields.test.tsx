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
import { act } from 'react-dom/test-utils';

import CheckboxWithTextfields from './CheckboxWithTextfields';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import Upload, { ReadFile } from 'src/shared/components/upload/Upload';
import ImageButton from 'src/shared/components/image-button/ImageButton';

const onTextChange = jest.fn();
const onFilesChange = jest.fn();
const onReset = jest.fn();

let wrapper: any;
const mockReadFile: ReadFile = {
  filename: faker.random.words(),
  content: faker.random.words(),
  error: null
};

const mockReadFileWithError: ReadFile = {
  filename: faker.random.words(),
  content: faker.random.words(),
  error: faker.random.words()
};

const defaultProps = {
  textValue: '',
  files: [],
  label: '',
  onTextChange,
  onFilesChange,
  onReset
};

describe('<CheckboxWithTextfields />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders without error', () => {
    wrapper = () => {
      mount(<CheckboxWithTextfields {...defaultProps} />);
    };
    expect(wrapper).not.toThrow();
  });

  it('displays the Paste Data text by default', () => {
    wrapper = mount(<CheckboxWithTextfields {...defaultProps} />);
    expect(wrapper.find('.pasteDataText').text()).toBe('Paste Data');
  });

  it('displays one Upload component by default', () => {
    wrapper = mount(<CheckboxWithTextfields {...defaultProps} />);
    expect(wrapper.find(Upload)).toHaveLength(1);
  });

  it('passes the label to the checkbox component', () => {
    const label = faker.random.words();
    wrapper = mount(<CheckboxWithTextfields {...defaultProps} label={label} />);
    expect(wrapper.find(Checkbox).prop('label')).toBe(label);
  });

  it('automatically checks the checkbox when a textValue is passed', () => {
    wrapper = mount(
      <CheckboxWithTextfields {...defaultProps} textValue={'foo'} />
    );
    expect(wrapper.find(Checkbox).prop('checked')).toBe(true);
  });

  it('automatically checks the checkbox when the files list is not empty', () => {
    wrapper = mount(
      <CheckboxWithTextfields {...defaultProps} files={[mockReadFile]} />
    );
    expect(wrapper.find(Checkbox).prop('checked')).toBe(true);
  });

  it('calls the onReset prop when the checkbox is unchecked', () => {
    wrapper = mount(
      <CheckboxWithTextfields {...defaultProps} textValue={'foo'} />
    );
    wrapper.find(Checkbox).find('label').simulate('click');
    expect(onReset).toBeCalled();
  });

  it('displays N number of file details based on the files prop', () => {
    const files = Array(faker.random.number(10)).fill(mockReadFile);
    wrapper = mount(<CheckboxWithTextfields {...defaultProps} files={files} />);
    expect(wrapper.find('.filename').length).toBe(files.length);
  });

  it('calls the onFilesChange when a file is removed', async () => {
    const files = Array(faker.random.number(10) || 1).fill(mockReadFile);
    const randomNumber = faker.random.number(files.length - 1);
    wrapper = mount(<CheckboxWithTextfields {...defaultProps} files={files} />);

    await act(async () => {
      wrapper
        .find('.removeFileIcon')
        .at(randomNumber)
        .find(ImageButton)
        .prop('onClick')();
    });
    wrapper.update();

    expect(onFilesChange).toBeCalled();
  });

  it('displays an error message if the file has the error field set', async () => {
    wrapper = mount(
      <CheckboxWithTextfields
        {...defaultProps}
        files={[mockReadFileWithError]}
      />
    );

    expect(wrapper.find('.errorMessage').text()).toBe(
      mockReadFileWithError.error
    );
  });
});
