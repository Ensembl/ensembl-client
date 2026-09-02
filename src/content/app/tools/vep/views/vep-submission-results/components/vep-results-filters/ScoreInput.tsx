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

import { useState } from 'react';
import type { FormEvent } from 'react';

import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';
import CheckboxWithLabel from 'src/shared/components/checkbox-with-label/CheckboxWithLabel';

import type {
  FilterOption,
  ResultsFilterCondition,
  ResultsFilterField,
  ResultsFilterOperator,
  ScoreOptionGroup
} from 'src/content/app/tools/vep/types/vepResultsFilters';

import styles from './VepResultsFilters.module.css';

type Props = {
  // Which score this row tests, and the ones still free to choose, grouped by
  // category (genome wide / missense / splicing). A score taken by another row
  // is not offered again — one threshold per score.
  field: ResultsFilterField;
  scoreOptionGroups: ScoreOptionGroup[];
  operatorOptions: FilterOption[];
  operator: ResultsFilterOperator;
  threshold: number | undefined;
  includeMissing: boolean;
  // What a variant with no score is called in this filter's own terms.
  missingLabel: string;
  onChange: (patch: Partial<ResultsFilterCondition>) => void;
};

/**
 * The editor for a numeric score filter: a comparison, a threshold, and what to
 * do with the variants that have no score.
 *
 * That last one is a choice rather than a policy because either answer is
 * reasonable depending on the question. A missing score usually means the
 * variant is outside what that predictor scores at all (CADD skips some
 * variant types; a missense predictor has nothing to say about a synonymous
 * variant) rather than that it scored low — so someone hunting damaging
 * variants wants them gone, while someone surveying a region does not want
 * them silently dropped.
 *
 * It starts unchecked, which is the opposite of how the allele-frequency
 * filter treats its unknowns. That asymmetry is deliberate: a missing allele
 * frequency means the variant is absent from the reference set, which is
 * evidence of rarity and usually the point of the query, whereas a missing
 * impact score is evidence of nothing at all — so carrying the unscored
 * variants through would dilute the result with variants nothing has judged.
 *
 * Unlike allele frequency the threshold is not bounded to 0-1, because not
 * every score is a probability: CADD RAW is unbounded and popEVE is negative
 * throughout. The placeholder therefore comes from the chosen score rather
 * than from the filter, and changes as the score changes.
 */
const ScoreInput = (props: Props) => {
  const {
    field,
    scoreOptionGroups,
    operatorOptions,
    operator,
    threshold,
    includeMissing,
    missingLabel,
    onChange
  } = props;
  // The row's own score is always among the groups it is offered, so its range
  // hint is here rather than needing the whole catalogue.
  const placeholder =
    scoreOptionGroups
      .flatMap((group) => group.options)
      .find((option) => option.value === field)?.placeholder ?? '';
  // Kept as text so a half-typed value ("-", "1.") survives; the number is only
  // reported once it parses.
  const [thresholdText, setThresholdText] = useState(
    typeof threshold === 'number' ? String(threshold) : ''
  );

  const onThresholdInput = (event: FormEvent<HTMLInputElement>) => {
    const text = event.currentTarget.value;
    setThresholdText(text);
    const parsed = Number(text);
    onChange({
      threshold: text.trim() !== '' && !isNaN(parsed) ? parsed : undefined
    });
  };

  return (
    <div className={styles.afField}>
      {/* One row, like the allele-frequency editor: score, comparison,
          threshold and the no-score choice read as a single sentence. */}
      <div className={styles.afRow}>
        <SimpleSelect
          className={styles.afScopeSelect}
          optionGroups={scoreOptionGroups}
          value={field}
          onInput={(event) =>
            onChange({
              field: event.currentTarget.value as ResultsFilterField
            })
          }
        />
        <SimpleSelect
          className={styles.afOperatorSelect}
          options={operatorOptions}
          value={operator}
          onInput={(event) =>
            onChange({
              operator: event.currentTarget.value as ResultsFilterOperator
            })
          }
        />
        <input
          type="text"
          inputMode="decimal"
          className={styles.afThreshold}
          value={thresholdText}
          placeholder={placeholder}
          onInput={onThresholdInput}
        />
        <CheckboxWithLabel
          label={missingLabel}
          checked={includeMissing}
          onChange={(checked) => onChange({ include_missing: checked })}
        />
      </div>
    </div>
  );
};

export default ScoreInput;
