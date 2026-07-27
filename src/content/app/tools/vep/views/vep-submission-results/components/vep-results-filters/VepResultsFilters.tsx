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
import { PrimaryButton, SecondaryButton } from 'src/shared/components/button/Button';
import CloseButton from 'src/shared/components/close-button/CloseButton';
import DownloadOptions from 'src/content/app/tools/vep/components/vep-submission-header/DownloadOptions';

import ConsequenceMultiSelect from './ConsequenceMultiSelect';
import TokenListInput from './TokenListInput';
import TranscriptGroupSelect from './TranscriptGroupSelect';
import AlleleFrequencyInput, {
  type AfSourceOption
} from './AlleleFrequencyInput';
import {
  FILTER_FIELDS,
  createCondition,
  availableFieldsForRow,
  nextAvailableField,
  type FilterFieldDefinition,
  type TranscriptGroupOption
} from './resultsFilterFields';

import type {
  ResultsFilterCondition,
  ResultsFilterField
} from 'src/content/app/tools/vep/types/vepResultsFilters';

import styles from './VepResultsFilters.module.css';

type Props = {
  // The draft conditions being edited (not yet applied).
  conditions: ResultsFilterCondition[];
  onChange: (conditions: ResultsFilterCondition[]) => void;
  // Commit the draft (triggers a filtered request); disabled unless the draft
  // differs from what's applied.
  onApply: () => void;
  onClear: () => void;
  isDirty: boolean;
  hasAppliedFilters: boolean;
  // Filtered / total record counts from the last applied request, if any.
  resultSummary: { filtered: number; total: number } | null;
  // Species-dependent transcript-group choices (e.g. MANE sets for human GRCh38).
  transcriptGroupOptions: TranscriptGroupOption[];
  // Allele-frequency sources chosen at input; the AF filter is only offered when
  // this is non-empty.
  afSources: AfSourceOption[];
  // Ids of conditions already applied; their field (query type) select is frozen
  // so the applied filter type can't change — only its values stay editable.
  appliedConditionIds: Set<string>;
  // Download links (VCF / flattened table) for just the rows passing the applied
  // filters — carry the same `filters` payload the results request used. The
  // control is disabled until filters are actually applied.
  filteredDownload: { vcfHref: string; tableHref: string };
};

const fieldDefinition = (field: ResultsFilterField): FilterFieldDefinition =>
  FILTER_FIELDS.find((definition) => definition.field === field) ??
  FILTER_FIELDS[0];

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
    transcriptGroupOptions,
    afSources,
    appliedConditionIds,
    filteredDownload
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

  // Replace a whole condition (used on field change, so field-specific defaults
  // apply cleanly and stale fields from the previous field don't linger).
  const changeField = (index: number, field: ResultsFilterField) => {
    onChange(
      conditions.map((condition, i) =>
        i === index
          ? { ...createCondition(field), id: condition.id }
          : condition
      )
    );
  };

  const removeCondition = (index: number) => {
    onChange(conditions.filter((_, i) => i !== index));
  };

  const addCondition = () => {
    onChange([...conditions, createCondition(nextAvailableField(conditions))]);
  };

  return (
    <div className={styles.panel}>
      {conditions.length === 0 && (
        <p className={styles.emptyHint}>
          No filters yet. Add a filter to narrow the results.
        </p>
      )}

      <div className={styles.conditions}>
        {conditions.map((condition, index) => {
          const definition = fieldDefinition(condition.field);
          // The field (query type) locks once this row has been applied.
          const isFieldLocked = appliedConditionIds.has(condition.id);
          return (
            <div className={styles.conditionRow} key={condition.id}>
              {index > 0 && <span className={styles.conjunction}>and</span>}
              <SimpleSelect
                className={styles.fieldSelect}
                options={availableFieldsForRow(conditions, index)
                  .filter(
                    (field) =>
                      field.field !== 'allele_frequency' || afSources.length > 0
                  )
                  .map((field) => ({
                    label: field.label,
                    value: field.field
                  }))}
                value={condition.field}
                disabled={isFieldLocked}
                onChange={() => undefined}
                onInput={(event) =>
                  changeField(
                    index,
                    event.currentTarget.value as ResultsFilterField
                  )
                }
              />
              {definition.operatorLabel && (
                <span className={styles.operator}>
                  {definition.operatorLabel}
                </span>
              )}
              {definition.editor === 'text' && definition.textInput ? (
                <TokenListInput
                  values={condition.values}
                  onChange={(values) => updateCondition(index, { values })}
                  config={definition.textInput}
                />
              ) : definition.editor === 'group' ? (
                <TranscriptGroupSelect
                  options={transcriptGroupOptions}
                  values={condition.values}
                  onChange={(values) => updateCondition(index, { values })}
                />
              ) : definition.editor === 'af' ? (
                <AlleleFrequencyInput
                  operator={condition.operator}
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
        <SecondaryButton onClick={addCondition}>+ Add filter</SecondaryButton>
        <div className={styles.controlsRight}>
          {resultSummary && (
            <span className={styles.summary}>
              Showing {resultSummary.filtered.toLocaleString()} of{' '}
              {resultSummary.total.toLocaleString()}
            </span>
          )}
          <DownloadOptions
            vcfHref={filteredDownload.vcfHref}
            tableHref={filteredDownload.tableHref}
            disabled={!hasAppliedFilters}
            label="Download filtered"
            ariaLabel="Download filtered results"
          />
          <SecondaryButton
            onClick={onClear}
            disabled={conditions.length === 0 && !hasAppliedFilters}
          >
            Clear all
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
