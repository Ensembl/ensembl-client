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
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import faker from 'faker';

import CheckboxWithTextfields, {
  CheckboxWithTextfieldsProps
} from './CheckboxWithTextfields';
import { FileTransformedToString } from 'src/shared/components/upload';

const onTextChange = jest.fn();
const onFilesChange = jest.fn();
const onReset = jest.fn();

const mockReadFile: FileTransformedToString = {
  filename: faker.random.words(),
  content: faker.random.words(),
  error: null
};

const mockReadFileWithError: FileTransformedToString = {
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
  const renderCheckboxWithTextfields = (
    props?: Partial<CheckboxWithTextfieldsProps>
  ) => render(<CheckboxWithTextfields {...defaultProps} {...props} />);

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders without error', () => {
    expect(() => renderCheckboxWithTextfields()).not.toThrow();
  });

  it('displays the Paste Data text by default', () => {
    const { container } = renderCheckboxWithTextfields();
    expect(container.querySelector('.pasteDataText')?.textContent).toBe(
      'Paste Data'
    );
  });

  it('displays one Upload component by default', () => {
    const { container } = renderCheckboxWithTextfields();
    expect(container.querySelectorAll('.upload')).toHaveLength(1);
  });

  it('passes the label to the checkbox component', () => {
    const label = faker.random.words();
    const { container } = renderCheckboxWithTextfields({ label });
    expect(container.querySelector('.label')?.textContent).toBe(label);
  });

  it('automatically checks the checkbox when a textValue is passed', () => {
    const { container } = renderCheckboxWithTextfields({ textValue: 'foo' });
    expect(
      (container.querySelector('input[type="checkbox"]') as HTMLInputElement)
        .checked
    ).toBeTruthy();
  });

  it('automatically checks the checkbox when the files list is not empty', () => {
    const { container } = renderCheckboxWithTextfields({
      files: [mockReadFile]
    });

    expect(
      (container.querySelector('input[type="checkbox"]') as HTMLInputElement)
        .checked
    ).toBeTruthy();
  });

  it('calls the onReset prop when the checkbox is unchecked', () => {
    const { getByTestId } = renderCheckboxWithTextfields({ textValue: 'foo' });
    const checkboxLabelElement = getByTestId('checkbox-label-grid');

    userEvent.click(checkboxLabelElement as HTMLElement);

    expect(onReset).toBeCalled();
  });

  it('displays N number of file details based on the files prop', () => {
    const files = Array(faker.datatype.number(10)).fill(mockReadFile);
    const { container } = renderCheckboxWithTextfields({ files: files });

    expect(container.querySelectorAll('.filename').length).toBe(files.length);
  });

  it('calls the onFilesChange when a file is removed', async () => {
    const files = Array(faker.datatype.number(10) || 1).fill(mockReadFile);
    const randomNumber = faker.datatype.number(files.length - 1);
    const { container } = renderCheckboxWithTextfields({ files: files });

    const removeIcon = container
      .querySelectorAll('.removeFileIcon')
      [randomNumber].querySelector('.imageButton');

    userEvent.click(removeIcon as HTMLElement);

    expect(onFilesChange).toBeCalled();
  });

  it('displays an error message if the file has the error field set', async () => {
    const { container } = renderCheckboxWithTextfields({
      files: [mockReadFileWithError]
    });

    expect(container.querySelector('.errorMessage')?.textContent).toBe(
      mockReadFileWithError.error
    );
  });
});
