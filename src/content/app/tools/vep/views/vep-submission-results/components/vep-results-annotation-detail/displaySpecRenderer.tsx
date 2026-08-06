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

import QuestionButton from 'src/shared/components/question-button/QuestionButton';
import TruncatedList, {
  type TruncatedListToggleProps
} from 'src/content/app/tools/vep/components/truncated-list/TruncatedList';
import ExternalLinkIcon from 'src/content/app/tools/vep/components/external-link-icon/ExternalLinkIcon';
import Chevron from 'src/shared/components/chevron/Chevron';
import StarRating from 'src/content/app/tools/vep/components/star-rating/StarRating';
import ViewInAppPopup from 'src/shared/components/view-in-app-popup/ViewInAppPopup';

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
  /**
   * Row sets a block cannot name up front, keyed by vocabulary name (see
   * `map_rows`). The allele frequencies are the case that needs it: which
   * populations a job carries is chosen per submission, and their labels are
   * decoded by the backend, so neither can be written into the spec.
   *
   * Threaded like `linkContext` rather than baked into the DSL — the block says
   * *which* vocabulary it wants, and knows nothing about where it came from.
   */
  vocabularies?: Record<string, VocabularyEntry[]>;
};

/** One row a `map_rows` block can draw: which slice it belongs to, the key it
 *  reads from the dict, and what to label it. */
export type VocabularyEntry = {
  scope: string;
  code: string;
  label: string;
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
 * The loose form of a rating term: case-folded, with `_` read as a space.
 *
 * ClinVar writes review status as `criteria_provided,_single_submitter` while
 * the scale is authored as the phrase a reader would recognise. Comparing both
 * in this form lets each stay as it is instead of one mirroring the other's
 * punctuation.
 */
const ratingTermKey = (term: string): string =>
  term.toLowerCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * A value's rating on the named scale, or null when there is nothing to show.
 *
 * Null for an unknown *term* as much as an unknown scale: sources add wording
 * without warning, and no stars reads as "not rated here", which is true, where
 * zero stars would be a claim the source never made. (A term the scale does map
 * to zero still draws its four empty stars — that is a rating.)
 */
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
                <ExternalLinkIcon />
                {row.help_link.label ?? 'Read more'}
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
  // An external link whose URL comes from a named builder (ProtVar) wraps the
  // value the same way a templated one does — icon, then the value as the link
  // text. It used to trail the value as a bare icon, which is the one place the
  // house rule was still broken.
  if (row.link?.kind === 'external' && row.link.builder) {
    const text = isAbsent(value)
      ? null
      : (formatValue(value, row.format ?? 'text') ?? null);
    return {
      key: row.key ?? undefined,
      label: rowLabel(row),
      value,
      mono: row.mono ?? undefined,
      valueNode:
        text === null
          ? null
          : (renderLink(row.link, entities.linkContext, text) ?? text)
    };
  }
  // An external link with a URL template wraps the value in an anchor (the value
  // becomes the clickable link, led by the icon, e.g. the ClinVar variation id
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
        <ExternalLink
          template={row.link.template}
          fields={{ value: String(value) }}
        >
          {formatValue(value, row.format ?? 'text')}
        </ExternalLink>
      )
    };
  }
  // A row that stacks a list: one rendered line per element under one label,
  // borrowing the element shape a list block repeats. An empty list drops the
  // row, as an absent scalar would.
  if (row.item) {
    const all = Array.isArray(value) ? value : [];
    // One list shown in two places: the germline classification above the
    // germline conditions, the somatic ones above theirs.
    const elements = row.where
      ? all.filter((e) => matchesFilter(row.where!, e))
      : all;
    const cells = row.item.cells;
    // Stacked lines read as a small table — a classification type, its rating,
    // its term — so the cells share columns down the stack rather than each
    // line packing its own. Every cell keeps its slot even when it renders
    // nothing, or a line missing one would pull the rest out of step.
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
      // Several columns of content cannot live in the half-width the label
      // leaves it; the stack takes its own lines beneath the label instead.
      stacked: true,
      valueNode: elements.length ? body : null
    };
  }
  // A rating in front of the value (ClinVar's review status as stars). Only for
  // a value that is actually there — an absent one falls through so `placeholder`
  // still decides whether the row drops or shows a dash.
  if (row.stars && !isAbsent(value)) {
    const text = formatValue(value, row.format ?? 'text');
    return {
      key: row.key ?? undefined,
      label: rowLabel(row),
      value,
      mono: row.mono ?? undefined,
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
    mono: row.mono ?? undefined,
    placeholder,
    // Shown by renderRows only next to a real value (ProtVar's icon).
    link: row.link ? renderLink(row.link, entities.linkContext) : undefined
  };
};

// --- list blocks (repeat + link + truncate) ---------------------------------

const MoreToggle = (props: TruncatedListToggleProps) => (
  <button
    type="button"
    className={styles.phenotypeToggle}
    onClick={props.toggle}
  >
    {props.isExpanded ? 'Show fewer' : `+ ${props.hiddenCount} more`}
  </button>
);

/** Fill a `{field}` template from an item's fields, for display text. */
const interpolate = (template: string, item: Record<string, unknown>): string =>
  template.replace(/\{(\w+)\}/g, (_match, field) => String(item[field] ?? ''));

/**
 * The same, for a URL — or null when no usable one can be built.
 *
 * Two ways that happens. A field the template names may be absent, and filling
 * it with '' silently truncates the URL: the GO cell reads `name` but links
 * `{id}`, so a term with a name and no id linked to `.../amigo/term/`. And the
 * whole href may come from the data (`template: "{value}"` with `link_from`),
 * where the scheme is whatever the parse put there.
 *
 * No link is better than a broken one, so both cases fall back to plain text.
 * Values are *not* percent-encoded: they routinely carry characters that are
 * URL-significant and intended — a MaveDB URN is `urn:mavedb:00000001-a-1` —
 * and encoding them would break links that work today. `#` is the exception,
 * and not a matter of taste: a MaveDB *accession* is
 * `urn:mavedb:00000045-a-1#2010`, and left raw the browser reads everything
 * from the '#' as a fragment and never sends it, so a template that puts the
 * accession in a query string loses both it and anything after it. There is no
 * reading of a '#' *inside a value* as anything but a literal, so it is always
 * safe to escape — unlike ':' or '/', which a value may well mean structurally.
 */
const HASH_IN_VALUE = /#/g;

const interpolateUrl = (
  template: string,
  item: Record<string, unknown>
): string | null => {
  let usable = true;
  const url = template.replace(/\{(\w+)\}/g, (_match, field) => {
    const value = item[field];
    if (value === null || value === undefined || value === '') {
      usable = false;
      return '';
    }
    return String(value).replace(HASH_IN_VALUE, '%23');
  });
  return usable && /^https?:\/\//i.test(url) ? url : null;
};

/**
 * A value linked out, or the value alone when there is no usable URL.
 *
 * The house shape in one place — the icon leads, the value is the blue text —
 * and, more to the point, the URL is built here too. Eight call sites had
 * grown their own copy of this anchor and they had drifted: only some passed
 * `mono`, only some added `nowrap`, and only the two newest refused to render a
 * link they could not build.
 */
const ExternalLink = (props: {
  template: string;
  fields: Record<string, unknown>;
  className?: string;
  children: ReactNode;
}) => {
  const href = interpolateUrl(props.template, props.fields);
  if (href === null) {
    return <>{props.children}</>;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={props.className ?? styles.listLink}
    >
      <ExternalLinkIcon />
      {props.children}
    </a>
  );
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
  // This variant's ProtVar page. Like every link here it leads with the icon
  // and makes the value beside it the blue clickable text — the value is the
  // row's own (a stability score, a pocket's score), so the builder wraps it
  // rather than sitting alongside as a bare icon.
  protvar: (context, value) =>
    context.protvarUrl ? (
      <a
        href={context.protvarUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.listLink}
        aria-label="View in ProtVar"
      >
        <ExternalLinkIcon />
        {value}
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
        className={styles.listLink}
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
    // This builder puts the value in a URL, so unlike the others it needs the
    // string form; it is only ever used on a row, whose value is one.
    const id = String(value);
    if (!gene) {
      return value; // no gene (e.g. intergenic) — plain id, no popup
    }
    return (
      <ViewInAppPopup
        links={{
          entityViewer: {
            url: proteinFeatureExplorerUrl(context.genomeId, gene, id)
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
  // What the link wraps: a formatted row value, or a list item's rendered cells.
  value: ReactNode = ''
): ReactNode => {
  const builder = link.builder ? LINK_BUILDERS[link.builder] : undefined;
  return builder ? builder(context, value) : null;
};

/** One cell of a list item: its formatted value, as a link when `link` is set. */
/**
 * One rendered value, wherever it appears.
 *
 * A cell of a repeated item, a line of a list-valued table cell, and a plain
 * table cell are the same idea described three times, and the three had drifted
 * apart with no principle behind the gaps: `labels` and `template` existed on
 * one, `count_from` on another, stars were named by a field in one and stated
 * outright in another, and an absent value ended as `null` here and `''` there.
 *
 * This is what they share — read the field, format it, count it, rate it — so
 * that a capability belongs to *a value* rather than to whichever of the three
 * happened to grow it. How the value is then linked still differs by shape
 * (a stack of split links, a prefix-stripped run) and stays with each caller.
 */
export type ValuePiece = DisplayValuePiece & {
  /** A companion count rendered after the value: "Pathogenic (5)". Only a line
   *  of a list has one, but the resolver is the same either way. */
  count_from?: string | null;
};

export type ResolvedPiece = {
  /** The value as it came, before formatting — what a link is built from. */
  raw: unknown;
  /** The element as a record ({} when the element is a scalar). */
  fields: Record<string, unknown>;
  /** The formatted value on its own — what a link is split or built from. */
  value: string;
  /** What the reader sees: the value, plus its count where it has one. */
  text: string;
  /** The rating leading it, or null when this piece is not rated. */
  stars: ReturnType<typeof starRating>;
};

/**
 * Resolve one piece against an element, or null when it shows nothing.
 *
 * Nothing means nothing in every case now: an absent field, a format with no
 * output, and an empty string all drop the piece rather than leaving an empty
 * cell behind. Two of the three already did that; the third rendered an empty
 * span.
 */
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
  // The count belongs to what is *shown*, not to what is linked: a value that
  // both counts and splits would otherwise split on its own count.
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
  // An absent cell renders nothing — this drops an optional field (OpenTargets'
  // L2G score, a QTL biosample) rather than showing an empty cell, and keeps a
  // `num`/`with_score` format from being handed a null.
  const resolved = resolveValuePiece(cell, item, spec);
  if (resolved === null) {
    return null;
  }
  const { text, fields: record, stars: cellStars } = resolved;
  const key = cell.from ?? index;
  // A cell whose text is a sentence about the element rather than one of its
  // values ("1/44 submissions contribute to aggregate classification") has
  // nothing to link or rate — it is already prose.
  if (cell.template) {
    return <span key={key}>{text}</span>;
  }
  if (cell.link?.kind === 'external' && cell.link.template) {
    return (
      <ExternalLink
        key={key}
        template={cell.link.template}
        fields={record}
        className={
          cell.mono ? `${styles.listLink} ${styles.mono}` : styles.listLink
        }
      >
        {text}
      </ExternalLink>
    );
  }
  // Plain value. An optional `label` becomes a prefix, for a meta cell like
  // OpenTargets' "L2G 0.42". (Cell-level builder links are not used — a row's or
  // item's `link` carries the builder ones.)
  return (
    <span
      key={key}
      className={[
        cell.mono ? styles.mono : null,
        cell.nowrap ? styles.nowrap : null
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {withStars(cellStars, cell.label ? `${cell.label} ${text}` : text)}
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
  entities: Entities,
  spec: DisplaySpec
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
    .map((cell, index) => renderCell(cell, element, index, spec))
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
    ? renderLink(item.link, entities.linkContext, <>{cells}</>)
    : null;
  if (!label && !cells.length && !linkNode) {
    return null;
  }
  return (
    <Row
      label={label}
      // A builder link wraps the item's cells rather than trailing them, so the
      // icon leads and the cells are the blue clickable text — the same shape a
      // linked row has (ProtVar's pocket and interface scores).
      value={linkNode ?? cells}
    />
  );
};

/**
 * A block whose rows come from a vocabulary rather than from the spec.
 *
 * The values are read from a dict field, keyed by each vocabulary entry's code
 * — except the `""` entry, a source's all-ancestry figure, which the parse
 * keeps as its own scalar beside the dict.
 *
 * Every row is built as a `sub_option` RowSpec so the two views need no code
 * here at all: `renderRows` already drops a value-less sub-option row in the
 * default view and shows it as a dash under "Show all", which is exactly what
 * an unpopulated population should do.
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
    // The suffix names where a figure came from, so it belongs to the value and
    // is dropped with it — a dash must never read "— (European)".
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
      // The `sub_option` row rule, stated directly rather than borrowed: every
      // entry in the vocabulary was selected — that is what being there means —
      // so the default view drops the ones with no value, and "Show all" lists
      // all of them with a dash where the variant had none.
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

/** One line of a list-valued cell (see ColumnItems in the display spec). */
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
  // An optional prefix, as a cell has: "filed as <condition>".
  const label = items.label ? `${items.label} ${text}` : text;
  // An identifier's link is one thing: its icon must not be left on the line
  // above. Declared per item, never assumed — a linked condition *name* is
  // prose and has to wrap.
  const linkClass = items.nowrap
    ? `${styles.listLink} ${styles.nowrap}`
    : styles.listLink;

  const template =
    items.link?.kind === 'external' ? items.link.template : undefined;
  if (!template) {
    return withStars(stars, label);
  }
  // One value holding several, each its own link: a submission's cited papers
  // arrive as one '+'-joined list of PMIDs, and each is a separate paper.
  if (items.split) {
    const parts = value.split(items.split).filter(Boolean);
    return withStars(
      stars,
      <span className={styles.splitLinks}>
        {parts.map((part, index) => (
          <ExternalLink
            key={index}
            template={template}
            fields={{ value: part }}
            className={linkClass}
          >
            {part}
          </ExternalLink>
        ))}
      </span>
    );
  }
  const href = items.link_from ? record[items.link_from] : value;
  if (typeof href !== 'string' || href === '') {
    return withStars(stars, label);
  }
  return withStars(
    stars,
    <ExternalLink
      template={template}
      fields={{ value: href }}
      className={linkClass}
    >
      {label}
    </ExternalLink>
  );
};

/** Whether a list element passes a `where` filter (see DisplayWhereSpec). */
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
  // `not_equals` is what stops a value nobody anticipated falling between two
  // blocks and disappearing: one names what it wants, the other takes the rest.
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

/**
 * One line of a list-valued cell, with its own expander when the spec gives it
 * one and there is something behind it.
 *
 * Per line rather than per cell: a condition's classifications are counted
 * separately ("Pathogenic (5)", "Uncertain significance (1)"), so the submitters
 * behind each count belong to that count. One control over the whole cell would
 * open all of them together and make the reader re-do the grouping the parse
 * already did.
 */
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
  element: unknown,
  spec: DisplaySpec
): ReactNode => {
  const isRecord = !!element && typeof element === 'object';

  // A cell whose value is a list of objects renders one line per element — the
  // classifications a condition's submitters gave, or every RCV record covering
  // it. A condition can have several of either, and they stack. Resolved before
  // the shared piece, because a list is not a value to format.
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
          // A div, not a span: a line carrying an expander holds block content.
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
  // A column can ask to stay on one line as an item can — an accession's icon
  // and its id are one thing.
  const linkClass = column.nowrap
    ? `${styles.listLink} ${styles.nowrap}`
    : undefined;

  const template =
    column.link?.kind === 'external' ? column.link.template : undefined;
  if (!template) {
    return text;
  }

  // `link_from` points the link at a sibling field of the same element: the
  // reader sees the condition's name, the href is the URL resolved for it in
  // the parse. No URL there means no link, not a broken one.
  if (column.link_from) {
    const href = isRecord
      ? (element as Record<string, unknown>)[column.link_from]
      : null;
    if (typeof href !== 'string' || href === '') {
      return text;
    }
    return (
      <ExternalLink
        template={template}
        fields={{ value: href }}
        className={linkClass}
      >
        {text}
      </ExternalLink>
    );
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
        <ExternalLink
          template={template}
          fields={{ value }}
          className={linkClass}
        >
          {value}
        </ExternalLink>
      </Fragment>
    );
  });
};

/**
 * A column's alignment class, or undefined for the default (left).
 *
 * The house rule is by data type: text reads left, numbers read right, so a
 * column of figures lines up on its digits. That is derived from the format —
 * `num` and `count` produce numbers — so a spec normally says nothing. `align`
 * overrides it for the one case a format cannot express: a number the source
 * publishes pre-formatted as a string, like OpenTargets' `2.033e-47`.
 */
const NUMERIC_FORMATS: ReadonlySet<string> = new Set(['num', 'count']);

const alignmentClass = (
  column: Pick<DisplayTableColumnSpec, 'format' | 'align'>
): string | undefined => {
  const align =
    column.align ??
    (column.format && NUMERIC_FORMATS.has(column.format) ? 'right' : 'left');
  return align === 'right' ? styles.alignRight : undefined;
};

/** A cell's classes: the alignment rule, plus monospacing when asked for. */
const cellClass = (
  column: Pick<DisplayTableColumnSpec, 'format' | 'align' | 'mono'> | undefined
): string | undefined => {
  if (!column) {
    return undefined;
  }
  const classes = [alignmentClass(column), column.mono ? styles.mono : null];
  const used = classes.filter(Boolean);
  return used.length ? used.join(' ') : undefined;
};

// The header row shared by both table modes.
const tableHead = (columns: DisplayTableBlockSpec['columns']): ReactNode => (
  <thead>
    <tr>
      {columns.map((column, index) => (
        <th key={index} className={alignmentClass(column)}>
          {column.label}
          {(column.notes ?? []).map((note, noteIndex) => (
            <span
              key={noteIndex}
              className={
                note.muted
                  ? `${styles.columnNote} ${styles.columnNoteMuted}`
                  : styles.columnNote
              }
            >
              {note.text}
            </span>
          ))}
        </th>
      ))}
    </tr>
  </thead>
);

/**
 * A heading indents its children (see `Indented` in annotationRows). A table
 * marked `indent` takes the same wrapper without a heading, so an unheaded table
 * lines up with the headed sections it sits beside instead of standing a step out
 * from them (the ClinVar phenotype table beside the grouped ones).
 */
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
  // `indent` applies to a headed block too: a heading of its own says what the
  // block is, not what it belongs to. ClinVar's Germline and Somatic tables are
  // both named and subordinate — they belong under the Classification above
  // them, and sat flush against it while their own contents were indented.
  return block.indent ? (
    <Indented className={styles.optionChildren}>{headed}</Indented>
  ) : (
    headed
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
          <td key={colIndex} className={cellClass(column)}>
            {tableCellContent(column, element, spec)}
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
            value={tableCellContent(column, items[0], spec)}
            mono={column.mono ?? undefined}
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
  // Row sets a `map_rows` block draws from, keyed by vocabulary name — the AF
  // populations this job selected. Optional: an option with no such block, and
  // every existing caller, is unaffected.
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
