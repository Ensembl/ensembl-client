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
import { storiesOf } from '@storybook/react';
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

storiesOf('Components|Shared Components/Upload', module)
  .add('default', () => <Wrapper upload={Upload} />)
  .add('with custom label', () => <Wrapper upload={Upload} label={'Upload'} />)
  .add('callback with single file', () => (
    <Wrapper upload={Upload} callbackWithFiles={true} allowMultiple={false} />
  ))
  .add('callback with multiple files', () => (
    <Wrapper upload={Upload} callbackWithFiles={true} />
  ))
  .add('callback with data urls', () => (
    <Wrapper upload={Upload} fileReaderMethod={FileReaderMethod.DATA_URL} />
  ))
  .add('callback with binary string', () => (
    <Wrapper
      upload={Upload}
      fileReaderMethod={FileReaderMethod.BINARY_STRING}
    />
  ))
  .add('callback with array buffer', () => (
    <Wrapper upload={Upload} fileReaderMethod={FileReaderMethod.ARRAY_BUFFER} />
  ))
  .add('customized upload', () => (
    <Wrapper
      upload={Upload}
      label="Upload here"
      classNames={{
        default: styles.customizedUpload,
        active: styles.customizedUploadActive
      }}
    />
  ));
