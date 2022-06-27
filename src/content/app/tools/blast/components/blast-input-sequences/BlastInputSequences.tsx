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
import { useAppSelector } from 'src/store';

import { getEmptyInputVisibility } from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import BlastFormContext from 'src/content/app/tools/blast/views/blast-form/BlastFormContext';

import useBlastForm from 'src/content/app/tools/blast/hooks/useBlastForm';

import { parseBlastInput } from 'src/content/app/tools/blast/utils/blastInputParser';

import BlastInputSequence from './BlastInputSequence';

import styles from './BlastInputSequences.scss';

const BlastInputSequences = () => {
  const {
    sequences,
    sequenceType,
    updateSequences,
    appendEmptyInputBox,
    setUncommittedSequencePresence
  } = useBlastForm();
  const shouldAppendEmptyInput = useAppSelector(getEmptyInputVisibility);
  const sequenceValidityContext = useContext(BlastFormContext);

  const onSequenceAdded = (input: string, index: number | null) => {
    const parsedSequences = parseBlastInput(input);

    if (typeof index === 'number') {
      const newSequences = [...sequences];
      newSequences.splice(index, 1, ...parsedSequences);
      updateSequences(newSequences);
    } else {
      updateSequences([...sequences, ...parsedSequences]);
    }
  };

  const onRemoveSequence = (index: number | null) => {
    if (index === null && sequences.length) {
      // User has called the function from an added empty input box.
      // The box can now be removed
      appendEmptyInputBox(false);
    } else if (typeof index === 'number') {
      const newSequences = [...sequences].filter((_, i) => i !== index);
      updateSequences(newSequences);
      sequenceValidityContext?.removeSequenceValidity(index);
    }
  };

  const onUncommittedSequenceInput = (sequence: string) => {
    setUncommittedSequencePresence(Boolean(sequence.length));
  };

  return (
    <div className={styles.blastInputSequences}>
      <div className={styles.inputBoxesContainer}>
        {sequences.map((sequence, index) => (
          <BlastInputSequence
            key={index}
            index={index}
            sequence={sequence}
            sequenceType={sequenceType}
            title={`Sequence ${index + 1}`}
            onCommitted={onSequenceAdded}
            onRemoveSequence={onRemoveSequence}
          />
        ))}
        {shouldAppendEmptyInput && (
          <BlastInputSequence
            title={`Sequence ${sequences.length + 1}`}
            sequenceType={sequenceType}
            onCommitted={onSequenceAdded}
            onInput={onUncommittedSequenceInput}
            onRemoveSequence={onRemoveSequence}
          />
        )}
      </div>
    </div>
  );
};

export default BlastInputSequences;
