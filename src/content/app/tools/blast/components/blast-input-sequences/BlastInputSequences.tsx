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

import React, { useState, useEffect } from 'react';

import { parseBlastInput } from 'src/content/app/tools/blast/utils/blastInputParser';

import BlastInputSequence from './BlastInputSequence';
import PlusButton from 'src/shared/components/plus-button/PlusButton';

import type { ParsedInputSequence } from 'src/content/app/tools/blast/types/parsedInputSequence';

import styles from './BlastInputSequences.scss';

export const BlastInputSequences = () => {
  const [sequences, setSequences] = useState<ParsedInputSequence[]>([]);
  const [shouldAppendEmptyInput, setShouldAppendEmptyInput] = useState(false);

  useEffect(() => {
    if (!sequences.length) {
      setShouldAppendEmptyInput(true);
    }
  });

  const onSequenceAdded = (input: string, index: number | null) => {
    const parsedSequences = parseBlastInput(input)
      .filter((result) => Boolean(result.value)) // <-- bad idea!
      .map((result) => ({
        ...result,
        rawInput: input
      })) as ParsedInputSequence[];

    if (typeof index === 'number') {
      const newSequences = [...sequences];
      newSequences.splice(index, 1, ...parsedSequences);
      setSequences(newSequences);
    } else {
      setSequences([...sequences, ...parsedSequences]);
    }

    setShouldAppendEmptyInput(false);
  };

  const appendEmptyInput = () => {
    setShouldAppendEmptyInput(true);
  };

  const onRemoveSequence = (index: number | null) => {
    if (typeof index === 'number') {
      const newSequences = [...sequences].filter((_, i) => i !== index);
      setSequences(newSequences);
    } else if (sequences.length) {
      setShouldAppendEmptyInput(false);
    }
  };

  return (
    <div>
      <div className={styles.inputBoxesContainer}>
        {sequences.map((sequence, index) => (
          <BlastInputSequence
            key={index}
            index={index}
            sequence={sequence}
            onCommitted={onSequenceAdded}
            onRemoveSequence={onRemoveSequence}
          />
        ))}
        {shouldAppendEmptyInput && (
          <BlastInputSequence
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
