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

import React, { FormEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ShowHide from 'src/shared/components/show-hide/ShowHide';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';
import ShadedInput from 'src/shared/components/input/ShadedInput';
import BlastJobSubmit from 'src/content/app/tools/blast/components/blast-job-submit/BlastJobSubmit';

import {
  getSelectedSequenceType,
  getSelectedBlastProgram,
  getSelectedSearchSensitivity,
  getBlastSearchParameters,
  getBlastJobName
} from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';
import {
  setBlastDatabase,
  setBlastProgram,
  changeSensitivityPresets,
  setBlastParameter,
  setBlastJobName
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import type {
  BlastProgram,
  BlastSelectSetting,
  BlastBooleanSetting,
  BlastParameterName,
  BlastSettingsConfig
} from 'src/content/app/tools/blast/types/blastSettings';

import styles from './BlastSettings.scss';

const getPresetsList = (config: BlastSettingsConfig) => {
  const { presets } = config;
  const { label, options } = presets;
  return { label, options };
};

const getAvailableBlastPrograms = (
  sequenceType: string,
  databaseSequenceType: string,
  config: BlastSettingsConfig
) => {
  const availablePrograms = config.programs_configurator.find(
    (option) =>
      option.sequence_type === sequenceType &&
      option.database_type === databaseSequenceType
  )?.programs as string[];
  const blastProgramSetting = {
    ...config.parameters.program,
    options: (config.parameters.program as BlastSelectSetting).options.filter(
      ({ value }) => availablePrograms.includes(value)
    )
  };
  return blastProgramSetting;
};

type Props = {
  config: BlastSettingsConfig;
};

const BlastSettings = ({ config }: Props) => {
  const [parametersExpanded, setParametersExpanded] = useState(false);
  const sequenceType = useSelector(getSelectedSequenceType);
  const blastProgram = useSelector(getSelectedBlastProgram);
  const searchSensitivity = useSelector(getSelectedSearchSensitivity);
  const blastParameters = useSelector(getBlastSearchParameters);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!blastParameters.database) {
      const defaultDatabase = config.defaults.database;
      onDatabaseChange(defaultDatabase);
    }
  }, []);

  const onDatabaseChange = (database: string) => {
    dispatch(
      setBlastDatabase({
        database,
        config
      })
    );
  };

  const onBlastProgramChange = (program: string) => {
    dispatch(
      setBlastProgram({
        program: program as BlastProgram,
        config
      })
    );
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

  const onParametersToggle = () => {
    setParametersExpanded(!parametersExpanded);
  };

  if (Object.keys(blastParameters).length === 0) {
    return null;
  }

  const database = blastParameters.database || config.defaults.database;
  const databaseSequenceType = config.database_sequence_types[database];

  config.database_sequence_types[database];
  const availableBlastPrograms = getAvailableBlastPrograms(
    sequenceType,
    databaseSequenceType,
    config
  );

  return (
    <>
      <div className={styles.topLevel}>
        Settings
        <div className={styles.mainSettings}>
          {buildSelect({
            ...(config.parameters['database'] as BlastSelectSetting),
            selectedOption: blastParameters.database as string,
            onChange: onDatabaseChange
          })}
          {buildSelect({
            ...(availableBlastPrograms as BlastSelectSetting),
            selectedOption: blastProgram,
            onChange: onBlastProgramChange
          })}
          {buildSelect({
            ...(getPresetsList(config) as BlastSelectSetting),
            selectedOption: searchSensitivity,
            onChange: onSearchSensitivityChange
          })}
        </div>
        <div>
          <ShowHide
            label="Parameters"
            isExpanded={parametersExpanded}
            onClick={onParametersToggle}
          />
        </div>
        <div className={styles.blastJobBlock}>
          <BlastJobName />
          <BlastJobSubmit />
        </div>
      </div>
      {parametersExpanded && (
        <div className={styles.bottomLevel}>
          {buildSelect({
            ...(config.parameters['alignments'] as BlastSelectSetting),
            selectedOption: blastParameters.alignments as string,
            onChange: (value: string) =>
              onBlastParameterChange('alignments', value)
          })}
          {buildSelect({
            ...(config.parameters['scores'] as BlastSelectSetting),
            selectedOption: blastParameters.scores as string,
            onChange: (value: string) => onBlastParameterChange('scores', value)
          })}
          {buildSelect({
            ...(config.parameters['hsps'] as BlastSelectSetting),
            selectedOption: blastParameters.scores as string,
            onChange: (value: string) => onBlastParameterChange('hsps', value)
          })}
          {buildSelect({
            ...(config.parameters['dropoff'] as BlastSelectSetting),
            selectedOption: blastParameters.scores as string,
            onChange: (value: string) =>
              onBlastParameterChange('dropoff', value)
          })}
          {buildCheckbox({
            ...(config.parameters['gapalign'] as BlastBooleanSetting),
            selectedOption: blastParameters.gapalign as string,
            onChange: (value: string) =>
              onBlastParameterChange('gapalign', value)
          })}
          {buildCheckbox({
            ...(config.parameters['filter'] as BlastBooleanSetting),
            selectedOption: blastParameters.filter as string,
            onChange: (value: string) => onBlastParameterChange('filter', value)
          })}
          {buildSelect({
            ...(config.parameters['compstats'] as BlastSelectSetting),
            selectedOption: blastParameters.compstats as string,
            onChange: (value: string) =>
              onBlastParameterChange('compstats', value)
          })}
          {buildSelect({
            ...(config.parameters['exp'] as BlastSelectSetting),
            selectedOption: blastParameters.exp as string,
            onChange: (value: string) => onBlastParameterChange('exp', value)
          })}
          {databaseSequenceType === 'dna' &&
            buildSelect({
              ...(config.parameters['match_scores'] as BlastSelectSetting),
              selectedOption: blastParameters.match_scores as string,
              onChange: (value: string) =>
                onBlastParameterChange('match_scores', value)
            })}
          {buildSelect({
            ...(config.parameters['wordsize'] as BlastSelectSetting),
            selectedOption: blastParameters.wordsize as string,
            onChange: (value: string) =>
              onBlastParameterChange('wordsize', value)
          })}
          {buildSelect({
            ...(config.parameters['gapopen'] as BlastSelectSetting),
            selectedOption: blastParameters.gapopen as string,
            onChange: (value: string) =>
              onBlastParameterChange('gapopen', value)
          })}
          {buildSelect({
            ...(config.parameters['gapext'] as BlastSelectSetting),
            selectedOption: blastParameters.gapext as string,
            onChange: (value: string) => onBlastParameterChange('gapext', value)
          })}
          {databaseSequenceType === 'protein' &&
            buildSelect({
              ...(config.parameters['matrix'] as BlastSelectSetting),
              selectedOption: blastParameters.matrix as string,
              onChange: (value: string) =>
                onBlastParameterChange('matrix', value)
            })}
        </div>
      )}
    </>
  );
};

const BlastJobName = () => {
  const jobName = useSelector(getBlastJobName);
  const dispatch = useDispatch();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.currentTarget.value;
    dispatch(setBlastJobName(name));
  };

  return (
    <div className={styles.blastJobName}>
      <span>Name the job</span>
      <ShadedInput value={jobName} onChange={onChange} placeholder="optional" />
    </div>
  );
};

// to be replaced with a simple select component
const buildSelect = (setting: {
  options: { label: string; value: string }[];
  label: string;
  selectedOption: string;
  onChange: (value: string) => void;
}) => {
  const onChange = (e: FormEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    setting.onChange(value);
  };

  return (
    <div className={styles.select}>
      <label>
        <span>{setting.label}</span>
        <SimpleSelect
          defaultValue={setting.selectedOption}
          onInput={onChange}
          options={setting.options}
        />
      </label>
    </div>
  );
};

const buildCheckbox = (params: {
  label: string;
  options: {
    true: string;
    false: string;
  };
  selectedOption: string;
  onChange: (value: string) => void;
}) => {
  const { label, options, selectedOption, onChange } = params;
  const isSelected = options.true === selectedOption;

  const onCheckboxChange = (isChecked: boolean) => {
    onChange(options[`${isChecked}`]);
  };

  return (
    <Checkbox label={label} checked={isSelected} onChange={onCheckboxChange} />
  );
};

export default BlastSettings;
