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

export type DisplayRowFormat =
  | 'text'
  | 'num'
  | 'phenotype'
  | 'join'
  | 'humanize' // pretty-print
  | 'humanize_join' // pretty-print and separate items with commas
  | 'count'
  /** Original string contains several terms joined with a "+"; pretty print them and separate them with commas. */
  | 'humanize_terms';

/** Which view a block belongs to; absent = both (the common case). */
export type DisplayBlockView = 'default' | 'show_all';

/**
 * A value built from more than one field. Only `with_score` exists.
 */
export type DisplayCompose = {
  format: 'with_score';
  classification: string;
  score: string;
};

export type DisplayRowSpec = {
  key?: string | null;
  /** Optional only for a row that stacks a list: ClinVar's somatic
   *  classifications sit directly above the table they describe, where their
   *  position says what a repeated label would. */
  label?: string | null;
  from?: string | null; // string formatted as `<plugin>.<field>`
  compose?: DisplayCompose | null;
  format?: DisplayRowFormat | null;
  placeholder?: string | null; // if present, shown in place of an absent row
  help?: string | null; // Help text shown by a QuestionButton beside the label
  help_link?: { href: string; label?: string | null } | null; // A source cited inside that help popup
  /**
   * The form sub-option that this row's value comes from.
   * Is used when user chooses to show all requested annotations,
   * even if some of them do not have any data (which the UI shows as a dash).
   * The value of the `default` field mirrors the form default.
   */
  sub_option?: { id: string; default?: boolean } | null;
  /** A trailing link on the value (a named builder — ProtVar's icon per row). */
  link?: DisplayLinkSpec | null;
  /**
   * Build that link from a sibling field rather than from the value's own text.
   * Example when used: Geno2MP
   */
  link_from?: string | null;
  split?: string | null;
  stars?: string | null; // string referring to a rating scale
  /**
   * An `item` is a row that itself contains a list of rows or cells,
   * stacked as the row's value under a single label.
   */
  item?: DisplayItemSpec | null;
  where?: DisplayWhereSpec | null; // Keep only some members of the list
};

/**
 * How a cell value becomes a link.
 * `external`: a plain link
 *   - `template` is a URL with `{field}` placeholders filled from the item
 *   - `builder` names a frontend link builder for URLs that are not a simple template.
 * `app_popup`: an in-app "View in" popup, always has a named `builder`.
 */
export type DisplayLinkSpec = {
  kind: 'external' | 'app_popup';
  template?: string | null;
  builder?: string | null;
};

/**
 * The `stars` field in this type seems to be mutually exclusive
 * with the `stars_from` / `stars_of` combo.
 * When the plain `stars` field is used, it will be combined
 * with a "from" field, which will point at a field whose value
 * can be used as a key for the rating value.
 * When a `stars_from` field is used, then then `stars_of` field
 * points at a field whose value is a key for rating value.
 * See tests in `resolveValuePiece.test.ts`
 */
export type DisplayValuePiece = {
  from?: string | null;
  label?: string | null;
  format?: DisplayRowFormat | null;
  link?: DisplayLinkSpec | null;
  link_from?: string | null; // Build the link from a *sibling* field rather than from the value's own text
  split?: string | null; // separator in cases of a value string containing several values (e.g.: "+" or "_and_")
  link_prefix?: string | null; // only link a value carrying this prefix, and strip the prefix from the result (e.g. turn "uniprotkb:P37840" from IntAct to "P37840")
  stars?: string | null; // name of the scale within the `rating_scales` dictionary in the payload used for the star rating
  stars_from?: string | null; // name of the field whose value names the scale within the `rating_scales` dictionary
  stars_of?: string | null; // name of the field in rating_scales->ratings that maps to the numeric value of the rating
  /** A template that uses `{field}` notation to inject the value of the field into an output string */
  template?: string | null;
  /**
   * Maps strings to human-readable labels
   * E.g.: in ClinVar, "SomaticClinicalImpact" is mapped to "Somatic Clinical Impact".
   */
  labels?: Record<string, string> | null;
  nowrap?: boolean | null;
};

export type DisplayCellSpec = DisplayValuePiece;

export type DisplayItemLabelSpec = {
  from?: string | null;
  template?: string | null; // interpolates item fields into text (e.g.: "Pocket {pocket_id}")
  format?: DisplayRowFormat | null; // applies to a `from` value
  wrap?: string | null; // surrounds the formatted `from` value with fixed text via a `{}` slot (e.g.: ClinVar's `Submitters reporting "Pathogenic"`)
};

/** One labelled field-row of a list element rendered as a stack of rows. */
export type DisplayItemFieldRowSpec = {
  label: string;
  from: string; // an item field
  format?: DisplayRowFormat | null;
};

/**
 * How one list element renders.
 * - Without `label`, a row of inline cells (e.g. GO id + name)
 * - With `label`, a label/value row whose value is the `cells`
 *   (e.g. ClinVar's per-class counts, ProtVar's pockets).
 * - With `rows` instead of `cells`, a stack of `label: value` field-rows
 *   (NearestExonJB's exon boundaries)
 * NOTE: `cells` and `rows` are mutually exclusive.
 */
export type DisplayItemSpec = {
  label?: DisplayItemLabelSpec | null;
  cells?: DisplayCellSpec[] | null;
  rows?: DisplayItemFieldRowSpec[] | null;
  /** A trailing link on a label/value item's value (ProtVar's per-pocket icon). */
  link?: DisplayLinkSpec | null;
};

/**
 * Keep only the list elements whose `field` equals (or does not equal) a value.
 */
export type DisplayWhereSpec = {
  field: string;
  equals?: string | null;
  not_equals?: string | null;
};

export type DisplayTruncateSpec = { visible_count: number };

export type DisplayWhenSpec = {
  present?: string | null; // only when corresponding field has content
  empty?: string | null; // only when corresponding field is absent (null / '' / empty list)
};

export type DisplaySelectedGate = {
  id: string;
  default?: boolean;
};

/** A fixed set of rows. */
export type DisplayRowsBlockSpec = {
  kind: 'rows';
  heading?: string | null;
  requires?: string | null; // A plugin that must have produced an annotation for the block to render.
  requires_selected?: DisplaySelectedGate | null; // Render only when this sub-option was selected (ClinVar short/structural).
  when?: DisplayWhenSpec | null; // A data condition on top of `requires`
  view?: DisplayBlockView | null; // Restrict to the default view or "Show all" (ProtVar / IntAct).
  rows: DisplayRowSpec[];
};

/** A parenthesised suffix on one row's value, read from a sibling scalar. */
export type DisplayMapRowLabelSuffix = {
  key: string;
  from: string;
};

/**
 * Example: allele frequency populations are a dict whose keys are chosen per submission.
 * So the rows come from a vocabulary the response ships.
 */
export type DisplayMapRowsBlockSpec = {
  kind: 'map_rows';
  heading?: string | null;
  requires?: string | null;
  requires_selected?: DisplaySelectedGate | null;
  when?: DisplayWhenSpec | null;
  view?: DisplayBlockView | null;
  from: string; // formatted as `<plugin>.<field>`, to map where the values come from.
  /**
   * In the context of allele frequency populations,
   * this field indicates where to read the "All" value from.
   * In the allele frequency vocabulary, this corresponds to the empty key ("").
   */
  overall_from?: string | null;
  vocabulary: string; // Which vocabulary provides data for the rows.
  scope: string; // used to filter the relevant vocabulary
  format?: DisplayRowFormat | null;
  label_suffix?: DisplayMapRowLabelSuffix | null;
};

/**
 * A variable-length list: one item (a row of cells, or a label/value row) per
 * element of a list-valued field, optionally truncated behind a show-more
 * toggle.
 */
export type DisplayListBlockSpec = {
  kind: 'list';
  heading?: string | null;
  requires?: string | null;
  requires_selected?: DisplaySelectedGate | null;
  when?: DisplayWhenSpec | null;
  view?: DisplayBlockView | null;
  from: string; // formatted as `<plugin>.<listField>`
  /** Split the items into a headed section per distinct value of an item field
   *  e.g.: GO terms by aspect. */
  group_by?: DisplayGroupBy | null;
  truncate?: DisplayTruncateSpec | null;
  item: DisplayItemSpec;
};

export type DisplayGroupBy = {
  field: string;
  // `labels` renames individual headings where the pipeline's word is not the one to show
  // e.g: "Variation" -> "Variant associated"
  labels?: Record<string, string> | null;
};

export type DisplayColumnItems = DisplayValuePiece & {
  from: string;
  count_from?: string | null; // A companion count rendered after the value, e.g.: "Pathogenic (5)"
  expand?: DisplayColumnExpand | null; // Opens this one line onto its own detail.
};

export type DisplayColumnExpand = {
  from: string;
  cells: DisplayColumnItems[];
  /**
   * Which of the lines to set apart
   * Example when used: ClinVar
   */
  emphasis?: DisplayWhereSpec | null;
};

export type DisplayColumnNote = {
  text: string;
};

export type DisplayTableColumnSpec = DisplayValuePiece & {
  label: string;
  notes?: DisplayColumnNote[] | null; // notes for this table column
  sub_option?: { id: string; default?: boolean } | null; // Present only when its sub-option ran
  items?: DisplayColumnItems | null; // How to render a cell whose value is a list of objects: one line per element
  align?: 'left' | 'right' | null;
  /** When every row shares one value for this column, show it once above the
   * table rather than repeating it down a column — IntAct's affected protein is
   * usually the same for every interaction a variant takes part in. */
  lift_when_invariant?: boolean | null;
  /**
   * Merge this column's cells down
   * Example: MaveDB - a dozen score sets from one experiment share a publication.
   */
  merge_by?: string | null;
};

/** Describes one row of a fixed (matrix) table.
 * The `label` field contains the text that goes in the first column.
 * The `values` array contains a list of strings formatted as `<plugin>.<field>`,
 * each describing where to access the data that goes into the corresponding column. */
export type DisplayTableMatrixRowSpec = {
  label: string;
  values: string[];
};

/**
 * A small table with a header row of column labels.
 * The table can be assembled in one of two ways:
 *
 * - "list mode"
 *   Rows of the table are looked up in `<plugin>.<listField>`,
 *   each column reading that element's `from` item field.
 *   Example: ClinVar's conflicting classifications (Classification | Submitters reporting).
 *
 * - "fixed / matrix mode"
 *   Rows of the table are defined explicitly in the
 *   `rows` field of the payload (each row having a shape of `{label, values}`,
 *   the label filling the first column and each value a `<plugin>.<field>` scalar
 *   under a value column
 *   Example: SpliceAI's splicing events (Splicing event | ΔS | ΔP).
 *
 * The "from" and "rows" fields are mutually exclusive; you should expect either one or the other
 */
export type DisplayTableBlockSpec = {
  kind: 'table';
  heading?: string | null;
  requires?: string | null;
  requires_selected?: DisplaySelectedGate | null;
  when?: DisplayWhenSpec | null;
  view?: DisplayBlockView | null;
  indent?: boolean;
  from?: string | null; // string format: `<plugin>.<listField>`
  columns: DisplayTableColumnSpec[];
  group_by?: DisplayGroupBy | null; // split the rows into a headed table per distinct value
  /**
   * Keep only the rows whose `field` equals `equals`, so two tables
   * can divide one list between them under a single shared heading.
   * Example: the phenotypes option shows variant-associated rows and ClinVar's own rows
   * as two tables under one "Variant associated" group.
   */
  where?: DisplayWhereSpec | null;
  truncate?: DisplayTruncateSpec | null; // show this many rows, and hide the rest behind a show-more toggle
  rows?: DisplayTableMatrixRowSpec[] | null;
};

/**
 * A list of blocks under one optional heading.
 */
export type DisplayGroupBlockSpec = {
  kind: 'group';
  heading?: string | null;
  requires_selected?: DisplaySelectedGate | null;
  when?: DisplayWhenSpec | null;
  view?: DisplayBlockView | null;
  blocks: DisplayBlockSpec[];
};

export type DisplayBlockSpec =
  | DisplayRowsBlockSpec
  | DisplayMapRowsBlockSpec
  | DisplayListBlockSpec
  | DisplayTableBlockSpec
  | DisplayGroupBlockSpec;

export type DisplayOptionSpec = {
  option_id: string;
  heading?: string | null;
  blocks: DisplayBlockSpec[];
};

/**
 * A term -> rating table, drawn as a row of filled and empty stars.
 */
export type DisplayRatingScale = {
  out_of: number;
  ratings: Record<string, number>;
};

export type DisplaySpec = {
  options: DisplayOptionSpec[];
  /** plugin id -> "allele" | "transcript", derived by the backend from `parsing`. */
  plugin_scopes: Record<string, string>;
  rating_scales?: Record<string, DisplayRatingScale>;
};
