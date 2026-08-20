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
  operatorLabel: string;
  // Which value editor to render: the grouped consequence multi-select, a
  // free-text token list, or the (species-dependent) transcript-group choices.
  editor: 'consequence' | 'text' | 'group' | 'af' | 'score';
  // Score editors only: what a variant with no score is called. The hint for
  // the expected range is not here but on the score option, since it differs
  // from score to score.
  score?: { missingLabel: string };
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

export type ScoreFieldOption = {
  value: ResultsFilterField;
  label: string;
  placeholder: string;
};

export type ScoreFieldOptionGroup = {
  title: string;
  options: ScoreFieldOption[];
};

export const SCORE_FIELD_OPTION_GROUPS: ScoreFieldOptionGroup[] = [
  {
    title: 'Genome wide',
    options: [
      { value: 'cadd_phred', label: 'CADD (PHRED)', placeholder: 'e.g. 20' },
      { value: 'cadd_raw', label: 'CADD (RAW)', placeholder: 'e.g. 3' }
    ]
  },
  {
    title: 'Missense',
    options: [
      {
        value: 'alphamissense',
        label: 'AlphaMissense',
        placeholder: 'e.g. 0.5'
      },
      { value: 'revel', label: 'REVEL', placeholder: 'e.g. 0.5' },
      { value: 'clinpred', label: 'ClinPred', placeholder: 'e.g. 0.5' },
      { value: 'eve', label: 'EVE', placeholder: 'e.g. 0.5' },
      // popEVE is a negative log-scale score (roughly -5.5 to -2.5 in the data
      // we have), so its example threshold is negative where every other
      // missense predictor's is a probability.
      // TODO(popeve): popEVE also reports a gap frequency alongside the score.
      // Offering a GAP-frequency filter is wanted, but it is a separate field
      // with its own meaning rather than another entry in this menu, so it is
      // deliberately not defined here yet.
      { value: 'popeve', label: 'popEVE', placeholder: 'e.g. -3' }
    ]
  },
  {
    title: 'Splicing',
    // Named the way the results name them: the source first, then "ΔS" — the
    // same column heading the SpliceAI table uses for these very values, which
    // are its `SpliceAI_pred_DS_*` delta scores. Spelling it "Delta score" here
    // and "ΔS" there made the reader translate between the filter they set and
    // the number they were looking at. The source prefix also leaves room for a
    // second splicing predictor under this heading without either becoming
    // ambiguous.
    options: [
      {
        value: 'spliceai_ag',
        label: 'SpliceAI ΔS (acceptor gain)',
        placeholder: 'e.g. 0.5'
      },
      {
        value: 'spliceai_al',
        label: 'SpliceAI ΔS (acceptor loss)',
        placeholder: 'e.g. 0.5'
      },
      {
        value: 'spliceai_dg',
        label: 'SpliceAI ΔS (donor gain)',
        placeholder: 'e.g. 0.5'
      },
      {
        value: 'spliceai_dl',
        label: 'SpliceAI ΔS (donor loss)',
        placeholder: 'e.g. 0.5'
      },
      {
        value: 'spliceai_any',
        label: 'SpliceAI ΔS (any)',
        placeholder: 'e.g. 0.5'
      }
    ]
  }
];

export const SCORE_FIELD_OPTIONS: ScoreFieldOption[] =
  SCORE_FIELD_OPTION_GROUPS.flatMap((group) => group.options);

const SCORE_FIELDS = new Set<ResultsFilterField>(
  SCORE_FIELD_OPTIONS.map((option) => option.value)
);

// The placeholder (range hint) for a score, for the row's threshold input.
export const scoreFieldOption = (
  field: ResultsFilterField
): ScoreFieldOption | undefined =>
  SCORE_FIELD_OPTIONS.find((option) => option.value === field);

export const isScoreField = (field: ResultsFilterField): boolean =>
  SCORE_FIELDS.has(field);

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
    label: 'Allele frequency',
    // The operator is chosen inside the AF editor, so no fixed operator label.
    operatorLabel: '',
    editor: 'af'
  },
  // One entry for every impact score, not one per score: the field dropdown
  // offers "Variant impact predictions" (matching the submission form's panel
  // of that name) and the score itself is chosen inside the row, the way the
  // allele-frequency filter picks its sources. `field` holds the score actually
  // chosen, so what goes to the API stays the real field.
  {
    field: 'cadd_phred',
    label: 'Variant impact predictions',
    operatorLabel: '',
    editor: 'score',
    score: {
      missingLabel: 'Include variants with no score'
    }
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
  if (isScoreField(field)) {
    // `>=` by default
    return { id, field, operator: 'ge', values: [], includeMissing: false };
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
/**
 * The definition to render a condition with. Every score resolves to the one
 * "Variant impact predictions" entry, since which score it is lives in the row
 * rather than in the field dropdown.
 */
export const definitionForField = (
  field: ResultsFilterField
): FilterFieldDefinition | undefined =>
  isScoreField(field)
    ? FILTER_FIELDS.find((f) => f.editor === 'score')
    : FILTER_FIELDS.find((f) => f.field === field);

/**
 * Which scores this row may offer: those the job carries, minus the ones other
 * rows have already taken, plus whichever this row is on.
 */
export const availableScoresForRow = (
  conditions: ResultsFilterCondition[],
  rowIndex: number,
  offered: ResultsFilterField[]
): ScoreFieldOptionGroup[] => {
  const takenElsewhere = new Set(
    conditions
      .filter((c, i) => i !== rowIndex && isScoreField(c.field))
      .map((c) => c.field)
  );
  const isAvailable = (option: ScoreFieldOption) =>
    offered.includes(option.value) &&
    (!takenElsewhere.has(option.value) ||
      conditions[rowIndex]?.field === option.value);

  return SCORE_FIELD_OPTION_GROUPS.map((group) => ({
    title: group.title,
    options: group.options.filter(isAvailable)
  })).filter((group) => group.options.length > 0);
};

// The flat list of scores behind a grouped menu, for the places that only care
// which scores are on offer rather than how they are presented.
export const flattenScoreOptions = (
  groups: ScoreFieldOptionGroup[]
): ScoreFieldOption[] => groups.flatMap((group) => group.options);

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
