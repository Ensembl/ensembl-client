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

import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';
import {
  PrimaryButton,
  SecondaryButton
} from 'src/shared/components/button/Button';
import CloseButton from 'src/shared/components/close-button/CloseButton';

import ConsequenceMultiSelect from './ConsequenceMultiSelect';
import TokenListInput from './TokenListInput';
import TranscriptGroupSelect from './TranscriptGroupSelect';
import ScoreInput from './ScoreInput';
import AlleleFrequencyInput, {
  type AfSourceOption
} from './AlleleFrequencyInput';
import {
  createCondition,
  availableFieldsForRow,
  availableScoresForRow,
  definitionForField,
  flattenScoreOptions,
  isScoreField,
  nextAvailableField
} from './resultsFilterFields';

import type {
  FilterField,
  ResultsFilterCondition
} from 'src/content/app/tools/vep/types/vepResultsFilters';

import styles from './VepResultsFilters.module.css';

type Props = {
  // The draft conditions being edited (not yet applied).
  conditions: ResultsFilterCondition[];
  onChange: (conditions: ResultsFilterCondition[]) => void;
  onApply: () => void;
  onClear: () => void;
  isDirty: boolean;
  hasAppliedFilters: boolean;
  resultSummary: { filtered: number; total: number } | null;
  // The fields this job can be filtered on, and how each is presented, from the
  // results response.
  filterFields: FilterField[];
  // Allele-frequency sources chosen at input; the AF filter is only offered when
  // this is non-empty.
  afSources: AfSourceOption[];
  // Impact-prediction scores chosen at input ('cadd_phred', 'revel',
  // 'spliceai_dl', etc.); a score is only offered in the row's menu when it is
  // among them.
  scoreFields: string[];
  // Ids of conditions already applied
  appliedConditionIds: Set<string>;
};

// Every score resolves to the one "Variant impact predictions" entry; which
// score a row tests lives in the row, not in the field dropdown.
const fieldDefinition = (field: string, fields: FilterField[]): FilterField =>
  definitionForField(field, fields) ?? fields[0];

/**
 * The results filter query builder: rows of (field, operator, values) conditions
 * combined with AND, plus apply / clear controls. Conditions are held as a draft
 * here and only committed on Apply, because each apply is a server-side scan.
 */
const VepResultsFilters = (props: Props) => {
  const {
    conditions,
    onChange,
    onApply,
    onClear,
    isDirty,
    hasAppliedFilters,
    resultSummary,
    filterFields,
    afSources,
    scoreFields,
    appliedConditionIds
  } = props;

  const updateCondition = (
    index: number,
    patch: Partial<ResultsFilterCondition>
  ) => {
    onChange(
      conditions.map((condition, i) =>
        i === index ? { ...condition, ...patch } : condition
      )
    );
  };

  const changeField = (index: number, field: string) => {
    const resolved = isScoreField(field, filterFields)
      ? (flattenScoreOptions(
          availableScoresForRow(conditions, index, scoreFields, filterFields)
        ).find(
          (option) =>
            !conditions.some((c, i) => i !== index && c.field === option.value)
        )?.value ?? field)
      : field;
    onChange(
      conditions.map((condition, i) =>
        i === index
          ? { ...createCondition(resolved, filterFields), id: condition.id }
          : condition
      )
    );
  };

  const removeCondition = (index: number) => {
    onChange(conditions.filter((_, i) => i !== index));
  };

  const addCondition = () => {
    onChange([
      ...conditions,
      createCondition(
        nextAvailableField(conditions, filterFields),
        filterFields
      )
    ]);
  };

  const transcriptGroupOptions =
    filterFields.find((f) => f.editor === 'group')?.options ?? [];

  return (
    <div className={styles.panel}>
      {conditions.length === 0 && (
        <p className={styles.emptyHint}>
          No filters yet. Add a filter to narrow the results.
        </p>
      )}

      <div className={styles.conditions}>
        {conditions.map((condition, index) => {
          const definition = fieldDefinition(condition.field, filterFields);
          // The field (query type) locks once this row has been applied.
          const isFieldLocked = appliedConditionIds.has(condition.id);
          return (
            <div className={styles.conditionRow} key={condition.id}>
              {index > 0 && <span className={styles.conjunction}>and</span>}
              <SimpleSelect
                className={styles.fieldSelect}
                options={availableFieldsForRow(conditions, index, filterFields)
                  .filter((field) => {
                    if (field.field === 'allele_frequency') {
                      return afSources.length > 0;
                    }
                    if (field.editor === 'score') {
                      return (
                        availableScoresForRow(
                          conditions,
                          index,
                          scoreFields,
                          filterFields
                        ).length > 0
                      );
                    }
                    return true;
                  })
                  .map((field) => ({
                    label: field.label,
                    value: field.field
                  }))}
                value={
                  isScoreField(condition.field, filterFields)
                    ? definition.field
                    : condition.field
                }
                disabled={isFieldLocked}
                onChange={() => undefined}
                onInput={(event) =>
                  changeField(index, event.currentTarget.value)
                }
              />
              {definition.operator_label && (
                <span className={styles.operator}>
                  {definition.operator_label}
                </span>
              )}
              {definition.editor === 'text' ? (
                <TokenListInput
                  values={condition.values}
                  onChange={(values) => updateCondition(index, { values })}
                  config={definition}
                />
              ) : definition.editor === 'group' ? (
                <TranscriptGroupSelect
                  options={transcriptGroupOptions}
                  values={condition.values}
                  onChange={(values) => updateCondition(index, { values })}
                />
              ) : definition.editor === 'score' ? (
                <ScoreInput
                  field={condition.field}
                  scoreOptionGroups={availableScoresForRow(
                    conditions,
                    index,
                    scoreFields,
                    filterFields
                  )}
                  operatorOptions={definition.operator_options ?? []}
                  operator={condition.operator}
                  threshold={condition.threshold}
                  includeMissing={condition.include_missing ?? false}
                  missingLabel={definition.missing_label ?? ''}
                  onChange={(patch) => updateCondition(index, patch)}
                />
              ) : definition.editor === 'af' ? (
                <AlleleFrequencyInput
                  operator={condition.operator}
                  operatorOptions={definition.operator_options ?? []}
                  match={condition.match}
                  values={condition.values}
                  threshold={condition.threshold}
                  sources={afSources}
                  onChange={(patch) => updateCondition(index, patch)}
                />
              ) : (
                <ConsequenceMultiSelect
                  values={condition.values}
                  onChange={(values) => updateCondition(index, { values })}
                  optionGroups={definition.option_groups ?? []}
                />
              )}
              <CloseButton
                className={styles.removeCondition}
                onClick={() => removeCondition(index)}
              />
            </div>
          );
        })}
      </div>

      <div className={styles.controls}>
        <SecondaryButton onClick={addCondition}>Add filter</SecondaryButton>
        <div className={styles.controlsRight}>
          {resultSummary && (
            <span className={styles.summary}>
              Showing {resultSummary.filtered.toLocaleString()} of{' '}
              {resultSummary.total.toLocaleString()}
            </span>
          )}
          <SecondaryButton
            onClick={onClear}
            disabled={conditions.length === 0 && !hasAppliedFilters}
          >
            Clear filters
          </SecondaryButton>
          <PrimaryButton onClick={onApply} disabled={!isDirty}>
            Apply
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default VepResultsFilters;
