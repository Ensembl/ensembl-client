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
   * The form sub-option this row's value comes from.
   * Is used when user chooses to show all requested annotations,
   * even if some of them do not have any data (which the UI shows as a dash).
   * The value of the `default` field mirrors the form default (absent parameter =
   * its default), as for `subOptionRan`.
   */
  sub_option?: { id: string; default?: boolean } | null;
  /** A trailing link on the value (a named builder — ProtVar's icon per row). */
  link?: DisplayLinkSpec | null;
  /**
   * Build that link from a sibling field rather than from the value's own text.
   * Example when used: Geno2MP
   */
  link_from?: string | null;
  stars?: string | null; // string referring to a rating scale
  /**
   * An `item` is a row that itself contains a list of rows or cells,
   * stacked as the row's value under a single label.
   */
  item?: DisplayItemSpec | null;
  /** Keep only some of the stacked list, so one list can be shown in two places. */
  where?: DisplayWhereSpec | null;
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
 * One rendered value, wherever it appears.
 *
 * A cell of a repeated item and a line of a list-valued table cell are the same
 * idea, and they had drifted: `labels` and `template` on one, `count_from` and
 * `split` on the other, a rating named by a field here and stated outright
 * there — differences that came from the order the two grew rather than from
 * anything about the values. A capability belongs to *a value*; what is
 * genuinely particular stays on the subtype.
 *
 * `from` is a field *of the element* (not `plugin.field`); omit it for a scalar
 * list whose elements are the value themselves (phenotype strings).
 */
export type DisplayValuePiece = {
  from?: string | null;
  /** A prefix before the value — OpenTargets' "L2G 0.42", or a ClinVar
   *  submitter's own wording ("filed as ..."). On the shared type because
   *  prefixing is a thing a value does, whichever renderer draws it. */
  label?: string | null;
  format?: DisplayRowFormat | null;
  link?: DisplayLinkSpec | null;
  /** Build the link from a *sibling* field rather than from the value's own
   *  text: the reader sees a condition's name, the href is the URL the parse
   *  resolved for it. */
  link_from?: string | null;
  /** One value packing several, each linked in its own right — a ClinVar
   *  submission cites its publications as one `+`-joined list of PMIDs, and
   *  IntAct joins interaction participants with `_and_`. */
  split?: string | null;
  /** Only link a value carrying this prefix, and strip it before filling the
   *  template: IntAct writes `uniprotkb:P37840` where UniProt's URL wants the
   *  bare accession. A value without the prefix is not an accession, so it
   *  renders as plain text rather than becoming a broken link. */
  link_prefix?: string | null;
  /** A star rating in front of the value, on this named scale... */
  stars?: string | null;
  /**
   * ...or on the scale *named by this field of the element*, so sibling lines
   * can be rated differently: ClinVar reads the same review-status wording one
   * way for a germline classification and another for a somatic one, so which
   * scale applies is data.
   */
  stars_from?: string | null;
  /** Which field the rating is *of*, when not this value itself: the stars lead
   *  the classification but rate the review status behind it. */
  stars_of?: string | null;
  /**
   * The text as a `{field}` template over the element, for a value that only
   * means something said in words ("1/44 submissions contribute to aggregate
   * classification"). `from` still says which field must be present for it to
   * render at all.
   */
  template?: string | null;
  /**
   * Value -> what to show for it. For a value whose wording is the source's
   * rather than a reader's: ClinVar's classification type is the key a join
   * matches on, so it stays "SomaticClinicalImpact" in the data while reading
   * as three words here. An unmapped value keeps the data's own wording.
   */
  labels?: Record<string, string> | null;
  /**
   * Keep the value on one line, so its column is never sized below it. For an
   * identifier: a link's icon and its id are one thing, and a break between
   * them strands the icon on the row above. Opt-in, never a blanket rule for
   * links, because the same table links a condition *name* — prose, which must
   * be free to wrap.
   */
  nowrap?: boolean | null;
};

/** One cell of a repeated list item. Everything a value can do, and nothing
 *  more — its last own field, `label`, moved to the base once an item line
 *  needed one too. */
export type DisplayCellSpec = DisplayValuePiece;

/**
 * The label of a list element rendered as a label/value row. `from` reads one
 * item field (ClinVar's per-class significance); `template` interpolates item
 * fields into text ("Pocket {pocket_id}"); `format` applies to a `from` value;
 * `wrap` surrounds the formatted `from` value with fixed text via a `{}` slot
 * (ClinVar's `Submitters reporting "Pathogenic"`).
 */
export type DisplayItemLabelSpec = {
  from?: string | null;
  template?: string | null;
  format?: DisplayRowFormat | null;
  wrap?: string | null;
};

/** One labelled field-row of a list element rendered as a stack of rows. */
export type DisplayItemFieldRowSpec = {
  label: string;
  from: string; // an item field
  format?: DisplayRowFormat | null;
};

/**
 * How one list element renders. Without `label`, a row of inline cells (GO id +
 * name); with `label`, a label/value row whose value is the `cells` (ClinVar's
 * per-class counts, ProtVar's pockets). With `rows` instead of `cells`, a stack
 * of `label: value` field-rows (NearestExonJB's exon boundaries) — `cells` and
 * `rows` are mutually exclusive.
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
 * `not_equals` is the complement, so a pair of blocks can divide a list
 * exhaustively rather than the second naming the values it wants.
 */
export type DisplayWhereSpec = {
  field: string;
  equals?: string | null;
  not_equals?: string | null;
};

export type DisplayTruncateSpec = { visible_count: number };

/**
 * String values of below fields are formatted as `<plugin>.<field>`,
 * like the value of a row's `from` field.
 */
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
  /** Present -> renderRowBlock (a sub-heading); absent -> renderRowGroup. */
  heading?: string | null;
  /**
   * A plugin that must have produced an annotation at all for the block to
   * render. SpliceAI needs it: its delta rows carry a placeholder, so without
   * it a variant with no SpliceAI annotation would show eight dashes.
   */
  requires?: string | null;
  /** Render only when this sub-option was selected (ClinVar short/structural). */
  requires_selected?: DisplaySelectedGate | null;
  /** A data condition on top of `requires` (ClinVar's bare vs headed shapes). */
  when?: DisplayWhenSpec | null;
  /** Restrict to the default view or "Show all" (ProtVar / IntAct). */
  view?: DisplayBlockView | null;
  rows: DisplayRowSpec[];
};

/** A parenthesised suffix on one row's value, read from a sibling scalar. */
export type DisplayMapRowLabelSuffix = {
  key: string;
  from: string;
};

/**
 * One row per entry of a per-job *vocabulary*, values read from a dict field.
 *
 * Every other block names its fields up front. This one cannot: an allele
 * frequency's populations are a dict whose keys are chosen per submission, and
 * whose human labels are decoded by the backend rather than carried in the
 * annotation. So the rows come from a vocabulary the response ships — see
 * `renderDisplayOption`'s `vocabularies` — gated to what the job selected.
 *
 * Taking the rows from the vocabulary rather than the data is what makes both
 * views work with no second code path: the default view drops a population the
 * variant has no value for, and "Show all" lists every selected population with
 * a dash where there is none. That is the `sub_option` row rule applied to a row
 * set that is discovered instead of written down.
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
   * The scalar the vocabulary's "" entry reads. A source's all-ancestry figure
   * sits beside the population dict rather than inside it, so without this the
   * "All" row would have nowhere to read from.
   */
  overall_from?: string | null;
  /** Which shipped vocabulary supplies the rows. */
  vocabulary: string;
  /** Which slice of it — one AF vocabulary covers every source at once. */
  scope: string;
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
  /** `<plugin>.<listField>` — the list the items come from. */
  from: string;
  /** Split the items into a headed section per distinct value of an item field
   *  (GO terms by aspect). `truncate` then applies per section. */
  group_by?: DisplayGroupBy | null;
  truncate?: DisplayTruncateSpec | null;
  item: DisplayItemSpec;
};

/**
 * Sub-sections driven by the data: one per distinct value of `field`, in
 * first-seen order, each headed by the value itself — so a value the pipeline
 * starts emitting shows up without a spec change. `labels` renames individual
 * headings where the pipeline's word is not the one to show ("Variation" ->
 * "Variant associated"); an unmapped value keeps the data's own wording.
 */
export type DisplayGroupBy = {
  field: string;
  labels?: Record<string, string> | null;
};

/** One line of a list-valued cell: `from` names the element field to show,
 * `count_from` a companion count rendered in brackets, and `link`/`link_from`
 * work as on the column itself. */
export type DisplayColumnItems = DisplayValuePiece & {
  /** Required here, unlike on a cell: a line of a list of *objects* has to say
   *  which field of them it shows. */
  from: string;
  /** A companion count rendered after the value: "Pathogenic (5)". */
  count_from?: string | null;
  /** Opens this one line onto its own detail. */
  expand?: DisplayColumnExpand | null;
};

/** A summary line's collapsed detail. `from` is read from the same element the
 *  line came from — a cell of several summaries opens one at a time — and
 *  `cells` are the fields shown for each element of it. */
export type DisplayColumnExpand = {
  from: string;
  cells: DisplayColumnItems[];
  /**
   * Which of these lines to set apart. The detail is a long list of much the
   * same thing and only some of it bears on the classification above: a ClinVar
   * submission that counts toward the aggregate reads at full weight, one that
   * does not stays quiet rather than being hidden — it is still a real
   * submission somebody made. Tested by value, not truthiness, because the flag
   * is a code and "0" is a perfectly true-looking string.
   */
  emphasis?: DisplayWhereSpec | null;
};

/**
 * A further line of a column's heading. A column that needs explaining ends up
 * with a heading longer than the values beneath it, and as one string it wrapped
 * wherever the width ran out. `muted` sets a line in the same quiet text as the
 * thing it describes, so the heading demonstrates its own convention.
 */
export type DisplayColumnNote = {
  text: string;
  muted?: boolean;
};

/** One column of a `table` block: a header `label`. In list mode the value
 * comes from the list element's `from`; in fixed mode the columns are headers
 * only (the value columns' `format` applies to each row's `values`). */
/**
 * One column of a table block: a heading over a rendered value.
 *
 * A column *is* a value, so it is a `DisplayValuePiece`. What stays here is
 * what a column has and a value does not — a heading, and how the column
 * behaves within its table.
 */
export type DisplayTableColumnSpec = DisplayValuePiece & {
  label: string;
  /** Further heading lines beneath the label. */
  notes?: DisplayColumnNote[] | null;
  /** Present only when its sub-option ran, so a table's width follows what the
   * user selected. Same gate the rows use. */
  sub_option?: { id: string; default?: boolean } | null;
  /** How to render a cell whose value is a list of objects: one line per
   *  element. `count_from` renders a companion count in brackets. */
  items?: DisplayColumnItems | null;
  /**
   * Which way the column's values and header align. Normally absent: the house
   * rule derives it from the data type, so a numeric `format` reads right and
   * everything else reads left. It is stated only where the format cannot say
   * so — a number the source publishes pre-formatted as a string, like
   * OpenTargets' p-value.
   */
  align?: 'left' | 'right' | null;
  /** When every row shares one value for this column, show it once above the
   * table rather than repeating it down a column — IntAct's affected protein is
   * usually the same for every interaction a variant takes part in. It stays a
   * column the moment the value differs anywhere. */
  lift_when_invariant?: boolean | null;
  /**
   * Merge this column's cells down: one cell per run of consecutive rows
   * sharing the value of the named *element* field, spanning that run.
   *
   * The per-group sibling of `lift_when_invariant` — that lifts a value out of
   * the table when every row agrees, this keeps it in but draws it once per
   * group, for a value belonging to something coarser than a row. MaveDB: a
   * dozen score sets from one experiment share a publication.
   *
   * The merged cell shows the group's first *stated* value, because the source
   * populates the field on only some rows of a group; and a group whose stated
   * values disagree is not merged at all.
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
