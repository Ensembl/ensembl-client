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

type AutomaticOrManual = 'automatic' | 'manual';

type BlastFormSettings = {
  jobName: string;
  sequenceType: SequenceType;
  sequenceSelectionMode: AutomaticOrManual;
  databaseSelectionMode: AutomaticOrManual;
  programSelectionMode: AutomaticOrManual;
  program: BlastProgram;
  preset: string;
  parameters: Partial<Record<BlastParameterName, string>>;
};

export type Species = {
  genome_id: string;
  common_name: string | null;
  scientific_name: string;
  assembly_name: string;
};

export type BlastFormState = {
  step: 'sequences' | 'species'; // will only be relevant on smaller screens
  sequences: ParsedInputSequence[];
  shouldAppendEmptyInput: boolean;
  hasUncommittedSequence: boolean;
  selectedSpecies: Species[];
  settings: BlastFormSettings;
};

const initialBlastFormSettings: BlastFormSettings = {
  jobName: '',
  sequenceType: 'dna',
  sequenceSelectionMode: 'automatic',
  databaseSelectionMode: 'automatic',
  programSelectionMode: 'automatic',
  program: 'blastn',
  preset: 'normal',
  parameters: {}
};

export const initialState: BlastFormState = {
  step: 'sequences',
  sequences: [],
  shouldAppendEmptyInput: true,
  hasUncommittedSequence: false,
  selectedSpecies: [],
  settings: initialBlastFormSettings
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
    },
    addSelectedSpecies(state, action: PayloadAction<Species>) {
      const species = action.payload;
      state.selectedSpecies.push(species);
    },
    removeSelectedSpecies(state, action: PayloadAction<string>) {
      const genomeId = action.payload;
      state.selectedSpecies = state.selectedSpecies.filter(
        (species) => species.genome_id !== genomeId
      );
    },
    clearSelectedSpecies(state) {
      state.selectedSpecies = [];
    },
    updateEmptyInputDisplay(state, action: PayloadAction<boolean>) {
      state.shouldAppendEmptyInput = action.payload;
    },
    setHasUncommittedSequence(state, action: PayloadAction<boolean>) {
      state.hasUncommittedSequence = action.payload;
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
        isAutomatic: boolean;
      }>
    ) {
      const { sequenceType, isAutomatic } = action.payload;

      state.settings.sequenceType = sequenceType;
      state.settings.sequenceSelectionMode = isAutomatic
        ? 'automatic'
        : 'manual';
    },
    setBlastDatabase(
      state,
      action: PayloadAction<{
        database: string;
        isAutomatic: boolean;
      }>
    ) {
      const { database, isAutomatic } = action.payload;

      state.settings.preset = initialBlastFormSettings.preset;
      state.settings.parameters.database = database;

      state.settings.databaseSelectionMode = isAutomatic
        ? 'automatic'
        : 'manual';
    },
    setBlastProgram(
      state,
      action: PayloadAction<{
        program: BlastProgram;
        config: BlastSettingsConfig;
        isAutomatic: boolean;
      }>
    ) {
      const { program, config, isAutomatic } = action.payload;
      const presetName = initialBlastFormSettings.preset;
      const parameters = config.presets.settings[program][presetName];

      state.settings.programSelectionMode = isAutomatic
        ? 'automatic'
        : 'manual';

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
    setBlastJobName(state, action: PayloadAction<string>) {
      state.settings.jobName = action.payload;
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
  setHasUncommittedSequence,
  switchToSpeciesStep,
  switchToSequencesStep,
  addSelectedSpecies,
  removeSelectedSpecies,
  clearSelectedSpecies,
  setSequenceType,
  setBlastDatabase,
  setBlastProgram,
  changeSensitivityPresets,
  setBlastParameter,
  setBlastJobName
} = blastFormSlice.actions;
export default blastFormSlice.reducer;
