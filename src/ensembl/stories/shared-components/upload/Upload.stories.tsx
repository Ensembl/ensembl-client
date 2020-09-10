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

import Upload, { FileReaderMethod } from 'src/shared/components/upload/Upload';

import styles from './Upload.stories.scss';

type DefaultArgs = {
  onChange: (...args: any) => void;
};

const Wrapper = (props: any) => {
  const { upload: Upload, ...otherProps } = props;

  const onChange = (filesOrContent: any) => {
    props.onChange(filesOrContent);
  };

  return (
    <div className={styles.defaultWrapper}>
      <Upload onChange={onChange} {...otherProps} />
    </div>
  );
};

export const DefaultStory = (args: DefaultArgs) => (
  <Wrapper upload={Upload} {...args} />
);

DefaultStory.storyName = 'default';

export const CustomLabelStory = (args: DefaultArgs) => (
  <Wrapper upload={Upload} label={'Upload'} {...args} />
);

CustomLabelStory.storyName = 'with custom label';

export const CallbackWithSingleFileStory = (args: DefaultArgs) => (
  <Wrapper
    upload={Upload}
    callbackWithFiles={true}
    allowMultiple={false}
    {...args}
  />
);

CallbackWithSingleFileStory.storyName = 'callback with single file';

export const CallbackWithMultipleFilesStory = (args: DefaultArgs) => (
  <Wrapper upload={Upload} callbackWithFiles={true} {...args} />
);

CallbackWithMultipleFilesStory.storyName = 'callback with multiple files';

export const CallbackWithDataUrlStory = (args: DefaultArgs) => (
  <Wrapper
    upload={Upload}
    fileReaderMethod={FileReaderMethod.DATA_URL}
    {...args}
  />
);

CallbackWithDataUrlStory.storyName = 'callback with data urls';

export const CallbackWithBinaryStringStory = (args: DefaultArgs) => (
  <Wrapper
    upload={Upload}
    fileReaderMethod={FileReaderMethod.BINARY_STRING}
    {...args}
  />
);

CallbackWithBinaryStringStory.storyName = 'callback with binary string';

export const CallbackWithArrayBufferStory = (args: DefaultArgs) => (
  <Wrapper
    upload={Upload}
    fileReaderMethod={FileReaderMethod.ARRAY_BUFFER}
    {...args}
  />
);

CallbackWithArrayBufferStory.storyName = 'callback with array buffer';

export const CustomStylingStory = (args: DefaultArgs) => (
  <Wrapper
    upload={Upload}
    label="Upload here"
    classNames={{
      default: styles.customizedUpload,
      active: styles.customizedUploadActive
    }}
    {...args}
  />
);

CustomStylingStory.storyName = 'customized upload';

export default {
  title: 'Components/Shared Components/Upload',
  argTypes: { onChange: { action: 'uploaded' } }
};
