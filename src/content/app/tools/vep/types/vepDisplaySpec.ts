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

/**
 * The wire shape of the annotation spec's `display` section, served on the
 * results response (`metadata.display`) from the spec pinned to the job.
 *
 * It says how each option's parsed annotation is laid out — the labels, order,
 * headings, formats and placeholders that used to be a `case` body per option
 * in VepResultsAnnotationDetail. Every field maps 1:1 onto the row primitives in
 * `annotationRows.tsx`; nothing here describes rendering those cannot already
 * do.
 *
 * Options whose output is interactive or derived (ClinVar, OpenTargets,
 * ProtVar, …) are deliberately not expressible and stay as frontend overrides.
 */

/** Mirrors `RowFormat` in annotationRows.tsx. */
export type DisplayRowFormat =
  | 'text'
  | 'num'
  | 'humanize'
  | 'phenotype'
  | 'join'
  | 'humanize_join'
  | 'count';

/** Which view a block belongs to; absent = both (the common case). */
export type DisplayBlockView = 'default' | 'show_all';

/**
 * A value built from more than one field. Only `with_score` exists: the
 * `withScore` formatter, from a classification plus its score.
 */
export type DisplayCompose = {
  format: 'with_score';
  classification: string;
  score: string;
};

export type DisplayRowSpec = {
  key?: string | null;
  label: string;
  /**
   * `<plugin>.<field>` into the parsing spec. Which entity the plugin is read
   * from is *not* stated here — that is the parser's `scope`, and arrives
   * separately as `plugin_scopes`.
   */
  from?: string | null;
  compose?: DisplayCompose | null;
  format?: DisplayRowFormat | null;
  mono?: boolean | null;
  /** Unset drops an absent row; set keeps it and shows this. */
  placeholder?: string | null;
  /** Help text for a (?) button beside the label. */
  help?: string | null;
  /**
   * A source cited inside that help popup — popEVE's threshold is the authors'
   * recommendation, so the help says where to read it. Not a `DisplayLinkSpec`:
   * those build a URL per row from the annotation's own values, while this is
   * one fixed reference belonging to the help text. `label` is the anchor text.
   * Shaped like the form side's `OptionHelpLink` (`href`, not `url`) so the two
   * help systems converge rather than growing a second name for one thing.
   */
  help_link?: { href: string; label?: string | null } | null;
  /**
   * The form sub-option this row's value comes from. Only affects "Show all":
   * a selected-but-empty sub-option shows a dash there; the default view still
   * drops the empty row. `default` mirrors the form default (absent parameter =
   * its default), as for `subOptionRan`.
   */
  sub_option?: { id: string; default?: boolean } | null;
  /** A trailing link on the value (a named builder — ProtVar's icon per row). */
  link?: DisplayLinkSpec | null;
};

/**
 * How a cell value becomes a link. `external` -> a plain anchor: `template` is a
 * URL with `{field}` placeholders filled from the item, or `builder` names a
 * frontend link builder for URLs that are not a simple template. `app_popup` ->
 * an in-app "View in" popup, always a named `builder`.
 */
export type DisplayLinkSpec = {
  kind: 'external' | 'app_popup';
  template?: string | null;
  builder?: string | null;
};

/**
 * One cell of a repeated list item. `from` is a field *of the list element* (not
 * `plugin.field`); omit it for a scalar list whose elements are the value
 * themselves (phenotype strings).
 */
export type DisplayCellSpec = {
  label?: string | null;
  from?: string | null;
  format?: DisplayRowFormat | null;
  mono?: boolean | null;
  link?: DisplayLinkSpec | null;
};

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

export type DisplayTruncateSpec = { visible_count: number };

/**
 * A condition gating whether a block renders. `present` -> only when the field
 * has content; `empty` -> only when it is absent (null / '' / empty list). The
 * field is a `<plugin>.<field>` reference like a row's `from`.
 */
export type DisplayWhenSpec = {
  present?: string | null;
  empty?: string | null;
};

/**
 * Gate a block on whether a form option/sub-option was *selected* for the job
 * (as opposed to `when`/`requires`, which test the annotation data). ClinVar's
 * master renders its short and structural blocks under one option, so each gates
 * on its own sub-option — dev-data VCFs carry columns the user didn't pick, so
 * gating on data alone would leak the unselected variant kind into the view.
 * `default` is the sub-option's default (an option left at its default isn't
 * written to the submitted parameters).
 */
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

/** One column of a `table` block: a header `label`. In list mode the value
 * comes from the list element's `from`; in fixed mode the columns are headers
 * only (the value columns' `format` applies to each row's `values`). */
export type DisplayTableColumnSpec = {
  label: string;
  from?: string | null;
  format?: DisplayRowFormat | null;
  mono?: boolean;
  /**
   * Which way the column's values and header align. Normally absent: the house
   * rule derives it from the data type, so a numeric `format` reads right and
   * everything else reads left. It is stated only where the format cannot say so
   * — a number the source publishes pre-formatted as a string, like
   * OpenTargets' p-value.
   */
  align?: 'left' | 'right' | null;
  /** Present only when its sub-option ran, so a table's width follows what the
   * user selected. Same gate the rows use. */
  sub_option?: { id: string; default?: boolean } | null;
  /** Links the cell value out, `{value}` being the cell's own text (after
   * `split` and `link_prefix` have been applied). */
  link?: DisplayLinkSpec | null;
  /** Some sources pack several values into one column — IntAct joins
   * interaction participants with `_and_`. Splitting renders them as separate
   * items, each linked in its own right. */
  split?: string | null;
  /** Only link a value carrying this prefix, and strip it before filling the
   * template: IntAct writes `uniprotkb:P37840` where UniProt's URL wants the
   * bare accession. A value without the prefix is not an accession, so it
   * renders as plain text rather than becoming a broken link. */
  link_prefix?: string | null;
  /** When every row shares one value for this column, show it once above the
   * table rather than repeating it down a column — IntAct's affected protein is
   * usually the same for every interaction a variant takes part in. It stays a
   * column the moment the value differs anywhere. */
  lift_when_invariant?: boolean;
};

/** One row of a fixed (matrix) table: a text `label` for the first column, then
 * a `<plugin>.<field>` scalar ref per value column. */
export type DisplayTableMatrixRowSpec = {
  label: string;
  values: string[];
};

/**
 * A small table with a header row of column labels. Either list mode (`from`:
 * one row per element of a list field, columns reading item fields — ClinVar's
 * Classification | Submitters reporting) or fixed mode (`rows`: explicit `{label,
 * values}` rows, label in the first column and each value a scalar under a value
 * column — SpliceAI's Splicing event | ΔS | ΔP). Exactly one of `from`/`rows`.
 */
export type DisplayTableBlockSpec = {
  kind: 'table';
  heading?: string | null;
  requires?: string | null;
  requires_selected?: DisplaySelectedGate | null;
  when?: DisplayWhenSpec | null;
  view?: DisplayBlockView | null;
  /** Sit one indent step in, as if under a heading — for an unheaded table
   *  standing beside headed siblings (the ClinVar phenotype table beside the
   *  "Gene associated" / "Variant associated" ones). */
  indent?: boolean;
  /** list mode: `<plugin>.<listField>` — the list the rows come from. */
  from?: string | null;
  columns: DisplayTableColumnSpec[];
  /** list mode: split the rows into a headed table per distinct value. */
  group_by?: DisplayGroupBy | null;
  /**
   * list mode: keep only the rows whose `field` equals `equals`, so two tables
   * can divide one list between them under a single shared heading — the
   * phenotypes option shows variant-associated rows and ClinVar's own rows as
   * two tables under one "Variant associated" group. `group_by` cannot do that:
   * it builds a heading per table, so a second table repeats the heading rather
   * than joining it.
   */
  where?: {
    field: string;
    equals?: string | null;
    not_equals?: string | null;
  } | null;
  /** list mode: show this many rows, the rest behind a show-more toggle (per
   *  section when grouped). */
  truncate?: DisplayTruncateSpec | null;
  /** fixed mode: explicit rows. */
  rows?: DisplayTableMatrixRowSpec[] | null;
};

/**
 * A run of sub-blocks under one optional heading, gated as a whole by `when`.
 * Lets a heading span more than one block conditionally (ClinVar's conflicting
 * case: a "Classification" row plus a breakdown table under one heading).
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
  | DisplayListBlockSpec
  | DisplayTableBlockSpec
  | DisplayGroupBlockSpec;

export type DisplayOptionSpec = {
  option_id: string;
  /**
   * An option-level heading wrapping all the option's blocks in one OptionBlock,
   * shown whenever the option renders anything — for output that spans more than
   * one block under a single heading (MaveDB's Variant row + assays list).
   */
  heading?: string | null;
  /** A sequence: `eve` is a bare EVE row plus a sibling popEVE block. */
  blocks: DisplayBlockSpec[];
};

export type DisplaySpec = {
  options: DisplayOptionSpec[];
  /** plugin id -> "allele" | "transcript", derived by the backend from `parsing`. */
  plugin_scopes: Record<string, string>;
};
