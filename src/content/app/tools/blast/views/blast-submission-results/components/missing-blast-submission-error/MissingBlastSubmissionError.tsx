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

import { useAppSelector } from 'src/store';
import * as urlFor from 'src/shared/helpers/urlHelper';

import { getUnviewedBlastSubmissions } from 'src/content/app/tools/blast/state/blast-results/blastResultsSelectors';

import AlertButton from 'src/shared/components/alert-button/AlertButton';
import ButtonLink from 'src/shared/components/button-link/ButtonLink';

import styles from './MissingBlastSubmissionError.scss';

type Props = {
  submissionId: string;
  hasSubmissionParameters: boolean;
};

const MissingBlastSubmissionError = (props: Props) => {
  const { submissionId, hasSubmissionParameters } = props;
  const unviewedBlastSubmissions = useAppSelector(getUnviewedBlastSubmissions);
  const hasUnviewedBlastSubmissions = unviewedBlastSubmissions.length > 0;

  const buttonLink = hasUnviewedBlastSubmissions
    ? urlFor.blastUnviewedSubmissions()
    : urlFor.blastSubmissionsList();

  const errorText = hasSubmissionParameters
    ? 'The results for this submission are no longer available'
    : `There are no results for the BLAST submission with an id ${submissionId}`;

  return (
    <div className={styles.container}>
      <AlertButton />
      <div>
        <p className={styles.errorText}>{errorText}</p>
        {hasSubmissionParameters && (
          <p>It may be possible to rerun this submission from your Jobs list</p>
        )}
      </div>
      <ButtonLink to={buttonLink}>Continue</ButtonLink>
    </div>
  );
};

export default MissingBlastSubmissionError;
