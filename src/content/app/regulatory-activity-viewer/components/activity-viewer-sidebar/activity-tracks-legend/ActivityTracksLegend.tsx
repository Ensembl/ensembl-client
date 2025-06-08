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

import { useAppSelector } from 'src/store';

import { getHistones } from 'src/content/app/regulatory-activity-viewer/state/ui/uiSelectors';

import styles from './ActivityTracksLegend.module.css';

type Props = {
  genomeId: string;
};

const ActivityTracksLegend = ({ genomeId }: Props) => {
  const histones = useAppSelector((state) => getHistones(state, genomeId));

  return (
    <div>
      <div className={styles.row}>
        <span className={styles.openChromatinPeak} />
        <span>Open chromatin: Peak</span>
      </div>
      <div className={styles.row}>
        <span className={styles.openChromatinSignal} />
        <span>Open chromatin: Signal</span>
      </div>
      {histones.map((histoneMetadata) => (
        <HistoneLegendElement
          key={histoneMetadata.label}
          {...histoneMetadata}
        />
      ))}
    </div>
  );
};

const HistoneLegendElement = ({
  label,
  color
}: {
  label: string;
  color: string;
}) => {
  return (
    <div className={styles.row}>
      <span className={styles.histone} style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
};

export default ActivityTracksLegend;
