import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Upload from 'src/shared/components/upload/Upload';

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
      <div></div>
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
  .add('customized upload', () => (
    <Wrapper
      upload={Upload}
      label="Upload here"
      className={styles.customizedUpload}
    />
  ));
