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

const blastSettingNames = [
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

export type BlastSettingName = typeof blastSettingNames[number];

// type BlastSettingName =
//   | 'database'
//   | 'program'
//   | 'alignments'
//   | 'scores'
//   | 'hsps'
//   | 'dropoff'
//   | 'gapalign'
//   | 'filter'
//   | 'compstats'

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

type Preset = Record<BlastSettingName, string>;

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

export type BlastSettingsConfig = {
  parameters: Record<BlastSettingName, BlastSetting>;
  presets: Presets;
};
