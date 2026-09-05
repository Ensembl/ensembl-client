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

import type {
  FilterField,
  ResultsFilterCondition,
  ScoreOption,
  ScoreOptionGroup
} from 'src/content/app/tools/vep/types/vepResultsFilters';

/**
 * Row-level bookkeeping for the query builder: which field a row may take, and
 * what a new row should default to. Everything a field *is* — its label, editor
 * and options — comes from the catalogue the API serves, and is passed in.
 *
 * The distinction is that this is interface state. What the user has already
 * chosen in another row is not something the backend knows or should.
 */

// Which of the offered scores exist at all, from the catalogue's score editor.
const scoreOptions = (fields: FilterField[]): ScoreOption[] =>
  fields.flatMap(
    (field) => field.score_groups?.flatMap((group) => group.options) ?? []
  );

export const isScoreField = (field: string, fields: FilterField[]): boolean =>
  scoreOptions(fields).some((option) => option.value === field);

/** The range hint for a score, for the row's threshold input. */
export const scoreFieldOption = (
  field: string,
  fields: FilterField[]
): ScoreOption | undefined =>
  scoreOptions(fields).find((option) => option.value === field);

// A fresh condition on the given field, with a unique client-side id (used to
// track which rows have been applied) and API-provided initial wire values.
let conditionCounter = 0;
export const createCondition = (
  field: string,
  fields: FilterField[]
): ResultsFilterCondition => {
  const definition = definitionForField(field, fields);
  if (!definition) {
    throw new Error(`No filter definition for field '${field}'`);
  }
  return {
    id: `condition-${++conditionCounter}`,
    field,
    ...definition.initial_condition,
    values: [...definition.initial_condition.values]
  };
};

// The single-instance fields already present in a set of conditions.
const usedSingleInstanceFields = (
  conditions: ResultsFilterCondition[],
  fields: FilterField[]
): Set<string> => {
  const singleInstance = new Set(
    fields.filter((f) => f.single_instance).map((f) => f.field)
  );
  return new Set(
    conditions.map((c) => c.field).filter((field) => singleInstance.has(field))
  );
};

/**
 * The definition to render a condition with. Every score resolves to the one
 * "Variant impact predictions" entry, since which score it is lives in the row
 * rather than in the field dropdown.
 */
export const definitionForField = (
  field: string,
  fields: FilterField[]
): FilterField | undefined =>
  isScoreField(field, fields)
    ? fields.find((f) => f.editor === 'score')
    : fields.find((f) => f.field === field);

/**
 * Which scores this row may offer: those the job carries, minus the ones other
 * rows have already taken, plus whichever this row is on.
 */
export const availableScoresForRow = (
  conditions: ResultsFilterCondition[],
  rowIndex: number,
  offered: string[],
  fields: FilterField[]
): ScoreOptionGroup[] => {
  const takenElsewhere = new Set(
    conditions
      .filter((c, i) => i !== rowIndex && isScoreField(c.field, fields))
      .map((c) => c.field)
  );
  const isAvailable = (option: ScoreOption) =>
    offered.includes(option.value) &&
    (!takenElsewhere.has(option.value) ||
      conditions[rowIndex]?.field === option.value);

  const groups = fields.find((f) => f.editor === 'score')?.score_groups ?? [];
  return groups
    .map((group) => ({
      title: group.title,
      options: group.options.filter(isAvailable)
    }))
    .filter((group) => group.options.length > 0);
};

// The flat list of scores behind a grouped menu, for the places that only care
// which scores are on offer rather than how they are presented.
export const flattenScoreOptions = (
  groups: ScoreOptionGroup[]
): ScoreOption[] => groups.flatMap((group) => group.options);

export const availableFieldsForRow = (
  conditions: ResultsFilterCondition[],
  rowIndex: number,
  fields: FilterField[]
): FilterField[] => {
  const usedElsewhere = usedSingleInstanceFields(
    conditions.filter((_, i) => i !== rowIndex),
    fields
  );
  return fields.filter(
    (f) =>
      !usedElsewhere.has(f.field) || conditions[rowIndex]?.field === f.field
  );
};

// The field a newly-added condition should default to: the first field not
// already blocked by a single-instance field being in use.
export const nextAvailableField = (
  conditions: ResultsFilterCondition[],
  fields: FilterField[]
): string => {
  const used = usedSingleInstanceFields(conditions, fields);
  const field = fields.find((f) => !used.has(f.field));
  return (field ?? fields[0]).field;
};
