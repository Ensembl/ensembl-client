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

import classNames from 'classnames';
import noop from 'lodash/noop';

import { getFormattedDateTime } from 'src/shared/helpers/formatters/dateFormatter';

import TextButton from 'src/shared/components/text-button/TextButton';
import ButtonLink from 'src/shared/components/button-link/ButtonLink';
import DeleteButton from 'src/shared/components/delete-button/DeleteButton';
import DownloadButton from 'src/shared/components/download-button/DownloadButton';

import type { VepSubmission } from 'src/content/app/tools/vep/types/vepSubmission';

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
  const submissionTime = submission.submittedAt
    ? getFormattedDateTime(new Date(submission.submittedAt))
    : null;

  return (
    <div className={styles.container}>
      <div className={styles.light}>Vep analysis</div>
      <div className={styles.submissionId}>
        <span className={classNames(styles.labelLeft, styles.smallLight)}>
          Submission
        </span>
        {submission.id}
      </div>
      <div className={styles.rerun}>
        <TextButton onClick={noop}>Edit/rerun</TextButton>
      </div>
      <div className={styles.submissionDate}>
        {submissionTime} <span className={styles.timezone}>GMT</span>
      </div>
      <ControlButtons {...props} />
    </div>
  );
};

// eslint-disable-next-line  -- FIXME use the props for the buttons
const ControlButtons = (props: Props) => {
  return (
    <div className={styles.controls}>
      <DeleteButton />
      <DownloadButton onClick={noop} />
      <ButtonLink isDisabled={true} to="/">
        Results
      </ButtonLink>
    </div>
  );
};

export default VepSubmissionHeader;
