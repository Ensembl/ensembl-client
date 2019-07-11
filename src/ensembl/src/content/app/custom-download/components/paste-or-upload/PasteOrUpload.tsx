import React, { useState } from 'react';
import Input from 'src/shared/input/Input';
import ImageButton from 'src/shared/image-button/ImageButton';
import { ReactComponent as RemoveIcon } from 'static/img/shared/clear.svg';
import styles from './PasteOrUpload.scss';
import noop from 'lodash/noop';

type PasteOrUploadProps = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onRemove: () => void;
};

const PasteOrUpload = (props: PasteOrUploadProps) => {
  const [shouldShowInput, showInput] = useState(Boolean(props.value));
  const onChangeHandler = (value: string) => {
    props.onChange(value);
  };

  const onRemoveHandler = () => {
    props.onRemove();
  };

  return (
    <>
      {!shouldShowInput && (
        <div className={styles.textWrapper}>
          <span className={styles.pasteText} onClick={() => showInput(true)}>
            Paste data
          </span>{' '}
          or <span className={styles.uploadText}>Upload file</span>
        </div>
      )}
      {shouldShowInput && (
        <div className={styles.fields}>
          <div className={styles.inputWrapper}>
            <Input
              value={props.value}
              onChange={onChangeHandler}
              className={styles.textInput}
              placeholder={props.placeholder}
            />
          </div>
          <div className={styles.removeIconHolder}>
            <ImageButton
              onClick={onRemoveHandler}
              description={'Remove'}
              image={RemoveIcon}
            />
          </div>
        </div>
      )}
    </>
  );
};

PasteOrUpload.defaultProps = {
  onChange: noop
};

export default PasteOrUpload;
