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

import { Fragment, type CSSProperties, type ReactNode } from 'react';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { withScore } from 'src/content/app/tools/vep/utils/annotationFormatters';
import {
  renderRows,
  renderRowGroup,
  renderRowBlock,
  formatValue,
  isAbsent,
  withOptionHelp,
  Row,
  OptionBlock,
  Indented,
  type RowSpec
} from './annotationRows';
import {
  getAnnotation,
  type AnnotatedEntity
} from 'src/content/app/tools/vep/utils/annotations';

import QuestionButton from 'src/shared/components/question-button/QuestionButton';
import TruncatedList, {
  type TruncatedListToggleProps
} from 'src/content/app/tools/vep/components/truncated-list/TruncatedList';
import ExternalLink from 'src/shared/components/external-link/ExternalLink';
import Chevron from 'src/shared/components/chevron/Chevron';
import StarRating from 'src/content/app/tools/vep/components/star-rating/StarRating';
import ViewInAppPopup from 'src/shared/components/view-in-app-popup/ViewInAppPopup';

import type { PredictedTranscriptConsequence } from 'src/content/app/tools/vep/types/vepResultsResponse';
import type { OptionHelp } from 'src/content/app/tools/vep/types/vepFormConfig';
import type {
  DisplayBlockSpec,
  DisplayCellSpec,
  DisplayCompose,
  DisplayItemLabelSpec,
  DisplayItemSpec,
  DisplayLinkSpec,
  DisplayListBlockSpec,
  DisplayMapRowsBlockSpec,
  DisplayOptionSpec,
  DisplayRowSpec,
  DisplaySpec,
  DisplayTableBlockSpec,
  DisplayColumnItems,
  DisplayTableColumnSpec,
  DisplayValuePiece,
  DisplayWhenSpec,
  DisplayWhereSpec
} from 'src/content/app/tools/vep/types/vepDisplaySpec';

import styles from './VepResultsAnnotationDetail.module.css';

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
   * `take` yields the help once and null thereafter,
   * so that the help block is rendered only once.
   */
  helpAnchor?: { take: () => OptionHelp | null };
  vocabularies?: Record<string, VocabularyEntry[]>;
};

/** One row a `map_rows` block can draw: which slice it belongs to, the key it
 *  reads from the dict, and what to label it. */
export type VocabularyEntry = {
  scope: string;
  code: string;
  label: string;
};

/** The first level-0 heading or row to call this function takes the help. */
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
  return getAnnotation(entity, plugin);
};

/**
 * ClinVar writes review status as e.g. `criteria_provided,_single_submitter`,
 * while the keys in rating scales are formatted as a regular phrase (e.g. 'criteria provided, single submitter').
 */
const ratingTermKey = (term: string): string =>
  term.toLowerCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

const starRating = (
  scaleName: string | null | undefined,
  value: unknown,
  spec: DisplaySpec
): ReactNode => {
  const scale = scaleName ? spec.rating_scales?.[scaleName] : undefined;
  if (!scale) {
    return null;
  }
  const wanted = ratingTermKey(String(value));
  const match = Object.entries(scale.ratings).find(
    ([term]) => ratingTermKey(term) === wanted
  );
  return match ? (
    <StarRating
      rating={match[1]}
      outOf={scale.out_of}
      className={styles.inlineRating}
    />
  ) : null;
};

/** A value with its rating in front of it, or the value alone when unrated. */
const withStars = (stars: ReactNode, value: ReactNode): ReactNode =>
  stars ? (
    <span className={styles.ratedValue}>
      {stars}
      {value}
    </span>
  ) : (
    value
  );

/**
 * Combines a value with a score.
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

const rowLabel = (row: DisplayRowSpec): ReactNode =>
  row.help ? (
    <span className={styles.labelWithHelp}>
      {row.label}
      <QuestionButton
        helpText={
          row.help_link ? (
            <>
              {row.help}{' '}
              <ExternalLink to={row.help_link.href}>
                {row.help_link.label ?? 'Read more'}
              </ExternalLink>
            </>
          ) : (
            row.help
          )
        }
        className={styles.rowHelpIcon}
      />
    </span>
  ) : (
    row.label
  );

/**
 * A plain row uses its own `placeholder`.
 * A `sub_option` will show a dash ("-") as placeholder when "Show all" is selected
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
  // A row with no `from`/`compose` is built by its named builder.
  if (!row.from && !row.compose && row.link?.builder) {
    const node = renderLink(row.link, entities.linkContext);
    return {
      key: row.key ?? undefined,
      label: rowLabel(row),
      value: node ? '' : null,
      valueNode: node ?? null,
      // Display as its own line under the block heading,
      plain: true
    };
  }
  const { value, placeholder } = rowValueAndPlaceholder(row, spec, entities);

  if (row.link?.kind === 'app_popup') {
    const absent = isAbsent(value);
    return {
      key: row.key ?? undefined,
      label: rowLabel(row),
      value,
      valueNode: absent
        ? null
        : renderLink(row.link, entities.linkContext, String(value))
    };
  }

  if (row.link?.kind === 'external' && row.link.builder) {
    const text = isAbsent(value)
      ? null
      : (formatValue(value, row.format ?? 'text') ?? null);
    return {
      key: row.key ?? undefined,
      label: rowLabel(row),
      value,
      valueNode:
        text === null
          ? null
          : (renderLink(row.link, entities.linkContext, text) ?? text)
    };
  }

  if (row.link?.kind === 'external' && row.link.template) {
    const href = row.link_from
      ? readField(row.link_from, spec, entities)
      : value;
    // One value holding several, each its own link: a ClinVar custom joins the
    // records that matched a variant with `&`, and one URL built from all of
    // them points nowhere.
    if (row.split && !isAbsent(value)) {
      const template = row.link.template;
      const parts = String(value).split(row.split).filter(Boolean);
      return {
        key: row.key ?? undefined,
        label: rowLabel(row),
        value,
        valueNode: (
          <span className={styles.splitLinks}>
            {parts.map((part, index) => {
              const url = interpolateUrl(template, { value: part });
              return url ? (
                <ExternalLink key={index} to={url}>
                  {part}
                </ExternalLink>
              ) : (
                <Fragment key={index}>{part}</Fragment>
              );
            })}
          </span>
        )
      };
    }
    const hrefString = interpolateUrl(row.link.template, {
      value: String(href)
    });
    return {
      key: row.key ?? undefined,
      label: rowLabel(row),
      value,
      valueNode: isAbsent(value) ? null : hrefString ? (
        <ExternalLink to={hrefString}>
          {formatValue(value, row.format ?? 'text')}
        </ExternalLink>
      ) : undefined
    };
  }

  if (row.item) {
    const all = Array.isArray(value) ? value : [];
    const elements = row.where
      ? all.filter((e) => matchesFilter(row.where, e))
      : all;
    const cells = row.item.cells;
    const body =
      cells && elements.length ? (
        <div
          className={styles.stackedGrid}
          style={{ '--stacked-columns': cells.length } as CSSProperties}
        >
          {elements.flatMap((element, line) =>
            cells.map((cell, column) => (
              <Fragment key={`${line}-${column}`}>
                {renderCell(cell, element, column, spec) ?? <span />}
              </Fragment>
            ))
          )}
        </div>
      ) : (
        <div className={styles.stackedValue}>
          {elements.map((element, index) => (
            <Fragment key={index}>
              {renderListItem(row.item!, element, entities, spec)}
            </Fragment>
          ))}
        </div>
      );
    return {
      key: row.key ?? undefined,
      label: rowLabel(row),
      value,
      stacked: true,
      valueNode: elements.length ? body : null
    };
  }

  // A rating in front of the value (ClinVar's review status as stars).
  if (row.stars && !isAbsent(value)) {
    const text = formatValue(value, row.format ?? 'text');
    return {
      key: row.key ?? undefined,
      label: rowLabel(row),
      value,
      valueNode:
        text === null
          ? null
          : withStars(starRating(row.stars, value, spec), text)
    };
  }

  return {
    key: row.key ?? undefined,
    label: rowLabel(row),
    value,
    format: row.format ?? undefined,
    placeholder,
    link: row.link ? renderLink(row.link, entities.linkContext) : undefined
  };
};

const MoreToggle = (props: TruncatedListToggleProps) => (
  <button
    type="button"
    className={styles.phenotypeToggle}
    onClick={props.toggle}
  >
    {props.isExpanded ? 'Show fewer' : `+ ${props.hiddenCount} more`}
  </button>
);

const SPLIT_CELL_VISIBLE_COUNT = 3;

/** Fill a `{field}` template from an item's fields, for display text. */
const interpolate = (template: string, item: Record<string, unknown>): string =>
  template.replace(/\{(\w+)\}/g, (_match, field) => String(item[field] ?? ''));

/**
 * Some urls contain hashes that need to survive the transformation
 * Example: https://geno2mp.gs.washington.edu/Geno2MP/#/variant/1/11022/G%3EA/snp
 *
 * On the other hand, some ids interpolated into the template may also contain a hash -
 * example: urn:mavedb:00000045-a-1#2010 -
 * then this hash must be url-escaped when generating the url.
 */
const HASH_IN_VALUE = /#/g;
const WHOLE_VALUE_TEMPLATE = /^\{\w+\}$/;

const interpolateUrl = (
  template: string,
  item: Record<string, unknown>
): string | null => {
  const valueIsTheUrl = WHOLE_VALUE_TEMPLATE.test(template);
  let usable = true;
  const url = template.replace(/\{(\w+)\}/g, (_match, field) => {
    const value = item[field];
    if (value === null || value === undefined || value === '') {
      usable = false;
      return '';
    }
    const text = String(value);
    return valueIsTheUrl ? text : text.replace(HASH_IN_VALUE, '%23');
  });
  return usable && /^https?:\/\//i.test(url) ? url : null;
};

// Named link builders, for links that are not a simple `{field}` template: an
// algorithmic URL (ProtVar) or an in-app "View in" popup (the protein id). Each
// gets the job context (genome / ProtVar URL / consequence) so it can build a
// link the annotation field alone cannot. Referenced by name from a row's or
// item's `link.builder`.
const LINK_BUILDERS: Record<
  string,
  (context: LinkBuilderContext, value: ReactNode) => ReactNode
> = {
  protvar: (context, value) =>
    context.protvarUrl ? (
      <ExternalLink to={context.protvarUrl}>{value}</ExternalLink>
    ) : null,
  opentargets_variant: (context) =>
    context.openTargetsVariantId ? (
      <ExternalLink
        to={`https://platform.opentargets.org/variant/${context.openTargetsVariantId}`}
      >
        {context.openTargetsVariantId}
      </ExternalLink>
    ) : null,
  // The protein id as an in-app "View in" popup
  protein_popup: (context, value) => {
    const consequence = context.consequence as
      PredictedTranscriptConsequence | null | undefined;
    const transcriptId = consequence?.stable_id;
    if (!transcriptId) {
      return value; // no transcript (e.g. intergenic variant) — plain id, no popup
    }
    return (
      <ViewInAppPopup
        links={{
          entityViewer: {
            url: urlFor.entityViewerTranscript({
              genomeId: context.genomeId,
              transcriptId,
              view: 'protein'
            })
          }
        }}
      >
        {value}
      </ViewInAppPopup>
    );
  }
};

const renderLink = (
  link: DisplayLinkSpec,
  context: LinkBuilderContext,
  value: ReactNode = ''
): ReactNode => {
  const builder = link.builder ? LINK_BUILDERS[link.builder] : undefined;
  return builder ? builder(context, value) : null;
};

export type ValuePiece = DisplayValuePiece & {
  /** A companion count rendered after the value: "Pathogenic (5)". Only a line
   *  of a list has one, but the resolver is the same either way. */
  count_from?: string | null;
};

export type ResolvedPiece = {
  /** The value as it came, before formatting — what a link is built from. */
  raw: unknown;
  /** The element as a record (empty record when the element is a scalar). */
  fields: Record<string, unknown>;
  /** The formatted value on its own — what a link is built from. */
  value: string;
  /** What the reader sees: the value, plus its count where it has one. */
  text: string;
  /** Associated rating or null when this piece is not rated. */
  stars: ReturnType<typeof starRating>;
};

export const resolveValuePiece = (
  piece: ValuePiece,
  element: unknown,
  spec: DisplaySpec
): ResolvedPiece | null => {
  const isRecord = !!element && typeof element === 'object';
  const fields = isRecord ? (element as Record<string, unknown>) : {};
  const raw = piece.from && isRecord ? fields[piece.from] : element;
  if (isAbsent(raw)) {
    return null;
  }
  if (piece.template) {
    const prose = interpolate(piece.template, fields);
    return { raw, fields, value: prose, text: prose, stars: null };
  }
  const labelled = piece.labels?.[String(raw)];
  const formatted = labelled ?? formatValue(raw, piece.format ?? 'text');
  if (formatted === null || formatted === '') {
    return null;
  }
  const count = piece.count_from ? fields[piece.count_from] : null;
  const text = isAbsent(count) ? formatted : `${formatted} (${count})`;
  const stars = piece.stars_from
    ? starRating(
        fields[piece.stars_from] as string | null,
        piece.stars_of ? fields[piece.stars_of] : raw,
        spec
      )
    : starRating(piece.stars, raw, spec);
  return { raw, fields, value: formatted, text, stars };
};

const renderCell = (
  cell: DisplayCellSpec,
  item: unknown,
  index: number,
  spec: DisplaySpec
): ReactNode => {
  const resolved = resolveValuePiece(cell, item, spec);
  if (resolved === null) {
    return null;
  }
  const { text, fields: record, stars: cellStars } = resolved;
  const key = cell.from ?? index;

  if (cell.template) {
    return <span key={key}>{text}</span>;
  }
  if (cell.link?.kind === 'external' && cell.link.template) {
    const url = interpolateUrl(cell.link.template, record);
    return url ? (
      <ExternalLink key={key} to={url}>
        {text}
      </ExternalLink>
    ) : (
      text
    );
  }
  return (
    <span key={key} className={cell.nowrap ? styles.nowrap : undefined}>
      {withStars(cellStars, cell.label ? `${cell.label} ${text}` : text)}
    </span>
  );
};

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
  entities: Entities,
  spec: DisplaySpec
): ReactNode => {
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
          <Row key={fieldRow.from} label={fieldRow.label} value={text} strong />
        );
      })
      .filter(Boolean);
    return fieldRows.length ? (
      <div className={styles.listRecord}>{fieldRows}</div>
    ) : null;
  }
  const cells = (item.cells ?? [])
    .map((cell, index) => renderCell(cell, element, index, spec))
    .filter(Boolean);

  if (!item.label) {
    return cells.length ? <div className={styles.listItem}>{cells}</div> : null;
  }
  const label = renderItemLabel(item.label, element);
  const linkNode = item.link
    ? renderLink(item.link, entities.linkContext, <>{cells}</>)
    : null;
  if (!label && !cells.length && !linkNode) {
    return null;
  }
  return <Row label={label} value={linkNode ?? cells} />;
};

/**
 * A block whose rows come from a vocabulary rather than from the spec.
 *
 * The values are read from a dict field, keyed by each vocabulary entry's code,
 * except for the entry with an empty code (""),
 * whose value is accessed via the `overall_from` field.
 */
const renderMapRowsBlock = (
  block: DisplayMapRowsBlockSpec,
  spec: DisplaySpec,
  entities: Entities,
  level: number
): ReactNode | null => {
  const vocabulary = entities.vocabularies?.[block.vocabulary] ?? [];
  const entries = vocabulary.filter((entry) => entry.scope === block.scope);
  if (!entries.length) {
    return null;
  }
  const populations = readField(block.from, spec, entities);
  const byCode =
    populations && typeof populations === 'object'
      ? (populations as Record<string, unknown>)
      : {};
  const suffixText = block.label_suffix
    ? readField(block.label_suffix.from, spec, entities)
    : null;

  const rows: RowSpec[] = entries.map((entry) => {
    const value = entry.code
      ? byCode[entry.code]
      : block.overall_from
        ? readField(block.overall_from, spec, entities)
        : null;
    const formatted = isAbsent(value)
      ? null
      : formatValue(value, block.format ?? 'text');
    const suffixed =
      formatted !== null &&
      block.label_suffix &&
      entry.code === block.label_suffix.key &&
      !isAbsent(suffixText)
        ? `${formatted} (${suffixText})`
        : formatted;
    return {
      key: entry.code || 'overall',
      label: entry.label,
      value: suffixed,
      placeholder: entities.showAll ? '—' : undefined
    };
  });

  const nodes = renderRows(rows);
  if (!nodes.length) {
    return null;
  }
  return block.heading ? (
    renderRowBlock(claimHelp(block.heading, entities, level), rows, level)
  ) : (
    <>{nodes}</>
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
    renderListItem(block.item, item, entities, spec);
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

/** The one value a column takes across every row.
 * Used to decide whether a `lift_when_invariant` column
 * can be shown once above the table. */
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

/**
 * Where a `merge_by` column's cells join up: for each run of consecutive rows
 * sharing the named element field, which row starts the run, how many rows it
 * covers, and which element the cell should be drawn from.
 */
const mergePlan = (
  column: DisplayTableColumnSpec,
  items: unknown[]
): {
  spanAt: Map<number, { span: number; element: unknown }>;
  covered: Set<number>;
} | null => {
  const key = column.merge_by;
  if (!key) {
    return null;
  }
  const groupOf = (item: unknown) =>
    !!item && typeof item === 'object'
      ? (item as Record<string, unknown>)[key]
      : undefined;
  const valueOf = (item: unknown) => {
    const isRecord = !!item && typeof item === 'object';
    const raw =
      column.from && isRecord
        ? (item as Record<string, unknown>)[column.from]
        : item;
    return isAbsent(raw) ? null : raw;
  };

  const spanAt = new Map<number, { span: number; element: unknown }>();
  const covered = new Set<number>();
  let start = 0;
  while (start < items.length) {
    const group = groupOf(items[start]);
    let end = start;
    while (
      group !== undefined &&
      group !== null &&
      end + 1 < items.length &&
      groupOf(items[end + 1]) === group
    ) {
      end++;
    }
    const run = items.slice(start, end + 1);
    const stated = run.filter((item) => valueOf(item) !== null);
    const distinct = new Set(stated.map((item) => String(valueOf(item))));
    if (end > start && distinct.size <= 1) {
      spanAt.set(start, {
        span: end - start + 1,
        element: stated[0] ?? items[start]
      });
      for (let row = start + 1; row <= end; row++) {
        covered.add(row);
      }
    }
    start = end + 1;
  }
  return { spanAt, covered };
};

const columnItem = (
  items: DisplayColumnItems,
  element: unknown,
  spec: DisplaySpec
): ReactNode => {
  const resolved = resolveValuePiece(items, element, spec);
  if (resolved === null) {
    return '';
  }
  const { text, value, fields: record, stars } = resolved;
  const label = items.label ? `${items.label} ${text}` : text;
  const linkClass = items.nowrap ? styles.nowrap : undefined;

  const template =
    items.link?.kind === 'external' ? items.link.template : undefined;
  if (!template) {
    return withStars(stars, label);
  }
  // One value holding several, separated with a separator that is the value of the `split` field
  if (items.split) {
    const parts = value.split(items.split).filter(Boolean);
    return withStars(
      stars,
      <span className={styles.splitLinks}>
        {parts.map((part, index) => {
          const url = interpolateUrl(template, { value: part });
          return url ? (
            <ExternalLink key={index} to={url} className={linkClass}>
              {part}
            </ExternalLink>
          ) : (
            <Fragment key={index}>{part}</Fragment>
          );
        })}
      </span>
    );
  }
  const href = items.link_from ? record[items.link_from] : value;
  if (typeof href !== 'string' || href === '') {
    return withStars(stars, label);
  }
  const url = items.link_from
    ? interpolateUrl(template, { value: href })
    : interpolateUrl(template, record);
  return url
    ? withStars(
        stars,
        <ExternalLink to={url} className={linkClass}>
          {label}
        </ExternalLink>
      )
    : withStars(stars, label);
};

const matchesFilter = (
  where: DisplayWhereSpec | null | undefined,
  element: unknown
): boolean => {
  if (!where) {
    return false;
  }
  const value =
    !!element && typeof element === 'object'
      ? String((element as Record<string, unknown>)[where.field] ?? '')
      : '';
  return where.not_equals !== null && where.not_equals !== undefined
    ? value !== where.not_equals
    : value === where.equals;
};

const ExpandableItem = (props: {
  summary: ReactNode;
  rows: unknown[];
  cells: DisplayColumnItems[];
  emphasis?: DisplayWhereSpec | null;
  spec: DisplaySpec;
}) => (
  <TruncatedList
    items={props.rows}
    visibleCount={0}
    toggleFirst={true}
    renderToggle={({ isExpanded, toggle }) => (
      <button
        type="button"
        className={styles.expandableCellToggle}
        aria-expanded={isExpanded}
        onClick={toggle}
      >
        {props.summary}
        <Chevron
          direction={isExpanded ? 'up' : 'down'}
          className={styles.cellChevron}
        />
      </button>
    )}
    renderItem={(row, index) => (
      <div
        className={
          matchesFilter(props.emphasis, row)
            ? `${styles.expandedDetailRow} ${styles.emphasisedDetailRow}`
            : styles.expandedDetailRow
        }
        key={index}
      >
        {props.cells.map((cell, cellIndex) => (
          <span key={cellIndex}>{columnItem(cell, row, props.spec)}</span>
        ))}
      </div>
    )}
  />
);

const columnItemNode = (
  items: DisplayColumnItems,
  element: unknown,
  spec: DisplaySpec
): ReactNode => {
  const content = columnItem(items, element, spec);
  const detail =
    items.expand && !!element && typeof element === 'object'
      ? (element as Record<string, unknown>)[items.expand.from]
      : null;
  if (!items.expand || !Array.isArray(detail) || detail.length === 0) {
    return content;
  }
  return (
    <ExpandableItem
      summary={content}
      rows={detail}
      cells={items.expand.cells}
      emphasis={items.expand.emphasis}
      spec={spec}
    />
  );
};

const tableCellContent = (
  column: DisplayTableColumnSpec,
  element: unknown,
  spec: DisplaySpec
): ReactNode => {
  const isRecord = !!element && typeof element === 'object';

  if (column.items) {
    const list =
      column.from && isRecord
        ? (element as Record<string, unknown>)[column.from]
        : element;
    if (!Array.isArray(list)) {
      return '';
    }
    return (
      <div className={styles.cellItems}>
        {list.map((value, index) => (
          <div key={index}>{columnItemNode(column.items!, value, spec)}</div>
        ))}
      </div>
    );
  }

  const resolved = resolveValuePiece(column, element, spec);
  if (resolved === null) {
    return '';
  }
  const { text } = resolved;
  const linkClass = column.nowrap
    ? `${styles.listLink} ${styles.nowrap}`
    : undefined;

  const template =
    column.link?.kind === 'external' ? column.link.template : undefined;
  if (!template) {
    return text;
  }

  if (column.link_from) {
    const href = isRecord
      ? (element as Record<string, unknown>)[column.link_from]
      : null;
    if (typeof href !== 'string' || href === '') {
      return text;
    }
    const url = interpolateUrl(template, { value: href });
    return url ? (
      <ExternalLink to={url} className={linkClass}>
        {text}
      </ExternalLink>
    ) : (
      text
    );
  }

  const parts = column.split ? text.split(column.split) : [text];
  const rendered = parts.map((part, index) => {
    const prefix = column.link_prefix;
    if (prefix && !part.startsWith(prefix)) {
      // Not the identifier this column links to; show it as it came.
      return <Fragment key={index}>{part}</Fragment>;
    }
    const value = prefix ? part.slice(prefix.length) : part;
    const url = interpolateUrl(template, { ...resolved.fields, value });
    return url ? (
      <ExternalLink key={index} to={url} className={linkClass}>
        {value}
      </ExternalLink>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    );
  });

  if (!column.split) {
    return rendered;
  }

  // A split column's values stack one per line in the same cell
  return (
    <div className={styles.cellItems}>
      <TruncatedList
        items={rendered}
        visibleCount={SPLIT_CELL_VISIBLE_COUNT}
        renderItem={(node) => node}
        renderToggle={(toggleProps) => <MoreToggle {...toggleProps} />}
      />
    </div>
  );
};

const NUMERIC_FORMATS: ReadonlySet<string> = new Set(['num', 'count']);

const alignmentClass = (
  column: Pick<DisplayTableColumnSpec, 'format' | 'align'>
): string | undefined => {
  const align =
    column.align ??
    (column.format && NUMERIC_FORMATS.has(column.format) ? 'right' : 'left');
  return align === 'right' ? styles.alignRight : undefined;
};

const cellClass = (
  column: Pick<DisplayTableColumnSpec, 'format' | 'align'> | undefined
): string | undefined => (column ? alignmentClass(column) : undefined);

const tableHead = (columns: DisplayTableBlockSpec['columns']): ReactNode => (
  <thead>
    <tr>
      {columns.map((column, index) => {
        const columnNotes = column.notes ?? [];
        const columnNoteElements =
          columnNotes.length > 0
            ? columnNotes.map((note, noteIndex) => (
                <div key={noteIndex}>{note.text}</div>
              ))
            : null;
        const columnHeadContent = columnNoteElements ? (
          <span className={styles.labelWithHelp}>
            <span>{column.label}</span>
            <QuestionButton helpText={columnNoteElements} />
          </span>
        ) : (
          column.label
        );
        return (
          <th key={index} className={alignmentClass(column)}>
            {columnHeadContent}
          </th>
        );
      })}
    </tr>
  </thead>
);

const withHeading = (
  block: DisplayTableBlockSpec,
  level: number,
  table: ReactNode,
  entities: Entities
): ReactNode => {
  const headed = block.heading ? (
    <OptionBlock
      label={claimHelp(block.heading, entities, level)}
      level={level}
    >
      {table}
    </OptionBlock>
  ) : (
    table
  );
  return block.indent ? (
    <Indented className={styles.optionChildren}>{headed}</Indented>
  ) : (
    headed
  );
};

// Fixed (matrix) mode: explicit `{label, values}` rows.
// The label fills the first column.
// Each value reads from `<plugin>.<field>` and is formatted
// as instructed by the corresponding column.
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
                  <td key={colIndex} className={cellClass(column)}>
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
  // `where` lets two tables split one list between them,
  // so each can sit under a shared heading.
  const items = block.where
    ? allItems.filter((item) => {
        const value =
          !!item && typeof item === 'object'
            ? String(
                (item as Record<string, unknown>)[block.where!.field] ?? ''
              )
            : '';
        const notEquals = block.where!.not_equals;
        return notEquals !== null && notEquals !== undefined
          ? value !== notEquals
          : value === block.where!.equals;
      })
    : allItems;
  if (items.length === 0) {
    return null;
  }

  // A column whose sub-option did not run has no data behind it,
  // so it is dropped rather than rendered empty.
  // For example, IntAct's table is 2 to 6 columns wide.
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
  // should be shown once above the table.
  const lifted = selectedColumns.filter(
    (column) =>
      column.lift_when_invariant && invariantValue(column, items) !== null
  );
  const columns = selectedColumns.filter((column) => !lifted.includes(column));

  const renderTable = (rows: unknown[]) => {
    // Computed per table rather than per row: the runs are a property of the
    // whole list, and recomputing them for each row would be quadratic.
    const merges = columns.map((column) => mergePlan(column, rows));

    const bodyRow = (
      element: unknown,
      rowIndex: number,
      renderedCount = rows.length
    ) => (
      <tr key={rowIndex}>
        {columns.map((column, colIndex) => {
          const merge = merges[colIndex];
          if (merge?.covered.has(rowIndex)) {
            return null;
          }
          const span = merge?.spanAt.get(rowIndex);
          if (!span) {
            return (
              <td key={colIndex} className={cellClass(column)}>
                {tableCellContent(column, element, spec)}
              </td>
            );
          }
          const visibleSpan = Math.min(span.span, renderedCount - rowIndex);
          return (
            <td
              key={colIndex}
              className={cellClass(column)}
              rowSpan={visibleSpan > 1 ? visibleSpan : undefined}
            >
              {tableCellContent(column, span.element, spec)}
            </td>
          );
        })}
      </tr>
    );
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
              rows.map((row, index) => bodyRow(row, index))
            )}
          </tbody>
        </table>
      </div>
    );
  };

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

  const withLifted =
    lifted.length === 0 ? (
      body
    ) : (
      <>
        {lifted.map((column, index) => (
          <Row
            key={`lifted-${index}`}
            label={column.label}
            value={tableCellContent(column, items[0], spec)}
          />
        ))}
        {body}
      </>
    );

  return withHeading(block, level, withLifted, entities);
};

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
  level: number // The heading nesting depth for this block: 0 for a block directly under the option
): ReactNode | null => {
  if (block.when && !whenSatisfied(block.when, spec, entities)) {
    return null;
  }

  if (
    block.requires_selected &&
    !entities.subOptionRan(
      block.requires_selected.id,
      block.requires_selected.default ?? false
    )
  ) {
    return null;
  }

  if (
    block.view &&
    block.view !== (entities.showAll ? 'show_all' : 'default')
  ) {
    return null;
  }

  if (block.kind === 'group') {
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

  if (block.requires && !readPlugin(block.requires, spec, entities)) {
    return null;
  }
  if (block.kind === 'list') {
    return renderListBlock(block, spec, entities, level);
  }
  if (block.kind === 'map_rows') {
    return renderMapRowsBlock(block, spec, entities, level);
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
  // When there is no designated heading at the option's level,
  // then the first available row becomes the option's visible title.
  // Examples: REVEL, CADD, SPDI.
  return renderRowGroup(rows, level, (label) =>
    claimHelp(label, entities, level)
  );
};

export const renderDisplayOption = (args: {
  option: DisplayOptionSpec;
  spec: DisplaySpec;
  consequence: AnnotatedEntity | null | undefined;
  allele: AnnotatedEntity | null | undefined;
  showAll?: boolean;
  subOptionRan?: (optionId: string, defaultValue: boolean) => boolean;
  genomeId?: string;
  protvarUrl?: string;
  openTargetsVariantId?: string;
  help?: OptionHelp;
  vocabularies?: Record<string, VocabularyEntry[]>;
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
    help,
    vocabularies
  } = args;
  const entities: Entities = {
    consequence,
    allele,
    vocabularies,
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

  return option.heading ? (
    <OptionBlock label={claimHelp(option.heading, entities, 0)} level={0}>
      {body}
    </OptionBlock>
  ) : (
    <>{body}</>
  );
};
