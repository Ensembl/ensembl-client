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

import React from 'react';
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

const SingleBlastJobResult = (props: SingleBlastJobResultProps) => {
  const { data } = useFetchBlastSubmissionQuery(props.jobId);

  if (!data) {
    return null;
  }

  const { species: speciesInfo } = props;
  return (
    <div className={styles.resultsSummaryRow}>
      <div className={styles.hitLabel}>
        <span>{data.result.hits.length} </span>
        <span className={styles.label}>
          {`${pluralise('hit', data.result.hits.length)}`}
        </span>
      </div>
      <div className={styles.summaryPlot}></div>
      <div className={styles.speciesInfo}>
        {speciesInfo.common_name && <span>{speciesInfo.common_name}</span>}
        <span>{speciesInfo.scientific_name}</span>
        <span>{speciesInfo.assembly_name}</span>
      </div>
    </div>
  );
};

export default BlastSubmissionResults;
