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

import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';

import type { RegulatoryFeatureMessage } from '../activityViewerPopupMessageTypes';

import styles from './AcrivityViewerPopupContent.module.css';

type Props = {
  content: RegulatoryFeatureMessage['content'];
};

const RegulatoryFeaturePopupContent = (props: Props) => {
  const { content: feature } = props;

  return (
    <div>
      <div className={styles.regularRow}>
        <span className={styles.light}>Regulatory feature </span>
        {feature.id}
      </div>
      <div className={styles.regularRow}>
        <span className={styles.light}>Type </span>
        <span>{feature.feature_type}</span>
      </div>
      <div className={styles.light}>
        <span className={styles.light}>Core </span>
        <span>
          {getFormattedLocation({
            chromosome: feature.region_name,
            start: feature.start,
            end: feature.end
          })}
        </span>
      </div>
      {feature.extended_start && feature.extended_end && (
        <div className={styles.light}>
          <span className={styles.light}>Bounds </span>
          <span>
            {getFormattedLocation({
              chromosome: feature.region_name,
              start: feature.extended_start,
              end: feature.extended_end
            })}
          </span>
        </div>
      )}
    </div>
  );
};

export default RegulatoryFeaturePopupContent;
