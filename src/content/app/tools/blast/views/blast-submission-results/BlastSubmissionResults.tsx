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
import React, { ReactNode, useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { useParams } from 'react-router';

import useResizeObserver from 'src/shared/hooks/useResizeObserver';

import { useAppSelector, useAppDispatch } from 'src/store';
import { getBlastSubmissionById } from 'src/content/app/tools/blast/state/blast-results/blastResultsSelectors';
import { useFetchBlastSubmissionQuery } from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';
import { markBlastSubmissionAsSeen } from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

import { parseBlastInput } from 'src/content/app/tools/blast/utils/blastInputParser';
import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';

import BasePairsRuler from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';
import ToolsTopBar from 'src/content/app/tools/shared/components/tools-top-bar/ToolsTopBar';
import BlastAppBar from 'src/content/app/tools/blast/components/blast-app-bar/BlastAppBar';
import BlastViewsNavigation from 'src/content/app/tools/blast/components/blast-views-navigation/BlastViewsNavigation';
import BlastSubmissionHeader from 'src/content/app/tools/blast/components/blast-submission-header/BlastSubmissionHeader';
import BlastHitsDiagram from 'src/content/app/tools/blast/components/blast-hits-diagram/BlastHitsDiagram';

import type { BlastResult } from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';
import type { Species } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import type { BlastJob } from 'src/content/app/tools/blast/types/blastJob';

import ShowHide from 'src/shared/components/show-hide/ShowHide';
import {
  DataTableState,
  TableAction,
  type TableCellRendererParams,
  type DataTableColumns,
  type TableData
} from 'src/shared/components/data-table/dataTableTypes';
import DataTable from 'src/shared/components/data-table/DataTable';
import BlastSequenceAlignment from '../../components/blast-sequence-alignment/BlastSequenceAlignment';
import { BlastSequenceAlignmentInput } from '../../components/blast-sequence-alignment/blastSequenceAlignmentTypes';
import { DatabaseType } from '../../types/blastSettings';

import styles from './BlastSubmissionResults.scss';

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
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (blastSubmission) {
      dispatch(markBlastSubmissionAsSeen(blastSubmission.id));
    }
  }, [blastSubmission?.id]);

  if (!blastSubmission) {
    return null;
  }

  const { submittedData, results } = blastSubmission;
  const resultsGroupedBySequence = submittedData.sequences.map((sequence) => {
    const blastResults = results.filter((r) => r.sequenceId === sequence.id);
    return {
      sequence,
      species: submittedData.species,
      blastResults,
      blastDatabase: submittedData.parameters.database as DatabaseType
    };
  });

  const sequenceBoxes = resultsGroupedBySequence.map((data) => (
    <SequenceBox
      key={data.sequence.id}
      species={data.species}
      sequence={data.sequence}
      blastResults={data.blastResults}
      blastDatabase={data.blastDatabase}
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
  blastDatabase: DatabaseType;
};

const SequenceBox = (props: SequenceBoxProps) => {
  const { sequence, species, blastResults, blastDatabase } = props;

  const parsedBlastSequence = parseBlastInput(sequence.value)[0];
  const { header: sequenceHeader = '', value: sequenceValue } =
    parsedBlastSequence;
  const rulerContainer = useRef<HTMLDivElement | null>(null);
  const { width: plotwidth } = useResizeObserver({ ref: rulerContainer });
  const [isExpanded, setExpanded] = useState(true);
  const rulerWrapperClassName = classNames(
    styles.resultsSummaryRow,
    styles.rulerWrapper
  );

  return (
    <div className={styles.sequenceBoxWrapper}>
      <div className={styles.resultsSummaryRow}>
        <div className={styles.sequenceId}>Sequence {sequence.id}</div>
        <div className={styles.sequenceHeader}>{'>' + sequenceHeader}</div>
        <div>
          <span className={styles.againstText}>Against</span>{' '}
          <span>{species.length} species</span>
        </div>
        <div className={styles.showHideWrapper}>
          <ShowHide
            isExpanded={isExpanded}
            onClick={() => setExpanded(!isExpanded)}
          ></ShowHide>
        </div>
      </div>
      {isExpanded &&
        blastResults.map((result) => {
          // TODO: Do we need to show a message if there isn't any matching species? Or will this even ever happen?
          const speciesInfo = species.find(
            (sp) => sp.genome_id === result.genomeId
          ) as Species;

          return (
            <SingleBlastJobResult
              key={result.jobId}
              species={speciesInfo}
              jobId={result.jobId}
              diagramWidth={plotwidth}
              blastDatabase={blastDatabase}
            />
          );
        })}
      <div className={rulerWrapperClassName}>
        <div ref={rulerContainer} className={styles.summaryPlot}>
          {isExpanded && (
            <BasePairsRuler
              width={plotwidth}
              length={sequenceValue.length}
              standalone={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

type SingleBlastJobResultProps = {
  jobId: string;
  species: Species;
  diagramWidth: number;
  blastDatabase: DatabaseType;
};

const hitsTableColumns: DataTableColumns = [
  {
    width: '0px',
    columnId: 'id',
    title: 'ID',
    isFilterable: false,
    isHideable: false
  },
  {
    width: '130px',
    columnId: 'e_value',
    title: 'E-value',
    isSortable: true,
    helpText: (
      <span>
        The number of times a match is expected to occur by chance <br></br>
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
    width: '300px',
    columnId: 'genomic_location',
    title: 'Genomic location',
    isSortable: true,
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

  const [tableState, setTableState] = useState<Partial<DataTableState>>({
    rowsPerPage: 100
  });

  const [sequenceAlignmentData, setSequenceAlignmentData] = useState<{
    [key: string]: BlastSequenceAlignmentInput & { hitId: string };
  }>();

  useEffect(() => {
    if (!data) {
      return;
    }
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
          counter,
          hitHsp.hsp_expect,
          hitHsp.hsp_align_len,
          '', // view_alignment
          hitHsp.hsp_identity,
          hitHsp.hsp_score,
          `${hit.hit_acc}:${[hitHsp.hsp_hit_from, hitHsp.hsp_hit_to]
            .sort()
            .join('-')}`, // genomic_location
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
  }, [data]);

  const [expandedContent, setExpandedContent] = useState<{
    [rowId: string]: ReactNode;
  }>({});

  const onExpanded = (isExpanded: boolean, rowId: string) => {
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
        ...expandedContent,
        [rowId]: isExpanded ? aligment : undefined
      });
    }
  };

  hitsTableColumns[3].renderer = (params: TableCellRendererParams) => {
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

  const alignmentsCount = countAlignments(data.result);

  return (
    <>
      <div className={styles.resultsSummaryRow}>
        <div className={styles.hitLabel}>
          <span>{alignmentsCount} </span>
          <span className={styles.label}>
            {`${pluralise('hit', alignmentsCount)}`}
          </span>
        </div>
        <div className={styles.summaryPlot}>
          <BlastHitsDiagram job={data.result} width={diagramWidth} />
        </div>
        <div className={styles.speciesInfo}>
          {speciesInfo.common_name && <span>{speciesInfo.common_name}</span>}
          <span>{speciesInfo.scientific_name}</span>
          <span>{speciesInfo.assembly_name}</span>
          <div className={styles.showHideWrapper}>
            <ShowHide
              isExpanded={isExpanded}
              onClick={() => setExpanded(!isExpanded)}
            ></ShowHide>
          </div>
        </div>

        {isExpanded && (
          <div className={styles.tableWrapper}>
            <DataTable
              state={tableState}
              onStateChange={setTableState}
              columns={hitsTableColumns}
              theme="dark"
              className={styles.hitsTable}
              expandedContent={expandedContent}
              disabledActions={[TableAction.FILTERS]}
              uniqueColumnId="id"
            />
          </div>
        )}
      </div>
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
      label="view alignment"
      isExpanded={props.isExpanded}
      onClick={onExpanded}
    />
  );
};

const countAlignments = (blastJob: BlastJob) => {
  return blastJob.hits.reduce((count, hit) => count + hit.hit_hsps.length, 0);
};

export default BlastSubmissionResults;
