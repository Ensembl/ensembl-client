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

import variantGroups from 'src/content/app/genome-browser/constants/variantGroups';

import type {
  ResultsFilterCondition,
  ResultsFilterField
} from 'src/content/app/tools/vep/types/vepResultsFilters';

// Config for a free-text token editor (transcript / gene fields). When `pattern`
// is set, tokens must match it to be applied; non-matching tokens are flagged.
export type TextInputConfig = {
  placeholder: string;
  mono?: boolean;
  pattern?: RegExp;
  invalidHint?: string;
};

// The fields the query builder can filter on. Adding a field here (plus, for a
// text field, its input config) extends the builder.
export type FilterFieldDefinition = {
  field: ResultsFilterField;
  label: string;
  // Human-readable operator shown between field and values (single operator for
  // now, so it's fixed text rather than a selector).
  operatorLabel: string;
  // Which value editor to render: the grouped consequence multi-select, a
  // free-text token list, or the (species-dependent) transcript-group choices.
  editor: 'consequence' | 'text' | 'group' | 'af';
  textInput?: TextInputConfig;
  // Fields whose editor is already multi-value (consequence, transcript group):
  // a second condition would be redundant, so only one instance is allowed and
  // the field is removed from other rows' field dropdowns once used.
  singleInstance?: boolean;
};

// Transcript-group ids and their labels (must match the backend group ids).
export type TranscriptGroupOption = { value: string; label: string };

const TRANSCRIPT_GROUP_LABELS: Record<string, string> = {
  mane_select: 'MANE Select',
  mane_plus_clinical: 'MANE Plus Clinical',
  gencode_primary: 'GENCODE Primary',
  canonical: 'Canonical'
};

/**
 * Which transcript groups are offered for a species. Human GRCh38 has the MANE
 * sets plus GENCODE primary plus canonical; everything else has canonical only
 * (for now).
 */
export const getTranscriptGroupOptions = (
  isHumanGRCh38: boolean
): TranscriptGroupOption[] => {
  const ids = isHumanGRCh38
    ? ['mane_select', 'mane_plus_clinical', 'gencode_primary', 'canonical']
    : ['canonical'];
  return ids.map((value) => ({ value, label: TRANSCRIPT_GROUP_LABELS[value] }));
};

export const FILTER_FIELDS: FilterFieldDefinition[] = [
  {
    field: 'consequence',
    label: 'Predicted molecular consequence',
    operatorLabel: 'is any of',
    editor: 'consequence',
    singleInstance: true
  },
  {
    field: 'transcript',
    label: 'Transcript',
    operatorLabel: 'is any of',
    editor: 'text',
    textInput: {
      placeholder: 'e.g. ENST00000341065',
      mono: true,
      pattern: /^ENST\d{11}(\.\d+)?$/,
      invalidHint: 'expected ENST + 11 digits'
    }
  },
  {
    field: 'gene_symbol',
    label: 'Gene name',
    operatorLabel: 'is any of',
    editor: 'text',
    textInput: {
      placeholder: 'e.g. TP53'
    }
  },
  {
    field: 'gene_id',
    label: 'Ensembl gene ID',
    operatorLabel: 'is any of',
    editor: 'text',
    textInput: {
      placeholder: 'e.g. ENSG00000141510',
      mono: true,
      pattern: /^ENSG\d{11}(\.\d+)?$/,
      invalidHint: 'expected ENSG + 11 digits'
    }
  },
  {
    field: 'transcript_group',
    label: 'Transcript group',
    operatorLabel: 'is any of',
    editor: 'group',
    singleInstance: true
  },
  {
    field: 'allele_frequency',
    // The operator is chosen inside the AF editor, so no fixed operator label.
    label: 'Allele frequency',
    operatorLabel: '',
    editor: 'af'
  }
];

// Consequence terms offered in the multi-select, grouped as they are elsewhere
// in the app (reusing the shared variant-consequence vocabulary as the single
// source of terms and grouping).
export type ConsequenceOptionGroup = {
  label: string;
  options: string[];
};

export const CONSEQUENCE_OPTION_GROUPS: ConsequenceOptionGroup[] =
  variantGroups.map((group) => ({
    label: group.label,
    options: group.variant_types.map((type) => type.label)
  }));

// A fresh condition on the given field, with a unique client-side id (used to
// track which rows have been applied). Allele frequency starts on the requested
// defaults: match any, <= (le), threshold 0.05.
let conditionCounter = 0;
export const createCondition = (
  field: ResultsFilterField
): ResultsFilterCondition => {
  const id = `condition-${++conditionCounter}`;
  if (field === 'allele_frequency') {
    return {
      id,
      field,
      operator: 'le',
      values: [],
      match: 'any',
      threshold: 0.05
    };
  }
  return { id, field, operator: 'in', values: [] };
};

// The single-instance fields already present in a set of conditions.
const usedSingleInstanceFields = (
  conditions: ResultsFilterCondition[]
): Set<ResultsFilterField> => {
  const singleInstance = new Set(
    FILTER_FIELDS.filter((f) => f.singleInstance).map((f) => f.field)
  );
  return new Set(
    conditions.map((c) => c.field).filter((field) => singleInstance.has(field))
  );
};

// Field options available to a given row: hide single-instance fields already
// used by another row, but always keep the row's own current field.
export const availableFieldsForRow = (
  conditions: ResultsFilterCondition[],
  rowIndex: number
): FilterFieldDefinition[] => {
  const usedElsewhere = usedSingleInstanceFields(
    conditions.filter((_, i) => i !== rowIndex)
  );
  return FILTER_FIELDS.filter(
    (f) =>
      !usedElsewhere.has(f.field) || conditions[rowIndex]?.field === f.field
  );
};

// The field a newly-added condition should default to: the first field not
// already blocked by a single-instance field being in use.
export const nextAvailableField = (
  conditions: ResultsFilterCondition[]
): ResultsFilterField => {
  const used = usedSingleInstanceFields(conditions);
  const field = FILTER_FIELDS.find((f) => !used.has(f.field));
  return (field ?? FILTER_FIELDS[0]).field;
};
