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

import { useState } from 'react';
import classNames from 'classnames';

import { downloadTextAsFile } from 'src/shared/helpers/downloadAsFile';
import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';
import { collapseSequence } from '../exonHelpers';
import { prepareExportTSV } from './exportExonsTable';

import { Table, ColumnHead } from 'src/shared/components/table';
import CheckboxWithLabel from 'src/shared/components/checkbox-with-label/CheckboxWithLabel';
import DownloadButton from 'src/shared/components/download-button/DownloadButton';
import TextButton from 'src/shared/components/text-button/TextButton';

import type {
  Data,
  EnrichedExon as Exon,
  EnrichedIntron as Intron
} from 'src/content/app/entity-viewer/transcript-view/components/transcript-exons/useExonsData';

import styles from './ExonsTable.module.css';

type Props = {
  data: Data;
};

const ExonsTable = ({ data }: Props) => {
  const [shouldDisplayIntrons, setShouldDisplayIntrons] = useState(true);
  const [shouldCollapseIntrons, setShouldCollapseIntrons] = useState(false);
  const [shouldCollapseAll, setShouldCollapseAll] = useState(false);

  const onToggleIntrons = () => {
    setShouldDisplayIntrons(!shouldDisplayIntrons);
  };

  const onToggleIntronsCollapse = () => {
    setShouldCollapseIntrons(!shouldCollapseIntrons);
  };

  const onToggleAllCollapse = () => {
    setShouldCollapseAll(!shouldCollapseAll);
  };

  const onDownload = () => {
    const tsvString = prepareExportTSV({ data });
    const fileName = `exons-table.tsv`;
    downloadTextAsFile(tsvString, fileName, {
      type: 'text/tab-separated-values'
    });
  };

  // add total exon count

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <Controls
          shouldDisplayIntrons={shouldDisplayIntrons}
          shouldCollapseIntrons={shouldCollapseIntrons}
          shouldCollapseAll={shouldCollapseAll}
          onIntronsDisplayChange={onToggleIntrons}
          onToggleIntronsCollapse={onToggleIntronsCollapse}
          onToggleAllCollapse={onToggleAllCollapse}
          onDownload={onDownload}
        />
      </div>
      <div className={styles.tableWrapper}>
        <Table stickyHeader={true} className={styles.table}>
          <thead>
            <tr>
              <ColumnHead>No.</ColumnHead>
              <ColumnHead>Exon/Intron</ColumnHead>
              <ColumnHead>Start</ColumnHead>
              <ColumnHead>End</ColumnHead>
              <ColumnHead>Start phase</ColumnHead>
              <ColumnHead>End phase</ColumnHead>
              <ColumnHead>Length</ColumnHead>
              <ColumnHead>Sequence</ColumnHead>
            </tr>
          </thead>
          <tbody>
            <FlankingSequenceRow
              title={"5' upstream sequence"}
              sequence={data.upstreamFlankingSequence}
              position="start"
            />
            {data.exonsAndIntrons.map((feature) => (
              <FeatureRow
                feature={feature}
                key={feature.type === 'exon' ? feature.stable_id : feature.id}
                shouldDisplayIntrons={shouldDisplayIntrons}
                shouldCollapseIntrons={shouldCollapseIntrons}
                shouldCollapseAll={shouldCollapseAll}
              />
            ))}
            <FlankingSequenceRow
              title={"3' downstream sequence"}
              sequence={data.downstreamFlankingSequence}
              position="end"
            />
          </tbody>
        </Table>
      </div>
    </div>
  );
};

const Controls = ({
  shouldDisplayIntrons,
  shouldCollapseIntrons,
  shouldCollapseAll,
  onToggleIntronsCollapse,
  onToggleAllCollapse,
  onIntronsDisplayChange,
  onDownload
}: {
  shouldDisplayIntrons: boolean;
  shouldCollapseIntrons: boolean;
  shouldCollapseAll: boolean;
  onIntronsDisplayChange: () => void;
  onToggleIntronsCollapse: () => void;
  onToggleAllCollapse: () => void;
  onDownload: () => void;
}) => {
  return (
    <div className={styles.tableControls}>
      <div className={styles.tableControlsLeft}>
        <span className={styles.light}>Sequence</span>
        <CheckboxWithLabel
          checked={shouldDisplayIntrons}
          label="Introns"
          onChange={() => onIntronsDisplayChange()}
        />
        <TextButton
          onClick={onToggleIntronsCollapse}
          disabled={!shouldDisplayIntrons || shouldCollapseAll}
        >
          {shouldCollapseIntrons ? 'Expand' : 'Collapse'}
        </TextButton>
      </div>
      <TextButton onClick={onToggleAllCollapse}>
        {shouldCollapseAll ? 'Expand all' : 'Collapse all'}
      </TextButton>
      <DownloadButton onClick={onDownload} />
    </div>
  );
};

const FlankingSequenceRow = ({
  title,
  sequence,
  position
}: {
  title: string;
  sequence: string;
  position: 'start' | 'end';
}) => {
  sequence = position === 'start' ? `...${sequence}` : `${sequence}...`;

  return (
    <tr>
      <td>{/* exon number column */}</td>
      <td>{title}</td>
      <td>{/* genomic start column */}</td>
      <td>{/* genomic end column */}</td>
      <td>{/* start phase column */}</td>
      <td>{/* end phase column */}</td>
      <td>{/* exon/intron length column */}</td>
      <td>
        <span className={classNames(styles.sequence, styles.light)}>
          {sequence}
        </span>
      </td>
    </tr>
  );
};

const FeatureRow = ({
  feature,
  shouldDisplayIntrons,
  shouldCollapseIntrons,
  shouldCollapseAll
}: {
  feature: Exon | Intron;
  shouldDisplayIntrons: boolean;
  shouldCollapseIntrons: boolean;
  shouldCollapseAll: boolean;
}) => {
  if (feature.type === 'exon') {
    return (
      <ExonRow exon={feature} shouldCollapseSequence={shouldCollapseAll} />
    );
  } else {
    return shouldDisplayIntrons ? (
      <IntronRow
        intron={feature}
        shouldCollapseSequence={shouldCollapseIntrons || shouldCollapseAll}
      />
    ) : null;
  }
};

const ExonRow = ({
  exon,
  shouldCollapseSequence
}: {
  exon: Exon;
  shouldCollapseSequence: boolean;
}) => {
  const sequence = shouldCollapseSequence
    ? collapseSequence(exon.sequence)
    : exon.sequence;

  return (
    <tr>
      <td>{exon.index}</td>
      <td>{exon.stable_id}</td>
      <td>{formatNumber(exon.start)}</td>
      <td>{formatNumber(exon.end)}</td>
      <td>{exon.startPhase !== -1 ? exon.startPhase : '-'}</td>
      <td>{exon.endPhase !== -1 ? exon.endPhase : '-'}</td>
      <td>{formatNumber(exon.length)}</td>
      <td>
        <div className={styles.sequence}>{sequence}</div>
      </td>
    </tr>
  );
};

const IntronRow = ({
  intron,
  shouldCollapseSequence
}: {
  intron: Intron;
  shouldCollapseSequence: boolean;
}) => {
  const sequence = shouldCollapseSequence
    ? collapseSequence(intron.sequence)
    : intron.sequence;

  return (
    <tr>
      <td>{/* empty cell */}</td>
      <td>{intron.id}</td>
      <td>{formatNumber(intron.start)}</td>
      <td>{formatNumber(intron.end)}</td>
      <td>-</td>
      <td>-</td>
      <td>{formatNumber(intron.length)}</td>
      <td>
        <div className={classNames(styles.sequence, styles.light)}>
          {sequence}
        </div>
      </td>
    </tr>
  );
};

export default ExonsTable;
