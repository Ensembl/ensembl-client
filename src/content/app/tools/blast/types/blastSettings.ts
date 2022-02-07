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

const blastParameterNames = [
  'database',
  'program',
  'alignments',
  'scores',
  'hsps',
  'dropoff',
  'gapalign',
  'gapopen',
  'gapext',
  'filter',
  'compstats',
  'exp',
  'match_scores',
  'wordsize',
  'matrix'
] as const;

export type BlastParameterName = typeof blastParameterNames[number];
export type SequenceType = 'dna' | 'protein';
export type BlastProgram =
  | 'blastn'
  | 'tblastx'
  | 'tblastn'
  | 'blastp'
  | 'blastx';

type Option = {
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

type Preset = Record<BlastParameterName, string>;

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
  database_type: SequenceType;
  programs: BlastProgram[];
};

type Defaults = {
  database: string;
};

export type BlastSettingsConfig = {
  parameters: Record<BlastParameterName, BlastSetting>;
  programs_configurator: ProgramConfiguration[];
  database_sequence_types: Record<string, SequenceType>;
  defaults: Defaults;
  presets: Presets;
};
