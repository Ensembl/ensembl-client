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

import CheckboxWithLabel from 'src/shared/components/checkbox-with-label/CheckboxWithLabel';

import type { FilterOption } from 'src/content/app/tools/vep/types/vepResultsFilters';

import styles from './VepResultsFilters.module.css';

type Props = {
  options: FilterOption[];
  values: string[];
  onChange: (values: string[]) => void;
};

/**
 * The value editor for the transcript-group condition: a small inline set of
 * checkboxes. The options are species-dependent (passed in), e.g. MANE Select /
 * MANE Plus Clinical / Canonical for human GRCh38, Canonical elsewhere.
 */
const TranscriptGroupSelect = (props: Props) => {
  const { options, values, onChange } = props;
  const selected = new Set(values);

  const toggle = (value: string) => {
    const next = new Set(selected);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    // Emit in the options' order for a stable, predictable value list.
    onChange(options.map((o) => o.value).filter((v) => next.has(v)));
  };

  return (
    <div className={styles.groupOptions}>
      {options.map((option) => (
        <CheckboxWithLabel
          key={option.value}
          label={option.label}
          checked={selected.has(option.value)}
          onChange={() => toggle(option.value)}
        />
      ))}
    </div>
  );
};

export default TranscriptGroupSelect;
