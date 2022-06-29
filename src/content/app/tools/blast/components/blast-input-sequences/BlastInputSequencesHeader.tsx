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

import React, { useContext } from 'react';
import classNames from 'classnames';
import { useAppSelector, useAppDispatch } from 'src/store';

import {
  getEmptyInputVisibility,
  getUncommittedSequencePresence
} from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import { updateEmptyInputDisplay } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import BlastFormContext from 'src/content/app/tools/blast/views/blast-form/BlastFormContext';

import useBlastForm from 'src/content/app/tools/blast/hooks/useBlastForm';

import PlusButton from 'src/shared/components/plus-button/PlusButton';
import RadioGroup from 'src/shared/components/radio-group/RadioGroup';
import AlertButton from 'src/shared/components/alert-button/AlertButton';

import { MAX_BLAST_SEQUENCE_COUNT } from 'src/content/app/tools/blast/utils/blastFormValidator';

import type { SequenceType } from 'src/content/app/tools/blast/types/blastSettings';

import styles from './BlastInputSequences.scss';
import sequenceBoxStyles from './BlastInputSequence.scss';

export type Props = {
  compact: boolean;
};

const errorTooltipDescription =
  'Please check that all your sequences are nucleotide or protein, and that they do not contain any invalid characters';

const BlastInputSequencesHeader = (props: Props) => {
  const { compact } = props;
  const { sequences, sequenceType, updateSequenceType, clearAllSequences } =
    useBlastForm();

  const isEmptyInputAppended = useAppSelector(getEmptyInputVisibility);
  const isUserTypingInEmptyInput = useAppSelector(
    getUncommittedSequencePresence
  );

  const dispatch = useAppDispatch();

  const blastFormContext = useContext(BlastFormContext);
  const shouldShowAlert =
    blastFormContext && blastFormContext.sequenceValidityFlags.includes(false);

  const appendEmptyInput = () => {
    dispatch(updateEmptyInputDisplay(true));

    // give React time to add the input box
    setTimeout(() => scrollToLastInputBox(), 0);
  };

  const onSequenceTypeChange = (sequenceType: SequenceType) => {
    updateSequenceType({ sequenceType });
  };

  const scrollToLastInputBox = () => {
    const lastInputBox = document.querySelector(
      `.${sequenceBoxStyles.inputSequenceBox}:last-child`
    );
    lastInputBox?.scrollIntoView({ block: 'end', behavior: 'smooth' }); // Safari doesn't properly support this (see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView); but other options scroll just as jerkily on Safari
  };

  const clearAllClick = () => {
    clearAllSequences();
    blastFormContext && blastFormContext.clearSequenceValidityFlags();
  };

  const shouldEnableAddButton = isEmptyInputAppended
    ? isUserTypingInEmptyInput &&
      sequences.length < MAX_BLAST_SEQUENCE_COUNT - 1
    : sequences.length < MAX_BLAST_SEQUENCE_COUNT;

  const sequencesCount = isUserTypingInEmptyInput
    ? sequences.length + 1
    : sequences.length;

  const sequenceCounterClass = classNames(styles.sequenceCounter, {
    [styles.sequenceCounterError]: sequences.length > MAX_BLAST_SEQUENCE_COUNT
  });

  const headerClass = classNames(styles.header, {
    [styles.smallScreenHeader]: compact
  });

  return (
    <div className={headerClass}>
      <div className={styles.headerGroup}>
        <span className={styles.headerTitle}>Sequences</span>
        <span className={sequenceCounterClass}>{sequencesCount}</span>
        <span className={styles.maxSequences}>
          of {MAX_BLAST_SEQUENCE_COUNT}
        </span>
        {shouldShowAlert && (
          <AlertButton
            className={styles.alertButton}
            tooltipContent={errorTooltipDescription}
          />
        )}
      </div>
      <SequenceSwitcher
        sequenceType={sequenceType}
        onChange={onSequenceTypeChange}
      />
      <div className={styles.headerGroup}>
        <span className={styles.clearAll} onClick={clearAllClick}>
          Clear all
        </span>
        <AddAnotherSequence
          onAdd={appendEmptyInput}
          disabled={!shouldEnableAddButton}
        />
      </div>
    </div>
  );
};

type AddAnotherSequenceProps = {
  disabled?: boolean;
  onAdd: () => void;
};

const AddAnotherSequence = (props: AddAnotherSequenceProps) => {
  return (
    <div className={styles.addSequence}>
      <span className={styles.addSequenceLabel}>Add another sequence</span>
      <PlusButton onClick={props.onAdd} disabled={props.disabled} />
    </div>
  );
};

const SequenceSwitcher = (props: {
  sequenceType: string;
  onChange: (sequenceType: SequenceType) => void;
}) => {
  const options: { label: string; value: SequenceType }[] = [
    {
      label: 'Nucleotide',
      value: 'dna'
    },
    {
      label: 'Protein',
      value: 'protein'
    }
  ];
  return (
    <RadioGroup
      options={options}
      direction="row"
      selectedOption={props.sequenceType}
      onChange={(val) => props.onChange(val as SequenceType)}
    />
  );
};

export default BlastInputSequencesHeader;
