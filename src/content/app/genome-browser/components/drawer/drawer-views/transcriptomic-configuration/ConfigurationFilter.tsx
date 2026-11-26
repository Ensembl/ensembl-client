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

import { toggleSelectionIds } from 'src/content/app/genome-browser/helpers/transcriptomic';

import ConfigurationGroup from './ConfigurationGroup';
import ConfigurationOption from './ConfigurationOption';

import styles from './TranscriptomicConfiguration.module.css';

type Props = {
  label: string;
  options: { value: string; count: number }[];
  selectedValues: string[];
  disabled: boolean;
  onChange: (values: string[]) => void;
};

const ConfigurationFilter = ({
  label,
  options,
  selectedValues,
  disabled,
  onChange
}: Props) => (
  <ConfigurationGroup label={label} expanded={true}>
    <div className={styles.filterValues}>
      <div className={styles.filterOptions}>
        {options.map(({ value, count }) => (
          <ConfigurationOption
            key={value}
            label={value}
            count={count}
            checked={selectedValues.includes(value)}
            disabled={disabled}
            onChange={(checked) =>
              onChange(toggleSelectionIds(selectedValues, [value], checked))
            }
          />
        ))}
      </div>
    </div>
  </ConfigurationGroup>
);

export default ConfigurationFilter;
