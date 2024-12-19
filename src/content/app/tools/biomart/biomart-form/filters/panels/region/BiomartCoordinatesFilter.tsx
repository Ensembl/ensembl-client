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

import ShadedInput from 'src/shared/components/input/ShadedInput';
import ShowHide from 'src/shared/components/show-hide/ShowHide';

import { BiomartFilterNumberType } from 'src/content/app/tools/biomart/state/biomartSlice';

import styles from '../../../BiomartForm.module.css';

type BiomartCoordinatesFilterProps = {
  label: string;
  data: BiomartFilterNumberType;
  toggle: () => void;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
};

const BiomartCoodinatesFilter = (props: BiomartCoordinatesFilterProps) => {
  let [start, end] = props.data.input;

  if (props.data.output && props.data.output.length > 0) {
    start = props.data.output[0];
    end = props.data.output[1];
  }

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
            <label>
              <span>Start</span>
              <ShadedInput
                type="number"
                value={start || ''}
                onChange={(e) => props.onStartChange(e.target.value)}
                placeholder="Start"
                disabled={true}
              />
            </label>
          </div>
          <div className={styles.biomartInput}>
            <label>
              <span>End</span>
              <ShadedInput
                type="number"
                value={end || ''}
                onChange={(e) => props.onEndChange(e.target.value)}
                placeholder="End"
                disabled={true}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiomartCoodinatesFilter;
