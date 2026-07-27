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

import { useState, useRef } from 'react';
import classNames from 'classnames';

import CheckboxWithLabel from 'src/shared/components/checkbox-with-label/CheckboxWithLabel';
import Chevron from 'src/shared/components/chevron/Chevron';
import VariantColour from 'src/shared/components/variant-color/VariantColor';
import useOutsideClick from 'src/shared/hooks/useOutsideClick';

import { CONSEQUENCE_OPTION_GROUPS } from './resultsFilterFields';

import styles from './VepResultsFilters.module.css';

type Props = {
  values: string[];
  onChange: (values: string[]) => void;
};

// All consequence terms in vocabulary order, so a selection is always reported
// in a stable order regardless of the order the user ticked them.
const ALL_TERMS = CONSEQUENCE_OPTION_GROUPS.flatMap((group) => group.options);

/**
 * The value editor for a consequence condition: a button summarising the current
 * selection that opens a scrollable panel of grouped consequence checkboxes.
 *
 * Uses a self-managed dropdown rather than the shared PointerBox: PointerBox
 * closes itself on any scroll (to reposition against its anchor), which makes an
 * inner scrollable list impossible to scroll.
 */
const ConsequenceMultiSelect = (props: Props) => {
  const { values, onChange } = props;
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selected = new Set(values);

  useOutsideClick(wrapperRef, () => setIsOpen(false));

  const emit = (next: Set<string>) => {
    onChange(ALL_TERMS.filter((term) => next.has(term)));
  };

  const toggleValue = (value: string) => {
    const next = new Set(selected);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    emit(next);
  };

  const toggleGroup = (options: string[], allSelected: boolean) => {
    const next = new Set(selected);
    for (const option of options) {
      if (allSelected) {
        next.delete(option);
      } else {
        next.add(option);
      }
    }
    emit(next);
  };

  const summary =
    values.length === 0 ? 'Select consequences' : `${values.length} selected`;

  return (
    <div className={styles.multiSelect} ref={wrapperRef}>
      <button
        type="button"
        className={classNames(styles.valueTrigger, {
          [styles.valueTriggerEmpty]: values.length === 0
        })}
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span>{summary}</span>
        <Chevron
          direction={isOpen ? 'up' : 'down'}
          className={styles.triggerChevron}
        />
      </button>
      {isOpen && (
        <div className={styles.optionsPanel}>
          <div className={styles.optionGroups}>
            {CONSEQUENCE_OPTION_GROUPS.map((group) => {
              const allSelected = group.options.every((option) =>
                selected.has(option)
              );
              return (
                <div className={styles.optionGroup} key={group.label}>
                  <button
                    type="button"
                    className={styles.groupHeading}
                    onClick={() => toggleGroup(group.options, allSelected)}
                  >
                    {group.label}
                    <span className={styles.groupToggle}>
                      {allSelected ? 'Clear' : 'All'}
                    </span>
                  </button>
                  {group.options.map((option) => (
                    <CheckboxWithLabel
                      key={option}
                      label={
                        <span className={styles.optionLabel}>
                          <VariantColour variantType={option} />
                          {option}
                        </span>
                      }
                      checked={selected.has(option)}
                      onChange={() => toggleValue(option)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsequenceMultiSelect;
