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

import { useState, useEffect, type FormEvent, type ReactNode } from 'react';
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
import { useVepFormExampleInputQuery } from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';

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

  useEffect(() => {
    // if the input form is reset (and thus the selected species is deleted)
    // when this section is expanded,
    // collapse the section
    setIsExpanded(false);
  }, [selectedSpecies]);

  // TODO: create a useEffect for component unmount, which will update stored VEP form

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
            canExpand={canExpand}
            inputText={inputText}
            inputFileName={inputFileName}
            toggleExpanded={toggleExpanded}
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
          genomeId={selectedSpecies?.genome_id ?? ''}
          inputString={inputText}
          setInputString={onInputTextUpdate}
          inputFileName={inputFileName}
          setInputFile={onInputFileUpdate}
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
  isExpanded,
  canExpand,
  toggleExpanded
}: {
  inputText: string | null;
  inputFileName: string | null;
  isExpanded: boolean;
  canExpand: boolean;
  toggleExpanded: () => void;
}) => {
  if (isExpanded || (!inputText && !inputFileName)) {
    return (
      <TextButton disabled={!canExpand} onClick={toggleExpanded}>
        Add variants
      </TextButton>
    );
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
  genomeId,
  inputString,
  inputFileName,
  setInputString,
  setInputFile,
  toggleExpanded,
  onReset
}: {
  genomeId: string;
  inputString: string | null;
  setInputString: (val: string) => void;
  inputFileName: string | null;
  setInputFile: (file: File) => void;
  toggleExpanded: () => void;
  onReset: () => void;
}) => {
  const [oversizedFileName, setOversizedFileName] = useState<string | null>(
    null
  );
  const { currentData: exampleInputs } = useVepFormExampleInputQuery(
    { genomeId },
    {
      skip: !genomeId
    }
  );
  const dispatch = useAppDispatch();

  const onTextareaContentChange = (event: FormEvent<HTMLTextAreaElement>) => {
    setInputString(event.currentTarget.value);
  };

  const onFileDrop = (file: File) => {
    if (isBelowMaxFileSize(file)) {
      setInputFile(file);
    } else {
      const fileName = file.name;
      setOversizedFileName(fileName);
    }
  };

  const onCommitInput = () => {
    dispatch(updateInputCommittedFlag(true));
    toggleExpanded();
  };

  const onClear = () => {
    setOversizedFileName(null);
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
          <>
            <span className={styles.labelThin}>Example data</span>
            {exampleInputs.vcfString && (
              <ExampleVariantInput
                input={exampleInputs.vcfString}
                onClick={setInputString}
              >
                VCF
              </ExampleVariantInput>
            )}
          </>
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
        <MaxUploadSize isError={!!oversizedFileName} />
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

const MaxUploadSize = (props: { isError: boolean }) => {
  const componentClasses = classNames(styles.maxUploadSize, {
    [styles.maxUploadSizeError]: props.isError
  });

  return (
    <div className={componentClasses}>
      <span>Max upload size</span>
      <span>
        <span className={styles.maxUploadSizeNumber}>250 </span>
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

const isBelowMaxFileSize = (file: File) => {
  const fileSize = file.size; // number in bytes
  const megabyte = 10 ** 6; // it is unclear whether to use the SI conventions (a megabyte is a million bytes), or earlier conventions (a megabyte is 2 ** 20 bytes)
  const maxFileSize = 250 * megabyte;

  return fileSize < maxFileSize;
};

export default VepFormVariantsSection;
