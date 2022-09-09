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

import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import { useAppSelector, useAppDispatch } from 'src/store';
import { getBlastSubmissionById } from 'src/content/app/tools/blast/state/blast-results/blastResultsSelectors';
import { markBlastSubmissionAsSeen } from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

import ToolsTopBar from 'src/content/app/tools/shared/components/tools-top-bar/ToolsTopBar';
import BlastAppBar from 'src/content/app/tools/blast/components/blast-app-bar/BlastAppBar';
import BlastViewsNavigation from 'src/content/app/tools/blast/components/blast-views-navigation/BlastViewsNavigation';
import BlastSubmissionHeader from 'src/content/app/tools/blast/components/blast-submission-header/BlastSubmissionHeader';
import BlastResultsPerSequence from './components/blast-results-per-sequence/BlastResultsPerSequence';

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

  const groupedBlastResultsPerSequence = resultsGroupedBySequence.map(
    (data) => (
      <BlastResultsPerSequence
        key={data.sequence.id}
        species={data.species}
        sequence={data.sequence}
        blastResults={data.blastResults}
        parameters={blastSubmission.submittedData.parameters}
      />
    )
  );

  return (
    <div className={styles.blastSubmissionResultsContainer}>
      <BlastSubmissionHeader
        submission={blastSubmission}
        isAnyJobRunning={false}
      />
      {groupedBlastResultsPerSequence}
    </div>
  );
};

export default BlastSubmissionResults;
