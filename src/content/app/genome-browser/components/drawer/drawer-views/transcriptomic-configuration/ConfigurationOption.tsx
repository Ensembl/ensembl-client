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

import { useId } from 'react';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import styles from './TranscriptomicConfiguration.module.css';

export default function ConfigurationOption({
  label,
  count,
  checked,
  disabled,
  onChange
}: {
  label: string;
  count?: number;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}) {
  const countId = useId();
  return (
    <label className={styles.option}>
      <span>{label}</span>
      {count !== undefined && (
        <span id={countId} className={styles.count}>
          {count}
        </span>
      )}
      <Checkbox
        aria-label={label}
        aria-describedby={count === undefined ? undefined : countId}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
