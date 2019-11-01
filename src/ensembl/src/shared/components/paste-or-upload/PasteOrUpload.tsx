import React, { useState } from 'react';
import noop from 'lodash/noop';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import { ReactComponent as RemoveIcon } from 'static/img/shared/clear.svg';
import Textarea from 'src/shared/components/textarea/Textarea';
import Upload, {
  UploadProps,
  ReadFile
} from 'src/shared/components/upload/Upload';

import styles from './PasteOrUpload.scss';
import { nextUuid } from 'src/shared/helpers/uuid';

type PasteOrUploadProps = {
  value: string | null;
  placeholder?: string;
  uploadProps?: Omit<UploadProps, 'onChange' | 'callbackWithFiles' | 'id'>;
  onChange: (value: string) => void;
  onUpload: (files: ReadFile[]) => void;
  onRemove: () => void;
};

const PasteOrUpload = (props: PasteOrUploadProps) => {
  const [shouldShowInput, showInput] = useState(props.value !== null);

  const [shouldShowFileUpload, showFileUpload] = useState(false);

  const onRemoveHandler = () => {
    showFileUpload(false);
    showInput(false);
    props.onRemove();
  };

  return (
    <>
      {!shouldShowInput && !shouldShowFileUpload && (
        <div className={styles.fields}>
          <div className={styles.textWrapper}>
            <span className={styles.pasteText} onClick={() => showInput(true)}>
              Paste data
            </span>
            <span className={styles.orText}>or</span>
            <Upload
              onChange={props.onUpload}
              {...props.uploadProps}
              id={'upload_' + nextUuid()}
            />
          </div>
        </div>
      )}
      {shouldShowInput && (
        <div className={styles.fields}>
          <div className={styles.inputWrapper}>
            <Textarea
              onChange={props.onChange}
              placeholder={props.placeholder}
              value={props.value || ''}
              resizable={false}
            />
          </div>
        </div>
      )}

      {(shouldShowInput || shouldShowFileUpload) && (
        <div className={styles.removeIconHolder}>
          <ImageButton
            onClick={onRemoveHandler}
            description={'Remove'}
            image={RemoveIcon}
          />
        </div>
      )}
    </>
  );
};

PasteOrUpload.defaultProps = {
  onChange: noop
};

export default PasteOrUpload;
