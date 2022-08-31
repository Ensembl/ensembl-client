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

import React, { useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import { useParams } from 'react-router';

import useResizeObserver from 'src/shared/hooks/useResizeObserver';

import { useAppSelector, useAppDispatch } from 'src/store';
import { getBlastSubmissionById } from 'src/content/app/tools/blast/state/blast-results/blastResultsSelectors';
import { useFetchBlastSubmissionQuery } from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';
import {
  type BlastSubmissionParameters,
  markBlastSubmissionAsSeen
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

import { parseBlastInput } from 'src/content/app/tools/blast/utils/blastInputParser';
import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';

import Copy from 'src/shared/components/copy/Copy';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import BasePairsRuler from 'src/content/app/entity-viewer/gene-view/components/base-pairs-ruler/BasePairsRuler';
import ToolsTopBar from 'src/content/app/tools/shared/components/tools-top-bar/ToolsTopBar';
import BlastAppBar from 'src/content/app/tools/blast/components/blast-app-bar/BlastAppBar';
import BlastViewsNavigation from 'src/content/app/tools/blast/components/blast-views-navigation/BlastViewsNavigation';
import BlastSubmissionHeader from 'src/content/app/tools/blast/components/blast-submission-header/BlastSubmissionHeader';
import BlastHitsDiagram from 'src/content/app/tools/blast/components/blast-hits-diagram/BlastHitsDiagram';

import type { BlastResult } from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';
import type { Species } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import type { BlastJob } from 'src/content/app/tools/blast/types/blastJob';
import type { DatabaseType } from '../../types/blastSettings';

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
      blastResults
    };
  });

  const sequenceBoxes = resultsGroupedBySequence.map((data) => (
    <SequenceBox
      key={data.sequence.id}
      species={data.species}
      sequence={data.sequence}
      blastResults={data.blastResults}
      parameters={blastSubmission.submittedData.parameters}
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
  parameters: BlastSubmissionParameters;
};

const SequenceBox = (props: SequenceBoxProps) => {
  const { sequence, species, blastResults, parameters } = props;
  const parsedBlastSequence = parseBlastInput(sequence.value)[0];
  const { header: sequenceHeader = '', value: sequenceValue } =
    parsedBlastSequence;
  const rulerContainer = useRef<HTMLDivElement | null>(null);
  const { width: plotwidth } = useResizeObserver({ ref: rulerContainer });
  const [shouldShowJobResult, showJobResult] = useState(true);
  const [shouldShowParamaters, showParamaters] = useState(false);
  const rulerWrapperClassName = classNames(
    styles.resultsSummaryRow,
    styles.rulerWrapper
  );

  return (
    <div className={styles.sequenceBoxWrapper}>
      <div className={styles.resultsSummaryRow}>
        <div className={styles.sequenceId}>Sequence {sequence.id}</div>
        <div className={styles.sequenceHeader}>
          <div className={styles.content}>
            <ShowHide
              label={'>' + sequenceHeader}
              isExpanded={shouldShowParamaters}
              onClick={() => showParamaters(!shouldShowParamaters)}
            ></ShowHide>
          </div>
          <div className={styles.expandedContent}>
            {shouldShowParamaters && (
              <JobParameters
                sequenceValue={sequence.value}
                parameters={parameters}
              />
            )}
          </div>
        </div>

        <div>
          <span className={styles.againstText}>Against</span>{' '}
          <span>{species.length} species</span>
        </div>
        <div className={styles.showHideWrapper}>
          <ShowHide
            isExpanded={shouldShowJobResult}
            onClick={() => showJobResult(!shouldShowJobResult)}
          ></ShowHide>
        </div>
      </div>

      {shouldShowJobResult &&
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
            />
          );
        })}
      <div className={rulerWrapperClassName}>
        <div ref={rulerContainer} className={styles.summaryPlot}>
          {shouldShowJobResult && (
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

const databaseLabelsMap: Record<DatabaseType, string> = {
  dna: 'Genomic sequence',
  cdna: 'cDNA',
  pep: 'Protein sequence'
};

type JobParametersProps = {
  sequenceValue: string;
  parameters: BlastSubmissionParameters;
};

const JobParameters = (props: JobParametersProps) => {
  const { sequenceValue, parameters } = props;

  return (
    <div className={styles.submissionParameters}>
      <div className={styles.copySequence}>
        <Copy value={sequenceValue} />
      </div>
      <div className={styles.sequence}>{sequenceValue}</div>
      <div className={styles.parameters}>
        <table>
          <tbody>
            <tr>
              <td>Database</td>
              <td>{databaseLabelsMap[parameters.database as DatabaseType]}</td>
            </tr>
            {/* <tr>
            <td>Sensitivity</td>
            <td>???</td>
          </tr> */}
            <tr>
              <td>Max. alignments</td>
              <td>{parameters.alignments}</td>
            </tr>
            <tr>
              <td>Max. scores</td>
              <td>{parameters.scores}</td>
            </tr>
            <tr>
              <td>E-threshold</td>
              <td>{parameters.exp}</td>
            </tr>
            <tr>
              <td>Statistical accuracy</td>
              <td>{parameters.compstats}</td>
            </tr>
            <tr>
              <td>HSPs per hit</td>
              <td>{parameters.hsps}</td>
            </tr>
            <tr>
              <td>Drop-off</td>
              <td>{parameters.dropoff}</td>
            </tr>
            <tr>
              <td>GAP opening</td>
              <td>{parameters.gapopen}</td>
            </tr>
            <tr>
              <td>GAP estension</td>
              <td>{parameters.gapext}</td>
            </tr>
            <tr>
              <td>Word size</td>
              <td>{parameters.wordsize}</td>
            </tr>
            <tr>
              <td>Match/Mismatch score</td>
              <td>{parameters.match_scores}</td>
            </tr>
            {parameters.gapalign === 'true' && (
              <tr>
                <td></td>
                <td>
                  <div className={styles.parameterCheckbox} />
                  <span>Align gaps</span>
                </td>
              </tr>
            )}
            {parameters.filter === 'T' && (
              <tr>
                <td></td>
                <td>
                  <div className={styles.parameterCheckbox} />
                  <span>Filter low complexity regions</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

type SingleBlastJobResultProps = {
  jobId: string;
  species: Species;
  diagramWidth: number;
};

const SingleBlastJobResult = (props: SingleBlastJobResultProps) => {
  const { species: speciesInfo, diagramWidth } = props;
  const { data } = useFetchBlastSubmissionQuery(props.jobId);

  if (!data) {
    return null;
  }

  const alignmentsCount = countAlignments(data.result);

  return (
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
      </div>
    </div>
  );
};

const countAlignments = (blastJob: BlastJob) => {
  return blastJob.hits.reduce((count, hit) => count + hit.hit_hsps.length, 0);
};

export default BlastSubmissionResults;
