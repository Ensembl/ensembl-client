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

import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import { useAppDispatch, useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { getFormattedDateTime } from 'src/shared/helpers/formatters/dateFormatter';
import { parseBlastInput } from 'src/content/app/tools/blast/utils/blastInputParser';

import { fillBlastForm } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import {
  deleteBlastSubmission,
  type BlastSubmission
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';
import {
  getUnviewedBlastSubmissions,
  getViewedBlastSubmissions
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSelectors';
import { getBlastView } from 'src/content/app/tools/blast/state/general/blastGeneralSelectors';

import ButtonLink from 'src/shared/components/button-link/ButtonLink';
import DeleteButton from 'src/shared/components/delete-button/DeleteButton';
import DownloadButton from 'src/shared/components/download-button/DownloadButton';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import { PrimaryButton } from 'src/shared/components/button/Button';

import type { BlastProgram } from 'src/content/app/tools/blast/types/blastSettings';

import styles from './BlastSubmissionHeader.scss';

export type Props = {
  submission: BlastSubmission;
  isAnyJobRunning?: boolean;
  isExpanded?: boolean;
  toggleExpanded?: (isExpanded: boolean) => void;
  sequenceCount?: number;
};

export const BlastSubmissionHeader = (props: Props) => {
  const { submission, sequenceCount } = props;

  const [deletingJob, setDeletingJob] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const unviewedBlastSubmissions = useAppSelector(getUnviewedBlastSubmissions);
  const viewedBlastSubmissions = useAppSelector(getViewedBlastSubmissions);
  const blastView = useAppSelector(getBlastView);

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

    //redirect to new job form/view if deleting on one submission/job result or it is the last submissions/job in either unviewed jobs and job lists
    if (
      blastView === 'submission-results' ||
      (blastView === 'unviewed-submissions' &&
        unviewedBlastSubmissions.length === 1) ||
      (blastView === 'submissions-list' && viewedBlastSubmissions.length === 1)
    ) {
      navigate(urlFor.blastForm());
    }
  };

  return (
    <div className={styles.grid}>
      <div>{blastProgram}</div>
      <div className={styles.submissionName}>
        {/* placeholder for submission name */}
      </div>
      <div className={styles.submissionDetails}>
        <span className={styles.submissionIdLabel}>Submission</span>
        <span>{submissionId}</span>
        <span className={styles.editSubmission} onClick={editSubmission}>
          Edit/rerun
        </span>
        <span className={styles.timeStamp}>
          <span>{submissionTime}</span>
          <span className={styles.timeZone}>GMT</span>
        </span>
        {sequenceCount && sequenceCount > 1 && (
          <ShowHide
            className={styles.showHide}
            isExpanded={props.isExpanded || false}
            onClick={() =>
              props.toggleExpanded && props.toggleExpanded(!props.isExpanded)
            }
          />
        )}
      </div>
      {!deletingJob ? (
        <div className={styles.controlButtons}>
          <DeleteButton
            onClick={() => setDeletingJob(true)}
            disabled={props.isAnyJobRunning}
          />
          <DownloadButton disabled={true} />
          <ButtonLink
            to={urlFor.blastSubmission(submissionId)}
            isDisabled={props.isAnyJobRunning}
          >
            Results
          </ButtonLink>
        </div>
      ) : (
        <div className={styles.deleteMessageContainer}>
          <span className={styles.deleteMessage}>Delete this submission</span>
          <PrimaryButton onClick={handleDeletion}>Delete</PrimaryButton>
          <span
            className={styles.clickable}
            onClick={() => {
              setDeletingJob(false);
            }}
          >
            Do not delete
          </span>
        </div>
      )}
    </div>
  );
};

export default BlastSubmissionHeader;
