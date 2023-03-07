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

export type MandatoryBlastParameterName =
  | 'database'
  | 'program'
  | 'alignments'
  | 'scores'
  | 'hsps'
  | 'dropoff'
  | 'filter'
  | 'compstats'
  | 'exp'
  | 'wordsize';

export type OptionalBlastParameterName =
  | 'gapalign'
  | 'gapopen'
  | 'gapext'
  | 'match_scores' // only for searches against nucleotide databases
  | 'matrix'; // only for searches against protein databases

export type BlastParameterName =
  | MandatoryBlastParameterName
  | OptionalBlastParameterName;
export type SequenceType = 'dna' | 'protein';
export type DatabaseType = 'dna_sm' | 'dna' | 'cdna' | 'pep';
export type BlastProgram =
  | 'blastn'
  | 'tblastx'
  | 'tblastn'
  | 'blastp'
  | 'blastx';

export type Option = {
  label: string;
  value: string;
};

export type BlastSelectSetting = {
  type: 'select';
  label: string;
  description?: string;
  options: Option[];
};

export type BlastBooleanSetting = {
  type: 'boolean';
  label: string;
  description?: string;
  options: {
    true: string;
    false: string;
  };
};

export type BlastSetting = BlastSelectSetting | BlastBooleanSetting;

type Preset = Partial<Record<BlastParameterName, string>>;

export type Presets = {
  label: string;
  defaultPreset: string;
  options: Option[];
  settings: {
    [program: string]: {
      [presetName: string]: Preset;
    };
  };
};

type ProgramConfiguration = {
  sequence_type: SequenceType;
  database_type: DatabaseType;
  programs: BlastProgram[];
};

type ProgramParametersOverride = {
  [blastParameterName: string]: {
    [program: string]: {
      options: Option[];
    };
  };
};

type GapPenalties = {
  label: string;
  description: string;
  options: {
    match_scores: Record<string, [string, string][]>;
    matrix: Record<string, [string, string][]>;
  };
  defaults: {
    match_scores: Record<string, [string, string]>;
    matrix: Record<string, [string, string]>;
  };
};

type Defaults = {
  database: string;
};

export type BlastSettingsConfig = {
  parameters: Record<BlastParameterName, BlastSetting>;
  programs_configurator: ProgramConfiguration[];
  programs_parameters_override: ProgramParametersOverride;
  database_sequence_types: Record<string, SequenceType>;
  defaults: Defaults;
  presets: Presets;
  valid_parameters_for_program: Record<BlastProgram, string[]>;
  valid_sensitivities_for_program: Record<BlastProgram, string[]>;
  gap_penalties: GapPenalties;
};
