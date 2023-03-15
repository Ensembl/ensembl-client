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

import { useAppSelector, useAppDispatch } from 'src/store';

import { useBlastConfigQuery } from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';

import {
  setSequences as setSequencesAction,
  setSequenceForGenome as setSequenceForGenomeAction,
  setBlastProgram as setBlastProgramAction,
  setSequenceType as setSequenceTypeAction,
  setBlastDatabase as setBlastDatabaseAction,
  updateEmptyInputDisplay as updateEmptyInputDisplayAction,
  changeSensitivityPresets as changeSensitivityPresetsAction,
  setHasUncommittedSequence as setHasUncommittedSequenceAction,
  clearBlastForm as clearBlastFormAction,
  setBlastSubmissionName as setBlastSubmissionNameAction,
  setBlastParameter as setBlastParameterAction,
  type Species
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import {
  getSequences,
  getSelectedSequenceType,
  getUncommittedSequencePresence
} from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import type {
  SequenceType,
  BlastProgram,
  BlastParameterName
} from 'src/content/app/tools/blast/types/blastSettings';
import type { ParsedInputSequence } from 'src/content/app/tools/blast/types/blastSequence';
import type { BlastSettingsConfig } from 'src/content/app/tools/blast/types/blastSettings';

/**
 * The purpose of this hook is to abstract away from React components
 * the responsibility to fetch the blast form config and to pass it
 * to the redux actions that are responsible for modifying blast form slice
 */

const useBlastForm = () => {
  const sequences = useAppSelector(getSequences);
  const sequenceType = useAppSelector(getSelectedSequenceType);
  const hasUncommittedSequence = useAppSelector(getUncommittedSequencePresence);
  const dispatch = useAppDispatch();

  const { data: config } = useBlastConfigQuery();

  const updateSequences = (sequences: ParsedInputSequence[]) => {
    if (!config) {
      return;
    }

    dispatch(setSequencesAction({ sequences, config }));
  };

  const updateSequenceType = ({
    sequenceType,
    isAutomatic
  }: {
    sequenceType: SequenceType;
    isAutomatic?: boolean;
  }) => {
    if (!config) {
      return;
    }

    dispatch(
      setSequenceTypeAction({
        sequenceType,
        isAutomatic,
        config
      })
    );
  };

  const updateBlastDatabase = ({
    database,
    isAutomatic
  }: {
    database: string;
    isAutomatic?: boolean;
  }) => {
    if (!config) {
      return;
    }

    dispatch(
      setBlastDatabaseAction({
        database,
        isAutomatic,
        config
      })
    );
  };

  const clearAllSequences = () => {
    updateSequences([]);
  };

  const appendEmptyInputBox = (shouldAppend: boolean) => {
    dispatch(updateEmptyInputDisplayAction(shouldAppend));
  };

  const setUncommittedSequencePresence = (isPresent: boolean) => {
    if (isPresent !== hasUncommittedSequence) {
      dispatch(setHasUncommittedSequenceAction(isPresent));
    }
  };

  const updateBlastProgram = (program: BlastProgram) => {
    if (!config) {
      return;
    }
    dispatch(
      setBlastProgramAction({
        program,
        config
      })
    );
  };

  const updateSensitivityPresets = (presetName: string) => {
    if (!config) {
      return;
    }
    dispatch(
      changeSensitivityPresetsAction({
        presetName,
        config
      })
    );
  };

  const setSequenceForGenome = ({
    sequence,
    species,
    sequenceType
  }: {
    sequence: ParsedInputSequence;
    species: Species;
    sequenceType: SequenceType;
  }) => {
    if (!config) {
      return;
    }
    dispatch(clearBlastFormAction());
    dispatch(
      setSequenceForGenomeAction({
        sequence,
        species,
        sequenceType,
        config
      })
    );
  };

  const setBlastSubmissionName = (name: string) => {
    dispatch(setBlastSubmissionNameAction(name));
  };

  const setGapPenalties = (gapOpen: string, gapExtend: string) => {
    setBlastParameter({
      parameterName: 'gapopen' as BlastParameterName,
      parameterValue: gapOpen
    });
    setBlastParameter({
      parameterName: 'gapext' as BlastParameterName,
      parameterValue: gapExtend
    });
  };

  const setBlastParameter = (params: {
    parameterName: BlastParameterName;
    parameterValue: string;
  }) => {
    dispatch(
      setBlastParameterAction({
        ...params,
        config: config as BlastSettingsConfig
      })
    );
  };

  return {
    sequences,
    sequenceType,
    setSequenceForGenome,
    updateSequences,
    clearAllSequences,
    updateSequenceType,
    updateBlastDatabase,
    appendEmptyInputBox,
    updateBlastProgram,
    updateSensitivityPresets,
    setUncommittedSequencePresence,
    setBlastSubmissionName,
    setGapPenalties,
    setBlastParameter
  };
};

export default useBlastForm;
