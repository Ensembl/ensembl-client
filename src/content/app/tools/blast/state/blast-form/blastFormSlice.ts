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

import { guessSequenceType } from 'src/content/app/tools/blast/utils/sequenceTypeGuesser';

import type { ParsedInputSequence } from 'src/content/app/tools/blast/types/blastSequence';
import type {
  BlastParameterName,
  BlastSettingsConfig,
  BlastProgram,
  SequenceType
} from 'src/content/app/tools/blast/types/blastSettings';

type BlastFormSettings = {
  submissionName: string;
  sequenceType: SequenceType;
  sequenceSelectionMode: 'automatic' | 'manual';
  databaseSelectionMode: 'automatic' | 'manual';
  program: BlastProgram;
  preset: string;
  parameters: Partial<Record<BlastParameterName, string>>;
};

export type Species = {
  genome_id: string;
  common_name: string | null;
  scientific_name: string;
  assembly_name: string;
  genome_tag: string | null;
};

export type BlastFormState = {
  step: 'sequences' | 'species'; // will only be relevant on smaller screens
  sequences: ParsedInputSequence[];
  shouldAppendEmptyInput: boolean;
  hasUncommittedSequence: boolean;
  selectedSpecies: Species[];
  settings: BlastFormSettings;
};

export const initialBlastFormSettings: BlastFormSettings = {
  submissionName: '',
  sequenceType: 'dna',
  sequenceSelectionMode: 'automatic',
  databaseSelectionMode: 'automatic',
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

/**
 * To be run for changes of sequences, sequence type, or database
 */
const autoUpdateSettings = (
  state: BlastFormState,
  config: BlastSettingsConfig
) => {
  if (
    state.sequences.length &&
    state.settings.sequenceSelectionMode === 'automatic'
  ) {
    const firstSequence = state.sequences[0].value;
    const sequenceType = guessSequenceType(firstSequence);
    state.settings.sequenceType = sequenceType;
  }

  if (state.settings.databaseSelectionMode === 'automatic') {
    updateDatabaseFromSequenceType(state, config);
  }

  // Update computed properties
  const sequenceType = state.settings.sequenceType;
  const database = state.settings.parameters.database as string;
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
};

const resetSettings = (state: BlastFormState, config: BlastSettingsConfig) => {
  state.settings = cloneDeep(initialBlastFormSettings);
  state.settings.parameters.database = config.defaults.database;
};

const updateDatabaseFromSequenceType = (
  state: BlastFormState,
  config: BlastSettingsConfig
) => {
  const currentDatabase = state.settings.parameters.database;
  const currentSequenceType = state.settings.sequenceType;
  const { database_sequence_types } = config;
  if (
    !currentDatabase ||
    database_sequence_types[currentDatabase] !== currentSequenceType
  ) {
    // get first database with the matching sequence type
    const match = Object.entries(config.database_sequence_types).find(
      ([, dbSequenceType]) => dbSequenceType === currentSequenceType
    ) as [string, SequenceType];
    const [databaseName] = match;
    state.settings.parameters.database = databaseName;
  }
};

const updateEmptyInputVisibility = (
  state: BlastFormState,
  sequences: ParsedInputSequence[]
) => {
  if (sequences.length > state.sequences.length) {
    state.shouldAppendEmptyInput = false;
  } else if (!sequences.length) {
    state.shouldAppendEmptyInput = true;
  }
};

const updateGapPenalties = (params: {
  state: BlastFormState;
  parameterName: 'match_scores' | 'matrix';
  parameterValue: string;
  config: BlastSettingsConfig;
}) => {
  const { state, parameterName, parameterValue, config } = params;
  const program = state.settings.program;
  const preset = state.settings.preset;

  if (!config.presets.settings[program][preset].gapopen) {
    return;
  }

  if (parameterName in config.gap_penalties.options) {
    let gapopen: string, gapext: string;

    if (config.gap_penalties.defaults?.[parameterName]?.[parameterValue]) {
      [gapopen, gapext] =
        config.gap_penalties.defaults[parameterName][parameterValue];
    } else {
      [gapopen, gapext] =
        config.gap_penalties.options[parameterName][parameterValue][0];
    }

    state.settings.parameters.gapopen = gapopen;
    state.settings.parameters.gapext = gapext;
  }
};

const blastFormSlice = createSlice({
  name: 'blast-form',
  initialState,
  reducers: {
    setSequences(
      state,
      action: PayloadAction<{
        sequences: ParsedInputSequence[];
        config: BlastSettingsConfig;
      }>
    ) {
      const { sequences, config } = action.payload;
      updateEmptyInputVisibility(state, sequences);

      state.sequences = sequences;
      state.hasUncommittedSequence = false;

      if (!sequences.length) {
        resetSettings(state, config);
        autoUpdateSettings(state, config); // to fill in individual blast parameters
      } else if (
        guessSequenceType(sequences[0].value) !== state.settings.sequenceType &&
        state.settings.sequenceSelectionMode === 'automatic'
      ) {
        autoUpdateSettings(state, config);
      }
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
        isAutomatic?: boolean;
        config: BlastSettingsConfig;
      }>
    ) {
      const { sequenceType, config, isAutomatic } = action.payload;

      state.settings.sequenceType = sequenceType;
      if (!isAutomatic) {
        state.settings.sequenceSelectionMode = 'manual';
      }

      autoUpdateSettings(state, config);
    },
    setBlastDatabase(
      state,
      action: PayloadAction<{
        database: string;
        isAutomatic?: boolean;
        config: BlastSettingsConfig;
      }>
    ) {
      const { database, config, isAutomatic } = action.payload;

      state.settings.parameters = { ...state.settings.parameters, database };
      if (!isAutomatic) {
        state.settings.databaseSelectionMode = 'manual';
        // NOTE: disabling the automatic guessing of sequence type in response to a manual choice of the database
        // is a requirement from the UX team. There's a good chance we'll want to undo this in the future
        state.settings.sequenceSelectionMode = 'manual';
      }
      autoUpdateSettings(state, config);
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
        config: BlastSettingsConfig;
      }>
    ) {
      const { parameterName, parameterValue, config } = action.payload;
      state.settings.parameters[parameterName] = parameterValue;

      if (parameterName === 'match_scores' || parameterName === 'matrix') {
        updateGapPenalties({ state, parameterName, parameterValue, config });
      }
    },
    setBlastSubmissionName(state, action: PayloadAction<string>) {
      state.settings.submissionName = action.payload;
    },
    // this action is for populating BLAST form with data from a previous BLAST submission
    fillBlastForm(
      _,
      action: PayloadAction<{
        sequences: ParsedInputSequence[];
        selectedSpecies: Species[];
        settings: Partial<BlastFormSettings>;
      }>
    ) {
      const { sequences, selectedSpecies, settings } = action.payload;
      return cloneDeep({
        ...initialState,
        sequences,
        selectedSpecies,
        shouldAppendEmptyInput: false,
        settings: {
          ...cloneDeep(initialBlastFormSettings),
          ...settings
        }
      });
    },
    // this action is for populating BLAST form via the "BLAST this sequence" button in another app
    setSequenceForGenome(
      state,
      action: PayloadAction<{
        sequence: ParsedInputSequence;
        species: Species;
        sequenceType: SequenceType;
        config: BlastSettingsConfig;
      }>
    ) {
      const { sequence, species, sequenceType, config } = action.payload;
      resetSettings(state, config);
      state.sequences = [sequence];
      state.selectedSpecies = [species];
      state.shouldAppendEmptyInput = false;
      state.settings.sequenceType = sequenceType;
      state.settings.sequenceSelectionMode = 'manual'; // to prevent sequence guessing (abusing the 'manual' keyword here)
      autoUpdateSettings(state, config);
    },
    clearBlastForm() {
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
  setBlastSubmissionName,
  fillBlastForm,
  setSequenceForGenome,
  clearBlastForm
} = blastFormSlice.actions;
export default blastFormSlice.reducer;
