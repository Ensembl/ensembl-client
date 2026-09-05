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

export type ResultsFilterField =
  | 'consequence'
  | 'transcript'
  | 'gene_symbol'
  | 'gene_id'
  | 'transcript_group'
  | 'allele_frequency'
  | 'cadd_phred'
  | 'cadd_raw'
  | 'alphamissense'
  | 'revel'
  | 'clinpred'
  | 'eve'
  | 'popeve'
  | 'spliceai_ag'
  | 'spliceai_al'
  | 'spliceai_dg'
  | 'spliceai_dl'
  | 'spliceai_any';

// 'in' for set-membership fields; le/ge (<=, >=) for the numeric ones. There is
// deliberately no '==': these are floats, so equality is a question the data can
// rarely answer, and it was never the useful test for a frequency or a score.
export type ResultsFilterOperator = 'in' | 'le' | 'ge';

export type AlleleFrequencyMatch = 'any' | 'all';

export type ResultsFilterCondition = {
  // Stable client-side id, used to track which draft rows have been applied.
  // Not part of the wire format — stripped before serialising to the API.
  id: string;
  field: ResultsFilterField;
  operator: ResultsFilterOperator;
  values: string[];
  threshold?: number;
  match?: AlleleFrequencyMatch;
  // Score filters only: whether entries with no score are kept.
  include_missing?: boolean;
};

// Whether a condition would actually filter anything (and so should be applied).
export const isResultsFilterActive = (
  condition: ResultsFilterCondition
): boolean => {
  if (condition.match !== undefined) {
    return (
      typeof condition.threshold === 'number' &&
      condition.threshold >= 0 &&
      condition.threshold <= 1
    );
  }
  if (condition.threshold !== undefined) {
    // No 0-1 bound here: not every score is a probability. CADD RAW is
    // unbounded and popEVE is negative throughout.
    return (
      typeof condition.threshold === 'number' && !isNaN(condition.threshold)
    );
  }
  return condition.values.length > 0;
};

/**
 * Serialise conditions into the `filters` query param,
 * keeping only active conditions and dropping the client-only `id`.
 * Allele-frequency conditions also carry threshold/match.
 */
export const serializeResultsFilters = (
  conditions: ResultsFilterCondition[]
): string | undefined => {
  const active = conditions.filter(isResultsFilterActive).map((condition) => {
    const wireCondition: Partial<ResultsFilterCondition> = { ...condition };
    delete wireCondition.id;
    return wireCondition;
  });
  return active.length > 0 ? JSON.stringify(active) : undefined;
};

export type FilterOption = {
  value: string;
  label: string;
};

export type InitialFilterCondition = Omit<
  ResultsFilterCondition,
  'id' | 'field'
>;

export type FilterOptionGroup = {
  label: string;
  options: string[];
};

export type ScoreOption = {
  value: ResultsFilterField;
  label: string;
  /** Range hint for the threshold input; differs per score. */
  placeholder: string;
};

export type ScoreOptionGroup = {
  title: string;
  options: ScoreOption[];
};

export type FilterField = {
  field: ResultsFilterField;
  label: string;
  /** Text to show between the field and its value.
   * Absent where the editor chooses its own operator,
   * as the allele-frequency and score editors do. */
  operator_label?: string;
  editor: 'consequence' | 'text' | 'group' | 'af' | 'score';
  initial_condition: InitialFilterCondition;
  operator_options?: FilterOption[];
  // used in the text editor
  placeholder?: string;
  single_instance?: boolean;
  // used in the consequence editor
  option_groups?: FilterOptionGroup[];
  // used in the transcript-group editor
  options?: FilterOption[];
  // used in the score editor
  missing_label?: string;
  score_groups?: ScoreOptionGroup[];
};
