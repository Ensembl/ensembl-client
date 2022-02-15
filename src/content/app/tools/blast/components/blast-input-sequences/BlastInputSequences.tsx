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

import {
  setSequences,
  setSequenceType
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import {
  getSequences,
  getSelectedSequenceType,
  getSequenceSelectionMode,
  getEmptyInputVisibility
} from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import { parseBlastInput } from 'src/content/app/tools/blast/utils/blastInputParser';
import { guessSequenceType } from 'src/content/app/tools/shared/helpers/sequenceTypeGuesser';

import BlastInputSequence from './BlastInputSequence';

import untypedBlastSettingsConfig from 'src/content/app/tools/blast/components/blast-settings/blastSettingsConfig.json';

import type { BlastSettingsConfig } from 'src/content/app/tools/blast/types/blastSettings';
import type { ParsedInputSequence } from 'src/content/app/tools/blast/types/parsedInputSequence';

import styles from './BlastInputSequences.scss';

const blastSettingsConfig = untypedBlastSettingsConfig as BlastSettingsConfig;

const BlastInputSequences = () => {
  const sequences = useSelector(getSequences);
  const sequenceType = useSelector(getSelectedSequenceType);
  const sequenceSelectionMode = useSelector(getSequenceSelectionMode);
  const shouldAppendEmptyInput = useSelector(getEmptyInputVisibility);
  const dispatch = useDispatch();

  const updateSequences = (sequences: ParsedInputSequence[]) => {
    dispatch(setSequences({ sequences }));
    updateSequenceType(sequences);
  };

  const updateSequenceType = (sequences: ParsedInputSequence[]) => {
    if (sequenceSelectionMode === 'manual') {
      return;
    }

    const guessedSequenceType = sequences.length
      ? guessSequenceType(sequences[0].value)
      : 'dna';

    if (guessedSequenceType !== sequenceType) {
      dispatch(
        setSequenceType({
          sequenceType: guessedSequenceType,
          isAutomatic: true,
          config: blastSettingsConfig
        })
      );
    }
  };

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
    if (typeof index === 'number') {
      const newSequences = [...sequences].filter((_, i) => i !== index);
      updateSequences(newSequences);
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
