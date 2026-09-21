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

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode
} from 'react';

import { renderDisplayOption } from '../vep-results-annotation-detail/displaySpecRenderer';
import type { VocabularyEntry } from '../vep-results-annotation-detail/displaySpecRenderer';
import { subOptionRan as didSubOptionRun } from 'src/content/app/tools/vep/utils/subOptionRan';
import { displayVocabularies } from 'src/content/app/tools/vep/utils/afVocabulary';
import { TruncationGroupContext } from 'src/content/app/tools/vep/components/truncated-list/TruncatedList';

import type {
  VepResultsResponse,
  PredictedMolecularConsequence,
  PredictedTranscriptConsequence,
  AlternativeVariantAllele,
  AfSource
} from 'src/content/app/tools/vep/types/vepResultsResponse';
import type {
  FormPanel,
  FormPanelOption
} from 'src/content/app/tools/vep/types/vepFormConfig';
import type {
  DisplaySpec,
  DisplayOptionSpec,
  DisplayBlockSpec,
  DisplayTableBlockSpec,
  DisplayWhereSpec,
  DisplayCellSpec
} from 'src/content/app/tools/vep/types/vepDisplaySpec';

import styles from './VepResultsFlatTable.module.css';

/**
 * PROTOTYPE — a flat, one-row-per-consequence view of the same results the
 * expandable table shows.
 *
 * Every annotation that would sit in a row's detail panel becomes a column
 * instead, so a whole consequence is readable on one line and the grid can be
 * scanned down a column. The cost is inherent, because the panel is a tree
 * rendered only where there is something to show, so flattening it into
 * columns means every row carries a cell for every option any row might have.
 * The result is wide and mostly empty.
 */

export type FlatRow = {
  variant: VepResultsResponse['variants'][number];
  allele: AlternativeVariantAllele;
  consequence: PredictedMolecularConsequence;
};

/** Every (variant, allele, consequence) triple, in display order. */
export const flattenRows = (
  variants: VepResultsResponse['variants']
): FlatRow[] => {
  const rows: FlatRow[] = [];
  for (const variant of variants) {
    for (const allele of variant.alternative_alleles) {
      for (const consequence of allele.predicted_molecular_consequences) {
        rows.push({ variant, allele, consequence });
      }
    }
  }
  return rows;
};

/**
 * The options that become columns are those this job ran, in the order the
 * pinned panels state. This uses the same selection gate as the detail panel,
 * so the two views never disagree about what was run.
 */
export const columnOptions = (
  panels: FormPanel[] | undefined,
  parameters: Record<string, unknown> | undefined
): { panel: FormPanel; option: FormPanelOption }[] =>
  (panels ?? []).flatMap((panel) =>
    panel.options
      .filter((option) =>
        didSubOptionRun(parameters, option.id, option.default)
      )
      .map((option) => ({ panel, option }))
  );

/**
 * One flat column, holding what to head it with and the option spec that draws
 * it.
 *
 * `renderSpec` is the option pruned to exactly this column's content, so the
 * real renderer still does the formatting, the links and the truncation. This
 * file decides what each column contains, never how it looks.
 */
export type FlatColumn = {
  /** The option's own name, e.g. "Phenotypes". */
  optionLabel: string;
  /** Group headings between the option and the table, e.g. ["Gene associated"]. */
  headingPath: string[];
  /** The table column's label, e.g. "Phenotype". Absent for a whole option. */
  columnLabel?: string;
  /**
   * Identifies the table these columns were split from, so the ones from the
   * same table can be lined back up (see alignSplitColumns). Absent for a
   * column that was never part of a table.
   */
  tableKey?: string;
  renderSpec: DisplayOptionSpec;
  /**
   * A column split out of a `map_rows` block, holding the one vocabulary entry
   * it draws. The renderer is handed a vocabulary narrowed to that entry, so
   * the block draws this population and no other.
   */
  vocabularyEntry?: { name: string; entry: VocabularyEntry };
  /**
   * The column draws a whole table rather than one column split out of one.
   * Its headers name what the values are, so the cell keeps them.
   */
  wholeTable?: boolean;
};

/** The stand-in for an option the spec renderer will not be asked to draw. */
const EMPTY_OPTION: DisplayOptionSpec = { option_id: '', blocks: [] };

/**
 * Line up the columns that came from one table.
 *
 * Splitting a table into a column each hands its rows to separate cells, and a
 * cell only knows its own heights — so a phenotype wrapping to three lines
 * leaves its source stranded beside the wrong one. Inside a single table the
 * browser does this for free; across cells it has to be measured.
 *
 * This runs after layout, on the rendered heights. For each row of the grid,
 * the cells from one table are compared row by row and every one is set to the
 * tallest. Heights are cleared first, so re-running never compounds them.
 */
export const alignSplitColumns = (table: HTMLTableElement | null): void => {
  if (!table) {
    return;
  }

  // Gather first, touching no styles. Each entry is one table's worth of
  // columns on one grid row, held as a list of inner-row lists to be levelled.
  const groups: HTMLTableRowElement[][][] = [];
  for (const gridRow of table.querySelectorAll(':scope > tbody > tr')) {
    const byTable = new Map<string, HTMLTableRowElement[][]>();
    for (const cell of gridRow.querySelectorAll(
      ':scope > td[data-table-key]'
    )) {
      const key = (cell as HTMLElement).dataset.tableKey as string;
      const innerRows = [
        ...cell.querySelectorAll(':scope table > tbody > tr')
      ] as HTMLTableRowElement[];
      if (innerRows.length) {
        byTable.set(key, [...(byTable.get(key) ?? []), innerRows]);
      }
    }
    for (const cells of byTable.values()) {
      if (cells.length > 1) {
        groups.push(cells);
      }
    }
  }

  // Then all the writes, then all the reads, then all the writes. A row at a
  // time instead makes every measurement follow a style change, and each one
  // then forces a layout of a grid thousands of pixels wide. A hundred rows of
  // that was four and a half seconds of blocked main thread; batching the
  // phases makes it two layouts in total.
  for (const cells of groups) {
    for (const rows of cells) {
      for (const row of rows) {
        row.style.height = '';
      }
    }
  }

  const heights = groups.map((cells) => {
    const depth = Math.max(...cells.map((rows) => rows.length));
    return Array.from({ length: depth }, (_unused, index) =>
      Math.max(...cells.map((rows) => rows[index]?.offsetHeight ?? 0))
    );
  });

  groups.forEach((cells, group) => {
    heights[group].forEach((height, index) => {
      for (const rows of cells) {
        if (rows[index]) {
          rows[index].style.height = `${height}px`;
        }
      }
    });
  });
};

/**
 * What a `where` divides on, as a heading, for telling apart two tables that
 * otherwise share one.
 *
 * `equals` names itself. `not_equals` is a complement, and only the data knows
 * what the other side is called, so the one case that arises is stated below.
 * ClinVar splits classification_type into germline and somatic.
 */
const WHERE_COMPLEMENT: Record<string, string> = {
  Germline: 'Somatic'
};

/**
 * What joins a heading path into a key two paths can be compared by. It is a
 * character no heading can contain, so ["A", "B C"] and ["A B", "C"] stay
 * different keys, which a space would quietly make identical.
 */
const PATH_KEY = '\u0000';

export const whereLabel = (
  where: DisplayWhereSpec | null | undefined
): string | undefined => {
  if (where?.equals) {
    return where.equals;
  }
  if (where?.not_equals) {
    return WHERE_COMPLEMENT[where.not_equals] ?? `not ${where.not_equals}`;
  }
  return undefined;
};

/**
 * What to head a column split out of a stacked row's cells.
 *
 * A table column carries its own `label`; a cell of a stacked item does not,
 * because in the panel it is one clause of a sentence rather than a heading
 * over a column of values. So the heading is derived from the field the cell
 * reads, unless the cell carries a `label` prefix, which is already the words
 * its author chose for that value. A `label` on a cell renders as a prefix on the
 * value in the detail panel, so adding one to the spec to serve this view
 * would change the other.
 */
const sentence = (words: string): string =>
  words.charAt(0).toUpperCase() + words.slice(1).replace(/_/g, ' ');

export const cellLabel = (cell: DisplayCellSpec): string | undefined => {
  if (cell.column_label) {
    return cell.column_label;
  }
  if (cell.label) {
    return cell.label;
  }
  return cell.from ? sentence(cell.from) : undefined;
};

/** Every `{field}` a template interpolates, with where it sits in the string. */
const PLACEHOLDER = /\{\w+\}/g;

/**
 * A cell's template with its prose stripped, keeping the span from its first
 * `{field}` to its last and nothing either side.
 *
 * ClinVar's supporting count is written `{supporting}/{submissions}
 * submission(s) contribute to aggregate classification`, which is the right
 * sentence in the panel. In a grid the column header says that, and repeating
 * it in every cell wraps four lines deep. The placeholders are the data and the
 * rest is prose, so `{a} of {b}` keeps its "of" and a single placeholder
 * collapses to that value alone.
 */
export const compactTemplate = (template: string): string => {
  const matches = [...template.matchAll(PLACEHOLDER)];
  if (!matches.length) {
    return template;
  }
  const first = matches[0];
  const last = matches[matches.length - 1];
  return template.slice(first.index, last.index + last[0].length);
};

/** A cell as a grid column shows it. The cell is copied and never mutated,
 *  because the spec is shared with the panel. */
const compactCell = (cell: DisplayCellSpec): DisplayCellSpec =>
  cell.template ? { ...cell, template: compactTemplate(cell.template) } : cell;

/**
 * A `<plugin>.<field>` reference as a heading — "Classification summary" from
 * `clinvar.classification_summary`. This names a stacked row by what it
 * stacks, because the field name is always there and is never the same as a
 * sibling table's column name.
 */
export const fieldLabel = (
  reference: string | null | undefined
): string | undefined => {
  const field = reference?.split('.')[1];
  return field ? sentence(field) : undefined;
};

/**
 * Split an option into one column per table column, named by the group
 * headings above it.
 *
 * An option that draws a table is really several columns. "Phenotypes" holds a
 * Phenotype and a Source under "Gene associated", and the same again under
 * "Variant associated". In a grid that nesting has to become what a grid has,
 * or the cell is a table inside a table. Anything that is not a table stays one
 * column, because there is no inner structure to promote.
 */
export const flatColumnsForOption = (
  specOption: DisplayOptionSpec | undefined,
  optionLabel: string,
  vocabularies: Record<string, VocabularyEntry[]> = {}
): FlatColumn[] => {
  const whole: FlatColumn[] = [
    {
      optionLabel,
      headingPath: [],
      renderSpec: specOption ?? EMPTY_OPTION
    }
  ];
  if (!specOption) {
    return whole;
  }

  // Tables are gathered first and turned into columns after, because whether a
  // table needs its `where` in the heading depends on whether a sibling shares
  // that heading, which is not known until every table has been seen.
  const tables: {
    block: DisplayTableBlockSpec;
    path: string[];
    key: string;
  }[] = [];
  // Rows blocks split too, and more simply, because a row is already one value
  // under one label, so it becomes a column with nothing to align. HGVS is
  // HGVSc and HGVSp, CADD is its PHRED and its RAW.
  const rowColumns: FlatColumn[] = [];
  // The index counts tables rather than deriving a key from the headings,
  // because two tables can sit under one heading, divided only by a `where`,
  // and columns from different tables must not be lined up with each other.
  let tableIndex = 0;
  const walk = (blocks: DisplayBlockSpec[], headings: string[]) => {
    for (const block of blocks) {
      const segment = block.column_label ?? block.heading;
      if (block.kind === 'group') {
        walk(block.blocks, segment ? [...headings, segment] : headings);
      } else if (block.kind === 'table' && block.rows?.length) {
        // A fixed-mode table is a matrix rather than a list, because its
        // columns are headers and the values live on the rows (SpliceAI's
        // splicing events against ΔS and ΔP). Pruning the columns leaves every
        // row carrying all its values, so each "column" would show the whole
        // matrix.
        rowColumns.push({
          optionLabel,
          headingPath: (segment ? [...headings, segment] : headings).filter(
            (heading) => heading !== optionLabel
          ),
          renderSpec: { ...specOption, heading: null, blocks: [block] },
          wholeTable: true
        });
      } else if (block.kind === 'table') {
        const path = (segment ? [...headings, segment] : headings).filter(
          // An option's outermost group often repeats its name, and the header
          // already leads with the option, so this would read "Phenotypes -
          // Phenotypes - Gene associated".
          (heading) => heading !== optionLabel
        );
        tables.push({
          block,
          path,
          key: `${specOption.option_id}#${tableIndex++}`
        });
      } else if (block.kind === 'map_rows') {
        // The rows a `map_rows` block draws are its vocabulary's entries, so
        // its columns are those entries. The job's population list is the
        // fixed set, because a variant carries frequencies only for the
        // populations it was seen in.
        const path = (segment ? [...headings, segment] : headings).filter(
          (heading) => heading !== optionLabel
        );
        for (const entry of vocabularies[block.vocabulary] ?? []) {
          if (entry.scope !== block.scope) {
            continue;
          }
          rowColumns.push({
            optionLabel,
            headingPath: path,
            columnLabel: entry.label,
            renderSpec: {
              ...specOption,
              heading: null,
              blocks: [{ ...block, heading: null }]
            },
            vocabularyEntry: { name: block.vocabulary, entry }
          });
        }
      } else if (block.kind === 'rows' && (block.rows ?? []).length) {
        const path = (segment ? [...headings, segment] : headings).filter(
          (heading) => heading !== optionLabel
        );
        for (const rowSpec of block.rows ?? []) {
          const cells = rowSpec.item?.cells ?? [];
          // A row that stacks several values is a table lying down. ClinVar's
          // classification is a type, a starred term, a review status and a
          // submission count, drawn inline because in the panel they read as
          // one sentence. A grid column is a few characters wide, so that
          // sentence wraps one letter per line. Split it as a table is split.
          if (cells.length > 1) {
            // A row that names itself for a grid says it in one segment. Where
            // it does not, the name is taken from what divides the row and what
            // it stacks, rather than from the row's own label. ClinVar labels
            // the germline summary "Classification" and leaves the somatic one
            // unlabelled, and the records table beneath each has a
            // "Classification" column of its own, so a derived header is what
            // keeps every column distinct from its siblings.
            const stackPath = rowSpec.column_label
              ? [...path, rowSpec.column_label]
              : [
                  ...path,
                  whereLabel(rowSpec.where) ?? rowSpec.label ?? '',
                  fieldLabel(rowSpec.from) ?? ''
                ].filter(Boolean);
            for (const cell of cells) {
              rowColumns.push({
                optionLabel,
                headingPath: stackPath,
                columnLabel: cellLabel(cell),
                // The label moves into the header, so the cell must not draw it
                // again — same reason a split table drops its heading.
                renderSpec: {
                  ...specOption,
                  heading: null,
                  blocks: [
                    {
                      ...block,
                      heading: null,
                      rows: [
                        {
                          ...rowSpec,
                          label: null,
                          item: { ...rowSpec.item, cells: [compactCell(cell)] }
                        }
                      ]
                    }
                  ]
                }
              });
            }
            continue;
          }
          rowColumns.push({
            optionLabel,
            headingPath: path,
            columnLabel: rowSpec.column_label ?? rowSpec.label ?? undefined,
            renderSpec: {
              ...specOption,
              heading: null,
              blocks: [{ ...block, heading: null, rows: [rowSpec] }]
            }
          });
        }
      }
    }
  };
  walk(specOption.blocks, []);

  // Tables sharing a heading are told apart by what divides them. ClinVar
  // files its germline and its somatic classifications through one "ClinVar"
  // heading, separated only by a `where`. The divider is added only where it is
  // needed, because the phenotypes tables already have "Gene associated" and
  // "Variant associated" of their own.
  const sharedHeading = new Set(
    tables
      .map(({ path }) => path.join(PATH_KEY))
      .filter((path, index, paths) => paths.indexOf(path) !== index)
  );

  const tableColumns: FlatColumn[] = tables.flatMap(({ block, path, key }) => {
    const divider = sharedHeading.has(path.join(PATH_KEY))
      ? (block.column_label ?? whereLabel(block.where))
      : undefined;
    const headingPath = divider ? [...path, divider] : path;
    return block.columns.map((column) => ({
      optionLabel,
      headingPath,
      columnLabel: column.column_label ?? column.label ?? undefined,
      tableKey: key,
      // Each column draws the table alone, one column wide and with no option
      // heading, because the headings it sat under are in this column's header
      // now. `where` is untouched, so each column still draws only its own
      // table's rows.
      renderSpec: {
        ...specOption,
        heading: null,
        blocks: [{ ...block, heading: null, columns: [column] }]
      }
    }));
  });

  // Rows come before tables, which is the order the options that have both
  // state them (EVE's own score ahead of its popEVE block).
  const found = [...rowColumns, ...tableColumns];
  return found.length ? found : whole;
};

/**
 * A column's heading lines, below the panel. The first line is the option and
 * the groups it was nested under, and the last is the column's own label.
 *
 * A segment the label already opens with is dropped, because it is being said
 * twice — "HGVS / HGVSc" is just HGVSc. The test is a prefix rather than an
 * equality, since that is the shape these take, and it runs one way only, so
 * "Phenotypes / Phenotype" keeps both because "Phenotype" opening "Phenotypes"
 * is a coincidence of plurals.
 */
export const headingLines = (column: FlatColumn): string[] => {
  const label = column.columnLabel;
  // Only the option's own name is dropped, and only when it is the whole line.
  // A heading is never dropped, because "ClinVar record" opens with "ClinVar"
  // and losing that heading would strand the column from its germline/somatic
  // section.
  const drop =
    label &&
    !column.headingPath.length &&
    label.toLowerCase().startsWith(column.optionLabel.toLowerCase());
  const path = drop ? [] : [column.optionLabel, ...column.headingPath];
  return [path.join(' - '), label ?? ''].filter(Boolean);
};

/**
 * Rows shown at once. The grid's cost is per row times per column, and the
 * column count is fixed by the options chosen, so this is the only dimension
 * left to bound.
 */
export const ROWS_PER_PAGE = 100;

/**
 * The columns identifying the row, before any annotation. They are stated as
 * data with their own widths, so the sticky offsets can be computed rather than
 * written out. Intergenic consequences carry no gene or transcript, so those
 * cells are legitimately blank.
 */
const IDENTITY_COLUMNS: {
  key: string;
  label: string;
  width: number;
  value: (row: FlatRow) => string;
}[] = [
  {
    key: 'variant',
    label: 'Variant',
    width: 130,
    value: (r) => r.variant.name
  },
  {
    key: 'gene',
    label: 'Gene',
    width: 150,
    value: (r) =>
      'gene_symbol' in r.consequence
        ? (r.consequence.gene_symbol ?? r.consequence.gene_stable_id)
        : ''
  },
  {
    key: 'transcript',
    label: 'Transcript',
    width: 150,
    value: (r) => ('stable_id' in r.consequence ? r.consequence.stable_id : '')
  },
  {
    key: 'allele',
    label: 'Alt allele',
    width: 70,
    value: (r) => r.allele.allele_sequence
  },
  {
    key: 'consequence',
    label: 'Consequence',
    width: 200,
    value: (r) =>
      'consequences' in r.consequence
        ? (r.consequence.consequences ?? []).join(', ')
        : ''
  }
];

/**
 * How much of the grid never moves. The mirror scrollbar is inset by this and
 * its range shortened to match, because a scrollbar drawn above columns that
 * cannot scroll offers to move something that will not.
 */
export const IDENTITY_WIDTH = IDENTITY_COLUMNS.reduce(
  (total, column) => total + column.width,
  0
);

/** Cumulative left offset of each identity column, for `position: sticky`. */
const IDENTITY_OFFSETS = IDENTITY_COLUMNS.reduce<number[]>(
  (offsets, column, index) =>
    offsets.concat(
      index === 0 ? 0 : offsets[index - 1] + IDENTITY_COLUMNS[index - 1].width
    ),
  []
);

const VepResultsFlatTable = (props: {
  genomeId: string;
  variants: VepResultsResponse['variants'];
  parameters: Record<string, unknown>;
  panels: FormPanel[] | undefined;
  display: DisplaySpec | null | undefined;
  /** The AF populations this job ran with, which become the vocabulary the
   *  frequency options' `map_rows` blocks draw from. */
  afSources: AfSource[] | undefined;
}) => {
  const { genomeId, variants, parameters, panels, display, afSources } = props;

  const allRows = useMemo(() => flattenRows(variants), [variants]);

  const vocabularies = useMemo(
    () => displayVocabularies(afSources),
    [afSources]
  );

  // Every option this job ran, each split into as many columns as its blocks
  // hold: one per table column, one per stacked cell, one per population. An
  // option whose blocks do not split contributes one column.
  const columns = useMemo(
    () =>
      columnOptions(panels, parameters).flatMap(({ panel, option }) => {
        const built = flatColumnsForOption(
          display?.options.find(
            (candidate) => candidate.option_id === option.id
          ),
          option.label,
          vocabularies
        );
        return built.map((column, index) => ({
          panel,
          option,
          column,
          key: `${panel.id}-${option.id}-${index}`
        }));
      }),
    [panels, parameters, display, vocabularies]
  );

  // A page of rows, inside the page of variants the request already fetched.
  //
  // The two do not line up, and cannot, because the backend pages by variant
  // while a row here is one consequence, and a variant carries anywhere from
  // one to sixty of them. 50 variants came to 936 rows, so "100 per page" in
  // the header buys a grid nine times that size. Paging the rows is what bounds
  // it.
  const [rowPage, setRowPage] = useState(0);
  const lastRowPage = Math.max(
    0,
    Math.ceil(allRows.length / ROWS_PER_PAGE) - 1
  );
  const rowPageStart = Math.min(rowPage, lastRowPage) * ROWS_PER_PAGE;
  const rows = useMemo(
    () => allRows.slice(rowPageStart, rowPageStart + ROWS_PER_PAGE),
    [allRows, rowPageStart]
  );

  const renderCell = useCallback(
    (row: FlatRow, column: FlatColumn): ReactNode => {
      if (!display || !column.renderSpec.option_id) {
        return null;
      }
      return renderDisplayOption({
        option: column.renderSpec,
        spec: display,
        consequence: row.consequence as PredictedTranscriptConsequence,
        allele: row.allele,
        showAll: false,
        subOptionRan: (id: string, defaultValue: boolean) =>
          didSubOptionRun(parameters, id, defaultValue),
        genomeId,
        // The column header already carries the option's title, so the cell
        // must not repeat it. The title is suppressed up front rather than
        // stripped back off afterwards, because only the renderer knows which
        // node the title turned out to be, and that depends on which blocks the
        // data let draw.
        showTitle: false,
        // A column drawn from a `map_rows` block gets the one entry it is for,
        // so the block draws that population alone.
        vocabularies: column.vocabularyEntry
          ? { [column.vocabularyEntry.name]: [column.vocabularyEntry.entry] }
          : vocabularies
      });
    },
    [display, parameters, genomeId, vocabularies]
  );

  // Go back to the first row-page whenever the fetched variants change (paging
  // or filtering the request). The rows are compared against the last set
  // rendered rather than reset from an effect, which is what
  // `react-hooks/set-state-in-effect` objects to. A different set of rows means
  // a different page 1.
  const [renderedRows, setRenderedRows] = useState(allRows);
  if (renderedRows !== allRows) {
    setRenderedRows(allRows);
    setRowPage(0);
  }

  // A second scrollbar above the grid, and drag-to-scroll across it.
  //
  // The grid is several screens wide, so the bar at the bottom is often off
  // screen when the part being read is not. The mirror scrolls nothing itself,
  // because it is a spacer as wide as the table, in a box that scrolls.
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const topBarRef = useRef<HTMLDivElement | null>(null);
  const spacerRef = useRef<HTMLDivElement | null>(null);
  // Setting one scrollLeft fires the other's onScroll, which would set this one
  // back; the flag makes an echo a no-op rather than a loop.
  const echoing = useRef(false);
  const mirrorScroll = (
    from: HTMLDivElement | null,
    to: HTMLDivElement | null
  ) => {
    if (echoing.current || !from || !to) {
      return;
    }
    echoing.current = true;
    to.scrollLeft = from.scrollLeft;
    echoing.current = false;
  };

  // This drags the grid sideways, for a table too wide to reach the ends of.
  // `moved` outlives the drag by one event so the click that follows a drag can
  // be swallowed — otherwise dragging from a link follows it on release.
  const [isDragging, setIsDragging] = useState(false);
  const dragFrom = useRef<{ x: number; scrollLeft: number } | null>(null);
  const moved = useRef(false);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // A drag starts on the left button only, never from something already
    // interactive, and never from the frozen columns, which do not move. Links
    // are a click-only zone, because a cell can hold several, and a link that
    // sometimes follows and sometimes pans is worse than one that always
    // follows. The click-after-drag guard
    // below still matters, because a drag begun on open space can end over a
    // link.
    if (
      event.button !== 0 ||
      (event.target as HTMLElement).closest(
        'a, button, input, select, textarea, [data-frozen]'
      )
    ) {
      return;
    }
    dragFrom.current = {
      x: event.clientX,
      scrollLeft: scrollerRef.current?.scrollLeft ?? 0
    };
    moved.current = false;
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const from = dragFrom.current;
    if (!from || !scrollerRef.current) {
      return;
    }
    const dx = event.clientX - from.x;
    // A few pixels of slack, so a click with an unsteady hand stays a click.
    if (!moved.current && Math.abs(dx) < 4) {
      return;
    }
    moved.current = true;
    setIsDragging(true);
    scrollerRef.current.scrollLeft = from.scrollLeft - dx;
    mirrorScroll(scrollerRef.current, topBarRef.current);
  };

  const endDrag = () => {
    dragFrom.current = null;
    setIsDragging(false);
  };

  // Which split tables are open, as "<grid row>:<table key>".
  //
  // The key is per row as well as per table, because a variant's ClinVar
  // records have nothing to do with the next variant's. The state is held here
  // rather than in each column's own list, because the columns of one table
  // show slices of the same rows and have to open together — see
  // TruncationGroupContext.
  const [expandedGroups, setExpandedGroups] = useState<ReadonlySet<string>>(
    () => new Set()
  );
  const truncationGroup = useCallback(
    (rowIndex: number, tableKey: string | undefined) => {
      if (!tableKey) {
        // This column was not split from anything, so the list keeps its own
        // state, exactly as it does in the detail panel.
        return null;
      }
      const id = `${rowIndex}:${tableKey}`;
      return {
        isExpanded: expandedGroups.has(id),
        toggle: () =>
          setExpandedGroups((open) => {
            const next = new Set(open);
            if (!next.delete(id)) {
              next.add(id);
            }
            return next;
          })
      };
    },
    [expandedGroups]
  );

  // Line the split columns back up once the browser has laid the page out.
  // This runs in `useLayoutEffect`, so the heights are set before the first
  // paint.
  const tableRef = useRef<HTMLTableElement | null>(null);
  useLayoutEffect(() => {
    const sync = () => {
      alignSplitColumns(tableRef.current);
      // The mirror bar scrolls because its spacer is as wide as the table, less
      // the frozen block it is inset by, so the two have the same range.
      if (spacerRef.current && tableRef.current) {
        spacerRef.current.style.width = `${tableRef.current.scrollWidth - IDENTITY_WIDTH}px`;
      }
    };
    sync();

    // Anything that changes the shape of a cell has to re-level the row, and
    // not all of it is visible from here. A collapsed detail (ClinVar's
    // chevrons) is owned by the list that draws it, so opening one changes no
    // state this component can depend on.
    //
    // A mutation observer catches that whatever caused it. It watches
    // `childList` only, because levelling writes `style` attributes and
    // observing those would make this retrigger itself forever. The callback
    // runs at the microtask checkpoint
    // after React has committed, which is before the browser paints, so the
    // reader never sees the misaligned version.
    const observers: { disconnect: () => void }[] = [];
    if (typeof MutationObserver !== 'undefined' && tableRef.current) {
      const observer = new MutationObserver(sync);
      observer.observe(tableRef.current, { childList: true, subtree: true });
      observers.push(observer);
    }
    // A narrower column wraps in a different place, so a resize re-levels too.
    if (typeof ResizeObserver !== 'undefined' && tableRef.current) {
      const observer = new ResizeObserver(sync);
      observer.observe(tableRef.current);
      observers.push(observer);
    }
    return () => observers.forEach((observer) => observer.disconnect());
    // `expandedGroups` is a dependency too, because opening a table changes how
    // tall its rows are and the columns beside it have to be levelled again
    // against the new heights.
  }, [rows, columns, expandedGroups]);

  if (!columns.length) {
    return (
      <p className={styles.empty}>
        This submission ran no annotation options, so there are no columns to
        show.
      </p>
    );
  }

  return (
    <div>
      <div className={styles.rowPager}>
        <button
          type="button"
          className={styles.pagerButton}
          disabled={rowPageStart === 0}
          onClick={() => setRowPage((page) => Math.max(0, page - 1))}
        >
          ‹ Previous
        </button>
        <span className={styles.rowRange}>
          rows {allRows.length ? rowPageStart + 1 : 0}–
          {Math.min(rowPageStart + ROWS_PER_PAGE, allRows.length)} of{' '}
          {allRows.length.toLocaleString()}
          <span className={styles.rowPagerNote}>
            {' '}
            (from {variants.length} variants on this request)
          </span>
        </span>
        <button
          type="button"
          className={styles.pagerButton}
          disabled={rowPageStart + ROWS_PER_PAGE >= allRows.length}
          onClick={() => setRowPage((page) => Math.min(lastRowPage, page + 1))}
        >
          Next ›
        </button>
      </div>
      {/* The mirror bar is kept in step with the real scroller below. */}
      <div
        ref={topBarRef}
        className={styles.topScrollBar}
        style={{ marginLeft: IDENTITY_WIDTH }}
        onScroll={() => mirrorScroll(topBarRef.current, scrollerRef.current)}
      >
        <div ref={spacerRef} className={styles.topScrollSpacer} />
      </div>
      <div
        ref={scrollerRef}
        className={`${styles.scroller} ${isDragging ? styles.dragging : ''}`}
        onScroll={() => mirrorScroll(scrollerRef.current, topBarRef.current)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        // A drag that ends over a link would otherwise follow it on release.
        onClickCapture={(event) => {
          if (moved.current) {
            event.preventDefault();
            event.stopPropagation();
            moved.current = false;
          }
        }}
      >
        <table className={styles.table} ref={tableRef}>
          <thead>
            <tr>
              {IDENTITY_COLUMNS.map((column, index) => (
                <th
                  key={column.key}
                  className={styles.identity}
                  data-frozen=""
                  style={{
                    left: IDENTITY_OFFSETS[index],
                    width: column.width,
                    minWidth: column.width,
                    maxWidth: column.width
                  }}
                >
                  {column.label}
                </th>
              ))}
              {columns.map(({ panel, column, key }) => (
                <th key={key} className={styles.optionHead}>
                  {/* The header narrows over three lines, the panel, then the
                    option and the headings it was nested under, then the table
                    column. Option
                    labels are only unique within their panel ("All", "Score"),
                    and a column label only within its option ("Phenotype",
                    "Source"), so each line needs the one above it. */}
                  <span className={styles.panelName}>{panel.label}</span>
                  {headingLines(column).map((line, index, lines) => (
                    <span
                      key={line}
                      className={
                        index === lines.length - 1
                          ? styles.subColumnName
                          : styles.optionName
                      }
                    >
                      {line}
                    </span>
                  ))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {IDENTITY_COLUMNS.map((column, index) => (
                  <td
                    key={column.key}
                    className={styles.identity}
                    data-frozen=""
                    style={{
                      left: IDENTITY_OFFSETS[index],
                      width: column.width,
                      minWidth: column.width,
                      maxWidth: column.width
                    }}
                    title={column.value(row)}
                  >
                    {column.value(row)}
                  </td>
                ))}
                {columns.map(({ column, key }) => (
                  <td
                    key={key}
                    className={
                      column.wholeTable
                        ? `${styles.cell} ${styles.wholeTable}`
                        : styles.cell
                    }
                    data-table-key={column.tableKey}
                  >
                    <TruncationGroupContext.Provider
                      value={truncationGroup(rowIndex, column.tableKey)}
                    >
                      {renderCell(row, column)}
                    </TruncationGroupContext.Provider>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VepResultsFlatTable;
