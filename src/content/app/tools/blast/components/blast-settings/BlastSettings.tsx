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
import classNames from 'classnames';

import { useAppSelector } from 'src/store';

import useHover from 'src/shared/hooks/useHover';
import useBlastForm from 'src/content/app/tools/blast/hooks/useBlastForm';

import ShowHide from 'src/shared/components/show-hide/ShowHide';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';
import ShadedInput from 'src/shared/components/input/ShadedInput';
import BlastJobSubmit from 'src/content/app/tools/blast/components/blast-job-submit/BlastJobSubmit';
import BlastJobListsNavigation from '../blast-job-lists-navigation/BlastJobListsNavigation';
import Tooltip from 'src/shared/components/tooltip/Tooltip';

import {
  getSelectedSequenceType,
  getSelectedBlastProgram,
  getSelectedSearchSensitivity,
  getBlastSearchParameters,
  getBlastSubmissionName
} from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';

import type {
  BlastProgram,
  BlastSelectSetting,
  BlastBooleanSetting,
  BlastParameterName,
  BlastSettingsConfig,
  Option
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
  const sequenceType = useAppSelector(getSelectedSequenceType);
  const blastProgram = useAppSelector(getSelectedBlastProgram);
  const searchSensitivity = useAppSelector(getSelectedSearchSensitivity);
  const blastParameters = useAppSelector(getBlastSearchParameters);

  const shouldShowMatchMismatch =
    config.valid_parameters_for_program[blastProgram].includes('match_scores');
  const shouldShowMatrix =
    config.valid_parameters_for_program[blastProgram].includes('matrix');
  const shouldShowGapPenalties =
    config.valid_parameters_for_program[blastProgram].includes('gapopen');
  const gapAlignEnabled =
    config.valid_parameters_for_program[blastProgram].includes('gapalign');

  const {
    updateBlastDatabase,
    updateBlastProgram,
    updateSensitivityPresets,
    setBlastParameter
  } = useBlastForm();

  useEffect(() => {
    if (!blastParameters.database) {
      const defaultDatabase = config.defaults.database;
      onDatabaseChange(defaultDatabase, { isAutomatic: true });
    }
  }, []);

  const onDatabaseChange = (
    database: string,
    options: { isAutomatic?: boolean } = {}
  ) => {
    updateBlastDatabase({
      database,
      isAutomatic: options.isAutomatic
    });
  };

  const onBlastProgramChange = (program: string) => {
    updateBlastProgram(program as BlastProgram);
  };

  const onSearchSensitivityChange = (presetName: string) => {
    updateSensitivityPresets(presetName);
  };

  const onGapPenaltiesChange = (newValue: string) => {
    const [gapOpen, gapExtend] = newValue.split(',');
    setBlastParameter({
      parameterName: 'gapopen' as BlastParameterName,
      parameterValue: gapOpen
    });
    setBlastParameter({
      parameterName: 'gapext' as BlastParameterName,
      parameterValue: gapExtend
    });
  };

  const onBlastParameterChange = (
    parameterName: string,
    parameterValue: string
  ) => {
    setBlastParameter({
      parameterName: parameterName as BlastParameterName,
      parameterValue
    });
  };

  const onParametersToggle = () => {
    setParametersExpanded(!parametersExpanded);
  };

  if (Object.keys(blastParameters).length === 0) {
    return null;
  }

  const database = blastParameters.database || config.defaults.database;
  const databaseSequenceType = config.database_sequence_types[database];

  const availableBlastPrograms = getAvailableBlastPrograms(
    sequenceType,
    databaseSequenceType,
    config
  );

  return (
    <>
      <div className={styles.topLevelContainer}>
        <div className={styles.topLevel}>
          <h1 className={styles.title}>Blast</h1>
          <div className={styles.runJob}>Run a job</div>
          <div>
            <BlastSelect
              options={config.parameters.database.options as Option[]}
              label={config.parameters.database.label}
              selectedOption={blastParameters.database as string}
              onChange={onDatabaseChange}
            />
          </div>
          <div>
            <BlastSelect
              options={availableBlastPrograms.options}
              label={availableBlastPrograms.label}
              selectedOption={blastProgram}
              onChange={onBlastProgramChange}
            />
          </div>
          <div>
            <BlastSelect
              options={getPresetsList(config).options}
              label={getPresetsList(config).label}
              selectedOption={searchSensitivity}
              onChange={onSearchSensitivityChange}
            />
          </div>
          <div>
            <ShowHide
              label="Parameters"
              isExpanded={parametersExpanded}
              onClick={onParametersToggle}
            />
          </div>
          <div className={styles.blastJobBlock}>
            <BlastSubmissionName />
            <BlastJobSubmit />
          </div>
        </div>
        <BlastJobListsNavigation />
      </div>
      {parametersExpanded && (
        <div className={styles.bottomLevel}>
          <div className={styles.parametersColumn}>
            <BlastSelect
              options={config.parameters.alignments.options as Option[]}
              label={config.parameters.alignments.label}
              description={config.parameters.alignments.description}
              selectedOption={blastParameters.alignments as string}
              onChange={(value: string) =>
                onBlastParameterChange('alignments', value)
              }
            />

            <BlastSelect
              options={config.parameters.scores.options as Option[]}
              label={config.parameters.scores.label}
              description={config.parameters.scores.description}
              selectedOption={blastParameters.scores as string}
              onChange={(value: string) =>
                onBlastParameterChange('scores', value)
              }
            />
          </div>
          <div className={styles.parametersColumn}>
            <BlastSelect
              options={config.parameters.exp.options as Option[]}
              label={config.parameters.exp.label}
              description={config.parameters.exp.description}
              selectedOption={blastParameters.exp as string}
              onChange={(value: string) => onBlastParameterChange('exp', value)}
            />

            <BlastSelect
              options={config.parameters.compstats.options as Option[]}
              label={config.parameters.compstats.label}
              description={config.parameters.compstats.description}
              selectedOption={blastParameters.compstats as string}
              onChange={(value: string) =>
                onBlastParameterChange('compstats', value)
              }
            />
          </div>
          <div className={styles.parametersColumn}>
            <BlastSelect
              options={config.parameters.hsps.options as Option[]}
              label={config.parameters.hsps.label}
              description={config.parameters.hsps.description}
              selectedOption={blastParameters.hsps as string}
              onChange={(value: string) =>
                onBlastParameterChange('hsps', value)
              }
            />

            <BlastSelect
              options={config.parameters.dropoff.options as Option[]}
              label={config.parameters.dropoff.label}
              description={config.parameters.dropoff.description}
              selectedOption={blastParameters.dropoff as string}
              onChange={(value: string) =>
                onBlastParameterChange('dropoff', value)
              }
            />
          </div>
          <div className={styles.parametersColumn}>
            <BlastSelect
              options={
                config.programs_parameters_override.wordsize[blastProgram]
                  ? config.programs_parameters_override.wordsize[blastProgram]
                      .options
                  : (config.parameters.wordsize.options as Option[])
              }
              label={config.parameters.wordsize.label}
              description={config.parameters.wordsize.description}
              selectedOption={blastParameters.wordsize as string}
              onChange={(value: string) =>
                onBlastParameterChange('wordsize', value)
              }
            />
            {shouldShowMatchMismatch && (
              <BlastSelect
                options={config.parameters.match_scores.options as Option[]}
                label={config.parameters.match_scores.label}
                description={config.parameters.match_scores.description}
                selectedOption={blastParameters.match_scores as string}
                onChange={(value: string) =>
                  onBlastParameterChange('match_scores', value)
                }
              />
            )}
            <div className={styles.matrixSetting}>
              {shouldShowMatrix && (
                <BlastSelect
                  options={config.parameters.matrix.options as Option[]}
                  label={config.parameters.matrix.label}
                  description={config.parameters.matrix.description}
                  selectedOption={blastParameters.matrix as string}
                  onChange={(value: string) =>
                    onBlastParameterChange('matrix', value)
                  }
                />
              )}
            </div>
          </div>

          <div className={styles.parametersColumn}>
            {shouldShowGapPenalties && (
              <BlastGapPenalties
                config={config}
                program={blastProgram}
                blastParameters={blastParameters}
                onChange={onGapPenaltiesChange}
              />
            )}
          </div>

          <div
            className={classNames(
              styles.parametersColumn,
              styles.checkboxesColumn
            )}
          >
            {buildCheckbox({
              ...(config.parameters.gapalign as BlastBooleanSetting),
              selectedOption: blastParameters.gapalign ?? '',
              disabled: !gapAlignEnabled,
              onChange: (value: string) =>
                onBlastParameterChange('gapalign', value)
            })}
            {buildCheckbox({
              ...(config.parameters.filter as BlastBooleanSetting),
              selectedOption: blastParameters.filter as string,
              onChange: (value: string) =>
                onBlastParameterChange('filter', value)
            })}
          </div>
        </div>
      )}
    </>
  );
};

const BlastSubmissionName = () => {
  const submissionName = useAppSelector(getBlastSubmissionName);
  const { setBlastSubmissionName } = useBlastForm();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.currentTarget.value;
    setBlastSubmissionName(name);
  };

  return (
    <div className={styles.blastSubmissionName}>
      <label>
        <span>Submission name</span>
        <ShadedInput
          value={submissionName}
          onChange={onChange}
          placeholder="Optional"
        />
      </label>
    </div>
  );
};

const BlastGapPenalties = (props: {
  program: BlastProgram;
  blastParameters: ReturnType<typeof getBlastSearchParameters>;
  config: BlastSettingsConfig;
  onChange: (value: string) => void;
}) => {
  const { program, config, blastParameters, onChange } = props;
  const {
    gap_penalties: gapPenaltiesConfig,
    valid_parameters_for_program: validParamsForProgram
  } = config;
  const {
    matrix,
    match_scores: matchScores,
    gapopen: gapOpen,
    gapext: gapExtend
  } = blastParameters;

  let gapPenaltiesOptions: [string, string][] = [];
  const shouldUseMatrix =
    validParamsForProgram[
      program as keyof BlastSettingsConfig['valid_parameters_for_program']
    ].includes('matrix');

  if (shouldUseMatrix && matrix) {
    gapPenaltiesOptions = gapPenaltiesConfig.options.matrix[matrix];
  } else if (matchScores) {
    gapPenaltiesOptions = gapPenaltiesConfig.options.match_scores[matchScores];
  }

  const options = gapPenaltiesOptions.map(([gapOpen, gapExtend]) => ({
    label: `${gapOpen}, ${gapExtend}`,
    value: `${gapOpen},${gapExtend}`
  }));
  return (
    <BlastSelect
      options={options as Option[]}
      label={gapPenaltiesConfig.label}
      description={gapPenaltiesConfig.description}
      className={styles.gapPenalties}
      selectedOption={`${gapOpen},${gapExtend}`}
      onChange={onChange}
    />
  );
};

type BlastSelectProps = {
  options: Option[];
  label: string;
  description?: string;
  className?: string;
  selectedOption: string;
  onChange: (value: string) => void;
};

const BlastSelect = (setting: BlastSelectProps) => {
  const onChange = (e: FormEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    setting.onChange(value);
  };

  const [hoverRef, isHovered] = useHover<HTMLSpanElement>();

  return (
    <div className={classNames(styles.select, setting.className)}>
      <label>
        <span ref={hoverRef}>{setting.label}</span>
        <SimpleSelect
          value={setting.selectedOption}
          onInput={onChange}
          options={setting.options}
        />
      </label>
      {isHovered && setting.description && (
        <Tooltip anchor={hoverRef.current} autoAdjust={true}>
          {setting.description}
        </Tooltip>
      )}
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
  disabled?: boolean;
  onChange: (value: string) => void;
}) => {
  const { label, options, selectedOption, disabled = false, onChange } = params;
  const isSelected = options.true === selectedOption;

  const onCheckboxChange = (isChecked: boolean) => {
    onChange(options[`${isChecked}`]);
  };

  return (
    <Checkbox
      label={label}
      checked={isSelected}
      onChange={onCheckboxChange}
      disabled={disabled}
    />
  );
};

export default BlastSettings;
