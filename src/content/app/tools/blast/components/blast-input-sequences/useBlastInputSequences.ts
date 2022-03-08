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

import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  setSequences,
  setSequenceType,
  updateEmptyInputDisplay,
  setHasUncommittedSequence
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import {
  getSequences,
  getSelectedSequenceType,
  getSequenceSelectionMode,
  getUncommittedSequencePresence
} from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import { guessSequenceType } from 'src/content/app/tools/blast/utils/sequenceTypeGuesser';

import untypedBlastSettingsConfig from 'src/content/app/tools/blast/components/blast-settings/blastSettingsConfig.json';

import type {
  SequenceType,
  BlastSettingsConfig
} from 'src/content/app/tools/blast/types/blastSettings';
import type { ParsedInputSequence } from 'src/content/app/tools/blast/types/parsedInputSequence';

const blastSettingsConfig = untypedBlastSettingsConfig as BlastSettingsConfig;

const useBlastInputSequences = () => {
  const sequences = useSelector(getSequences);
  const sequenceType = useSelector(getSelectedSequenceType);
  const sequenceSelectionMode = useSelector(getSequenceSelectionMode);
  const hasUncommittedSequence = useSelector(getUncommittedSequencePresence);
  const dispatch = useDispatch();

  const ref = useRef({
    sequenceType,
    sequenceSelectionMode
  });

  // to avoid stale closures persisting in functions returned from the hook
  useEffect(() => {
    ref.current = { sequenceType, sequenceSelectionMode };
  });

  const updateSequences = (newSequences: ParsedInputSequence[]) => {
    dispatch(setSequences({ sequences: newSequences }));
    if (newSequences.length > sequences.length) {
      dispatch(updateEmptyInputDisplay(false));
    } else if (!newSequences.length) {
      dispatch(updateEmptyInputDisplay(true));
    }
    updateSequenceTypeAutomatically(newSequences);
    setUncommittedSequencePresence(false);
  };

  const updateSequenceTypeAutomatically = (
    sequences: ParsedInputSequence[]
  ) => {
    if (sequences.length && ref.current.sequenceSelectionMode === 'manual') {
      return;
    }

    const guessedSequenceType = sequences.length
      ? guessSequenceType(sequences[0].value)
      : 'dna';

    if (guessedSequenceType !== ref.current.sequenceType) {
      dispatch(
        setSequenceType({
          sequenceType: guessedSequenceType,
          isAutomatic: true,
          config: blastSettingsConfig
        })
      );
    }
  };

  const updateSequenceType = (sequenceType: SequenceType) => {
    dispatch(
      setSequenceType({
        sequenceType,
        config: blastSettingsConfig
      })
    );
  };

  const clearAllSequences = () => {
    updateSequences([]);
  };

  const appendEmptyInputBox = (shouldAppend: boolean) => {
    dispatch(updateEmptyInputDisplay(shouldAppend));
  };

  const setUncommittedSequencePresence = (isPresent: boolean) => {
    if (isPresent !== hasUncommittedSequence) {
      dispatch(setHasUncommittedSequence(isPresent));
    }
  };

  return {
    sequences,
    sequenceType,
    updateSequences,
    clearAllSequences,
    updateSequenceType,
    appendEmptyInputBox,
    setUncommittedSequencePresence
  };
};

export default useBlastInputSequences;
