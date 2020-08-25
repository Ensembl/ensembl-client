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
import { action } from '@storybook/addon-actions';

import Upload, { FileReaderMethod } from 'src/shared/components/upload/Upload';

import styles from './Upload.stories.scss';

const Wrapper = (props: any) => {
  const { upload: Upload, ...otherProps } = props;

  const onchangeHandler = (filesOrContent: any) => {
    if (props.callbackWithFiles) {
      action(`Files: ${filesOrContent}`)();
      return;
    }

    action(`Content: ${filesOrContent}`)();
  };

  return (
    <div className={styles.defaultWrapper}>
      <Upload onChange={onchangeHandler} {...otherProps} />
    </div>
  );
};

export const DefaultStory = () => <Wrapper upload={Upload} />;

DefaultStory.story = {
  name: 'default'
};

export const CustomLabelStory = () => (
  <Wrapper upload={Upload} label={'Upload'} />
);

CustomLabelStory.story = {
  name: 'with custom label'
};

export const CallbackWithSingleFileStory = () => (
  <Wrapper upload={Upload} callbackWithFiles={true} allowMultiple={false} />
);

CallbackWithSingleFileStory.story = {
  name: 'callback with single file'
};

export const CallbackWithMultipleFilesStory = () => (
  <Wrapper upload={Upload} callbackWithFiles={true} />
);

CallbackWithMultipleFilesStory.story = {
  name: 'callback with multiple files'
};

export const CallbackWithDataUrlStory = () => (
  <Wrapper upload={Upload} fileReaderMethod={FileReaderMethod.DATA_URL} />
);

CallbackWithDataUrlStory.story = {
  name: 'callback with data urls'
};

export const CallbackWithBinaryStringStory = () => (
  <Wrapper upload={Upload} fileReaderMethod={FileReaderMethod.BINARY_STRING} />
);

CallbackWithBinaryStringStory.story = {
  name: 'callback with binary string'
};

export const CallbackWithArrayBufferStory = () => (
  <Wrapper upload={Upload} fileReaderMethod={FileReaderMethod.ARRAY_BUFFER} />
);

CallbackWithArrayBufferStory.story = {
  name: 'callback with array buffer'
};

export const CustomStylingStory = () => (
  <Wrapper
    upload={Upload}
    label="Upload here"
    classNames={{
      default: styles.customizedUpload,
      active: styles.customizedUploadActive
    }}
  />
);

CustomStylingStory.story = {
  name: 'customized upload'
};

export default {
  title: 'Components/Shared Components/Upload'
};
