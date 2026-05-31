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
  const [shouldDisplayExons, setShouldDisplayExons] = useState(true);
  const [shouldDisplayIntrons, setShouldDisplayIntrons] = useState(true);
  const [shouldCollapseIntrons, setShouldCollapseIntrons] = useState(false);
  const [shouldCollapseAll, setShouldCollapseAll] = useState(false);

  const onToggleExons = () => {
    setShouldDisplayExons(!shouldDisplayExons);
  };

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

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div>
          <span className={styles.bold}>{data.exons.length} </span>
          exons
        </div>
        <Controls
          shouldDisplayExons={shouldDisplayExons}
          shouldDisplayIntrons={shouldDisplayIntrons}
          shouldCollapseIntrons={shouldCollapseIntrons}
          shouldCollapseAll={shouldCollapseAll}
          onExonsDisplayChange={onToggleExons}
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
              <ColumnHead>Strand</ColumnHead>
              <ColumnHead>Sequence</ColumnHead>
            </tr>
          </thead>
          <tbody>
            <FlankingSequenceRow
              sequence={data.upstreamFlankingSequence.sequence}
              strand={data.upstreamFlankingSequence.strand}
              position="upstream"
            />
            {data.exonsAndIntrons.map((feature) => (
              <FeatureRow
                feature={feature}
                key={feature.type === 'exon' ? feature.stable_id : feature.id}
                shouldDisplayExons={shouldDisplayExons}
                shouldDisplayIntrons={shouldDisplayIntrons}
                shouldCollapseIntrons={shouldCollapseIntrons}
                shouldCollapseAll={shouldCollapseAll}
              />
            ))}
            <FlankingSequenceRow
              sequence={data.downstreamFlankingSequence.sequence}
              strand={data.downstreamFlankingSequence.strand}
              position="downstream"
            />
          </tbody>
        </Table>
      </div>
    </div>
  );
};

const Controls = ({
  shouldDisplayExons,
  shouldDisplayIntrons,
  shouldCollapseIntrons,
  shouldCollapseAll,
  onToggleIntronsCollapse,
  onToggleAllCollapse,
  onExonsDisplayChange,
  onIntronsDisplayChange,
  onDownload
}: {
  shouldDisplayExons: boolean;
  shouldDisplayIntrons: boolean;
  shouldCollapseIntrons: boolean;
  shouldCollapseAll: boolean;
  onExonsDisplayChange: () => void;
  onIntronsDisplayChange: () => void;
  onToggleIntronsCollapse: () => void;
  onToggleAllCollapse: () => void;
  onDownload: () => void;
}) => {
  return (
    <div className={styles.tableControls}>
      <div className={styles.tableControlsLeft}>
        <span className={styles.light}>Sequence</span>
        <div className={styles.checkboxGroup}>
          <CheckboxWithLabel
            checked={shouldDisplayExons}
            label="Exons"
            onChange={() => onExonsDisplayChange()}
          />
          <div className={styles.checkboxWithAssociatedButton}>
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
        </div>
      </div>
      <TextButton onClick={onToggleAllCollapse}>
        {shouldCollapseAll ? 'Expand all' : 'Collapse all'}
      </TextButton>
      <TextButton onClick={onDownload}>Download all data</TextButton>
    </div>
  );
};

const FlankingSequenceRow = ({
  sequence,
  strand,
  position
}: {
  sequence: string;
  strand: string;
  position: 'upstream' | 'downstream';
}) => {
  const title =
    position === 'upstream' ? "5' upstream sequence" : "3' downstream sequence";
  sequence = position === 'upstream' ? `...${sequence}` : `${sequence}...`;

  return (
    <tr>
      <td>{/* exon number column */}</td>
      <td>{title}</td>
      <td>{/* genomic start column */}</td>
      <td>{/* genomic end column */}</td>
      <td>{/* start phase column */}</td>
      <td>{/* end phase column */}</td>
      <td>{/* exon/intron length column */}</td>
      <td>{strand}</td>
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
  shouldDisplayExons,
  shouldDisplayIntrons,
  shouldCollapseIntrons,
  shouldCollapseAll
}: {
  feature: Exon | Intron;
  shouldDisplayExons: boolean;
  shouldDisplayIntrons: boolean;
  shouldCollapseIntrons: boolean;
  shouldCollapseAll: boolean;
}) => {
  if (feature.type === 'exon') {
    return shouldDisplayExons ? (
      <ExonRow exon={feature} shouldCollapseSequence={shouldCollapseAll} />
    ) : null;
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
      <td>{exon.strand}</td>
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
      <td>{/* empty cell for start phase */}</td>
      <td>{/* empty cell for end phase */}</td>
      <td>{formatNumber(intron.length)}</td>
      <td>{intron.strand}</td>
      <td>
        <div className={classNames(styles.sequence, styles.light)}>
          {sequence}
        </div>
      </td>
    </tr>
  );
};

export default ExonsTable;
