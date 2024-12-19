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

import ShowHide from 'src/shared/components/show-hide/ShowHide';
import { BiomartFilterStringType } from 'src/content/app/tools/biomart/state/biomartSlice';

import styles from '../../../BiomartForm.module.css';
import ShadedInput from 'src/shared/components/input/ShadedInput';

type BiomartIdentifierFilterProps = {
  label: string;
  data: BiomartFilterStringType;
  toggle: () => void;
  onStableIdChange: (value: string) => void;
};

const BiomartIdentifierFilter = (props: BiomartIdentifierFilterProps) => {
  return (
    <div className={styles.sectionFilterContainer}>
      <div className={styles.sectionTitleContainer}>
        <ShowHide
          label={props.label}
          isExpanded={props.data.expanded || false}
          onClick={props.toggle}
        />
      </div>
      {props.data.expanded && (
        <div className={styles.sectionSelectionContainer}>
          <div className={styles.biomartInput}>
            <ShadedInput
              type="string"
              value={props.data.input[0] || ''}
              onChange={(e) => props.onStableIdChange(e.target.value)}
              placeholder={props.label}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BiomartIdentifierFilter;
