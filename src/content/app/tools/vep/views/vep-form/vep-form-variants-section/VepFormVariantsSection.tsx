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

import { useState, type ChangeEvent, type ReactNode } from 'react';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from 'src/store';

import {
  getSelectedSpecies,
  getVepFormInputText,
  getVepFormInputFileName
} from 'src/content/app/tools/vep/state/vep-form/vepFormSelectors';

import {
  updateInputText,
  updateInputFile,
  clearVariantsInput,
  updateInputCommittedFlag
} from 'src/content/app/tools/vep/state/vep-form/vepFormSlice';
import {
  useVepFormConfigQuery,
  useVepFormExampleInputQuery
} from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';
import { checkVepInput } from './checkVepInput';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedSpecies = useAppSelector(getSelectedSpecies);
  const inputText = useAppSelector(getVepFormInputText);
  const inputFileName = useAppSelector(getVepFormInputFileName);
  const dispatch = useAppDispatch();

  const { currentData: formConfig } = useVepFormConfigQuery(
    { genome_id: selectedSpecies?.genome_id ?? '' },
    { skip: !selectedSpecies }
  );
  const { currentData: exampleInputs } = useVepFormExampleInputQuery(
    { genomeId: selectedSpecies?.genome_id ?? '' },
    {
      skip: !selectedSpecies?.genome_id
    }
  );

  const [prevIsGenomeSelected, setPrevIsGenomeSelected] = useState(
    Boolean(selectedSpecies)
  );

  if (
    (selectedSpecies && !prevIsGenomeSelected) ||
    (!selectedSpecies && prevIsGenomeSelected)
  ) {
    // Automatically expand this section once a species has been selected, so the
    // user can go straight to entering variants. If the species is cleared
    // (e.g. the form is reset), collapse the section again.
    setPrevIsGenomeSelected(Boolean(selectedSpecies));
    setIsExpanded(Boolean(selectedSpecies));
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const onReset = () => {
    dispatch(clearVariantsInput());
    dispatch(updateInputCommittedFlag(false));
  };

  const onInputTextUpdate = (text: string) => {
    dispatch(updateInputText(text));
  };

  const onInputFileUpdate = (file: File) => {
    dispatch(updateInputFile(file));
  };

  const canExpand = !!selectedSpecies;

  return (
    <FormSection className={styles.variantsSection}>
      <div className={commonFormStyles.topFormSectionRegularGrid}>
        <div className={commonFormStyles.topFormSectionName}>Variants</div>
        <div className={commonFormStyles.topFormSectionMain}>
          <MainContentCollapsed
            isExpanded={isExpanded}
            inputText={inputText}
            inputFileName={inputFileName}
          />
        </div>
        <div className={commonFormStyles.topFormSectionToggle}>
          {isExpanded ? (
            <CloseButtonWithLabel onClick={toggleExpanded} />
          ) : inputText || inputFileName ? (
            <TextButton onClick={toggleExpanded}>Change</TextButton>
          ) : (
            <PlusButton disabled={!canExpand} onClick={toggleExpanded} />
          )}
        </div>
      </div>
      {isExpanded && (
        <ExpandedContents
          inputString={inputText}
          setInputString={onInputTextUpdate}
          inputFileName={inputFileName}
          exampleInputs={exampleInputs}
          setInputFile={onInputFileUpdate}
          maxUploadBytes={formConfig?.max_upload_bytes}
          toggleExpanded={toggleExpanded}
          onReset={onReset}
        />
      )}
    </FormSection>
  );
};

const MainContentCollapsed = ({
  inputText,
  inputFileName,
  isExpanded
}: {
  inputText: string | null;
  inputFileName: string | null;
  isExpanded: boolean;
}) => {
  if (isExpanded || (!inputText && !inputFileName)) {
    // No "Add variants" prompt: the section auto-expands once a species is
    // selected, and the toggle button in the section header handles expansion.
    return null;
  } else if (inputText) {
    return <div className={styles.rawVariantsTextContainer}>{inputText}</div>;
  } else if (inputFileName) {
    return <span>{inputFileName}</span>;
  } else {
    // this branch should be unreachable
    return null;
  }
};

const ExpandedContents = ({
  inputString,
  inputFileName,
  exampleInputs,
  setInputString,
  setInputFile,
  maxUploadBytes,
  toggleExpanded,
  onReset
}: {
  inputString: string | null;
  setInputString: (val: string) => void;
  inputFileName: string | null;
  setInputFile: (file: File) => void;
  maxUploadBytes?: number;
  exampleInputs?: {
    vcfString?: string;
  };
  toggleExpanded: () => void;
  onReset: () => void;
}) => {
  const [oversizedFileName, setOversizedFileName] = useState<string | null>(
    null
  );
  // input check (remove this state + its uses to disable)
  const [inputError, setInputError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const onTextareaContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputError(null); // input check: clear error while editing
    setInputString(event.currentTarget.value);
  };

  const onFileDrop = (file: File) => {
    if (isWithinUploadLimit(file, maxUploadBytes)) {
      setInputFile(file);
    } else {
      const fileName = file.name;
      setOversizedFileName(fileName);
    }
  };

  const onCommitInput = () => {
    // --- input check (remove this block to disable) ---
    if (inputString) {
      const error = checkVepInput(inputString);
      if (error) {
        setInputError(error);
        return;
      }
    }
    setInputError(null);
    // --- end input check ---
    dispatch(updateInputCommittedFlag(true));
    toggleExpanded();
  };

  const onClear = () => {
    setOversizedFileName(null);
    setInputError(null); // input check: clear error on clear
    onReset();
  };

  const hasTextInput = !!inputString;
  const hasFileInput = !!inputFileName;
  const hasOversizedFile = !!oversizedFileName;
  const shouldDisableTextInput = hasFileInput || hasOversizedFile;
  const shouldDisableFileInput = hasTextInput;
  const canCommitInput = hasTextInput || hasFileInput;
  const canClearInput = hasTextInput || hasFileInput || hasOversizedFile;
  const attachedFileName = inputFileName || oversizedFileName;

  return (
    <div className={styles.expandedContentGrid}>
      <div className={styles.gridColumnLeft}>
        {exampleInputs && (
          <div className={styles.exampleInputsContainer}>
            <span className={styles.labelThin}>Example data</span>
            {exampleInputs.vcfString && (
              <ExampleVariantInput
                input={exampleInputs.vcfString}
                onClick={setInputString}
              >
                VCF
              </ExampleVariantInput>
            )}
          </div>
        )}
      </div>
      <div className={styles.gridColumnMiddle}>
        <Textarea
          className={styles.textarea}
          value={inputString ?? ''}
          onChange={onTextareaContentChange}
          placeholder="Paste data"
          disabled={shouldDisableTextInput}
        />
        {/* input check: error message (remove to disable) */}
        {inputError && <p className={styles.inputError}>{inputError}</p>}
      </div>
      <div className={styles.gridColumnRight}>
        <div className={styles.inputControlButtons}>
          <PrimaryButton disabled={!canCommitInput} onClick={onCommitInput}>
            Add
          </PrimaryButton>
          <TextButton
            className={!canClearInput ? styles.invisible : undefined}
            onClick={onClear}
          >
            Clear
          </TextButton>
        </div>
        <MaxUploadSize
          maxUploadBytes={maxUploadBytes}
          isError={!!oversizedFileName}
        />
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
            {!attachedFileName ? (
              <FileDropZone
                className={styles.fileDropZone}
                onUpload={onFileDrop}
              >
                <FileDropZoneLabel />
              </FileDropZone>
            ) : (
              <FileDropZoneOutline className={styles.fileDropZoneOutline}>
                {attachedFileName}
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

export const MaxUploadSize = (props: {
  maxUploadBytes?: number;
  isError: boolean;
}) => {
  if (props.maxUploadBytes === undefined) {
    return null;
  }
  const componentClasses = classNames(styles.maxUploadSize, {
    [styles.maxUploadSizeError]: props.isError
  });

  return (
    <div className={componentClasses}>
      <span>Max upload size</span>
      <span>
        <span className={styles.maxUploadSizeNumber}>
          {formatMegabytes(props.maxUploadBytes)}{' '}
        </span>
        MB
      </span>
    </div>
  );
};

const ExampleVariantInput = (props: {
  input: string;
  onClick: (input: string) => void;
  children: ReactNode;
}) => {
  const onClick = () => {
    props.onClick(props.input);
  };

  return <TextButton onClick={onClick}>{props.children}</TextButton>;
};

// The backend states its upload limit in bytes and counts a megabyte as a
// million of them. Until the limit arrives, the backend's own check is the
// only one.
export const isWithinUploadLimit = (file: File, maxUploadBytes?: number) =>
  maxUploadBytes === undefined || file.size <= maxUploadBytes;

export const formatMegabytes = (bytes: number) =>
  String(Math.round(bytes / 10 ** 5) / 10);

export default VepFormVariantsSection;
