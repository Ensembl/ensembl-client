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

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setSequences } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import {
  getSequences,
  getEmptyInputVisibility
} from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import { parseBlastInput } from 'src/content/app/tools/blast/utils/blastInputParser';

import BlastInputSequence from './BlastInputSequence';

import styles from './BlastInputSequences.scss';

const BlastInputSequences = () => {
  const sequences = useSelector(getSequences);
  const shouldAppendEmptyInput = useSelector(getEmptyInputVisibility);
  const dispatch = useDispatch();

  const onSequenceAdded = (input: string, index: number | null) => {
    const parsedSequences = parseBlastInput(input);

    if (typeof index === 'number') {
      const newSequences = [...sequences];
      newSequences.splice(index, 1, ...parsedSequences);
      dispatch(
        setSequences({
          sequences: newSequences
        })
      );
    } else {
      dispatch(
        setSequences({
          sequences: [...sequences, ...parsedSequences]
        })
      );
    }
  };

  const onRemoveSequence = (index: number | null) => {
    if (typeof index === 'number') {
      const newSequences = [...sequences].filter((_, i) => i !== index);
      dispatch(
        setSequences({
          sequences: newSequences
        })
      );
    }
  };

  return (
    <div className={styles.blastInputSequences}>
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
    </div>
  );
};

export default BlastInputSequences;
