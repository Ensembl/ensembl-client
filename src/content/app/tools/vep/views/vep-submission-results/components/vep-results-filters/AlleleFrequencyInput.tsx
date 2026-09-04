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

import { useState, useRef } from 'react';
import type { FormEvent } from 'react';
import classNames from 'classnames';

import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';
import CheckboxWithLabel from 'src/shared/components/checkbox-with-label/CheckboxWithLabel';
import useOutsideClick from 'src/shared/hooks/useOutsideClick';

import type {
  FilterOption,
  ResultsFilterCondition,
  ResultsFilterOperator,
  AlleleFrequencyMatch
} from 'src/content/app/tools/vep/types/vepResultsFilters';

import styles from './VepResultsFilters.module.css';

export type AfSourceOption = { key: string; label: string };

type Scope = 'any' | 'all' | 'specific';

type Props = {
  operator: ResultsFilterOperator;
  operatorOptions: FilterOption[];
  match: AlleleFrequencyMatch | undefined;
  values: string[];
  threshold: number | undefined;
  sources: AfSourceOption[];
  onChange: (patch: Partial<ResultsFilterCondition>) => void;
};

const SCOPE_OPTIONS = [
  { value: 'any', label: 'Any variant allele frequency source' },
  { value: 'all', label: 'All variant allele frequency sources' },
  { value: 'specific', label: 'Specific selections' }
];

const AlleleFrequencyInput = (props: Props) => {
  const {
    operator,
    operatorOptions,
    match,
    values,
    threshold,
    sources,
    onChange
  } = props;
  const [thresholdText, setThresholdText] = useState(
    threshold !== undefined ? String(threshold) : ''
  );
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const sourcesRef = useRef<HTMLDivElement>(null);
  useOutsideClick(sourcesRef, () => setIsSourcesOpen(false));

  // Scope is explicit local state: "specific" with no picks yet can't be derived
  // from the condition (values would be empty, reading as "any"), so tracking it
  // separately keeps the specific selector visible while the user chooses.
  const [scope, setScope] = useState<Scope>(
    values.length > 0 ? 'specific' : match === 'all' ? 'all' : 'any'
  );

  const onScopeChange = (next: Scope) => {
    setScope(next);
    if (next === 'any') {
      onChange({ match: 'any', values: [] });
    } else if (next === 'all') {
      onChange({ match: 'all', values: [] });
    } else {
      // Specific: match across the chosen subset is "any"; keep any picks made.
      onChange({ match: 'any' });
    }
  };

  const toggleSource = (key: string) => {
    const selected = new Set(values);
    if (selected.has(key)) {
      selected.delete(key);
    } else {
      selected.add(key);
    }
    onChange({
      values: sources.map((s) => s.key).filter((k) => selected.has(k))
    });
  };

  const onThresholdInput = (event: FormEvent<HTMLInputElement>) => {
    const text = event.currentTarget.value;
    setThresholdText(text);
    const parsed = Number.parseFloat(text);
    onChange({ threshold: Number.isNaN(parsed) ? undefined : parsed });
  };

  const parsed = Number.parseFloat(thresholdText);
  const thresholdInvalid =
    thresholdText.trim() !== '' &&
    (Number.isNaN(parsed) || parsed < 0 || parsed > 1);

  const selectedCount = values.length;

  return (
    <div className={styles.afField}>
      <div className={styles.afRow}>
        <SimpleSelect
          className={styles.afScopeSelect}
          options={SCOPE_OPTIONS}
          value={scope}
          onChange={() => undefined}
          onInput={(event) => onScopeChange(event.currentTarget.value as Scope)}
        />

        {scope === 'specific' && (
          <div className={styles.multiSelect} ref={sourcesRef}>
            <button
              type="button"
              className={classNames(styles.valueTrigger, {
                [styles.valueTriggerEmpty]: selectedCount === 0,
                [styles.valueTriggerOpen]: isSourcesOpen
              })}
              onClick={() => setIsSourcesOpen((open) => !open)}
              aria-haspopup="dialog"
              aria-expanded={isSourcesOpen}
            >
              <span>
                {selectedCount === 0
                  ? 'Select sources'
                  : `${selectedCount} selected`}
              </span>
            </button>
            {isSourcesOpen && (
              <div className={styles.optionsPanel}>
                <div className={styles.optionGroups}>
                  {sources.map((source) => (
                    <CheckboxWithLabel
                      key={source.key}
                      label={source.label}
                      checked={values.includes(source.key)}
                      onChange={() => toggleSource(source.key)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <SimpleSelect
          className={styles.afOperatorSelect}
          options={operatorOptions}
          value={operator}
          onChange={() => undefined}
          onInput={(event) =>
            onChange({
              operator: event.currentTarget.value as ResultsFilterOperator
            })
          }
        />

        <input
          type="text"
          inputMode="decimal"
          className={classNames(styles.afThreshold, {
            [styles.tokenInputInvalid]: thresholdInvalid
          })}
          value={thresholdText}
          onInput={onThresholdInput}
          placeholder="0–1"
          aria-label="Allele frequency threshold"
          aria-invalid={thresholdInvalid}
          spellCheck={false}
        />
      </div>
      {thresholdInvalid && (
        <span className={styles.tokenError}>Enter a value between 0 and 1</span>
      )}
    </div>
  );
};

export default AlleleFrequencyInput;
