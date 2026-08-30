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

import classNames from 'classnames';
import type { ReactNode } from 'react';

import {
  num,
  humanizeClass,
  humanizeTerms,
  normalizePhenotype,
  joinList,
  humanizeJoin,
  count
} from 'src/content/app/tools/vep/utils/annotationFormatters';

import QuestionButton from 'src/shared/components/question-button/QuestionButton';
import OptionHelpText from 'src/content/app/tools/vep/views/vep-form/vep-form-options-section/vep-form-options-panel/OptionHelpText';

import type { OptionHelp } from 'src/content/app/tools/vep/types/vepFormConfig';

import styles from './VepResultsAnnotationDetail.module.css';

export const withOptionHelp = (
  label: ReactNode,
  help: OptionHelp | undefined
): ReactNode =>
  help ? (
    <span className={styles.labelWithHelp}>
      {label}
      <QuestionButton
        helpText={<OptionHelpText help={help} />}
        className={styles.rowHelpIcon}
      />
    </span>
  ) : (
    label
  );

export const Row = (props: {
  label: ReactNode;
  value: ReactNode;
  emphasis?: boolean;
  /**
   * A row that is only its value (no label opposite it).
   * Rendered left-aligned under its heading
   * Example: the OpenTargets variant link.
   */
  plain?: boolean;
  /**
   * A value too wide to sit opposite its label: the label takes a line of its
   * own and the value goes beneath it, indented.
   * Example: ClinVar's classification per type.
   */
  stacked?: boolean;
  strong?: boolean;
}) => {
  const contentStyles =
    classNames({
      [styles.strongValue]: props.strong,
      [styles.stackedRowValue]: props.stacked
    }) ?? undefined;

  if (props.plain) {
    const rowStyles = classNames(styles.row, styles.plainRow);
    return (
      <div className={rowStyles}>
        <span className={contentStyles}>{props.value}</span>
      </div>
    );
  }

  const rowStyles = classNames(styles.row, {
    [styles.stackedRow]: props.stacked,
    [styles.standaloneStack]: props.stacked && !props.label
  });

  return (
    <div className={rowStyles}>
      {props.label ? (
        <span className={props.emphasis ? styles.optionLabel : styles.rowLabel}>
          {props.label}
        </span>
      ) : null}
      <span className={contentStyles}>{props.value}</span>
    </div>
  );
};

export const Indented = (props: {
  className?: string;
  children: ReactNode;
}) => (
  <div className={classNames(props.className, styles.indented)}>
    {props.children}
  </div>
);

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

export const OptionBlock = (props: {
  label: ReactNode;
  children: ReactNode;
  level?: number; // the heading's nesting depth within the option
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
  | 'count'
  | 'humanize_terms';

export type RowSpec = {
  label: ReactNode;
  value: unknown;
  format?: RowFormat; // How to render the value; "text" by default
  mono?: boolean; // Use monospace font-family
  placeholder?: string; // What to render when the value is absent. When unset, empty row is dropped
  key?: string;
  plain?: boolean;
  stacked?: boolean;
  link?: ReactNode;
  /**
   * A pre-rendered value node that replaces the formatted value entirely — an
   * app-popup-wrapped value (the protein id). `null` means the value was absent,
   * so the row drops; `undefined` (the usual case) means format `value` instead.
   */
  valueNode?: ReactNode;
};

// Absent = nothing to show.
// `0` and `false` are real values (SpliceAI deltas),
// so only null/undefined and the empty string count as absent.
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
    case 'humanize_terms':
      return humanizeTerms(String(value));
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

export const renderRows = (
  rows: RowSpec[],
  emphasis = false,
  decorateFirstLabel?: (label: ReactNode) => ReactNode // A function that adds the help button to the label
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
            emphasis={emphasis}
            plain={row.plain}
            stacked={row.stacked}
          />
        );
      }
      return;
    }
    const formatted = isAbsent(row.value)
      ? null
      : formatValue(row.value, row.format);
    if (formatted === null) {
      if (row.placeholder === undefined) {
        return;
      }
      nodes.push(
        <Row
          key={row.key ?? index}
          label={label(row.label)}
          value={row.placeholder}
          emphasis={emphasis}
          plain={row.plain}
        />
      );
      return;
    }

    // Note that the value of this row is bolded.
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
        emphasis={emphasis}
        plain={row.plain}
        strong
      />
    );
  });
  return nodes;
};

export const renderRowGroup = (
  rows: RowSpec[],
  level = 0, // rows' own nesting depth
  decorateFirstLabel?: (label: ReactNode) => ReactNode
): ReactNode | null => {
  const nodes = renderRows(rows, level === 0, decorateFirstLabel);
  return nodes.length ? <>{nodes}</> : null;
};

/**
 * The common "option heading with its rows beneath" shape.
 */
export const renderRowBlock = (
  label: ReactNode,
  rows: RowSpec[],
  level = 0 // heading's nesting depth
): ReactNode | null => {
  const nodes = renderRows(rows);
  return nodes.length ? (
    <OptionBlock label={label} level={level}>
      {nodes}
    </OptionBlock>
  ) : null;
};
