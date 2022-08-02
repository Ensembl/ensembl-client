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
import { useNavigate } from 'react-router';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { getFormattedDateTime } from 'src/shared/helpers/formatters/dateFormatter';
import { parseBlastInput } from 'src/content/app/tools/blast/utils/blastInputParser';
import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';
import { fillBlastForm } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import {
  deleteBlastSubmission,
  type BlastSubmission,
  type BlastJob,
  updateSubmissionUi
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';
import { getBlastSubmissionsUi } from '../../state/blast-results/blastResultsSelectors';

import BlastSubmissionHeaderGrid from 'src/content/app/tools/blast/components/blast-submission-header-container/BlastSubmissionHeaderGrid';
import ButtonLink from 'src/shared/components/button-link/ButtonLink';
import DeleteButton from 'src/shared/components/delete-button/DeleteButton';
import DownloadButton from 'src/shared/components/download-button/DownloadButton';
import ShowHide from 'src/shared/components/show-hide/ShowHide';

import type { BlastProgram } from 'src/content/app/tools/blast/types/blastSettings';

import styles from './ListedBlastSubmission.scss';

export type Props = {
  submission: BlastSubmission;
};

const ListedBlastSubmission = (props: Props) => {
  const { submission } = props;
  const dispatch = useAppDispatch();
  const uiState = useAppSelector(getBlastSubmissionsUi);

  const sequences = submission.submittedData.sequences;
  const allJobs = submission.results;
  const isAnyJobRunning = allJobs.some((job) => job.status === 'RUNNING');
  const { expandedSubmissionIds } = uiState.unviewedJobsPage;

  const isCurrentSubmissionExpanded = expandedSubmissionIds.includes(
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
  if (isCurrentSubmissionExpanded || sequences.length === 1) {
    sequenceContent = jobsGroupedBySequence.map(({ sequence, jobs }) => (
      <SequenceBox key={sequence.id} sequence={sequence} jobs={jobs} />
    ));
  } else {
    sequenceContent = <CollapsedSequencesBox submission={submission} />;
  }

  const toggleExpanded = (status: boolean) => {
    const newExpandedSubmissionIds = status
      ? [...expandedSubmissionIds, submission.id]
      : expandedSubmissionIds.filter((id) => id !== submission.id);

    dispatch(
      updateSubmissionUi({
        fragment: {
          unviewedJobsPage: {
            expandedSubmissionIds: newExpandedSubmissionIds
          }
        }
      })
    );
  };

  return (
    <div className={styles.listedBlastSubmission}>
      <Header
        {...props}
        isAnyJobRunning={isAnyJobRunning}
        toggleExpanded={toggleExpanded}
        isExpanded={isCurrentSubmissionExpanded}
        sequenceCount={sequences.length}
      />
      {sequenceContent}
    </div>
  );
};

const CollapsedSequencesBox = (props: Props) => {
  const { submission } = props;
  const sequences = submission.submittedData.sequences;
  const allJobs = submission.results;

  const sequenceCount = sequences.length;
  const totalSpecies = submission.submittedData.species.length;

  return (
    <div className={styles.sequenceBox}>
      <div>{`${sequenceCount} ${pluralise('sequence', sequenceCount)}`}</div>
      <div>
        <span className={styles.againstText}>Against</span> {totalSpecies}{' '}
        species
      </div>
      <StatusElement jobs={allJobs} />
    </div>
  );
};

const Header = (
  props: Props & {
    isAnyJobRunning: boolean;
    isExpanded: boolean;
    toggleExpanded: (isExpanded: boolean) => void;
    sequenceCount: number;
  }
) => {
  const { submission, sequenceCount } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const blastProgram =
    submission.submittedData.parameters.program.toUpperCase();
  const submissionId = submission.id;
  const submissionTime = getFormattedDateTime(new Date(submission.submittedAt));

  const editSubmission = () => {
    const { sequences, species, parameters } = submission.submittedData;
    const parsedSequences = sequences.flatMap((sequence) =>
      parseBlastInput(sequence.value)
    );
    const { title, program, stype, ...otherParameters } = parameters;

    const payload = {
      sequences: parsedSequences,
      selectedSpecies: species,
      settings: {
        jobName: title,
        sequenceType: stype,
        program: program as BlastProgram,
        parameters: otherParameters
      }
    };
    dispatch(fillBlastForm(payload));
    navigate(urlFor.blastForm());
  };

  const handleDeletion = () => {
    dispatch(deleteBlastSubmission(submissionId));
  };

  return (
    <BlastSubmissionHeaderGrid>
      <div>{blastProgram}</div>
      <div>
        <span className={styles.submissionIdLabel}>Submission</span>
        <span>{submissionId}</span>
        <span className={styles.editSubmission} onClick={editSubmission}>
          Edit/rerun
        </span>
        <span className={styles.timeStamp}>
          <span>{submissionTime}</span>
          <span className={styles.timeZone}>GMT</span>
        </span>
        {sequenceCount > 1 && (
          <ShowHide
            className={styles.showHide}
            isExpanded={props.isExpanded}
            onClick={() => props.toggleExpanded(!props.isExpanded)}
          />
        )}
      </div>
      <div className={styles.controlButtons}>
        {!props.isAnyJobRunning && (
          <>
            <DeleteButton onClick={handleDeletion} />
            <DownloadButton className={styles.inactiveButton} />
          </>
        )}
        <ButtonLink
          to={urlFor.blastSubmission(submissionId)}
          isDisabled={props.isAnyJobRunning}
        >
          Results
        </ButtonLink>
      </div>
    </BlastSubmissionHeaderGrid>
  );
};

type SequenceBoxProps = {
  sequence: { id: number; value: string };
  jobs: BlastJob[];
};

const SequenceBox = (props: SequenceBoxProps) => {
  const { sequence, jobs } = props;

  return (
    <div className={styles.sequenceBox}>
      <div>Sequence {sequence.id}</div>
      <div>
        <span className={styles.againstText}>Against</span> {jobs.length}{' '}
        species
      </div>
      <StatusElement jobs={jobs} />
    </div>
  );
};

const StatusElement = ({ jobs }: { jobs: BlastJob[] }) => {
  const hasRunningJobs = jobs.some((job) => job.status === 'RUNNING');
  const hasFailedJobs = jobs.some((job) => job.status === 'FAILURE');

  const elementClasses = classNames(styles.jobStatus, {
    [styles.jobStatusProminent]: hasRunningJobs || hasFailedJobs
  });

  if (hasRunningJobs) {
    return <span className={elementClasses}>Running...</span>;
  } else if (hasFailedJobs) {
    if (jobs.length === 1 || jobs.every((job) => job.status === 'FAILURE')) {
      return <span className={elementClasses}>Failed</span>;
    } else {
      return <span className={elementClasses}>Some jobs failed</span>;
    }
  } else {
    return null;
  }
};

export default ListedBlastSubmission;
