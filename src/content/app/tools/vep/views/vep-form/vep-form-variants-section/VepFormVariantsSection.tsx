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

import { useState, type FormEvent } from 'react';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from 'src/store';

import {
  getSelectedSpecies,
  getVepFormInputText
} from 'src/content/app/tools/vep/state/vep-form/vepFormSelectors';

import {
  updateInputText,
  updateInputCommittedFlag
} from 'src/content/app/tools/vep/state/vep-form/vepFormSlice';

import FormSection from 'src/content/app/tools/vep/components/form-section/FormSection';
import PlusButton from 'src/shared/components/plus-button/PlusButton';
import { PrimaryButton } from 'src/shared/components/button/Button';
import TextButton from 'src/shared/components/text-button/TextButton';
import Textarea from 'src/shared/components/textarea/Textarea';
import FileDropZone from 'src/shared/components/upload/FileDropZone';
import FileDropZoneOutline from 'src/shared/components/upload/FileDropZoneOutline';
import { CloseButtonWithLabel } from 'src/shared/components/close-button/CloseButton';

import UploadIcon from 'static/icons/icon_upload.svg';

import commonFormStyles from '../VepForm.module.css';
import styles from './VepFormVariantsSection.module.css';
import uploadStyles from 'src/shared/components/upload/Upload.module.css';

const VepFormVariantsSection = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const selectedSpecies = useAppSelector(getSelectedSpecies);
  const [inputFile, setInputFile] = useState<File | null>(null);
  const inputText = useAppSelector(getVepFormInputText);
  const dispatch = useAppDispatch();

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const onReset = () => {
    dispatch(updateInputText(''));
    setInputFile(null);
  };

  const onInputTextUpdate = (text: string) => {
    dispatch(updateInputText(text));
  };

  const canExpand = !!selectedSpecies;

  return (
    <FormSection>
      <div className={commonFormStyles.topFormSectionRegularGrid}>
        <div className={commonFormStyles.topFormSectionName}>Variants</div>
        <div className={commonFormStyles.topFormSectionMain}>
          <TextButton disabled={!canExpand} onClick={toggleExpanded}>
            Add variants
          </TextButton>
        </div>
        <div className={commonFormStyles.topFormSectionToggle}>
          {isExpanded ? (
            <CloseButtonWithLabel onClick={toggleExpanded} />
          ) : (
            <PlusButton disabled={!canExpand} onClick={toggleExpanded} />
          )}
        </div>
      </div>
      {isExpanded && (
        <ExpandedContents
          inputString={inputText}
          setInputString={onInputTextUpdate}
          inputFile={inputFile}
          setInputFile={setInputFile}
          onReset={onReset}
        />
      )}
    </FormSection>
  );
};

const ExpandedContents = (props: {
  inputString: string;
  setInputString: (val: string) => void;
  inputFile: File | null;
  setInputFile: (file: File) => void;
  onReset: () => void;
}) => {
  const { inputString, inputFile, setInputString, setInputFile, onReset } =
    props;
  const dispatch = useAppDispatch();

  const onTextareaContentChange = (event: FormEvent<HTMLTextAreaElement>) => {
    setInputString(event.currentTarget.value);
  };

  const onFileDrop = (file: File) => {
    setInputFile(file);
  };

  const onCommitInput = () => {
    dispatch(updateInputCommittedFlag(true));
  };

  const hasTextInput = !!inputString;
  const hasFileInput = !!inputFile;
  const shouldDisableTextInput = hasFileInput;
  const shouldDisableFileInput = hasTextInput;
  const canCommitInput = hasTextInput || hasFileInput;

  return (
    <div className={styles.expandedContentGrid}>
      <div className={styles.gridColumnLeft}>Example data</div>
      <div className={styles.gridColumnMiddle}>
        <Textarea
          className={styles.textarea}
          value={inputString}
          onChange={onTextareaContentChange}
          placeholder="Paste data"
          disabled={shouldDisableTextInput}
        />
      </div>
      <div className={styles.gridColumnRight}>
        <div className={styles.inputControlButtons}>
          <PrimaryButton disabled={!canCommitInput} onClick={onCommitInput}>
            Add
          </PrimaryButton>
          {canCommitInput && <TextButton onClick={onReset}>Clear</TextButton>}
        </div>
      </div>
      {!shouldDisableFileInput && (
        <>
          <div
            className={classNames(
              styles.gridColumnLeft,
              styles.alignSelfCenter
            )}
          >
            or
          </div>
          <div className={styles.gridColumnMiddle}>
            {!inputFile ? (
              <FileDropZone
                className={styles.fileDropZone}
                onUpload={onFileDrop}
              >
                <FileDropZoneLabel />
              </FileDropZone>
            ) : (
              <FileDropZoneOutline className={styles.fileDropZoneOutline}>
                {inputFile.name}
              </FileDropZoneOutline>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const FileDropZoneLabel = () => {
  return (
    <div className={styles.fileDropZoneLabel}>
      <span>Click or drag a VCF here</span>
      <UploadIcon className={uploadStyles.uploadIcon} />
    </div>
  );
};

export default VepFormVariantsSection;
