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

import { Legend, LegendItem, LegendMarker } from 'src/shared/components/legend';

import styles from './ActivityTracksLegend.module.css';

type Props = {
  genomeId: string;
};

const ActivityTracksLegend = ({ genomeId }: Props) => {
  const histones = useAppSelector((state) => getHistones(state, genomeId));

  return (
    <Legend>
      <LegendItem>
        <LegendMarker className={styles.openChromatinPeak} />
        <span>Open chromatin: Peak</span>
      </LegendItem>
      <LegendItem>
        <LegendMarker className={styles.openChromatinSignal} />
        <span>Open chromatin: Signal</span>
      </LegendItem>
      {histones.map((histoneMetadata) => (
        <HistoneLegendElement
          key={histoneMetadata.label}
          {...histoneMetadata}
        />
      ))}
    </Legend>
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
    <LegendItem className={styles.histone}>
      <LegendMarker
        className={styles.histoneMarker}
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </LegendItem>
  );
};

export default ActivityTracksLegend;
