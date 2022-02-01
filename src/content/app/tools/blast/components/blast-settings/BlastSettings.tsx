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

import React, { useState } from 'react';

import ShowHide from 'src/shared/components/show-hide/ShowHide';
import Checkbox from 'src/shared/components/checkbox/Checkbox';

import blastSettingsConfig from './blastSettingsConfig.json';

import type {
  BlastSelectSetting,
  BlastBooleanSetting,
  BlastSettingName,
  BlastSettingsConfig
} from 'src/content/app/tools/blast/types/blastSettings';

import styles from './BlastSettings.scss';

const getParameterData = (name: BlastSettingName) => {
  return (blastSettingsConfig as unknown as BlastSettingsConfig).parameters[
    name
  ];
};

const getPresetsList = () => {
  const presets = (blastSettingsConfig as unknown as BlastSettingsConfig)
    .presets;
  const { label, options } = presets;
  return { label, options };
};

const BlastSettings = () => {
  const [parametersExpanded, setParametersExpanded] = useState(false);

  const onParametersToggle = () => {
    setParametersExpanded(!parametersExpanded);
  };

  return (
    <>
      <div className={styles.topLevel}>
        Settings
        <div className={styles.mainSettings}>
          {buildSelect(getParameterData('database') as BlastSelectSetting)}
          {buildSelect(getParameterData('program') as BlastSelectSetting)}
          {buildSelect(getPresetsList())}
        </div>
        <div>
          <ShowHide
            label="Parameters"
            isExpanded={parametersExpanded}
            onClick={onParametersToggle}
          />
        </div>
      </div>
      {parametersExpanded && (
        <div className={styles.bottomLevel}>
          {buildSelect(getParameterData('alignments') as BlastSelectSetting)}
          {buildSelect(getParameterData('scores') as BlastSelectSetting)}
          {buildSelect(getParameterData('hsps') as BlastSelectSetting)}
          {buildSelect(getParameterData('dropoff') as BlastSelectSetting)}
          {buildCheckbox(getParameterData('gapalign') as BlastBooleanSetting)}
          {buildCheckbox(getParameterData('filter') as BlastBooleanSetting)}
          {buildSelect(getParameterData('compstats') as BlastSelectSetting)}
          {buildSelect(getParameterData('exp') as BlastSelectSetting)}
          {buildSelect(getParameterData('match_scores') as BlastSelectSetting)}
          {buildSelect(getParameterData('wordsize') as BlastSelectSetting)}
          {buildSelect(getParameterData('gapopen') as BlastSelectSetting)}
          {buildSelect(getParameterData('gapext') as BlastSelectSetting)}
          {buildSelect(getParameterData('matrix') as BlastSelectSetting)}
          Expanded
        </div>
      )}
    </>
  );
};

// to be replaced with a simple select component
const buildSelect = (setting: {
  options: { label: string; value: string }[];
  label: string;
}) => {
  const options = setting.options.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ));

  return (
    <div className={styles.select}>
      <label>
        <span>{setting.label}</span>
        <select>{options}</select>
      </label>
    </div>
  );
};

const buildCheckbox = (setting: BlastBooleanSetting) => {
  return (
    <Checkbox
      label={setting.label}
      checked={false}
      onChange={() => {} /* eslint-disable-line */}
    />
  );
};

export default BlastSettings;
