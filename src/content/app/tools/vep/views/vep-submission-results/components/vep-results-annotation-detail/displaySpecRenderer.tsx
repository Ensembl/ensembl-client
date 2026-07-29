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

import { Fragment, type ReactNode } from 'react';

import QuestionButton from 'src/shared/components/question-button/QuestionButton';
import TruncatedList from 'src/content/app/tools/vep/components/truncated-list/TruncatedList';
import ExternalLinkIcon from 'src/content/app/tools/vep/components/external-link-icon/ExternalLinkIcon';
import ViewInAppPopup from 'src/shared/components/view-in-app-popup/ViewInAppPopup';

import {
  renderRowGroup,
  renderRowBlock,
  formatValue,
  isAbsent,
  withOptionHelp,
  Row,
  OptionBlock,
  type RowSpec
} from './annotationRows';

import { withScore } from 'src/content/app/tools/vep/utils/annotationFormatters';
import { proteinFeatureExplorerUrl } from 'src/content/app/tools/vep/utils/featureExplorerUrls';
import type { PredictedTranscriptConsequence } from 'src/content/app/tools/vep/types/vepResultsResponse';
import type { OptionHelp } from 'src/content/app/tools/vep/types/vepFormConfig';
import {
  getAnnotation,
  type AnnotatedEntity,
  type PluginId
} from 'src/content/app/tools/vep/utils/annotations';
import type {
  DisplayBlockSpec,
  DisplayCellSpec,
  DisplayCompose,
  DisplayItemLabelSpec,
  DisplayItemSpec,
  DisplayLinkSpec,
  DisplayListBlockSpec,
  DisplayOptionSpec,
  DisplayRowSpec,
  DisplaySpec,
  DisplayTableBlockSpec,
  DisplayTableColumnSpec,
  DisplayWhenSpec
} from 'src/content/app/tools/vep/types/vepDisplaySpec';

import styles from './VepResultsAnnotationDetail.module.css';

/**
 * The generic renderer for spec-driven options.
 *
 * The annotation spec's `display` section describes an option's output as
 * blocks of label/value rows; this walks that description and hands it to the
 * same row primitives the hand-written cases used, so the output is identical
 * to the twelve `case` bodies it replaces.
 *
 * The only thing it needs beyond the spec is where to read each plugin from:
 * `plugin_scopes` (derived by the backend from the parsing spec) says whether a
 * plugin hangs off the allele or the transcript consequence.
 */

/**
 * What a named link builder needs beyond the annotation field: the job's genome
 * and the ProtVar URL (algorithmic, precomputed upstream), plus the consequence
 * for a builder that needs the gene (the protein "View in" popup).
 */
export type LinkBuilderContext = {
  genomeId: string;
  protvarUrl?: string;
  consequence: AnnotatedEntity | null | undefined;
  /**
   * This variant in OpenTargets' own notation — `1_230710048_A_G`, i.e.
   * chromosome_position_reference_alternate. Built upstream from the variant
   * and allele (see VepSubmissionResults) because it comes from the results
   * row rather than from anything a plugin parsed, so no `<plugin>.<field>`
   * can name it.
   */
  openTargetsVariantId?: string;
};

type Entities = {
  consequence: AnnotatedEntity | null | undefined;
  allele: AnnotatedEntity | null | undefined;
  // "Show all" reveals the sub-option rows; `subOptionRan` (default-aware) says
  // whether a form sub-option was selected for this submission.
  showAll: boolean;
  subOptionRan: (optionId: string, defaultValue: boolean) => boolean;
  // For named link builders referenced by a row/item `link.builder`.
  linkContext: LinkBuilderContext;
  /**
   * The option's own help, shown as a (?) beside whatever ends up being its
   * top-level heading in the results — the same text the form shows for that
   * option, so the two can never disagree.
   *
   * Which node that is cannot be known up front: an option may carry its own
   * heading (ProtVar), or take it from its first block (SpliceAI), or have no
   * heading at all and render as one emphasised label/value row (REVEL). Worse,
   * the first block can be gated out by the data — ClinVar's conflicting-vs-not
   * shapes are two different blocks, and only one of them draws. So the help is
   * *claimed* by the first level-0 heading or row that actually draws, which is
   * exactly the option's visible title in every one of those shapes.
   *
   * `take` yields the help once and null thereafter. Blocks render in document
   * order within a single synchronous pass, so the claim is deterministic.
   */
  helpAnchor?: { take: () => OptionHelp | null };
};

/** One-shot holder: the first level-0 heading or row to draw takes the help. */
const makeHelpAnchor = (help: OptionHelp) => {
  let taken = false;
  return {
    take: () => {
      if (taken) {
        return null;
      }
      taken = true;
      return help;
    }
  };
};

/** A heading with its (?) button, when this is the node claiming the option's
 *  help. A nested heading (level > 0) is a sub-division of the option, not its
 *  title, so it never claims. */
const claimHelp = (
  heading: ReactNode,
  entities: Entities,
  level: number
): ReactNode =>
  withOptionHelp(
    heading,
    (level === 0 ? entities.helpAnchor?.take() : null) ?? undefined
  );

/** Resolve a `<plugin>.<field>` reference against the right entity. */
const readField = (
  ref: string,
  spec: DisplaySpec,
  entities: Entities
): unknown => {
  const separator = ref.indexOf('.');
  if (separator < 0) {
    return null;
  }
  const plugin = ref.slice(0, separator);
  const field = ref.slice(separator + 1);
  const data = readPlugin(plugin, spec, entities);
  return data ? (data as Record<string, unknown>)[field] : null;
};

const readPlugin = (
  plugin: string,
  spec: DisplaySpec,
  entities: Entities
): unknown => {
  const entity =
    spec.plugin_scopes[plugin] === 'allele'
      ? entities.allele
      : entities.consequence;
  return getAnnotation(entity, plugin as PluginId);
};

/**
 * A composed value. `with_score` mirrors the hand-written cases exactly: no
 * classification means no row, whatever the score says.
 */
const composeValue = (
  compose: DisplayCompose,
  spec: DisplaySpec,
  entities: Entities
): string | null => {
  const classification = readField(compose.classification, spec, entities);
  if (isAbsent(classification)) {
    return null;
  }
  const score = readField(compose.score, spec, entities);
  return withScore(String(classification), (score ?? null) as number | null);
};

/** A label, with its help (?) button when the spec gives it help text. The help
 * may cite a source (popEVE's threshold comes from its paper), which trails the
 * text inside the popup rather than sitting beside the label — the label row is
 * for the value, and the citation only matters once the help is open. */
const rowLabel = (row: DisplayRowSpec): ReactNode =>
  row.help ? (
    <span className={styles.labelWithHelp}>
      {row.label}
      <QuestionButton
        helpText={
          row.help_link ? (
            <>
              {row.help}{' '}
              <a
                href={row.help_link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.helpLink}
              >
                {row.help_link.label ?? 'Read more'}
                <ExternalLinkIcon />
              </a>
            </>
          ) : (
            row.help
          )
        }
        className={{ inline: styles.rowHelpIcon }}
      />
    </span>
  ) : (
    row.label
  );

/**
 * A row's value and effective placeholder, applying sub-option semantics.
 *
 * A plain row uses its own `placeholder`. A `sub_option` row behaves like the
 * old `renderRunSubOptions`: the default view is value-gated (an empty row just
 * drops); "Show all" instead lists the *selected* sub-options — an unselected
 * one is dropped even if it has a value, and a selected-but-empty one shows a
 * dash.
 */
const rowValueAndPlaceholder = (
  row: DisplayRowSpec,
  spec: DisplaySpec,
  entities: Entities
): { value: unknown; placeholder: string | undefined } => {
  const value = row.compose
    ? composeValue(row.compose, spec, entities)
    : readField(row.from ?? '', spec, entities);
  if (!row.sub_option) {
    return { value, placeholder: row.placeholder ?? undefined };
  }
  if (!entities.showAll) {
    return { value, placeholder: undefined };
  }
  return entities.subOptionRan(
    row.sub_option.id,
    row.sub_option.default ?? false
  )
    ? { value, placeholder: '—' }
    : { value: null, placeholder: undefined };
};

const toRowSpec = (
  row: DisplayRowSpec,
  spec: DisplaySpec,
  entities: Entities
): RowSpec => {
  // A row with no `from`/`compose` is built entirely by its named builder: the
  // value is job context, not annotation (the OpenTargets variant link). The
  // builder returning null — no id to link — drops the row, exactly as an
  // absent annotation value would.
  if (!row.from && !row.compose && row.link?.builder) {
    const node = renderLink(row.link, entities.linkContext);
    return {
      key: row.key ?? undefined,
      label: rowLabel(row),
      value: node ? '' : null,
      valueNode: node ?? null,
      // Its own line under the block heading, not the value half of a
      // label/value pair — there is no label opposite it.
      plain: true
    };
  }
  const { value, placeholder } = rowValueAndPlaceholder(row, spec, entities);
  // An app-popup link wraps the value itself (the protein id becomes the popup
  // trigger) rather than trailing it, so it is rendered here as the value node.
  if (row.link?.kind === 'app_popup') {
    const absent = isAbsent(value);
    return {
      key: row.key ?? undefined,
      label: rowLabel(row),
      value,
      mono: row.mono ?? undefined,
      valueNode: absent
        ? null
        : renderLink(row.link, entities.linkContext, String(value))
    };
  }
  // An external link with a URL template wraps the value in an anchor (the value
  // becomes the clickable link + trailing icon, e.g. the ClinVar variation id
  // linking to its ClinVar page), interpolating `{value}` into the template. An
  // absent value renders nothing rather than a broken link.
  if (row.link?.kind === 'external' && row.link.template) {
    const absent = isAbsent(value);
    return {
      key: row.key ?? undefined,
      label: rowLabel(row),
      value,
      mono: row.mono ?? undefined,
      valueNode: absent ? null : (
        <a
          href={interpolate(row.link.template, { value: String(value) })}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.listLink}
        >
          {formatValue(value, row.format ?? 'text')}
          <ExternalLinkIcon />
        </a>
      )
    };
  }
  return {
    key: row.key ?? undefined,
    label: rowLabel(row),
    value,
    format: row.format ?? undefined,
    mono: row.mono ?? undefined,
    placeholder,
    // Shown by renderRows only next to a real value (ProtVar's icon).
    link: row.link ? renderLink(row.link, entities.linkContext) : undefined
  };
};

// --- list blocks (repeat + link + truncate) ---------------------------------

const MoreToggle = (props: {
  hiddenCount: number;
  isExpanded: boolean;
  toggle: () => void;
}) => (
  <button
    type="button"
    className={styles.phenotypeToggle}
    onClick={props.toggle}
  >
    {props.isExpanded ? 'Show fewer' : `+ ${props.hiddenCount} more`}
  </button>
);

/** Fill a `{field}` URL template from a list item's fields. */
const interpolate = (template: string, item: Record<string, unknown>): string =>
  template.replace(/\{(\w+)\}/g, (_match, field) => String(item[field] ?? ''));

// Named link builders, for links that are not a simple `{field}` template: an
// algorithmic URL (ProtVar) or an in-app "View in" popup (the protein id). Each
// gets the job context (genome / ProtVar URL / consequence) so it can build a
// link the annotation field alone cannot. Referenced by name from a row's or
// item's `link.builder`.
const LINK_BUILDERS: Record<
  string,
  (context: LinkBuilderContext, value: string) => ReactNode
> = {
  // One icon per ProtVar row/item, to this variant's ProtVar page.
  protvar: (context) =>
    context.protvarUrl ? (
      <a
        href={context.protvarUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.protvarLink}
        aria-label="View in ProtVar"
      >
        <ExternalLinkIcon />
      </a>
    ) : null,
  // The variant's OpenTargets page: the link icon, then the variant in
  // OpenTargets' own notation as the link text. Unlike ProtVar's icon-only link
  // this *is* the row's value — there is no annotation field behind it.
  opentargets_variant: (context) =>
    context.openTargetsVariantId ? (
      <a
        href={`https://platform.opentargets.org/variant/${context.openTargetsVariantId}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.listLink} ${styles.iconFirst}`}
      >
        <ExternalLinkIcon />
        {context.openTargetsVariantId}
      </a>
    ) : null,
  // The protein id as an in-app "View in" popup trigger (Entity Viewer), built
  // from the job genome plus the consequence's gene. Unlike an external icon it
  // *wraps* the value, so it becomes the row's value rather than a trailing bit.
  protein_popup: (context, value) => {
    const consequence = context.consequence as
      PredictedTranscriptConsequence | null | undefined;
    const gene = consequence?.gene_stable_id;
    if (!gene) {
      return value; // no gene (e.g. intergenic) — plain id, no popup
    }
    return (
      <ViewInAppPopup
        links={{
          entityViewer: {
            url: proteinFeatureExplorerUrl(context.genomeId, gene, value)
          }
        }}
      >
        {value}
      </ViewInAppPopup>
    );
  }
};

/** A row/item-level link: the named builder rendered against the job context. */
const renderLink = (
  link: DisplayLinkSpec,
  context: LinkBuilderContext,
  value = ''
): ReactNode => {
  const builder = link.builder ? LINK_BUILDERS[link.builder] : undefined;
  return builder ? builder(context, value) : null;
};

/** One cell of a list item: its formatted value, as a link when `link` is set. */
const renderCell = (
  cell: DisplayCellSpec,
  item: unknown,
  index: number
): ReactNode => {
  const isRecord = !!item && typeof item === 'object';
  const fields = isRecord ? (item as Record<string, unknown>) : {};
  // A scalar list (phenotype strings) has no `from`: the element is the value.
  const raw = cell.from && isRecord ? fields[cell.from] : item;
  // An absent cell renders nothing — this drops an optional field (OpenTargets'
  // L2G score, a QTL biosample) rather than showing an empty cell, and keeps a
  // `num`/`with_score` format from being handed a null.
  if (isAbsent(raw)) {
    return null;
  }
  const text = formatValue(raw, cell.format ?? 'text');
  if (text === null) {
    return null;
  }
  const key = cell.from ?? index;
  const record = fields;
  if (cell.link?.kind === 'external' && cell.link.template) {
    return (
      <a
        key={key}
        href={interpolate(cell.link.template, record)}
        target="_blank"
        rel="noopener noreferrer"
        className={
          cell.mono ? `${styles.listLink} ${styles.mono}` : styles.listLink
        }
      >
        {text}
        <ExternalLinkIcon />
      </a>
    );
  }
  // Plain value. An optional `label` becomes a prefix, for a meta cell like
  // OpenTargets' "L2G 0.42". (Cell-level builder links are not used — a row's or
  // item's `link` carries the builder ones.)
  return (
    <span key={key} className={cell.mono ? styles.mono : undefined}>
      {cell.label ? `${cell.label} ${text}` : text}
    </span>
  );
};

/**
 * The label of a row-layout list item: an interpolated `{field}` template
 * ("Pocket {pocket_id}") or a formatted item field (ClinVar's humanised
 * significance).
 */
const renderItemLabel = (
  label: DisplayItemLabelSpec,
  element: unknown
): string => {
  const record = (
    element && typeof element === 'object' ? element : {}
  ) as Record<string, unknown>;
  if (label.template) {
    return interpolate(label.template, record);
  }
  const raw = label.from ? record[label.from] : element;
  const text = formatValue(raw, label.format ?? 'text') ?? '';
  // `wrap` surrounds the formatted value with fixed text via a `{}` slot
  // (ClinVar's `Submitters reporting "Pathogenic"`).
  return label.wrap ? label.wrap.replace('{}', text) : text;
};

const renderListItem = (
  item: DisplayItemSpec,
  element: unknown,
  entities: Entities
): ReactNode => {
  // A stack of labelled field-rows (NearestExonJB's exon boundaries): each field
  // is its own `label: value` row; absent fields drop.
  if (item.rows) {
    const record = (
      element && typeof element === 'object' ? element : {}
    ) as Record<string, unknown>;
    const fieldRows = item.rows
      .map((fieldRow) => {
        const raw = record[fieldRow.from];
        if (isAbsent(raw)) {
          return null;
        }
        const text = formatValue(raw, fieldRow.format ?? 'text');
        return text === null ? null : (
          <Row key={fieldRow.from} label={fieldRow.label} value={text} />
        );
      })
      .filter(Boolean);
    return fieldRows.length ? (
      <div className={styles.listRecord}>{fieldRows}</div>
    ) : null;
  }
  const cells = (item.cells ?? [])
    .map((cell, index) => renderCell(cell, element, index))
    .filter(Boolean);
  // Without a label the cells lay out inline (a GO id + name); with one they
  // become the value of a label/value row (ClinVar's per-class counts, ProtVar's
  // pockets).
  if (!item.label) {
    return cells.length ? <div className={styles.listItem}>{cells}</div> : null;
  }
  const label = renderItemLabel(item.label, element);
  // A trailing item link (ProtVar's icon) shows on every rendered item, even
  // when a cell (the score) is absent — matching the old per-pocket summary.
  const linkNode = item.link
    ? renderLink(item.link, entities.linkContext)
    : null;
  if (!label && !cells.length && !linkNode) {
    return null;
  }
  return (
    <Row
      label={label}
      // Space before the trailing link icon, matching a row's `{value} {link}`
      // (renderRows) so ProtVar's icon isn't jammed against the value.
      value={
        linkNode ? (
          <>
            {cells} {linkNode}
          </>
        ) : (
          cells
        )
      }
    />
  );
};

const renderListBlock = (
  block: DisplayListBlockSpec,
  spec: DisplaySpec,
  entities: Entities,
  level: number
): ReactNode | null => {
  const list = readField(block.from, spec, entities);
  const items = Array.isArray(list) ? list : [];
  if (items.length === 0) {
    return null;
  }
  const renderItem = (item: unknown) =>
    renderListItem(block.item, item, entities);
  const renderItems = (subset: unknown[]) =>
    block.truncate ? (
      <TruncatedList
        items={subset}
        visibleCount={block.truncate.visible_count}
        renderItem={renderItem}
        renderToggle={(toggleProps) => <MoreToggle {...toggleProps} />}
      />
    ) : (
      <>
        {subset.map((item, index) => (
          <Fragment key={index}>{renderItem(item)}</Fragment>
        ))}
      </>
    );

  // Grouped: a headed run of items per distinct value of the grouped field, the
  // headings coming from the data rather than the spec — GO terms by aspect.
  // Truncation then applies per section, so each aspect gets its own toggle.
  // Same shape the grouped table uses.
  const groupBy = block.group_by;
  const body = groupBy
    ? groupRows(items, groupBy.field, groupBy.labels).map((group) => (
        <Fragment key={group.heading ?? ''}>
          {group.heading ? (
            <OptionBlock label={group.heading} level={level + 1}>
              {renderItems(group.rows)}
            </OptionBlock>
          ) : (
            renderItems(group.rows)
          )}
        </Fragment>
      ))
    : renderItems(items);

  return block.heading ? (
    <OptionBlock
      label={claimHelp(block.heading, entities, level)}
      level={level}
    >
      {body}
    </OptionBlock>
  ) : (
    <>{body}</>
  );
};

/** The one value a column takes across every row, or null if it varies, is
 * missing anywhere, or there is nothing to compare. Used to decide whether a
 * `lift_when_invariant` column can be shown once above the table. */
const invariantValue = (
  column: DisplayTableColumnSpec,
  items: unknown[]
): string | null => {
  if (items.length === 0) {
    return null;
  }
  const values = items.map((item) => {
    const isRecord = !!item && typeof item === 'object';
    const raw =
      column.from && isRecord
        ? (item as Record<string, unknown>)[column.from]
        : item;
    return isAbsent(raw) ? null : String(raw);
  });
  const [first] = values;
  if (first === null) {
    return null;
  }
  return values.every((value) => value === first) ? first : null;
};

/** One table cell: the column's value read from the list element and formatted
 * (a scalar list element is the value itself; no `from`).
 *
 * A `split` column holds several values in one string — IntAct joins interaction
 * participants with `_and_` — and each is rendered in its own right. Where the
 * column carries a `link_prefix`, only values with that prefix are linkable: the
 * prefix is stripped to fill the template, and anything without it is left as
 * plain text rather than becoming a link to nowhere. */
const tableCellContent = (
  column: DisplayTableColumnSpec,
  element: unknown
): ReactNode => {
  const isRecord = !!element && typeof element === 'object';
  const raw =
    column.from && isRecord
      ? (element as Record<string, unknown>)[column.from]
      : element;
  if (isAbsent(raw)) {
    return '';
  }
  const text = formatValue(raw, column.format ?? 'text') ?? '';
  if (text === '') {
    return '';
  }

  const template =
    column.link?.kind === 'external' ? column.link.template : undefined;
  if (!template) {
    return text;
  }

  const parts = column.split ? text.split(column.split) : [text];
  return parts.map((part, index) => {
    // Space, not a comma: the values are already visually separate as links,
    // and in a narrow column each tends to land on its own line anyway.
    const separator = index > 0 ? ' ' : '';
    const prefix = column.link_prefix;
    if (prefix && !part.startsWith(prefix)) {
      // Not the identifier this column links to; show it as it came.
      return <Fragment key={index}>{separator + part}</Fragment>;
    }
    const value = prefix ? part.slice(prefix.length) : part;
    return (
      <Fragment key={index}>
        {separator}
        <a
          href={interpolate(template, { value })}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.listLink}
        >
          {value}
          <ExternalLinkIcon />
        </a>
      </Fragment>
    );
  });
};

// The header row shared by both table modes.
const tableHead = (columns: DisplayTableBlockSpec['columns']): ReactNode => (
  <thead>
    <tr>
      {columns.map((column, index) => (
        <th key={index}>{column.label}</th>
      ))}
    </tr>
  </thead>
);

/**
 * A heading indents its children by wrapping them in `.optionChildren`. A table
 * marked `indent` gets that container without the heading, so an unheaded table
 * lines up with the headed sections it sits beside instead of standing a step out
 * from them (the ClinVar phenotype table beside the grouped ones).
 */
const withHeading = (
  block: DisplayTableBlockSpec,
  level: number,
  table: ReactNode,
  entities: Entities
): ReactNode => {
  if (block.heading) {
    return (
      <OptionBlock
        label={claimHelp(block.heading, entities, level)}
        level={level}
      >
        {table}
      </OptionBlock>
    );
  }
  return block.indent ? (
    <div className={styles.optionChildren}>{table}</div>
  ) : (
    table
  );
};

// Fixed (matrix) mode: explicit `{label, values}` rows. The label fills the
// first column; each value reads a scalar `<plugin>.<field>` and is formatted by
// its value column (the columns after the first).
const renderMatrixTable = (
  block: DisplayTableBlockSpec,
  spec: DisplaySpec,
  entities: Entities,
  level: number
): ReactNode | null => {
  const rows = block.rows ?? [];
  const valueColumns = block.columns.slice(1);
  const table = (
    <div className={styles.tableScroll}>
      <table className={styles.breakdownTable}>
        {tableHead(block.columns)}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{row.label}</td>
              {row.values.map((ref, colIndex) => {
                const column = valueColumns[colIndex];
                const raw = readField(ref, spec, entities);
                const text = isAbsent(raw)
                  ? ''
                  : (formatValue(raw, column?.format ?? 'text') ?? '');
                return (
                  <td
                    key={colIndex}
                    className={column?.mono ? styles.mono : undefined}
                  >
                    {text}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  return withHeading(block, level, table, entities);
};

const renderTableBlock = (
  block: DisplayTableBlockSpec,
  spec: DisplaySpec,
  entities: Entities,
  level: number
): ReactNode | null => {
  if (block.rows) {
    return renderMatrixTable(block, spec, entities, level);
  }
  const list = readField(block.from ?? '', spec, entities);
  const allItems = Array.isArray(list) ? list : [];
  // `where` lets two tables split one list between them, so each can sit under
  // a shared heading. Filtering to nothing renders nothing, which is what makes
  // an empty half collapse its group heading with it.
  const items = block.where
    ? allItems.filter((item) => {
        const value =
          !!item && typeof item === 'object'
            ? String(
                (item as Record<string, unknown>)[block.where!.field] ?? ''
              )
            : '';
        // `not_equals` is what stops a value nobody anticipated falling between
        // two tables and disappearing: one names what it wants, the other takes
        // the rest.
        const notEquals = block.where!.not_equals;
        return notEquals !== null && notEquals !== undefined
          ? value !== notEquals
          : value === block.where!.equals;
      })
    : allItems;
  if (items.length === 0) {
    return null;
  }

  // A column whose sub-option did not run has no data behind it, so it is
  // dropped rather than rendered empty — IntAct's table is 2 to 6 columns wide.
  const selectedColumns = block.columns.filter(
    (column) =>
      !column.sub_option ||
      entities.subOptionRan(
        column.sub_option.id,
        column.sub_option.default ?? false
      )
  );
  if (selectedColumns.length === 0) {
    return null;
  }

  // A column marked `lift_when_invariant` whose value is the same on every row
  // says one thing about the variant, not one thing per row: show it once above
  // the table and give its width back to the columns that do vary. It stays a
  // column the moment the value differs anywhere.
  const lifted = selectedColumns.filter(
    (column) =>
      column.lift_when_invariant && invariantValue(column, items) !== null
  );
  const columns = selectedColumns.filter((column) => !lifted.includes(column));

  const renderTable = (rows: unknown[]) => {
    const bodyRow = (element: unknown, rowIndex: number) => (
      <tr key={rowIndex}>
        {columns.map((column, colIndex) => (
          <td key={colIndex} className={column.mono ? styles.mono : undefined}>
            {tableCellContent(column, element)}
          </td>
        ))}
      </tr>
    );
    // TruncatedList adds no markup of its own, so the rows and the toggle stay
    // inside the tbody — the toggle as a row spanning every column.
    return (
      <div className={styles.tableScroll}>
        <table className={styles.breakdownTable}>
          {tableHead(columns)}
          <tbody>
            {block.truncate ? (
              <TruncatedList
                items={rows}
                visibleCount={block.truncate.visible_count}
                renderItem={bodyRow}
                renderToggle={(toggleProps) => (
                  <tr>
                    <td colSpan={columns.length}>
                      <MoreToggle {...toggleProps} />
                    </td>
                  </tr>
                )}
              />
            ) : (
              rows.map(bodyRow)
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Grouped: a headed table per distinct value of the grouped field, the
  // headings coming from the data rather than the spec.
  const groupBy = block.group_by;
  const body = groupBy
    ? groupRows(items, groupBy.field, groupBy.labels).map((group) => (
        <Fragment key={group.heading ?? ''}>
          {group.heading ? (
            <OptionBlock label={group.heading} level={level + 1}>
              {renderTable(group.rows)}
            </OptionBlock>
          ) : (
            renderTable(group.rows)
          )}
        </Fragment>
      ))
    : renderTable(items);

  // The lifted columns read as facts about the variant, so they sit above the
  // table, using the same cell rendering (links, prefixes) as the column would.
  const withLifted =
    lifted.length === 0 ? (
      body
    ) : (
      <>
        {lifted.map((column, index) => (
          <Row
            key={`lifted-${index}`}
            label={column.label}
            value={tableCellContent(column, items[0])}
            mono={column.mono}
          />
        ))}
        {body}
      </>
    );

  return withHeading(block, level, withLifted, entities);
};

/**
 * Rows split by the value of `field`, in first-seen order — so the sub-headings
 * come from the data, with `labels` renaming the ones the spec chooses to word
 * differently. Rows with no value for that field keep their order in an
 * unheaded group.
 */
const groupRows = (
  rows: unknown[],
  field: string,
  labels?: Record<string, string> | null
): { heading: string | null; rows: unknown[] }[] => {
  const groups: { heading: string | null; rows: unknown[] }[] = [];
  const byHeading = new Map<string | null, { rows: unknown[] }>();
  for (const row of rows) {
    const raw =
      row && typeof row === 'object'
        ? (row as Record<string, unknown>)[field]
        : null;
    const value = isAbsent(raw) ? null : String(raw);
    const heading = value === null ? null : (labels?.[value] ?? value);
    let group = byHeading.get(heading);
    if (!group) {
      group = { rows: [] };
      byHeading.set(heading, group);
      groups.push({ heading, rows: group.rows });
    }
    group.rows.push(row);
  }
  return groups;
};

/**
 * A block's `when` guard: whether the named field is present / empty. Empty is
 * `null | undefined | '' | []` — the same "absent" rule the rows use, extended
 * to an empty list (ClinVar's `conflicting_breakdown`).
 */
const whenSatisfied = (
  when: DisplayWhenSpec,
  spec: DisplaySpec,
  entities: Entities
): boolean => {
  const value = readField(when.present ?? when.empty ?? '', spec, entities);
  const isEmpty =
    isAbsent(value) || (Array.isArray(value) && value.length === 0);
  return when.present ? !isEmpty : isEmpty;
};

const renderBlock = (
  block: DisplayBlockSpec,
  spec: DisplaySpec,
  entities: Entities,
  // The heading nesting depth for this block: 0 for a block directly under the
  // option (or under a headingless gate group), incremented each time a heading
  // is drawn (see OptionBlock). A headingless block passes its level straight to
  // its children, so only visible headings add a level of weight/indent.
  level: number
): ReactNode | null => {
  // A data condition (ClinVar's shape-flip) gates the whole block first.
  if (block.when && !whenSatisfied(block.when, spec, entities)) {
    return null;
  }
  // A selection gate: render only when the named sub-option was selected. Gates
  // ClinVar's short vs structural blocks so an unselected variant kind (whose
  // columns dev-data still carries) doesn't leak into the view.
  if (
    block.requires_selected &&
    !entities.subOptionRan(
      block.requires_selected.id,
      block.requires_selected.default ?? false
    )
  ) {
    return null;
  }
  // The default annotation view vs "Show all": a view-restricted block renders
  // only in its view (ProtVar's detail rows by default, sub-option counts in
  // Show all).
  if (
    block.view &&
    block.view !== (entities.showAll ? 'show_all' : 'default')
  ) {
    return null;
  }
  if (block.kind === 'group') {
    // A run of sub-blocks under one optional heading, shown only because a
    // child survived — like the option-level heading, but scoped to the group.
    // A heading here is a sub-option, so its children nest one level deeper; a
    // headingless gate group is invisible and passes its level through.
    const childLevel = block.heading ? level + 1 : level;
    const nodes = block.blocks
      .map((child) => renderBlock(child, spec, entities, childLevel))
      .filter(Boolean);
    if (!nodes.length) {
      return null;
    }
    const body = nodes.map((node, index) => (
      <Fragment key={index}>{node}</Fragment>
    ));
    return block.heading ? (
      <OptionBlock
        label={claimHelp(block.heading, entities, level)}
        level={level}
      >
        {body}
      </OptionBlock>
    ) : (
      <>{body}</>
    );
  }
  // `requires` guards a block whose rows have placeholders: with no annotation
  // at all there is nothing to show, not a column of dashes.
  if (block.requires && !readPlugin(block.requires, spec, entities)) {
    return null;
  }
  if (block.kind === 'list') {
    return renderListBlock(block, spec, entities, level);
  }
  if (block.kind === 'table') {
    return renderTableBlock(block, spec, entities, level);
  }
  const rows = block.rows.map((row) => toRowSpec(row, spec, entities));
  if (block.heading) {
    return renderRowBlock(
      claimHelp(block.heading, entities, level),
      rows,
      level
    );
  }
  // Headingless at the option's own level: the first surviving row *is* the
  // option's visible title (REVEL, CADD, SPDI …), so that label carries the
  // help. Decorating the first row rather than rows[0] matters — rows[0] can be
  // dropped for an absent value.
  return renderRowGroup(rows, level, (label) =>
    claimHelp(label, entities, level)
  );
};

/**
 * One option's content, or null when nothing survived — the same contract as
 * the `case` bodies this replaces.
 */
export const renderDisplayOption = (args: {
  option: DisplayOptionSpec;
  spec: DisplaySpec;
  consequence: AnnotatedEntity | null | undefined;
  allele: AnnotatedEntity | null | undefined;
  // Sub-option rows (Show all) need these; default to the plain, no-sub-option
  // behaviour so existing callers/tests are unaffected.
  showAll?: boolean;
  subOptionRan?: (optionId: string, defaultValue: boolean) => boolean;
  // For named link builders (ProtVar's icon, the protein popup); optional so
  // options without a builder link, and their tests, need not supply them.
  genomeId?: string;
  protvarUrl?: string;
  openTargetsVariantId?: string;
  // The option's help, hung on whichever node turns out to be its visible title
  // (see Entities.helpAnchor). Optional: an option with no help renders exactly
  // as before.
  help?: OptionHelp;
}): ReactNode | null => {
  const {
    option,
    spec,
    consequence,
    allele,
    showAll = false,
    subOptionRan = () => false,
    genomeId = '',
    protvarUrl,
    openTargetsVariantId,
    help
  } = args;
  const entities: Entities = {
    consequence,
    allele,
    showAll,
    subOptionRan,
    linkContext: { genomeId, protvarUrl, openTargetsVariantId, consequence },
    helpAnchor: help ? makeHelpAnchor(help) : undefined
  };
  // The option heading is the top level (0); its blocks are sub-options one
  // level deeper. Without an option heading the blocks are themselves the
  // top-level headings.
  const childLevel = option.heading ? 1 : 0;
  const nodes = option.blocks
    .map((block) => renderBlock(block, spec, entities, childLevel))
    .filter(Boolean);
  if (!nodes.length) {
    return null;
  }
  const body = nodes.map((node, index) => (
    <Fragment key={index}>{node}</Fragment>
  ));
  // An option-level heading wraps every block in one OptionBlock (MaveDB); it is
  // shown only because at least one block survived above. Its blocks rendered at
  // level 1, so none of them can have claimed the help — it belongs here, on the
  // option's own title.
  return option.heading ? (
    <OptionBlock label={claimHelp(option.heading, entities, 0)} level={0}>
      {body}
    </OptionBlock>
  ) : (
    <>{body}</>
  );
};
