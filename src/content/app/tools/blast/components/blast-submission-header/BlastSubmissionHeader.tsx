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
import { areSubmissionResultsAvailable } from 'src/content/app/tools/blast/utils/blastResultsAvailability';
import downloadBlastSubmission from 'src/content/app/tools/blast/blast-download/submissionDownload';

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
import QuestionButton from 'src/shared/components/question-button/QuestionButton';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import DeletionConfirmation from 'src/shared/components/deletion-confirmation/DeletionConfirmation';

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

  const [isInDeleteMode, setIsInDeleteMode] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const unviewedBlastSubmissions = useAppSelector(getUnviewedBlastSubmissions);
  const viewedBlastSubmissions = useAppSelector(getViewedBlastSubmissions);
  const blastView = useAppSelector(getBlastView);

  const blastProgram =
    submission.submittedData.parameters.program.toUpperCase();
  const submissionId = submission.id;
  const submissionName = submission.submittedData.submissionName;
  const submissionTime = getFormattedDateTime(new Date(submission.submittedAt));

  const editSubmission = () => {
    const { sequences, species, preset, parameters } = submission.submittedData;
    const parsedSequences = sequences.flatMap((sequence) =>
      parseBlastInput(sequence.value)
    );
    const { program, stype, ...otherParameters } = parameters;

    const payload = {
      sequences: parsedSequences,
      selectedSpecies: species,
      settings: {
        submissionName,
        sequenceType: stype,
        program: program as BlastProgram,
        preset,
        parameters: otherParameters
      }
    };
    dispatch(fillBlastForm(payload));
    navigate(urlFor.blastForm());
  };

  const handleDeletion = () => {
    dispatch(deleteBlastSubmission(submissionId));

    //if nothing more is left on the page after the submission is deleted, go to the new BLAST form (This might change depending on UX)
    if (
      blastView === 'submission-results' ||
      (blastView === 'unviewed-submissions' &&
        unviewedBlastSubmissions.length === 1) ||
      (blastView === 'submissions-list' && viewedBlastSubmissions.length === 1)
    ) {
      navigate(urlFor.blastForm());
    }
  };

  const handleDownload = async () => {
    await downloadBlastSubmission(submission, dispatch);
  };

  return (
    <>
      <div className={styles.grid}>
        <div>{blastProgram}</div>
        {submissionName && (
          <div className={styles.submissionName}>
            <span className={styles.submissionIdLabel}>Submission name</span>
            {submissionName}
          </div>
        )}
        <div className={styles.submissionDetails}>
          <span className={styles.submissionNameLabel}>Submission</span>
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
              onClick={() => props.toggleExpanded?.(!props.isExpanded)}
            />
          )}
        </div>
        <ControlsSection
          submission={submission}
          isAnyJobRunning={Boolean(props.isAnyJobRunning)}
          isInDeleteMode={isInDeleteMode}
          onDelete={() => setIsInDeleteMode(true)}
          onDownload={handleDownload}
        />
      </div>
      {isInDeleteMode && (
        <DeletionConfirmation
          warningText="Delete this submission?"
          confirmText="Delete"
          cancelText="Do not delete"
          className={styles.deleteMessageContainer}
          onCancel={() => setIsInDeleteMode(false)}
          onConfirm={handleDeletion}
          alignContent="right"
        />
      )}
    </>
  );
};

const ControlsSection = (props: {
  submission: BlastSubmission;
  isAnyJobRunning: boolean;
  isInDeleteMode: boolean;
  onDelete: () => void;
  onDownload: () => unknown;
}) => {
  const { submission, isAnyJobRunning, isInDeleteMode, onDelete, onDownload } =
    props;
  const isExpiredSubmission = areSubmissionResultsAvailable(submission);

  return !isExpiredSubmission ? (
    <div className={styles.controlsSection}>
      <DeleteButton onClick={onDelete} disabled={isInDeleteMode} />
      <DownloadButton
        onClick={onDownload}
        disabled={isAnyJobRunning || isInDeleteMode}
      />
      <ButtonLink
        to={urlFor.blastSubmission(submission.id)}
        isDisabled={isAnyJobRunning || isInDeleteMode}
      >
        Results
      </ButtonLink>
    </div>
  ) : (
    <div className={styles.controlsSection}>
      <DeleteButton onClick={onDelete} disabled={isInDeleteMode} />
      <div className={styles.unavailableResultsMessage}>
        <span>Results no longer available</span>
        <QuestionButton helpText={<UnavailableResultsHelpText />} />
      </div>
    </div>
  );
};

const UnavailableResultsHelpText = () => (
  <>
    <p>Results are stored for 7 days from submission</p>
    <p>
      Use 'Edit/rerun' to start a new job with the same configuration as the
      original submission
    </p>
    <p>
      Configurations are stored for 28 days after submission, then removed from
      the jobs list
    </p>
  </>
);

export default BlastSubmissionHeader;
