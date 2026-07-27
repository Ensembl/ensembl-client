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
  | 'allele_frequency';

// 'in' for set-membership fields; le/eq/ge (<=, ==, >=) for allele frequency.
export type ResultsFilterOperator = 'in' | 'le' | 'eq' | 'ge';

export type AlleleFrequencyMatch = 'any' | 'all';

export type ResultsFilterCondition = {
  // Stable client-side id, used to track which draft rows have been applied.
  // Not part of the wire format — stripped before serialising to the API.
  id: string;
  field: ResultsFilterField;
  operator: ResultsFilterOperator;
  values: string[];
  // Allele-frequency only: comparison threshold (0-1) and any/all match mode.
  threshold?: number;
  match?: AlleleFrequencyMatch;
};

// Whether a condition would actually filter anything (and so should be applied).
export const isResultsFilterActive = (
  condition: ResultsFilterCondition
): boolean => {
  if (condition.field === 'allele_frequency') {
    return (
      typeof condition.threshold === 'number' &&
      condition.threshold >= 0 &&
      condition.threshold <= 1
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
  const active = conditions.filter(isResultsFilterActive).map((condition) =>
    condition.field === 'allele_frequency'
      ? {
          field: condition.field,
          operator: condition.operator,
          values: condition.values,
          threshold: condition.threshold,
          match: condition.match ?? 'any'
        }
      : {
          field: condition.field,
          operator: condition.operator,
          values: condition.values
        }
  );
  return active.length > 0 ? JSON.stringify(active) : undefined;
};
