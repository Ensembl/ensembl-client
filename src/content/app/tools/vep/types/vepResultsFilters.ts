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

// A results query-builder condition. Conditions are AND-combined server-side.
// The shape matches the tools API's ResultsFilter (field/operator/values), so it
// serialises straight into the `filters` query param.

export type ResultsFilterField =
  | 'consequence'
  | 'transcript'
  | 'gene_symbol'
  | 'gene_id'
  | 'transcript_group'
  | 'allele_frequency'
  // Every variant-impact prediction is its own field, even where several come
  // from one tool, because each carries its own scale and a threshold means
  // nothing without knowing which scale it is on. CADD PHRED is ~0-99 and
  // scaled for interpretation while CADD RAW is unbounded around -7 to +35;
  // the missense predictors are 0-1 probabilities except popEVE, which is a
  // negative log-scale score; and SpliceAI's four delta scores describe four
  // different events at the same position, so they cannot share one threshold
  // either.
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
  // Numeric fields only: the comparison threshold. Allele frequency also
  // carries the any/all match mode across its columns; a score filter tests one
  // column, so it has no equivalent.
  threshold?: number;
  match?: AlleleFrequencyMatch;
  // Score filters only: whether entries with no score are kept. Defaults to
  // dropping them, unlike the allele-frequency filter, which always keeps its
  // unknowns. The paradigm differs: a missing allele frequency implies the
  // variant is absent from the reference set and so very rare, which is usually
  // what the query is after, whereas a missing impact score means the variant
  // was never scored (out of that predictor's scope — a missense predictor has
  // nothing to say about a synonymous variant) and so implies nothing about how
  // damaging it is.
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
 * Serialise conditions into the `filters` query param (a JSON array), keeping
 * only active conditions and dropping the client-only `id`. Allele-frequency
 * conditions also carry threshold/match. Returns undefined when nothing is
 * active, so the request omits the param and takes the fast unfiltered path.
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

/**
 * The filter catalogue the tools API serves on the results response: which
 * fields the query builder offers, and what each one's editor needs.
 *
 * Only the keys an editor reads are sent, so a text field has no score groups
 * and the allele-frequency field is three keys wide. Which of the offered
 * scores and AF sources this job actually carries is separate, and arrives as
 * `available_scores` / `available_af_sources`.
 */
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
  /** Read between the field and its value. Absent where the editor chooses its
   *  own operator, as the allele-frequency and score editors do. */
  operator_label?: string;
  editor: 'consequence' | 'text' | 'group' | 'af' | 'score';
  initial_condition: InitialFilterCondition;
  operator_options?: FilterOption[];
  /** Text editors. */
  placeholder?: string;
  /** An editor that already takes many values is offered once, then withdrawn. */
  single_instance?: boolean;
  /** Consequence editor. */
  option_groups?: FilterOptionGroup[];
  /** Transcript-group editor. */
  options?: FilterOption[];
  /** Score editor. */
  missing_label?: string;
  score_groups?: ScoreOptionGroup[];
};
