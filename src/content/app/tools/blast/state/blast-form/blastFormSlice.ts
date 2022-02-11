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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import cloneDeep from 'lodash/cloneDeep';

import type { ParsedInputSequence } from 'src/content/app/tools/blast/types/parsedInputSequence';
import type {
  BlastParameterName,
  BlastSettingsConfig,
  BlastProgram,
  SequenceType
} from 'src/content/app/tools/blast/types/blastSettings';

type BlastFormSettings = {
  sequenceType: SequenceType;
  sequenceSelectionMode: 'automatic' | 'manual';
  program: BlastProgram;
  preset: string;
  parameters: Partial<Record<BlastParameterName, string>>;
};

export type BlastFormState = {
  step: 'sequences' | 'species'; // will only be relevant on smaller screens
  sequences: ParsedInputSequence[];
  shouldAppendEmptyInput: boolean;
  selectedSpecies: string[];
  settings: BlastFormSettings;
};

const initialBlastFormSettings: BlastFormSettings = {
  sequenceType: 'dna',
  sequenceSelectionMode: 'automatic',
  program: 'blastn',
  preset: 'normal',
  parameters: {}
};

export const initialState: BlastFormState = {
  step: 'sequences',
  sequences: [],
  shouldAppendEmptyInput: true,
  selectedSpecies: [],
  settings: initialBlastFormSettings
};

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

const blastFormSlice = createSlice({
  name: 'blast-form',
  initialState,
  reducers: {
    setSequences(
      state,
      action: PayloadAction<{ sequences: ParsedInputSequence[] }>
    ) {
      const { sequences } = action.payload;
      state.sequences = sequences;
      state.shouldAppendEmptyInput = Boolean(!sequences.length);
    },
    updateSelectedSpecies(
      state,
      action: PayloadAction<{ isChecked: boolean; genomeId: string }>
    ) {
      const { genomeId, isChecked } = action.payload;

      if (isChecked) {
        state.selectedSpecies.push(genomeId);
      } else {
        state.selectedSpecies = state.selectedSpecies.filter(
          (item) => item !== genomeId
        );
      }
    },
    clearSelectedSpecies(state) {
      state.selectedSpecies = [];
    },
    updateEmptyInputDisplay(state, action: PayloadAction<boolean>) {
      state.shouldAppendEmptyInput = action.payload;
    },
    switchToSequencesStep(state) {
      state.step = 'sequences';
    },
    switchToSpeciesStep(state) {
      state.step = 'species';
    },
    setSequenceType(
      state,
      action: PayloadAction<{
        sequenceType: SequenceType;
        isAutomatic?: boolean;
        config: BlastSettingsConfig;
      }>
    ) {
      const { sequenceType, config, isAutomatic } = action.payload;
      const selectedDatabase =
        state.settings.parameters.database ?? config.defaults.database;
      const databaseSequenceType = getDatabaseSequenceType({
        database: selectedDatabase,
        config
      });
      const programName = getProgamName({
        sequenceType,
        databaseSequenceType,
        config
      });
      const presetName = initialBlastFormSettings.preset;
      const parameters = config.presets.settings[programName][presetName];
      state.settings.sequenceType = sequenceType;
      state.settings.sequenceSelectionMode = isAutomatic
        ? 'automatic'
        : 'manual';
      state.settings.program = programName;
      state.settings.preset = presetName;
      state.settings.parameters = { ...parameters, database: selectedDatabase };
    },
    setBlastDatabase(
      state,
      action: PayloadAction<{
        database: string;
        config: BlastSettingsConfig;
      }>
    ) {
      const { database, config } = action.payload;
      const sequenceType = state.settings.sequenceType;
      const databaseSequenceType = getDatabaseSequenceType({
        database,
        config
      });
      const programName = getProgamName({
        sequenceType,
        databaseSequenceType,
        config
      });
      const presetName = initialBlastFormSettings.preset;
      const parameters = config.presets.settings[programName][presetName];
      state.settings.program = programName;
      state.settings.preset = presetName;
      state.settings.parameters = { ...parameters, database };
    },
    setBlastProgram(
      state,
      action: PayloadAction<{
        program: BlastProgram;
        config: BlastSettingsConfig;
      }>
    ) {
      const { program, config } = action.payload;
      const presetName = initialBlastFormSettings.preset;
      const parameters = config.presets.settings[program][presetName];
      state.settings.program = program;
      state.settings.preset = presetName;
      state.settings.parameters = {
        ...parameters,
        database: state.settings.parameters.database
      };
    },
    changeSensitivityPresets(
      state,
      action: PayloadAction<{
        presetName: string;
        config: BlastSettingsConfig;
      }>
    ) {
      const { presetName, config } = action.payload;
      const program = state.settings.program;
      const parameters = config.presets.settings[program][presetName];
      state.settings.preset = presetName;
      state.settings.parameters = {
        ...parameters,
        database: state.settings.parameters.database
      };
    },
    setBlastParameter(
      state,
      action: PayloadAction<{
        parameterName: BlastParameterName;
        parameterValue: string;
      }>
    ) {
      const { parameterName, parameterValue } = action.payload;
      state.settings.parameters[parameterName] = parameterValue;
    },
    clearForm() {
      // TODO: apply default settings to the form
      return cloneDeep(initialState);
    }
  }
});

export const {
  setSequences,
  updateEmptyInputDisplay,
  switchToSpeciesStep,
  switchToSequencesStep,
  updateSelectedSpecies,
  clearSelectedSpecies,
  setSequenceType,
  setBlastDatabase,
  setBlastProgram,
  changeSensitivityPresets,
  setBlastParameter
} = blastFormSlice.actions;
export default blastFormSlice.reducer;
