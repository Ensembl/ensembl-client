import React, { useState, useEffect } from 'react';
import Input from 'src/shared/input/Input';
import ImageButton from 'src/shared/image-button/ImageButton';
import { ReactComponent as RemoveIcon } from 'static/img/shared/clear.svg';
import styles from './PasteOrUpload.scss';
import noop from 'lodash/noop';
import get from 'lodash/get';

type PasteOrUploadProps = {
  value: string | undefined;
  placeholder?: string;
  onChange: (value: string) => void;
  onRemove: () => void;
};

const PasteOrUpload = (props: PasteOrUploadProps) => {
  const [shouldShowInput, showInput] = useState(props.value !== undefined);
  const [value, setValue] = useState<string | undefined>('');

  useEffect(() => {
    showInput(props.value !== undefined);
    setValue(props.value);
  }, [props.value]);

  const [shouldShowFileUpload, showFileUpload] = useState(false);
  const onChangeHandler = (value: string) => {
    props.onChange(value);
    showInput(true);
  };

  const onRemoveHandler = () => {
    showFileUpload(false);
    props.onRemove();
  };

  let fileReader: FileReader;
  const handleFileRead = () => {
    const content: string = fileReader.result as string;
    showInput(true);
    showFileUpload(false);
    setValue(content);
    onChangeHandler(content);
  };

  const handleFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null = get(e, 'target.files.0', null);

    if (!file) {
      return;
    }
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  return (
    <>
      {!shouldShowInput && !shouldShowFileUpload && (
        <div className={styles.fields}>
          <div className={styles.textWrapper}>
            <span className={styles.pasteText} onClick={() => showInput(true)}>
              Paste data
            </span>{' '}
            or{' '}
            <span
              className={styles.uploadText}
              onClick={() => showFileUpload(true)}
            >
              Upload file
            </span>
          </div>
        </div>
      )}
      {shouldShowInput && (
        <div className={styles.fields}>
          <div className={styles.inputWrapper}>
            <Input
              value={value}
              onChange={onChangeHandler}
              className={styles.textInput}
              placeholder={props.placeholder}
            />
          </div>
        </div>
      )}

      {shouldShowFileUpload && (
        <div className={styles.fields}>
          <div className={styles.fileUploadWrapper}>
            <input
              type="file"
              className={styles.fileInput}
              onChange={(e) => handleFileChosen(e)}
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
