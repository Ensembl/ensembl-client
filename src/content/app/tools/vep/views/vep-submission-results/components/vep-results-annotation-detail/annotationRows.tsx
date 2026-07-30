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

import type { ReactNode } from 'react';

import QuestionButton from 'src/shared/components/question-button/QuestionButton';
// The form's help renderer, reused so one OptionHelp renders identically on the
// form and against the matching results heading.
import OptionHelpText from 'src/content/app/tools/vep/views/vep-form/vep-form-options-section/vep-form-options-panel/OptionHelpText';

import {
  num,
  humanizeClass,
  normalizePhenotype,
  joinList,
  humanizeJoin,
  count
} from 'src/content/app/tools/vep/utils/annotationFormatters';

import type { OptionHelp } from 'src/content/app/tools/vep/types/vepFormConfig';

import styles from './VepResultsAnnotationDetail.module.css';

/**
 * An option's title in the results with its help (?) beside it — the same text
 * the form shows for that option, so a reader who skipped the form still gets
 * the explanation, and the two can never disagree.
 *
 * Returns the label untouched when there is no help, so an option without any
 * renders exactly as before.
 */
export const withOptionHelp = (
  label: ReactNode,
  help: OptionHelp | undefined
): ReactNode =>
  help ? (
    <span className={styles.labelWithHelp}>
      {label}
      <QuestionButton
        helpText={<OptionHelpText help={help} />}
        className={{ inline: styles.rowHelpIcon }}
      />
    </span>
  ) : (
    label
  );

/**
 * The labelled-row vocabulary of the annotation detail panel.
 *
 * Most annotations are "a heading and some label/value rows", differing only in
 * which value each row reads and how it is formatted. Describing them as data
 * (RowSpec) rather than as bespoke JSX keeps that shape in one place — and is
 * the vocabulary a later declarative (spec-driven) display layer will target.
 */

// `emphasis` marks a row whose label *is* a top-level option name (a
// single-value option like REVEL / SPDI, rendered as one label/value line
// rather than a heading-plus-rows block). It gets the top-level option label
// style so those options read the same weight/size as a multi-value option's
// heading (popEVE). Nested value rows leave it off and stay plain.
export const Row = (props: {
  label: ReactNode;
  value: ReactNode;
  mono?: boolean;
  emphasis?: boolean;
  /**
   * A row that is only its value — no label opposite it. Rendered left-aligned
   * under its heading rather than pushed to the far edge by the label/value
   * `space-between` (the OpenTargets variant link).
   */
  plain?: boolean;
}) =>
  props.plain ? (
    <div className={`${styles.row} ${styles.plainRow}`}>
      <span className={props.mono ? styles.mono : undefined}>
        {props.value}
      </span>
    </div>
  ) : (
    <div className={styles.row}>
      <span className={props.emphasis ? styles.optionLabel : styles.rowLabel}>
        {props.label}
      </span>
      <span className={props.mono ? styles.mono : undefined}>
        {props.value}
      </span>
    </div>
  );

/**
 * The one place the annotation panel's indent step is applied.
 *
 * Everything that sits beneath a heading goes through here, so "a heading
 * indents its content" is a property of the code rather than a rule each call
 * site has to remember — which is how the category headings ended up flat.
 * `className` carries the container's own layout (the gap differs by context);
 * the indent itself is never restated.
 */
export const Indented = (props: {
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={
      props.className
        ? `${props.className} ${styles.indented}`
        : styles.indented
    }
  >
    {props.children}
  </div>
);

/**
 * A heading with its content indented beneath it — the shape shared by an
 * option heading and a category heading. They differ only in the label's
 * typography and the gap between the children, so those are the only knobs.
 */
const HeadingWithChildren = (props: {
  label: ReactNode;
  blockClass: string;
  labelClass: string;
  childrenClass: string;
  children: ReactNode;
}) => (
  <div className={props.blockClass}>
    <span className={props.labelClass}>{props.label}</span>
    <Indented className={props.childrenClass}>{props.children}</Indented>
  </div>
);

/**
 * An option whose output is more than a single value: the option's own label as
 * a sub-heading (below its panel/category) with its values beneath, so the
 * panel -> category -> option -> values hierarchy from the form_config contract
 * is preserved (e.g. "Dosage sensitivity" over pHaplo / pTriplo).
 *
 * `level` is the heading's nesting depth within the option (0 = the top-level
 * option heading, 1 = an intermediate sub-option, 2+ = a bottom sub-option), so
 * a sub-section reads as subordinate rather than a sibling: the label weight
 * steps down (bold -> semi-bold -> normal). The heading's *children* indent one
 * step, not the heading itself, and because a nested OptionBlock's children wrap
 * in another indented container the indent compounds — a level-2 block's content
 * sits two steps in.
 */
export const OptionBlock = (props: {
  /** ReactNode rather than string for the same reason as `Row`: a heading may
   *  carry an inline help (?) control. */
  label: ReactNode;
  children: ReactNode;
  level?: number;
}) => {
  const level = props.level ?? 0;
  const labelClass =
    level <= 0
      ? styles.optionLabel
      : level === 1
        ? styles.optionLabelIntermediate
        : styles.optionLabelPlain;
  return (
    <HeadingWithChildren
      label={props.label}
      blockClass={styles.optionBlock}
      labelClass={labelClass}
      childrenClass={styles.optionChildren}
    >
      {props.children}
    </HeadingWithChildren>
  );
};

/**
 * A panel's category heading (Locations, Missense, …) with its options beneath.
 *
 * The tier above OptionBlock: a category groups whole options, where an
 * OptionBlock groups one option's values. Its children keep the section body's
 * spacing rather than the tighter within-option gap, so grouping the options
 * changes their indent and nothing else.
 */
export const CategoryBlock = (props: {
  label: ReactNode;
  children: ReactNode;
}) => (
  <HeadingWithChildren
    label={props.label}
    blockClass={styles.categoryBlock}
    labelClass={styles.categoryLabel}
    childrenClass={styles.categoryChildren}
  >
    {props.children}
  </HeadingWithChildren>
);

export type RowFormat =
  | 'text'
  | 'num'
  | 'humanize'
  | 'phenotype'
  | 'join'
  | 'humanize_join'
  | 'count';

export type RowSpec = {
  /**
   * ReactNode rather than string: a label may carry an inline control, e.g.
   * popEVE's gap frequency and its help (?) button.
   */
  label: ReactNode;
  value: unknown;
  /** How to render the value; `text` (stringify as-is) by default. */
  format?: RowFormat;
  mono?: boolean;
  /**
   * What to render when the value is absent. When set (SpliceAI uses '—') the
   * row is kept and shows this; when unset the row is dropped entirely.
   */
  placeholder?: string;
  /** Defaults to the row's position, which is stable for these fixed lists. */
  key?: string;
  /** See `Row.plain`: the row is its value alone, left-aligned. */
  plain?: boolean;
  /**
   * A trailing element on the value — ProtVar's link icon. Shown only next to a
   * real value, never on a placeholder/dash row (as the old summary did).
   */
  link?: ReactNode;
  /**
   * A pre-rendered value node that replaces the formatted value entirely — an
   * app-popup-wrapped value (the protein id). `null` means the value was absent,
   * so the row drops; `undefined` (the usual case) means format `value` instead.
   */
  valueNode?: ReactNode;
};

// Absent = nothing to show. `0` and `false` are real values (SpliceAI deltas),
// so only null/undefined and the empty string count as absent — matching the
// truthiness checks these rows replace.
export const isAbsent = (value: unknown) =>
  value === null || value === undefined || value === '';

export const formatValue = (
  value: unknown,
  format: RowFormat = 'text'
): string | null => {
  switch (format) {
    case 'num':
      return num(value as number);
    case 'humanize':
      return humanizeClass(String(value));
    case 'phenotype':
      return normalizePhenotype(String(value));
    case 'join':
      return joinList(value as string[]);
    case 'humanize_join':
      return humanizeJoin(value as string[]);
    case 'count':
      return count(value);
    case 'text':
    default:
      return String(value);
  }
};

/**
 * Turn row specs into <Row> elements: format each value, and either drop or
 * placeholder the rows whose value is absent. `emphasis` marks these as
 * top-level option rows (see Row) — set only for a headingless group at the
 * option's own level, not for value rows nested under a heading.
 */
export const renderRows = (
  rows: RowSpec[],
  emphasis = false,
  /**
   * Applied to the label of the first row that actually renders — not the first
   * in the list, which may be dropped for an absent value. Used to hang the
   * option's help (?) on a headingless option's title row, where that row *is*
   * the option's visible title.
   */
  decorateFirstLabel?: (label: ReactNode) => ReactNode
): ReactNode[] => {
  const nodes: ReactNode[] = [];
  const label = (raw: ReactNode): ReactNode => {
    if (!decorateFirstLabel || nodes.length > 0) {
      return raw;
    }
    return decorateFirstLabel(raw);
  };
  rows.forEach((row, index) => {
    // A pre-rendered value (an app-popup-wrapped id) bypasses formatting; a
    // null one means the underlying value was absent, so the row drops.
    if (row.valueNode !== undefined) {
      if (row.valueNode !== null) {
        nodes.push(
          <Row
            key={row.key ?? index}
            label={label(row.label)}
            value={row.valueNode}
            mono={row.mono}
            emphasis={emphasis}
            plain={row.plain}
          />
        );
      }
      return;
    }
    const formatted = isAbsent(row.value)
      ? null
      : formatValue(row.value, row.format);
    // 'join' can also come back null (an empty list), which is equally absent.
    if (formatted === null) {
      if (row.placeholder === undefined) {
        return;
      }
      nodes.push(
        <Row
          key={row.key ?? index}
          label={label(row.label)}
          value={row.placeholder}
          mono={row.mono}
          emphasis={emphasis}
          plain={row.plain}
        />
      );
      return;
    }
    nodes.push(
      <Row
        key={row.key ?? index}
        label={label(row.label)}
        value={
          row.link ? (
            <>
              {formatted} {row.link}
            </>
          ) : (
            formatted
          )
        }
        mono={row.mono}
        emphasis={emphasis}
        plain={row.plain}
      />
    );
  });
  return nodes;
};

/**
 * The rows as a fragment, or null when none of them survived. `level` is the
 * rows' own nesting depth: at the option's top level (0) each row *is* a
 * single-value option, so its label gets the top-level option style; nested
 * (>=1) they are plain value rows under a heading.
 */
export const renderRowGroup = (
  rows: RowSpec[],
  level = 0,
  decorateFirstLabel?: (label: ReactNode) => ReactNode
): ReactNode | null => {
  const nodes = renderRows(rows, level === 0, decorateFirstLabel);
  return nodes.length ? <>{nodes}</> : null;
};

/**
 * The common "option heading with its rows beneath" shape: an OptionBlock, or
 * null when no row survived (so the heading never shows on its own). `level` is
 * the heading's nesting depth (see OptionBlock); its rows are the heading's
 * children (plain value rows), so they are never emphasised.
 */
export const renderRowBlock = (
  label: ReactNode,
  rows: RowSpec[],
  level = 0
): ReactNode | null => {
  const nodes = renderRows(rows);
  return nodes.length ? (
    <OptionBlock label={label} level={level}>
      {nodes}
    </OptionBlock>
  ) : null;
};
