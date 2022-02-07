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
import RadioGroup from 'src/shared/components/radio-group/RadioGroup';

import blastSettingsConfig from './blastSettingsConfig.json';

import {
  getSelectedSequenceType,
  getSelectedBlastProgram,
  getSelectedSearchSensitivity,
  getBlastSearchParameters
} from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';
import {
  setSequenceType,
  setBlastDatabase,
  setBlastProgram,
  changeSensitivityPresets,
  setBlastParameter
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import type {
  SequenceType,
  BlastProgram,
  BlastSelectSetting,
  BlastBooleanSetting,
  BlastParameterName,
  BlastSettingsConfig
} from 'src/content/app/tools/blast/types/blastSettings';

import styles from './BlastSettings.scss';

const getParameterData = (name: BlastParameterName) => {
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

const getDatabaseSequenceType = (database: string) => {
  return blastSettingsConfig.databases.options.find(
    (option) => option.value === database
  )?.sequence_type as string;
};

const getAvailableBlastPrograms = (
  sequenceType: string,
  databaseSequenceType: string
) => {
  const availablePrograms = blastSettingsConfig.programs_configurator.find(
    (option) =>
      option.sequence_type === sequenceType &&
      option.database_type === databaseSequenceType
  )?.programs as string[];
  const blastProgramSetting = {
    ...blastSettingsConfig.parameters.program,
    options: blastSettingsConfig.parameters.program.options.filter(
      ({ value }) => availablePrograms.includes(value)
    )
  };
  return blastProgramSetting;
};

const BlastSettings = () => {
  const [parametersExpanded, setParametersExpanded] = useState(false);
  const sequenceType = useSelector(getSelectedSequenceType);
  const blastProgram = useSelector(getSelectedBlastProgram);
  const searchSensitivity = useSelector(getSelectedSearchSensitivity);
  const blastParameters = useSelector(getBlastSearchParameters);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!blastParameters.database) {
      const defaultDatabase = blastSettingsConfig.defaults.database;
      onDatabaseChange(defaultDatabase);
    }
  }, []);

  const onSequenceTypeChange = (sequenceType: string) => {
    dispatch(
      setSequenceType({
        sequenceType: sequenceType as SequenceType,
        config: blastSettingsConfig as unknown as BlastSettingsConfig
      })
    );
  };

  const onDatabaseChange = (database: string) => {
    dispatch(
      setBlastDatabase({
        database,
        config: blastSettingsConfig as unknown as BlastSettingsConfig
      })
    );
  };

  const onBlastProgramChange = (program: string) => {
    dispatch(
      setBlastProgram({
        program: program as BlastProgram,
        config: blastSettingsConfig as unknown as BlastSettingsConfig
      })
    );
  };

  const onSearchSensitivityChange = (presetName: string) => {
    dispatch(
      changeSensitivityPresets({
        presetName,
        config: blastSettingsConfig as unknown as BlastSettingsConfig
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

  const databaseSequenceType = getDatabaseSequenceType(
    blastParameters.database as string
  );
  const availableBlastPrograms = getAvailableBlastPrograms(
    sequenceType,
    databaseSequenceType
  );

  return (
    <>
      <div className={styles.topLevel}>
        Settings
        <div className={styles.mainSettings}>
          {buildSelect({
            ...(getParameterData('database') as BlastSelectSetting),
            selectedOption: blastParameters.database as string,
            onChange: onDatabaseChange
          })}
          {buildSelect({
            ...(availableBlastPrograms as BlastSelectSetting),
            selectedOption: blastProgram,
            onChange: onBlastProgramChange
          })}
          {buildSelect({
            ...(getPresetsList() as BlastSelectSetting),
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
        <SequenceSwitcher
          sequenceType={sequenceType}
          onChange={onSequenceTypeChange}
        />
      </div>
      {parametersExpanded && (
        <div className={styles.bottomLevel}>
          {buildSelect({
            ...(getParameterData('alignments') as BlastSelectSetting),
            selectedOption: blastParameters.alignments as string,
            onChange: (value: string) =>
              onBlastParameterChange('alignments', value)
          })}
          {buildSelect({
            ...(getParameterData('scores') as BlastSelectSetting),
            selectedOption: blastParameters.scores as string,
            onChange: (value: string) => onBlastParameterChange('scores', value)
          })}
          {buildSelect({
            ...(getParameterData('hsps') as BlastSelectSetting),
            selectedOption: blastParameters.scores as string,
            onChange: (value: string) => onBlastParameterChange('hsps', value)
          })}
          {buildSelect({
            ...(getParameterData('dropoff') as BlastSelectSetting),
            selectedOption: blastParameters.scores as string,
            onChange: (value: string) =>
              onBlastParameterChange('dropoff', value)
          })}
          {buildCheckbox({
            ...(getParameterData('gapalign') as BlastBooleanSetting),
            selectedOption: blastParameters.gapalign as string,
            onChange: (value: string) =>
              onBlastParameterChange('gapalign', value)
          })}
          {buildCheckbox({
            ...(getParameterData('filter') as BlastBooleanSetting),
            selectedOption: blastParameters.filter as string,
            onChange: (value: string) => onBlastParameterChange('filter', value)
          })}
          {buildSelect({
            ...(getParameterData('compstats') as BlastSelectSetting),
            selectedOption: blastParameters.compstats as string,
            onChange: (value: string) =>
              onBlastParameterChange('compstats', value)
          })}
          {buildSelect({
            ...(getParameterData('exp') as BlastSelectSetting),
            selectedOption: blastParameters.exp as string,
            onChange: (value: string) => onBlastParameterChange('exp', value)
          })}
          {databaseSequenceType === 'dna' &&
            buildSelect({
              ...(getParameterData('match_scores') as BlastSelectSetting),
              selectedOption: blastParameters.match_scores as string,
              onChange: (value: string) =>
                onBlastParameterChange('match_scores', value)
            })}
          {buildSelect({
            ...(getParameterData('wordsize') as BlastSelectSetting),
            selectedOption: blastParameters.match_scores as string,
            onChange: (value: string) =>
              onBlastParameterChange('wordsize', value)
          })}
          {buildSelect({
            ...(getParameterData('gapopen') as BlastSelectSetting),
            selectedOption: blastParameters.gapopen as string,
            onChange: (value: string) =>
              onBlastParameterChange('gapopen', value)
          })}
          {buildSelect({
            ...(getParameterData('gapext') as BlastSelectSetting),
            selectedOption: blastParameters.gapopen as string,
            onChange: (value: string) => onBlastParameterChange('gapext', value)
          })}
          {databaseSequenceType === 'protein' &&
            buildSelect({
              ...(getParameterData('matrix') as BlastSelectSetting),
              selectedOption: blastParameters.gapopen as string,
              onChange: (value: string) =>
                onBlastParameterChange('matrix', value)
            })}
        </div>
      )}
    </>
  );
};

const SequenceSwitcher = (props: {
  sequenceType: string;
  onChange: (sequenceType: string) => void;
}) => {
  const options = [
    {
      label: 'Nucleotide',
      value: 'dna'
    },
    {
      label: 'Protein',
      value: 'protein'
    }
  ];
  return (
    <RadioGroup
      options={options}
      selectedOption={props.sequenceType}
      onChange={(val) => props.onChange(val as string)}
    />
  );
};

// to be replaced with a simple select component
const buildSelect = (setting: {
  options: { label: string; value: string }[];
  label: string;
  selectedOption: string;
  onChange: (value: string) => void;
}) => {
  const options = setting.options.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ));

  const onChange = (e: FormEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    setting.onChange(value);
  };

  return (
    <div className={styles.select}>
      <label>
        <span>{setting.label}</span>
        <select value={setting.selectedOption} onInput={onChange}>
          {options}
        </select>
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
  const isChecked = options.true === selectedOption;

  const onCheckboxChange = (isChecked: boolean) => {
    onChange(options[`${isChecked}`]);
  };

  return (
    <Checkbox label={label} checked={isChecked} onChange={onCheckboxChange} />
  );
};

export default BlastSettings;
