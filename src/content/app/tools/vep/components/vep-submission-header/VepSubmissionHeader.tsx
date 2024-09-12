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

import { useState } from 'react';
import { useNavigate } from 'react-router';
import classNames from 'classnames';

import config from 'config';
import * as urlFor from 'src/shared/helpers/urlHelper';

import { useAppDispatch } from 'src/store';

import { getFormattedDateTime } from 'src/shared/helpers/formatters/dateFormatter';

import { fillVepFormWithExistingSubmissionData } from 'src/content/app/tools/vep/state/vep-form/vepFormSlice';
import { deleteSubmission } from 'src/content/app/tools/vep/state/vep-submissions/vepSubmissionsSlice';

import {
  serverSideSubmissionStatuses,
  type VepSubmission
} from 'src/content/app/tools/vep/types/vepSubmission';

import { PrimaryButton } from 'src/shared/components/button/Button';
import TextButton from 'src/shared/components/text-button/TextButton';
import ButtonLink from 'src/shared/components/button-link/ButtonLink';
import DeleteButton from 'src/shared/components/delete-button/DeleteButton';
import DownloadLink from 'src/shared/components/download-button/DownloadLink';

import styles from './VepSubmissionHeader.module.css';

type Props = {
  submission: {
    id: VepSubmission['id'];
    submittedAt: VepSubmission['submittedAt'];
    status: VepSubmission['status'];
  };
};

const VepSubmissionHeader = (props: Props) => {
  const { submission } = props;
  const [isDeleting, setIsDeleting] = useState(false);
  const submissionTime = submission.submittedAt
    ? getFormattedDateTime(new Date(submission.submittedAt))
    : null;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleDeletionConfirmation = () => {
    setIsDeleting(!isDeleting);
  };

  const onEditSubmission = () => {
    dispatch(
      fillVepFormWithExistingSubmissionData({ submissionId: submission.id })
    );
    navigate(urlFor.vepForm());
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.light}>Vep analysis</div>
        <div className={styles.submissionId}>
          {hasServerSideSubmissionId(submission) && (
            <>
              <span className={classNames(styles.labelLeft, styles.smallLight)}>
                Submission
              </span>{' '}
              {submission.id}
            </>
          )}
        </div>
        <div className={styles.rerun}>
          <TextButton onClick={onEditSubmission}>Edit/rerun</TextButton>
        </div>
        <div className={styles.submissionDate}>
          {submissionTime} <span className={styles.timezone}>GMT</span>
        </div>
        <ControlButtons
          {...props}
          isDeleting={isDeleting}
          onDelete={toggleDeletionConfirmation}
        />
      </div>
      {isDeleting && (
        <div className={styles.deletionConfirmationContainer}>
          <DeletionConfirmation
            {...props}
            onCancel={toggleDeletionConfirmation}
          />
        </div>
      )}
    </>
  );
};

const hasServerSideSubmissionId = (submission: { status: string }) => {
  // Only submissions with a server-side status will have an id assigned by the server
  // (temporary client-side ids aren't helpful for users; so there's no point in displaying those)
  return (serverSideSubmissionStatuses as readonly string[]).includes(
    submission.status
  );
};

const ControlButtons = (
  props: Props & {
    isDeleting: boolean;
    onDelete: () => void;
  }
) => {
  const { submission, isDeleting, onDelete } = props;

  const canGetResults = submission.status === 'SUCCEEDED';
  const downloadLink = `${config.toolsApiBaseUrl}/vep/submissions/${submission.id}/download`;
  const vepResultsLink = urlFor.vepResults({
    submissionId: props.submission.id
  });

  return (
    <div className={styles.controls}>
      <DeleteButton onClick={onDelete} disabled={isDeleting} />
      <DownloadLink
        href={downloadLink}
        disabled={isDeleting || !canGetResults}
      />
      <ButtonLink isDisabled={isDeleting || !canGetResults} to={vepResultsLink}>
        Results
      </ButtonLink>
    </div>
  );
};

const DeletionConfirmation = (
  props: Props & {
    onCancel: () => void;
  }
) => {
  const { submission, onCancel } = props;
  const dispatch = useAppDispatch();

  const onDelete = () => {
    dispatch(deleteSubmission({ submissionId: submission.id }));
  };

  return (
    <div className={styles.deletionConfirmation}>
      <span className={styles.deletionConfirmationMessage}>
        Delete this submisison?
      </span>
      <PrimaryButton onClick={onDelete}>Delete</PrimaryButton>
      <TextButton onClick={onCancel}>Do not delete</TextButton>
    </div>
  );
};

export default VepSubmissionHeader;
