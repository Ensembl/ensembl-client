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

import { useAppDispatch, useAppSelector } from 'src/store';

import { isSuccessfulBlastSubmission } from 'src/content/app/tools/blast/utils/blastSubmisionTypeNarrowing';

import BlastSubmissionHeader from '../blast-submission-header/BlastSubmissionHeader';

import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';

import { getBlastSubmissionsUi } from 'src/content/app/tools/blast/state/blast-results/blastResultsSelectors';

import type { SubmittedSequence } from 'src/content/app/tools/blast/types/blastSequence';
import {
  type BlastSubmission,
  type BlastJob,
  updateSubmissionUi
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

import styles from './ListedBlastSubmission.module.css';

export type Props = {
  submission: BlastSubmission;
};

const ListedBlastSubmission = (props: Props) => {
  const { submission } = props;
  const dispatch = useAppDispatch();
  const uiState = useAppSelector(getBlastSubmissionsUi);

  const sequences = submission.submittedData.sequences;
  const allJobs = getBlastJobsFromSubmission(submission);
  const isAnyJobRunning = allJobs.some((job) => job.status === 'RUNNING');
  const { collapsedSubmissionIds } = uiState.unviewedJobsPage;

  const isCurrentSubmissionCollapsed = collapsedSubmissionIds.includes(
    submission.id
  );

  const jobsGroupedBySequence = sequences.map((sequence) => {
    const jobs = allJobs.filter((job) => job.sequenceId === sequence.id);
    return {
      sequence,
      jobs
    };
  });

  let sequenceContent = null;
  if (!isCurrentSubmissionCollapsed || sequences.length === 1) {
    sequenceContent = jobsGroupedBySequence.map(({ sequence, jobs }) => (
      <SequenceBox
        key={sequence.id}
        submission={submission}
        sequence={sequence}
        jobs={jobs}
      />
    ));
  } else {
    sequenceContent = <CollapsedSequencesBox submission={submission} />;
  }

  const toggleCollapsed = (status: boolean) => {
    const newCollapsedSubmissionIds = status
      ? [...collapsedSubmissionIds, submission.id]
      : collapsedSubmissionIds.filter((id) => id !== submission.id);

    dispatch(
      updateSubmissionUi({
        fragment: {
          unviewedJobsPage: {
            collapsedSubmissionIds: newCollapsedSubmissionIds
          }
        }
      })
    );
  };

  return (
    <div className={styles.listedBlastSubmission}>
      <BlastSubmissionHeader
        {...props}
        isAnyJobRunning={isAnyJobRunning}
        toggleCollapsed={toggleCollapsed}
        isCollapsed={isCurrentSubmissionCollapsed}
        sequenceCount={sequences.length}
      />
      {sequenceContent}
    </div>
  );
};

const CollapsedSequencesBox = (props: Props) => {
  const { submission } = props;
  const sequences = submission.submittedData.sequences;
  const allJobs = getBlastJobsFromSubmission(submission);

  const sequenceCount = sequences.length;
  const totalSpecies = submission.submittedData.species.length;

  return (
    <div className={styles.sequenceBox}>
      <div>{`${sequenceCount} ${pluralise('sequence', sequenceCount)}`}</div>
      <div className={styles.speciesCount}>
        <span className={styles.againstText}>Against</span> {totalSpecies}{' '}
        species
      </div>
      {<JobStatus jobs={allJobs} />}
    </div>
  );
};

type SequenceBoxProps = {
  submission: BlastSubmission;
  sequence: SubmittedSequence;
  jobs: BlastJob[];
};

const SequenceBox = (props: SequenceBoxProps) => {
  const { submission, sequence, jobs } = props;
  const { header: sequenceHeader } = sequence;
  const sequenceHeaderLabel =
    '>' + (sequenceHeader ?? `Sequence ${sequence.id}`);
  const speciesCount = submission.submittedData.species.length;

  return (
    <div className={styles.sequenceBox}>
      <div>Sequence {sequence.id}</div>
      <div className={styles.sequenceHeader}>{sequenceHeaderLabel}</div>
      <div className={styles.speciesCount}>
        <span className={styles.againstText}>Against</span> {speciesCount}{' '}
        species
      </div>
      <div className={styles.jobStatus}>{<JobStatus jobs={jobs} />}</div>
    </div>
  );
};

type JobStatusProps = {
  jobs: BlastJob[];
};

export const JobStatus = (props: JobStatusProps) => {
  const { jobs } = props;

  const hasRunningJobs = jobs.some((job) => job.status === 'RUNNING');
  const hasAllFailedJobs = jobs.every((job) => job.status === 'FAILURE');
  const hasSomeFailedJobs = jobs.some((job) => job.status === 'FAILURE');

  if (hasRunningJobs) {
    return <span className={styles.jobStatusProminent}>Running...</span>;
  } else if (hasAllFailedJobs) {
    return <span className={styles.jobStatusProminent}>Job failed</span>;
  } else if (hasSomeFailedJobs) {
    return <span className={styles.jobStatusProminent}>Part failed</span>;
  } else {
    return null;
  }
};

const getBlastJobsFromSubmission = (submission: BlastSubmission) =>
  isSuccessfulBlastSubmission(submission) ? submission.results : [];

export default ListedBlastSubmission;
