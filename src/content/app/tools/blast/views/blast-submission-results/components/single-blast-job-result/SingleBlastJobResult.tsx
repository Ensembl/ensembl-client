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

import React, { ReactNode, useEffect, useState } from 'react';

import { useFetchBlastSubmissionQuery } from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';
import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';

import DataTable from 'src/shared/components/data-table/DataTable';
import ShowHide from 'src/shared/components/show-hide/ShowHide';

import BlastHitsDiagram from 'src/content/app/tools/blast/components/blast-hits-diagram/BlastHitsDiagram';
import BlastSequenceAlignment from 'src/content/app/tools/blast/components/blast-sequence-alignment/BlastSequenceAlignment';

import type {
  BlastHit,
  BlastJob,
  BlastJobResultResponse,
  HSP
} from 'src/content/app/tools/blast/types/blastJob';
import type { Species } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import type { BlastSequenceAlignmentInput } from 'src/content/app/tools/blast/components/blast-sequence-alignment/blastSequenceAlignmentTypes';
import type { DatabaseType } from 'src/content/app/tools/blast/types/blastSettings';
import {
  type DataTableColumns,
  type DataTableState,
  type TableData,
  type TableCellRendererParams,
  SortingDirection,
  TableAction
} from 'src/shared/components/data-table/dataTableTypes';

import styles from './SingleBlastJobResult.scss';

type SingleBlastJobResultProps = {
  jobId: string;
  species: Species;
  diagramWidth: number;
  blastDatabase: DatabaseType;
};

const hitsTableColumns: DataTableColumns = [
  {
    width: '130px',
    columnId: 'e_value',
    title: 'E-value',
    isSortable: true,
    helpText: (
      <span>
        The number of times a match is expected to occur by chance <br />
        Typically, a low e-value indicates greater similarity between sequences
      </span>
    )
  },
  {
    width: '100px',
    columnId: 'hit_length',
    title: 'Length',
    isSortable: true
  },
  { width: '200px', columnId: 'view_alignment', isHideable: false },
  {
    width: '100px',
    columnId: 'percentage_id',
    title: '% ID',
    isSortable: true,
    helpText: (
      <span>
        Indicates the extent to which the query sequence and the hit have the
        same residues at the same positions in an alignment
      </span>
    )
  },
  {
    width: '100px',
    columnId: 'score',
    title: 'Score',
    isSortable: true
  },
  {
    columnId: 'genomic_location',
    title: 'Genomic location',
    helpText: <span>Location of the hit in this species</span>
  },
  {
    width: '100px',
    columnId: 'hit_orientation',
    title: 'Hit orientation',
    isSortable: true,
    helpText: (
      <span>The orientation of the hit against the query sequence</span>
    ),
    bodyCellClassName: styles.strandColumn
  },
  {
    width: '130px',
    columnId: 'hit_start',
    title: 'Hit start',
    isSortable: true,
    helpText: (
      <span>
        The position within the target sequence at which the hit started
      </span>
    )
  },
  {
    width: '130px',
    columnId: 'hit_end',
    title: 'Hit end',
    isSortable: true,
    helpText: (
      <span>
        The position within the target sequence at which the hit ended
      </span>
    )
  },
  {
    width: '130px',
    columnId: 'query_start',
    title: 'Query start',
    isSortable: true,
    helpText: (
      <span>
        The first position within the query sequence that matches the beginning
        of the hit that BLAST returns
      </span>
    )
  },
  {
    width: '130px',
    columnId: 'query_end',
    title: 'Query end',
    isSortable: true,
    helpText: (
      <span>
        The last position within the query sequence that matches the end of the
        hit that BLAST returns
      </span>
    )
  }
];

const SingleBlastJobResult = (props: SingleBlastJobResultProps) => {
  const { species: speciesInfo, diagramWidth, blastDatabase } = props;
  const { data } = useFetchBlastSubmissionQuery(props.jobId);
  const [isExpanded, setExpanded] = useState(false);

  if (!data) {
    return null;
  }

  const alignmentsCount = countAlignments(data.result);

  return (
    <div className={styles.resultsSummaryRow}>
      <div className={styles.hitLabel}>
        <span>{alignmentsCount} </span>
        <span>{pluralise('hit', alignmentsCount)}</span>
      </div>
      <div className={styles.summaryPlot}>
        <BlastHitsDiagram job={data.result} width={diagramWidth} />
      </div>
      <div className={styles.speciesInfo}>
        {speciesInfo.common_name && <span>{speciesInfo.common_name}</span>}
        <span>{speciesInfo.scientific_name}</span>
        <span>
          {speciesInfo.assembly_name}
          <ShowHide
            className={styles.showHide}
            isExpanded={isExpanded}
            onClick={() => setExpanded(!isExpanded)}
          ></ShowHide>
        </span>
      </div>

      {isExpanded && <HitsTable data={data} blastDatabase={blastDatabase} />}
    </div>
  );
};

type HitsTableProps = {
  data: BlastJobResultResponse;
  blastDatabase: DatabaseType;
};
const HitsTable = (props: HitsTableProps) => {
  const { data, blastDatabase } = props;

  const [tableState, setTableState] = useState<Partial<DataTableState>>({
    rowsPerPage: 100,
    sortedColumn: {
      columnId: 'e_value',
      sortedDirection: SortingDirection.ASC
    }
  });

  const [sequenceAlignmentData, setSequenceAlignmentData] = useState<{
    [key: string]: BlastSequenceAlignmentInput & { hitId: string };
  }>();

  useEffect(() => {
    const { hits } = data.result;

    const allTableData: TableData = [];
    const newSequenceAlignmentData: {
      [key: string]: BlastSequenceAlignmentInput & { hitId: string };
    } = {};
    let counter = 0;

    hits.forEach((hit) => {
      const { hit_hsps } = hit;
      hit_hsps.forEach((hitHsp) => {
        allTableData.push([
          hitHsp.hsp_expect,
          hitHsp.hsp_align_len,
          '', // view_alignment
          hitHsp.hsp_identity,
          hitHsp.hsp_score,
          <DynamicColumnContent
            key={counter}
            hit={hit}
            blastDatabase={blastDatabase}
            hitHsp={hitHsp}
          />,
          hitHsp.hsp_hit_frame === '1' ? 'Forward' : 'Reverse',
          hitHsp.hsp_hit_from,
          hitHsp.hsp_hit_to,
          hitHsp.hsp_query_from,
          hitHsp.hsp_query_to
        ]);

        newSequenceAlignmentData[counter] = {
          hitId: hit.hit_acc,
          querySequence: hitHsp.hsp_qseq,
          hitSequence: hitHsp.hsp_hseq,
          alignmentLine: hitHsp.hsp_mseq,
          queryStart: hitHsp.hsp_query_from,
          queryEnd: hitHsp.hsp_query_to,
          hitStart: hitHsp.hsp_hit_from,
          hitEnd: hitHsp.hsp_hit_to
        };

        counter++;
      });
    });

    setTableState({ ...tableState, data: allTableData });
    setSequenceAlignmentData(newSequenceAlignmentData);
  }, []);

  const [expandedContent, setExpandedContent] = useState<
    | {
        [rowId: string]: ReactNode;
      }
    | undefined
  >();

  if (!tableState.data) {
    return null;
  }

  const onExpanded = (isExpanded: boolean, rowId: string) => {
    if (!isExpanded) {
      setExpandedContent(undefined);
      return;
    }
    if (sequenceAlignmentData && sequenceAlignmentData[rowId]) {
      const aligment = (
        <div className={styles.sequenceAlignment}>
          <BlastSequenceAlignment
            alignment={sequenceAlignmentData[rowId]}
            blastDatabase={blastDatabase}
          />
        </div>
      );
      setExpandedContent({
        [rowId]: aligment
      });
    }
  };

  const tableColumns = [...hitsTableColumns];

  const genomicLocationColumnIndex = tableColumns.findIndex(
    (column) => column.columnId === 'genomic_location'
  );

  if (blastDatabase === 'pep') {
    tableColumns[genomicLocationColumnIndex] = {
      columnId: 'protein_id',
      title: 'Protein ID',
      helpText: (
        <span>Proteins in this species that contain sequence similarity</span>
      )
    };
  } else if (blastDatabase === 'cdna') {
    tableColumns[genomicLocationColumnIndex] = {
      columnId: 'transcript_id',
      title: 'Transcript ID',
      helpText: (
        <span>
          Transcripts in this species that contain sequence similarity
        </span>
      )
    };
  }

  tableColumns[2].renderer = (params: TableCellRendererParams) => {
    return (
      <ShowHideColumn
        onExpanded={onExpanded}
        rowId={params.rowId}
        isExpanded={!!expandedContent?.[params.rowId]}
      />
    );
  };

  return (
    <div className={styles.tableWrapper}>
      <DataTable
        state={tableState}
        onStateChange={setTableState}
        columns={tableColumns}
        theme="dark"
        className={styles.hitsTable}
        expandedContent={expandedContent}
        disabledActions={[
          TableAction.FILTERS,
          TableAction.DOWNLOAD_ALL_DATA,
          TableAction.DOWNLOAD_SHOWN_DATA
        ]}
      />
    </div>
  );
};

const ShowHideColumn = (props: {
  isExpanded: boolean;
  onExpanded: (isExpanded: boolean, rowId: string) => void;
  rowId: string;
}) => {
  const onExpanded = () => {
    props.onExpanded(!props.isExpanded, props.rowId);
  };

  return (
    <ShowHide
      label="view alignment"
      isExpanded={props.isExpanded}
      onClick={onExpanded}
    />
  );
};

type DynamicColumnContentProps = {
  hit: BlastHit;
  hitHsp: HSP;
  blastDatabase: DatabaseType;
};

const DynamicColumnContent = (props: DynamicColumnContentProps) => {
  const { hit, blastDatabase, hitHsp } = props;

  if (blastDatabase !== 'dna') {
    return <span className={styles.nowrap}>{hit.hit_acc}</span>;
  }

  return (
    <span className={styles.nowrap}>
      {`${hit.hit_acc}:${[hitHsp.hsp_hit_from, hitHsp.hsp_hit_to]
        .sort()
        .join('-')}`}
    </span>
  );
};

const countAlignments = (blastJob: BlastJob) => {
  return blastJob.hits.reduce((count, hit) => count + hit.hit_hsps.length, 0);
};

export default SingleBlastJobResult;