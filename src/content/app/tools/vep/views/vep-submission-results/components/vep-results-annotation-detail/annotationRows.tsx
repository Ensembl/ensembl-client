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

import {
  num,
  humanizeClass,
  normalizePhenotype,
  joinList,
  humanizeJoin,
  count
} from 'src/content/app/tools/vep/utils/annotationFormatters';

import styles from './VepResultsAnnotationDetail.module.css';

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
}) => (
  <div className={styles.row}>
    <span className={props.emphasis ? styles.optionLabel : styles.rowLabel}>
      {props.label}
    </span>
    <span className={props.mono ? styles.mono : undefined}>{props.value}</span>
  </div>
);

// An option whose output is more than a single value: renders the option's own
// label as a sub-heading (below its panel/category) with its values beneath, so
// the panel -> category -> option -> values hierarchy from the form_config
// contract is preserved (e.g. "Dosage sensitivity" over pHaplo / pTriplo).
//
// `level` is the heading's nesting depth within the option (0 = the top-level
// option heading, 1 = an intermediate sub-option, 2+ = a bottom sub-option), so
// a sub-section reads as subordinate rather than a sibling: the label weight
// steps down (bold -> semi-bold -> normal). The heading's *children* indent one
// step (not the heading itself), and because a nested OptionBlock's children
// wrap in another indented container the indent compounds — a level-2 block's
// content sits two steps in.
export const OptionBlock = (props: {
  label: string;
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
    <div className={styles.optionBlock}>
      <span className={labelClass}>{props.label}</span>
      <div className={styles.optionChildren}>{props.children}</div>
    </div>
  );
};

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
const isAbsent = (value: unknown) => value == null || value === '';

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
  emphasis = false
): ReactNode[] => {
  const nodes: ReactNode[] = [];
  rows.forEach((row, index) => {
    // A pre-rendered value (an app-popup-wrapped id) bypasses formatting; a
    // null one means the underlying value was absent, so the row drops.
    if (row.valueNode !== undefined) {
      if (row.valueNode !== null) {
        nodes.push(
          <Row
            key={row.key ?? index}
            label={row.label}
            value={row.valueNode}
            mono={row.mono}
            emphasis={emphasis}
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
          label={row.label}
          value={row.placeholder}
          mono={row.mono}
          emphasis={emphasis}
        />
      );
      return;
    }
    nodes.push(
      <Row
        key={row.key ?? index}
        label={row.label}
        value={row.link ? <>{formatted} {row.link}</> : formatted}
        mono={row.mono}
        emphasis={emphasis}
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
  level = 0
): ReactNode | null => {
  const nodes = renderRows(rows, level === 0);
  return nodes.length ? <>{nodes}</> : null;
};

/**
 * The common "option heading with its rows beneath" shape: an OptionBlock, or
 * null when no row survived (so the heading never shows on its own). `level` is
 * the heading's nesting depth (see OptionBlock); its rows are the heading's
 * children (plain value rows), so they are never emphasised.
 */
export const renderRowBlock = (
  label: string,
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
