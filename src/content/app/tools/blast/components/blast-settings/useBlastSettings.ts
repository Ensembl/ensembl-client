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

import { useContext, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  changeSensitivityPresets,
  updateSettings
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import {
  getSelectedSequenceType,
  getBlastSearchParameters,
  getSelectedBlastProgram,
  getSelectedSearchSensitivity,
  getSequenceSelectionMode,
  getDatabaseSelectionMode,
  getProgramSelectionMode
} from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import type {
  BlastProgram,
  BlastSettingsConfig,
  SequenceType
} from 'src/content/app/tools/blast/types/blastSettings';
import { ParsedInputSequence } from '../../types/parsedInputSequence';
import { guessSequenceType } from '../../utils/sequenceTypeGuesser';
import { BlastConfigContext } from '../../views/blast-form/BlastForm';

const getProgamName = ({
  sequenceType,
  databaseSequenceType,
  config
}: {
  sequenceType: SequenceType;
  databaseSequenceType: SequenceType;
  config: BlastSettingsConfig;
}) => {
  const programs = config.programs_configurator.find(
    ({ sequence_type, database_type }) => {
      return (
        sequence_type === sequenceType && database_type === databaseSequenceType
      );
    }
  )?.programs as BlastProgram[];
  return programs[0];
};

const getDatabaseSequenceType = ({
  database,
  config
}: {
  database: string;
  config: BlastSettingsConfig;
}) => {
  return config.database_sequence_types[database];
};

const useBlastSettings = () => {
  const blastConfigContext = useContext(BlastConfigContext);
  if (!blastConfigContext?.config) {
    throw new Error(
      'useBlastSettings must be used with BlastConfigContext Provider'
    );
  }

  const { config } = blastConfigContext;
  const sequenceType = useSelector(getSelectedSequenceType);
  const blastProgram = useSelector(getSelectedBlastProgram);
  const sequenceSelectionMode = useSelector(getSequenceSelectionMode);
  const databaseSelectionMode = useSelector(getDatabaseSelectionMode);
  const programSelectionMode = useSelector(getProgramSelectionMode);
  const searchSensitivity = useSelector(getSelectedSearchSensitivity);
  const blastParameters = useSelector(getBlastSearchParameters);

  const dispatch = useDispatch();

  const ref = useRef({
    sequenceSelectionMode,
    databaseSelectionMode,
    programSelectionMode,
    sequenceType
  });

  useEffect(() => {
    ref.current = {
      sequenceSelectionMode,
      databaseSelectionMode,
      programSelectionMode,
      sequenceType
    };
  }, [
    sequenceSelectionMode,
    databaseSelectionMode,
    programSelectionMode,
    sequenceType
  ]);

  useEffect(() => {
    if (!blastParameters.database) {
      const defaultDatabase = config.defaults.database;
      onDatabaseChange(defaultDatabase, true);
    }
  }, []);

  const updateSequenceType = (
    newSequenceType: SequenceType,
    isAutomatic = false
  ) => {
    // Update the program and the database
    const newDatabse = newSequenceType === 'protein' ? 'pep' : 'dna';
    const databaseSequenceType = getDatabaseSequenceType({
      database: newDatabse,
      config
    });

    const newProgramName = getProgamName({
      sequenceType: newSequenceType,
      databaseSequenceType,
      config
    });

    dispatch(
      updateSettings({
        settingsFragment: {
          sequenceType: newSequenceType,
          program: newProgramName,
          parameters: {
            database: newDatabse
          },
          sequenceSelectionMode: isAutomatic ? 'automatic' : 'manual',
          programSelectionMode: 'automatic',
          databaseSelectionMode: 'automatic'
        },
        config
      })
    );
  };

  const onDatabaseChange = (database: string, isAutomatic = false) => {
    // Auto update the program
    const databaseSequenceType = getDatabaseSequenceType({
      database: database,
      config
    });

    const newProgramName = getProgamName({
      sequenceType: ref.current.sequenceType,
      databaseSequenceType,
      config
    });

    dispatch(
      updateSettings({
        settingsFragment: {
          program: newProgramName,
          parameters: {
            database
          },
          programSelectionMode: 'automatic',
          databaseSelectionMode: isAutomatic ? 'automatic' : 'manual'
        },
        config
      })
    );
  };

  const onBlastProgramChange = (program: string, isAutomatic = false) => {
    dispatch(
      updateSettings({
        settingsFragment: {
          program: program as BlastProgram,
          programSelectionMode: isAutomatic ? 'automatic' : 'manual'
        },
        config
      })
    );
  };

  const updateSequenceTypeAutomatically = (
    sequences: ParsedInputSequence[]
  ) => {
    if (!sequences.length) {
      updateSequenceType('dna', true);
      return;
    }
    if (
      [
        ref.current.sequenceSelectionMode,
        ref.current.programSelectionMode,
        ref.current.databaseSelectionMode
      ].includes('manual')
    ) {
      return;
    }

    const guessedSequenceType = sequences.length
      ? guessSequenceType(sequences[0].value)
      : 'dna';

    updateSequenceType(guessedSequenceType, true);
  };

  const onSearchSensitivityChange = (presetName: string) => {
    dispatch(
      changeSensitivityPresets({
        presetName,
        config
      })
    );
  };

  const onBlastParameterChange = (
    parameterName: string,
    parameterValue: string
  ) => {
    dispatch(
      updateSettings({
        settingsFragment: {
          parameters: {
            [parameterName]: parameterValue
          }
        },
        config
      })
    );
  };

  return {
    sequenceType,
    blastProgram,
    searchSensitivity,
    blastParameters,
    config,
    onDatabaseChange,
    onBlastProgramChange,
    onSearchSensitivityChange,
    onBlastParameterChange,
    updateSequenceTypeAutomatically,
    updateSequenceType
  };
};

export default useBlastSettings;
