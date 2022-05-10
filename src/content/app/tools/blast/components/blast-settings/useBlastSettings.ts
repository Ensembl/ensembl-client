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

import { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  setBlastDatabase,
  changeSensitivityPresets,
  setBlastParameter,
  setBlastProgram,
  setSequenceType
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
  BlastParameterName,
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

  useEffect(() => {
    if (!blastParameters.database) {
      const defaultDatabase = config.defaults.database;
      onDatabaseChange(defaultDatabase, true);
    }
  }, []);

  const updateSequenceType = (
    sequenceType: SequenceType,
    isAutomatic = false
  ) => {
    dispatch(
      setSequenceType({
        sequenceType,
        isAutomatic
      })
    );

    // Update the program and the database
    const newDatabse = sequenceType === 'protein' ? 'pep' : 'dna';
    const databaseSequenceType = getDatabaseSequenceType({
      database: newDatabse,
      config
    });

    const newProgramName = getProgamName({
      sequenceType,
      databaseSequenceType,
      config
    });

    dispatch(
      setBlastProgram({
        program: newProgramName,
        config,
        isAutomatic: true
      })
    );

    dispatch(
      setBlastDatabase({
        database: newDatabse,
        isAutomatic: true
      })
    );
  };

  const onDatabaseChange = (database: string, isAutomatic = false) => {
    dispatch(
      setBlastDatabase({
        database,
        isAutomatic
      })
    );

    // Auto update the program
    const databaseSequenceType = getDatabaseSequenceType({
      database: database,
      config
    });

    const newProgramName = getProgamName({
      sequenceType,
      databaseSequenceType,
      config
    });

    setBlastProgram({
      program: newProgramName,
      isAutomatic: true,
      config
    });
  };

  const onBlastProgramChange = (program: string) => {
    dispatch(
      setBlastProgram({
        program: program as BlastProgram,
        config,
        isAutomatic: false
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
      sequenceSelectionMode === 'manual' ||
      programSelectionMode === 'manual' ||
      databaseSelectionMode === 'manual'
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
      setBlastParameter({
        parameterName: parameterName as BlastParameterName,
        parameterValue
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
