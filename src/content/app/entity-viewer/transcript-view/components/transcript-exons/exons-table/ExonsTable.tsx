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

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import { Table, ColumnHead } from 'src/shared/components/table';
import DownloadButton from 'src/shared/components/download-button/DownloadButton';

import type { EnrichedExon as Exon } from 'src/content/app/entity-viewer/transcript-view/components/transcript-exons/useExonsData';

import styles from './ExonsTable.module.css';

type Props = {
  exons: Exon[];
};

const ExonsTable = (props: Props) => {
  const onDownload = () => {
    alert('some day there will be download');
  };

  return (
    <>
      <div className={styles.topSection}>
        <DownloadButton onClick={onDownload} />
      </div>
      <Table stickyHeader={true} className={styles.table}>
        <thead>
          <tr>
            <ColumnHead>No.</ColumnHead>
            <ColumnHead>Name</ColumnHead>
            <ColumnHead>Start</ColumnHead>
            <ColumnHead>End</ColumnHead>
            <ColumnHead>Start phase</ColumnHead>
            <ColumnHead>End phase</ColumnHead>
            <ColumnHead>Length</ColumnHead>
            <ColumnHead>Sequence</ColumnHead>
          </tr>
        </thead>
        <tbody>
          {props.exons.map((exon, index) => (
            <tr key={exon.stable_id}>
              <td>{index + 1}</td>
              <td>{exon.stable_id}</td>
              <td>{formatNumber(exon.start)}</td>
              <td>{formatNumber(exon.end)}</td>
              <td>{exon.startPhase !== -1 ? exon.startPhase : '-'}</td>
              <td>{exon.endPhase !== -1 ? exon.endPhase : '-'}</td>
              <td>{formatNumber(exon.length)}</td>
              <td>
                <div className={styles.sequence}>{exon.sequence}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ExonsTable;
