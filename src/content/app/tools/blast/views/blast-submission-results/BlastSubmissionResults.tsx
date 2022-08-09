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
import { useParams } from 'react-router';

import { useAppSelector } from 'src/store';
import { getBlastSubmissionById } from 'src/content/app/tools/blast/state/blast-results/blastResultsSelectors';
import { useFetchBlastSubmissionQuery } from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';

import { parseBlastInput } from '../../utils/blastInputParser';
import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';

import BlastAppBar from 'src/content/app/tools/blast/components/blast-app-bar/BlastAppBar';
import ToolsTopBar from 'src/content/app/tools/shared/components/tools-top-bar/ToolsTopBar';
import BlastViewsNavigation from 'src/content/app/tools/blast/components/blast-views-navigation/BlastViewsNavigation';
import BlastSubmissionHeader from 'src/content/app/tools/blast/components/blast-submission-header/BlastSubmissionHeader';

import { type BlastResult } from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';
import { type Species } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import styles from './BlastSubmissionResults.scss';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import {
  TableAction,
  TableCellRendererParams,
  TableColumns,
  TableData
} from 'src/shared/components/table/state/tableReducer';
import Table from 'src/shared/components/table/Table';

const BlastSubmissionResults = () => {
  return (
    <div>
      <BlastAppBar view="submission-results" />
      <ToolsTopBar>
        <BlastViewsNavigation />
      </ToolsTopBar>
      <Main />
    </div>
  );
};

const Main = () => {
  const { submissionId } = useParams() as { submissionId: string };
  const blastSubmission = useAppSelector((state) =>
    getBlastSubmissionById(state, submissionId)
  );

  if (!blastSubmission) {
    return null;
  }

  const { submittedData, results } = blastSubmission;
  const resultsGroupedBySequence = submittedData.sequences.map((sequence) => {
    const blastResults = results.filter((r) => r.sequenceId === sequence.id);
    return {
      sequence,
      species: submittedData.species,
      blastResults
    };
  });

  const sequenceBoxes = resultsGroupedBySequence.map((data) => (
    <SequenceBox
      key={data.sequence.id}
      species={data.species}
      sequence={data.sequence}
      blastResults={data.blastResults}
    />
  ));

  return (
    <div className={styles.blastSubmissionResultsContainer}>
      <BlastSubmissionHeader
        submission={blastSubmission}
        isAnyJobRunning={false}
      />
      {sequenceBoxes}
    </div>
  );
};

type SequenceBoxProps = {
  sequence: {
    id: number;
    value: string;
  };
  species: Species[];
  blastResults: BlastResult[];
};

const SequenceBox = (props: SequenceBoxProps) => {
  const { sequence, species, blastResults } = props;

  return (
    <div className={styles.sequenceBoxWrapper}>
      <div className={styles.resultsSummaryRow}>
        <div className={styles.sequenceId}>Sequence {sequence.id}</div>
        <div className={styles.sequenceHeader}>
          {'>' + (parseBlastInput(sequence.value)[0].header || '')}
        </div>
        <div>
          <span className={styles.againstText}>Against</span>{' '}
          <span>{species.length} species</span>
        </div>
      </div>

      {blastResults.map((result) => {
        const speciesInfo = species.filter(
          (sp) => sp.genome_id === result.genomeId
        );
        return (
          <SingleBlastJobResult
            key={result.jobId}
            species={speciesInfo[0]}
            jobId={result.jobId}
          />
        );
      })}
    </div>
  );
};

type SingleBlastJobResultProps = {
  jobId: string;
  species: Species;
};

const hitsTableColumns: TableColumns = [
  {
    width: '150px',
    columnId: 'e_value',
    title: 'E-value',
    isSortable: true,
    helpText: (
      <span>
        The number of times a match is expected to occur by chance <br></br>{' '}
        Typically, a low e-value indicated greater similarity between sequences{' '}
      </span>
    )
  },
  {
    width: '150px',
    columnId: 'hit_length',
    title: 'Hit length',
    isSortable: true
  },
  { width: '200px', columnId: 'view_alignment', title: '' },
  {
    width: '150px',
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
  { width: '150px', columnId: 'score', title: 'Score', isSortable: true },
  {
    width: '300px',
    columnId: 'genomic_location',
    title: 'Genomic location',
    isSortable: true,
    helpText: <span>Location of the hit in this species</span>
  },
  {
    width: '150px',
    columnId: 'hit_orientation',
    title: 'Hit orientation',
    isSortable: true,
    helpText: <span>The orientation of the hit against the query sequence</span>
  },
  {
    width: '150px',
    columnId: 'hit_start',
    title: 'Hit start',
    isSortable: true,
    helpText: (
      <span>
        The position within the query sequence at which the hit started
      </span>
    )
  },
  {
    width: '150px',
    columnId: 'hit_end',
    title: 'Hit end',
    isSortable: true,
    helpText: (
      <span>The position within the query sequence at which the hit ended</span>
    )
  },
  {
    width: '150px',
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
    width: '150px',
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
  const { data } = useFetchBlastSubmissionQuery(props.jobId);

  const [isExpanded, setExpanded] = useState(false);

  const [tableData, setTableData] = useState<TableData>([]);

  useEffect(() => {
    if (!data) {
      return;
    }
    const { hits } = data.result;

    const allTableData: TableData = [];

    hits.forEach((hit) => {
      const { hit_hsps } = hit;

      hit_hsps.forEach((hitHsp) => {
        allTableData.push([
          hitHsp.hsp_expect,
          hitHsp.hsp_align_len,
          '', // view_alignment
          hitHsp.hsp_identity,
          hitHsp.hsp_score,
          `${hit.hit_acc}:${hitHsp.hsp_hit_from}-${hitHsp.hsp_hit_to}`, // genomic_location
          hitHsp.hsp_hit_frame === '1' ? 'forward' : 'reverse',
          hitHsp.hsp_hit_from,
          hitHsp.hsp_hit_to,
          hitHsp.hsp_query_from,
          hitHsp.hsp_query_to
        ]);
      });
    });

    setTableData(allTableData);
  }, [data]);

  const [expandedContent, setExpandedContent] = useState<{
    [rowId: string]: ReactNode;
  }>({});

  const onExpanded = (isExpanded: boolean, rowId: string) => {
    setExpandedContent({
      ...expandedContent,
      [rowId]: isExpanded ? <div>Row {rowId} expanded content</div> : undefined
    });
  };

  hitsTableColumns[2].renderer = (params: TableCellRendererParams) => {
    return (
      <ShowHideColumn
        onExpanded={onExpanded}
        rowId={params.rowId}
        isExpanded={!!expandedContent[params.rowId]}
      />
    );
  };

  if (!data) {
    return null;
  }
  const { hits } = data.result;

  const { species: speciesInfo } = props;
  return (
    <>
      <div className={styles.resultsSummaryRow}>
        <div className={styles.hitLabel}>
          <span>{hits.length} </span>
          <span className={styles.label}>
            {`${pluralise('hit', hits.length)}`}
          </span>
        </div>
        <div className={styles.summaryPlot}></div>
        <div className={styles.speciesInfo}>
          {speciesInfo.common_name && <span>{speciesInfo.common_name}</span>}
          <span>{speciesInfo.scientific_name}</span>
          <span>{speciesInfo.assembly_name}</span>
        </div>
        <div className={styles.showHideWrapper}>
          <ShowHide
            isExpanded={isExpanded}
            onClick={() => setExpanded(!isExpanded)}
          ></ShowHide>
        </div>
      </div>
      {isExpanded && (
        <Table
          columns={hitsTableColumns}
          data={tableData}
          theme={'dark'}
          rowsPerPage={100}
          className={styles.hitsTable}
          expandedContent={expandedContent}
          disabledActions={[TableAction.FILTERS]}
        />
      )}
    </>
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
      label={'view alignment'}
      isExpanded={props.isExpanded}
      onClick={onExpanded}
    />
  );
};

export default BlastSubmissionResults;
