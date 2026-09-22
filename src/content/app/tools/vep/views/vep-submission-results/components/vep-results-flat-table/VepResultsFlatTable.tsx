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

/** PROTOTYPE — this view flattens the results to one row per consequence. */

export type FlatRow = {
  variant: VepResultsResponse['variants'][number];
  allele: AlternativeVariantAllele;
  consequence: PredictedMolecularConsequence;
};

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
 * Returns the options this job ran, in the pinned panels' order. It uses the
 * detail panel's gate, so both views agree on what ran.
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

/** One grid column, with its header parts and the spec that draws it. */
export type FlatColumn = {
  /** The option's own name, e.g. "Phenotypes". */
  optionLabel: string;
  /** Group headings under the option, e.g. ["Gene associated"]. */
  headingPath: string[];
  /** The table column's label, e.g. "Phenotype". Absent for a whole option. */
  columnLabel?: string;
  /**
   * Keys the table this column was split from, so that table's columns stay
   * aligned and expand together.
   */
  tableKey?: string;
  /**
   * The option pruned to this column's content. The shared renderer draws it,
   * so this file decides what a column holds but not how it looks.
   */
  renderSpec: DisplayOptionSpec;
  /**
   * Holds the one vocabulary entry a `map_rows` column draws. The renderer
   * gets only that entry, so the column shows one population.
   */
  vocabularyEntry?: { name: string; entry: VocabularyEntry };
  /** The column draws a whole table, headers included. */
  wholeTable?: boolean;
};

/** Stands in for a missing spec. It has no blocks, so the cell stays blank. */
const EMPTY_OPTION: DisplayOptionSpec = { option_id: '', blocks: [] };

/**
 * Lines up the inner rows of columns split from one table. Each split column
 * is its own cell, so a phenotype that wraps to three lines would leave its
 * source beside the wrong row. After layout, each inner row is set to the
 * height of the tallest matching row. Heights are cleared first, so re-running
 * does not compound them.
 */
export const alignSplitColumns = (table: HTMLTableElement | null): void => {
  if (!table) {
    return;
  }

  // Each group holds one table's cells on one grid row, and each cell is a
  // list of its inner rows.
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

  // Clear every height, read every height, then set every height. Mixing reads
  // and writes forces a layout of the whole wide grid per row, which blocks the
  // main thread for seconds on a page of rows. Batching costs two layouts.
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
 * Maps a `not_equals` value to a heading for the other side, which the spec
 * does not name. ClinVar's germline and somatic split is the only case.
 */
const WHERE_COMPLEMENT: Record<string, string> = {
  Germline: 'Somatic'
};

/**
 * Joins a heading path into a comparable key. No heading contains it, so
 * ["A", "B C"] and ["A B", "C"] give different keys.
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

const sentence = (words: string): string =>
  words.charAt(0).toUpperCase() + words.slice(1).replace(/_/g, ' ');

/**
 * Returns the header for a column split from a stacked row. It prefers the
 * cell's `column_label`, then its `label`, then its field name. A cell's
 * `label` prefixes its value in the panel, so a name meant only for the grid
 * goes in `column_label`.
 */
export const cellLabel = (cell: DisplayCellSpec): string | undefined => {
  if (cell.column_label) {
    return cell.column_label;
  }
  if (cell.label) {
    return cell.label;
  }
  return cell.from ? sentence(cell.from) : undefined;
};

const PLACEHOLDER = /\{\w+\}/g;

/**
 * Trims a template to the span from its first `{field}` to its last, because
 * the column header already carries the prose. ClinVar's
 * "{supporting}/{submissions} submission(s) contribute to aggregate
 * classification" shows as "{supporting}/{submissions}".
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

/** Never mutates the cell, because the panel shares the spec. */
const compactCell = (cell: DisplayCellSpec): DisplayCellSpec =>
  cell.template ? { ...cell, template: compactTemplate(cell.template) } : cell;

/**
 * Turns `clinvar.classification_summary` into "Classification summary". A
 * stacked row is named by its field, because every row has one and no sibling
 * table column shares it.
 */
export const fieldLabel = (
  reference: string | null | undefined
): string | undefined => {
  const field = reference?.split('.')[1];
  return field ? sentence(field) : undefined;
};

/**
 * Splits an option into grid columns, each headed by the groups above it, so
 * no cell holds a table inside a table. "Phenotypes" becomes a Phenotype and a
 * Source column under "Gene associated", and the same under "Variant
 * associated". An option with nothing to split stays one column.
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

  // Tables become columns after the walk, because a table needs its `where` in
  // its heading only when a sibling shares that heading.
  const tables: {
    block: DisplayTableBlockSpec;
    path: string[];
    key: string;
  }[] = [];
  // Everything except a split table lands here, because only split tables
  // need aligning. A `rows` block gives a column per row, so HGVS gives HGVSc
  // and HGVSp, and CADD gives PHRED and RAW.
  const rowColumns: FlatColumn[] = [];
  // Table keys count tables, because two tables can share a heading and differ
  // only by `where`. Their columns must not be aligned together.
  let tableIndex = 0;
  const walk = (blocks: DisplayBlockSpec[], headings: string[]) => {
    for (const block of blocks) {
      const segment = block.column_label ?? block.heading;
      if (block.kind === 'group') {
        walk(block.blocks, segment ? [...headings, segment] : headings);
      } else if (block.kind === 'table' && block.rows?.length) {
        // A fixed-mode table is a matrix, such as SpliceAI's events against ΔS
        // and ΔP. Its values live on the rows, so pruning its columns splits
        // nothing, and it stays one whole column.
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
          // The header already leads with the option, so drop a group that
          // repeats its name.
          (heading) => heading !== optionLabel
        );
        tables.push({
          block,
          path,
          key: `${specOption.option_id}#${tableIndex++}`
        });
      } else if (block.kind === 'map_rows') {
        // Each vocabulary entry in the block's scope becomes a column. The
        // job's population list sets the columns, because a variant has
        // frequencies only for the populations it was seen in.
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
          // A row that stacks several values splits into a column per value.
          // ClinVar's classification reads as one sentence in the panel, but a
          // narrow grid column would wrap it one letter per line.
          if (cells.length > 1) {
            // Without a `column_label`, the header comes from the row's
            // `where`, or from its label when the row has no `where`, and then
            // its field. ClinVar labels its germline row "Classification" and
            // leaves the somatic row unlabelled, so the `where` gives both rows
            // matching names.
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
                // The label is in the header, so the cell must not draw it too.
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

  // Tables that share a heading add a divider from their `column_label` or
  // `where`, as ClinVar's germline and somatic tables do. Tables with their own
  // headings get none.
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
      // The column draws its table one column wide and without a heading,
      // because the header carries the headings. Keeping `where` limits it to
      // its own table's rows.
      renderSpec: {
        ...specOption,
        heading: null,
        blocks: [{ ...block, heading: null, columns: [column] }]
      }
    }));
  });

  // Rows go before tables, as options with both order them. EVE puts its own
  // score ahead of its popEVE block.
  const found = [...rowColumns, ...tableColumns];
  return found.length ? found : whole;
};

/**
 * Returns the header lines under a column's panel name. The first is the
 * option and its groups, and the last is the column's own label.
 *
 * The first line is dropped when it holds only the option and the label opens
 * with it, so "HGVS / HGVSc" reads as HGVSc. A first line with headings stays,
 * because the headings name the column's section (ClinVar's germline or
 * somatic). The label must open with the option, so "Phenotypes / Phenotype"
 * keeps both.
 */
export const headingLines = (column: FlatColumn): string[] => {
  const label = column.columnLabel;
  const drop =
    label &&
    !column.headingPath.length &&
    label.toLowerCase().startsWith(column.optionLabel.toLowerCase());
  const path = drop ? [] : [column.optionLabel, ...column.headingPath];
  return [path.join(' - '), label ?? ''].filter(Boolean);
};

/**
 * The grid's cost is rows times columns. The chosen options fix the columns, so
 * paging bounds the rows.
 */
export const ROWS_PER_PAGE = 100;

/**
 * These frozen columns identify the row. Each states its width, so the sticky
 * offsets can be computed. Intergenic consequences have no gene or transcript,
 * so those cells stay blank.
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
 * The top scrollbar is inset by the frozen columns' width, so it spans only
 * the columns that scroll.
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
  /** The job's AF populations, which frequency `map_rows` blocks draw from. */
  afSources: AfSource[] | undefined;
}) => {
  const { genomeId, variants, parameters, panels, display, afSources } = props;

  const allRows = useMemo(() => flattenRows(variants), [variants]);

  const vocabularies = useMemo(
    () => displayVocabularies(afSources),
    [afSources]
  );

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

  // Rows are paged inside the page of variants already fetched. The backend
  // pages by variant, and one variant can have dozens of consequences, so only
  // paging the rows bounds the grid.
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
        // The header already shows the option's title. The renderer is told to
        // skip it, because only the renderer knows which node the title is.
        showTitle: false,
        // A `map_rows` column gets a vocabulary of just its own population.
        vocabularies: column.vocabularyEntry
          ? { [column.vocabularyEntry.name]: [column.vocabularyEntry.entry] }
          : vocabularies
      });
    },
    [display, parameters, genomeId, vocabularies]
  );

  // Return to the first row page when the fetched variants change. This
  // compares against the last rows rendered instead of resetting in an effect,
  // which `react-hooks/set-state-in-effect` forbids.
  const [renderedRows, setRenderedRows] = useState(allRows);
  const [rowsVersion, setRowsVersion] = useState(0);
  if (renderedRows !== allRows) {
    setRenderedRows(allRows);
    setRowsVersion((version) => version + 1);
    setRowPage(0);
  }

  // Names the rows on screen. Rows and open tables are keyed by it, so a new
  // row page or new results start with everything collapsed.
  const slice = `${rowsVersion}:${rowPageStart}`;

  // The grid's own scrollbar is at the bottom and often off screen, so a second
  // one runs above the grid. The top bar scrolls a spacer as wide as the table,
  // and mirrorScroll keeps the two in step.
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const topBarRef = useRef<HTMLDivElement | null>(null);
  const spacerRef = useRef<HTMLDivElement | null>(null);
  // Setting one bar's scrollLeft fires the other's onScroll. The flag stops
  // that echo from looping back.
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

  // Drag-to-scroll pans the grid sideways. `moved` stays set after a drag, so
  // the click that ends it can be swallowed.
  const [isDragging, setIsDragging] = useState(false);
  const dragFrom = useRef<{ x: number; scrollLeft: number } | null>(null);
  const moved = useRef(false);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // Drags start only with the left button, and never on a control, a link
    // or a frozen column. Links stay click-only, because a link that sometimes
    // pans is worse than one that always follows.
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
    // Allow a few pixels of slack, so an unsteady click stays a click.
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

  // Holds the open split tables, as "<grid row>:<table key>", for the slice
  // they were opened on. The state lives here because one table's columns
  // show parts of the same rows and must open together (see
  // TruncationGroupContext).
  const [openTables, setOpenTables] = useState<{
    slice: string;
    ids: ReadonlySet<string>;
  }>(() => ({ slice, ids: new Set() }));
  const expandedGroups = useMemo(
    () => (openTables.slice === slice ? openTables.ids : new Set<string>()),
    [openTables, slice]
  );
  const truncationGroup = useCallback(
    (rowIndex: number, tableKey: string | undefined) => {
      if (!tableKey) {
        // An unsplit column's list keeps its own state, as in the detail panel.
        return null;
      }
      const id = `${rowIndex}:${tableKey}`;
      return {
        isExpanded: expandedGroups.has(id),
        toggle: () =>
          setOpenTables((open) => {
            const ids = new Set(open.slice === slice ? open.ids : []);
            if (!ids.delete(id)) {
              ids.add(id);
            }
            return { slice, ids };
          })
      };
    },
    [expandedGroups, slice]
  );

  // Align the split columns and size the top scrollbar. A layout effect does
  // this before paint, so the reader never sees them misaligned.
  const tableRef = useRef<HTMLTableElement | null>(null);
  useLayoutEffect(() => {
    const sync = () => {
      alignSplitColumns(tableRef.current);
      // The spacer matches the table's scroll width, less the frozen columns,
      // so both bars have the same range.
      if (spacerRef.current && tableRef.current) {
        spacerRef.current.style.width = `${tableRef.current.scrollWidth - IDENTITY_WIDTH}px`;
      }
    };
    sync();

    // A mutation observer re-aligns rows after changes this component cannot
    // see, such as opening a collapsed ClinVar detail, whose state lives in its
    // list. It watches `childList` only, because aligning writes `style`
    // attributes and watching those would retrigger it forever. Its callback
    // runs before paint, so no misalignment shows.
    const observers: { disconnect: () => void }[] = [];
    if (typeof MutationObserver !== 'undefined' && tableRef.current) {
      const observer = new MutationObserver(sync);
      observer.observe(tableRef.current, { childList: true, subtree: true });
      observers.push(observer);
    }
    // Resizing changes where text wraps, so a resize re-aligns too.
    if (typeof ResizeObserver !== 'undefined' && tableRef.current) {
      const observer = new ResizeObserver(sync);
      observer.observe(tableRef.current);
      observers.push(observer);
    }
    return () => observers.forEach((observer) => observer.disconnect());
    // `expandedGroups` is listed because opening a table changes row heights.
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
                  {/* The header stacks the panel, the option with its headings,
                    and the column, because an option label is unique only
                    within its panel ("Score") and a column label only within
                    its option ("Source"). */}
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
              <tr key={`${slice}:${rowIndex}`}>
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
