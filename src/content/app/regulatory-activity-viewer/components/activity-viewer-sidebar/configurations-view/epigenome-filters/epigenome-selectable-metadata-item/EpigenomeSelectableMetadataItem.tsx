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

import { memo, type FormEvent } from 'react';

import Checkbox from 'src/shared/components/checkbox/Checkbox';

import styles from './EpigenomeSelectableMetadataItem.module.css';

type Props = {
  name: string;
  dimensionName: string;
  count: number;
  isSelected: boolean;
  onAdd: (payload: { dimensionName: string; value: string }) => void;
  onRemove: (payload: { dimensionName: string; value: string }) => void;
};

const EpigenomeSelectableMetadataItem = (props: Props) => {
  const onChange = (event: FormEvent<HTMLInputElement>) => {
    const dimensionName = props.dimensionName;
    const metadataName = props.name;
    const isChecked = event.currentTarget.checked;

    if (isChecked) {
      props.onAdd({ dimensionName, value: metadataName });
    } else {
      props.onRemove({ dimensionName, value: metadataName });
    }
  };

  return (
    <div className={styles.grid}>
      <span>{props.name}</span>
      <span className={styles.count}>{props.count}</span>
      <Checkbox onChange={onChange} checked={props.isSelected} />
    </div>
  );
};

export default memo(EpigenomeSelectableMetadataItem);
