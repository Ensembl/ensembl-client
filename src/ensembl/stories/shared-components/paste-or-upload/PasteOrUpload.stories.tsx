import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import PasteOrUpload from 'src/shared/components/paste-or-upload/PasteOrUpload';

import styles from './PasteOrUpload.stories.scss';

const Wrapper = (props: any) => {
  const [value, setValue] = useState<string | null>(props.value);

  const handleOnChange = (newValue: string) => {
    setValue(newValue);
    action('value-changed')(newValue);
  };

  const handleOnRemove = () => {
    setValue(null);
    action('input-removed')();
  };

  const handleOnUpload = (files: any) => {
    action('files-uploaded')(files);
  };

  return (
    <PasteOrUpload
      value={value}
      onChange={handleOnChange}
      onRemove={handleOnRemove}
      onUpload={handleOnUpload}
      placeholder={'Paste data'}
    />
  );
};

storiesOf('Components|Shared Components/PasteOrUpload', module)
  .add('without default value', () => {
    return (
      <div className={styles.wrapper}>
        <Wrapper value={null} />
      </div>
    );
  })
  .add('with default value', () => {
    return (
      <div className={styles.wrapper}>
        <Wrapper value={'Hello world!'} />
      </div>
    );
  });
