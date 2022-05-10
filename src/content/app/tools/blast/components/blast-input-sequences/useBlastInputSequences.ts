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

import { useSelector, useDispatch } from 'react-redux';

import {
  setSequences,
  updateEmptyInputDisplay,
  setHasUncommittedSequence
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import {
  getSequences,
  getSelectedSequenceType,
  getUncommittedSequencePresence
} from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import type { ParsedInputSequence } from 'src/content/app/tools/blast/types/parsedInputSequence';
import useBlastSettings from '../blast-settings/useBlastSettings';

const useBlastInputSequences = () => {
  const sequences = useSelector(getSequences);
  const sequenceType = useSelector(getSelectedSequenceType);
  const hasUncommittedSequence = useSelector(getUncommittedSequencePresence);

  const { updateSequenceTypeAutomatically } = useBlastSettings();

  const dispatch = useDispatch();

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
    appendEmptyInputBox,
    setUncommittedSequencePresence
  };
};

export default useBlastInputSequences;
