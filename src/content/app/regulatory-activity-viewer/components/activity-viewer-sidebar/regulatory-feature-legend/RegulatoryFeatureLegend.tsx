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

import type { RegulatoryFeatureMetadata } from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

import styles from './RegulatoryFeatureLegend.module.css';

type Props = {
  featureTypes: Record<string, RegulatoryFeatureMetadata>;
};

const RegulatoryFeatureLegend = (props: Props) => {
  return (
    <div>
      {Object.values(props.featureTypes).map((item) => (
        <div className={styles.item} key={item.label}>
          <span
            className={styles.colorKey}
            style={{ backgroundColor: item.color }}
          />
          <span className={styles.label}>
            <span className={styles.primaryText}>{item.label}</span>
            {item.description && (
              <span className={styles.secondaryText}>{item.description}</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default RegulatoryFeatureLegend;
