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

import { useAppDispatch } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { getFormattedDateTime } from 'src/shared/helpers/formatters/dateFormatter';
import { parseBlastInput } from 'src/content/app/tools/blast/utils/blastInputParser';

import { fillBlastForm } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import {
  deleteBlastSubmission,
  type BlastSubmission
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

import ButtonLink from 'src/shared/components/button-link/ButtonLink';
import DeleteButton from 'src/shared/components/delete-button/DeleteButton';
import DownloadButton from 'src/shared/components/download-button/DownloadButton';

import type { BlastProgram } from 'src/content/app/tools/blast/types/blastSettings';

import styles from './BlastSubmissionHeader.scss';
import ShowHide from 'src/shared/components/show-hide/ShowHide';

export type Props = {
  submission: BlastSubmission;
  isAnyJobRunning?: boolean;
  isExpanded?: boolean;
  toggleExpanded?: (isExpanded: boolean) => void;
  sequenceCount?: number;
};

export const BlastSubmissionHeader = (props: Props) => {
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
      <div className={styles.controlButtons}>
        <DeleteButton
          onClick={handleDeletion}
          className={props.isAnyJobRunning ? styles.inactiveButton : ''}
        />
        <DownloadButton className={styles.inactiveButton} />
        <ButtonLink
          to={urlFor.blastSubmission(submissionId)}
          isDisabled={props.isAnyJobRunning}
        >
          Results
        </ButtonLink>
      </div>
    </div>
  );
};

export default BlastSubmissionHeader;
