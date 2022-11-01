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

import { areSubmissionResultsAvailable } from 'src/content/app/tools/blast/utils/blastResultsAvailability';

import { getBlastSubmissionById } from 'src/content/app/tools/blast/state/blast-results/blastResultsSelectors';

import { useFetchAllBlastJobsQuery } from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';
import {
  markBlastSubmissionAsSeen,
  type BlastSubmission,
  type BlastJobWithResults
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';
import { setBlastView } from 'src/content/app/tools/blast/state/general/blastGeneralSlice';

import ToolsTopBar from 'src/content/app/tools/shared/components/tools-top-bar/ToolsTopBar';
import BlastAppBar from 'src/content/app/tools/blast/components/blast-app-bar/BlastAppBar';
import BlastViewsNavigation from 'src/content/app/tools/blast/components/blast-views-navigation/BlastViewsNavigation';
import BlastSubmissionHeader from 'src/content/app/tools/blast/components/blast-submission-header/BlastSubmissionHeader';
import BlastResultsPerSequence from './components/blast-results-per-sequence/BlastResultsPerSequence';
import MissingBlastSubmissionError from './components/missing-blast-submission-error/MissingBlastSubmissionError';
import { CircleLoader } from 'src/shared/components/loader';

import type { BlastJobResultResponse } from 'src/content/app/tools/blast/types/blastJob';

import styles from './BlastSubmissionResults.scss';

const BlastSubmissionResults = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setBlastView('submission-results'));
  }, []);

  return (
    <div>
      <BlastAppBar />
      <ToolsTopBar>
        <BlastViewsNavigation />
      </ToolsTopBar>
      <Main />
    </div>
  );
};

const Main = () => {
  const { submissionId } = useParams() as { submissionId: string };
  // Since reading from IndexedDB is asynchronous; it is conceivable that blastSubmission may be null/undefined
  const blastSubmission = useAppSelector((state) =>
    getBlastSubmissionById(state, submissionId)
  );
  const dispatch = useAppDispatch();

  const blastSubmissionJobIds =
    blastSubmission?.results.map((job) => job.jobId) || [];
  const {
    currentData: allBlastJobResults,
    isLoading,
    error
  } = useFetchAllBlastJobsQuery(blastSubmissionJobIds, {
    skip: !blastSubmissionJobIds.length
  });

  useEffect(() => {
    if (blastSubmission && !blastSubmission.seen) {
      dispatch(markBlastSubmissionAsSeen(blastSubmission.id));
    }
  }, [blastSubmission?.id]);

  if (!blastSubmission) {
    return (
      <MissingBlastSubmissionError
        submissionId={submissionId}
        hasSubmissionParameters={false}
      />
    );
  } else if (!areSubmissionResultsAvailable(blastSubmission)) {
    return (
      <MissingBlastSubmissionError
        submissionId={submissionId}
        hasSubmissionParameters={true}
      />
    );
  } else if (isLoading) {
    return <LoadingView submission={blastSubmission} />;
  } else if (error) {
    // TODO: replace this with a proper error component when it is designed
    return (
      <div>An error occurred while loading data for this BLAST submission</div>
    );
  }

  const allJobResultsWithData = blastSubmission.results
    .map((job, index) => {
      const blastJobResult = allBlastJobResults?.[index].result;
      if (!blastJobResult) {
        // shouldn't happen if the api behaves correctly
        return job;
      } else {
        return {
          ...job,
          data: (allBlastJobResults as BlastJobResultResponse[])[index].result
        };
      }
    })
    .filter((job) => !!job.data) as BlastJobWithResults[]; // only care about BLAST jobs that have the results from the server; they all should do if the apis behave properly

  const { submittedData } = blastSubmission;
  const resultsGroupedBySequence = submittedData.sequences.map((sequence) => {
    const blastResults = allJobResultsWithData.filter(
      (r) => r.sequenceId === sequence.id
    );
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
        submission={blastSubmission}
        blastResults={data.blastResults}
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

const LoadingView = (props: { submission: BlastSubmission }) => {
  return (
    <div className={styles.blastSubmissionResultsContainer}>
      <BlastSubmissionHeader
        submission={props.submission}
        isAnyJobRunning={
          true
        } /* this will disable control buttons of the header */
      />
      <div className={styles.loaderContainer}>
        <CircleLoader />
      </div>
    </div>
  );
};

export default BlastSubmissionResults;
