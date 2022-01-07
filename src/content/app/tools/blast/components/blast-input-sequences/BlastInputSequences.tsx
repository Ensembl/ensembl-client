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

import React, { useReducer } from 'react';

import { parseBlastInput } from 'src/content/app/tools/blast/utils/blastInputParser';

import BlastInputSequence from './BlastInputSequence';
import PlusButton from 'src/shared/components/plus-button/PlusButton';

import type { ParsedInputSequence } from 'src/content/app/tools/blast/types/parsedInputSequence';

import styles from './BlastInputSequences.scss';

// the reducer code below is temporary; it will need to be moved over to Redux

type InputSequencesState = {
  sequences: ParsedInputSequence[];
  shouldAppendEmptyInput: boolean;
};

const initialState: InputSequencesState = {
  sequences: [],
  shouldAppendEmptyInput: true
};

type SetSequencesAction = {
  type: 'set_sequences';
  sequences: ParsedInputSequence[];
};

type DisplayEmptyInputAction = {
  type: 'display_empty_input';
  shouldAppendEmptyInput: boolean;
};

type Action = SetSequencesAction | DisplayEmptyInputAction;

const reducer = (state: InputSequencesState, action: Action) => {
  switch (action.type) {
    case 'set_sequences': {
      const shouldAppendEmptyInput = Boolean(!action.sequences.length);
      return {
        shouldAppendEmptyInput,
        sequences: action.sequences
      };
    }
    case 'display_empty_input':
      return {
        ...state,
        shouldAppendEmptyInput: action.shouldAppendEmptyInput
      };
  }
};

const BlastInputSequences = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { sequences, shouldAppendEmptyInput } = state;

  const onSequenceAdded = (input: string, index: number | null) => {
    const parsedSequences = parseBlastInput(input);

    if (typeof index === 'number') {
      const newSequences = [...sequences];
      newSequences.splice(index, 1, ...parsedSequences);
      dispatch({
        type: 'set_sequences',
        sequences: newSequences
      });
    } else {
      dispatch({
        type: 'set_sequences',
        sequences: [...sequences, ...parsedSequences]
      });
    }
  };

  const appendEmptyInput = () => {
    dispatch({
      type: 'display_empty_input',
      shouldAppendEmptyInput: true
    });
  };

  const onRemoveSequence = (index: number | null) => {
    if (typeof index === 'number') {
      const newSequences = [...sequences].filter((_, i) => i !== index);
      dispatch({
        type: 'set_sequences',
        sequences: newSequences
      });
    }
  };

  const onClearAll = () => {
    dispatch({
      type: 'set_sequences',
      sequences: []
    });
  };

  return (
    <div className={styles.blastInputSequences}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Sequences</span>
        <span className={styles.sequenceCounter}>{sequences.length}</span>
        <span className={styles.maxSequences}>of 30</span>
        <span className={styles.clearAll} onClick={onClearAll}>
          Clear all
        </span>
      </div>
      <div className={styles.inputBoxesContainer}>
        {sequences.map((sequence, index) => (
          <BlastInputSequence
            key={index}
            index={index}
            sequence={sequence}
            title={`Sequence ${index + 1}`}
            onCommitted={onSequenceAdded}
            onRemoveSequence={onRemoveSequence}
          />
        ))}
        {shouldAppendEmptyInput && (
          <BlastInputSequence
            title={`Sequence ${sequences.length + 1}`}
            onCommitted={onSequenceAdded}
            onRemoveSequence={onRemoveSequence}
          />
        )}
      </div>
      {!shouldAppendEmptyInput && (
        <div className={styles.addSequenceWrapper}>
          <AddAnotherSequence onAdd={appendEmptyInput} />
        </div>
      )}
    </div>
  );
};

const AddAnotherSequence = (props: { onAdd: () => void }) => {
  return (
    <div className={styles.addSequence}>
      <span className={styles.addSequenceLabel}>Add another sequence</span>
      <PlusButton onClick={props.onAdd} />
    </div>
  );
};

export default BlastInputSequences;
