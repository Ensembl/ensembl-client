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

import { useId, type ReactNode } from 'react';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import Chevron from 'src/shared/components/chevron/Chevron';
import TextButton from 'src/shared/components/text-button/TextButton';
import styles from './TranscriptomicConfiguration.module.css';

export default function ConfigurationGroup({
  label,
  count,
  expanded,
  onToggle,
  selection,
  children
}: {
  label: string;
  count?: number;
  expanded: boolean;
  onToggle?: () => void;
  selection?: {
    ids: string[];
    selected: Set<string>;
    disabled: boolean;
    onChange: (ids: string[], checked: boolean) => void;
  };
  children: ReactNode;
}) {
  const bodyId = useId();
  const countId = useId();
  const checkedCount =
    selection?.ids.filter((id) => selection.selected.has(id)).length ?? 0;
  return (
    <section
      className={styles.group}
      aria-label={`${label} ${selection ? 'selections' : 'filter'}`}
    >
      <div className={styles.groupHeader}>
        {onToggle ? (
          <TextButton
            className={styles.groupToggle}
            aria-label={label}
            aria-describedby={count === undefined ? undefined : countId}
            aria-expanded={expanded}
            aria-controls={bodyId}
            onClick={onToggle}
          >
            <span className={styles.groupLabel}>{label}</span>
            <Chevron
              direction={expanded ? 'up' : 'down'}
              animate={true}
              aria-hidden={true}
            />
          </TextButton>
        ) : (
          <h4 className={styles.groupTitle}>
            <span className={styles.groupLabel}>{label}</span>
          </h4>
        )}
        {count !== undefined && (
          <span id={countId} className={styles.count}>
            {count}
          </span>
        )}
        {selection && (
          <Checkbox
            aria-label={label}
            aria-describedby={count === undefined ? undefined : countId}
            checked={checkedCount === selection.ids.length}
            disabled={selection.disabled}
            ref={(element) => {
              if (element)
                element.indeterminate =
                  checkedCount > 0 && checkedCount < selection.ids.length;
            }}
            onChange={(event) =>
              selection.onChange(selection.ids, event.target.checked)
            }
          />
        )}
      </div>
      <div id={bodyId} hidden={!expanded}>
        {expanded && children}
      </div>
    </section>
  );
}
