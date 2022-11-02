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

import {
  getViewedBlastSubmissions,
  getUnviewedBlastSubmissions
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSelectors';

import AlertButton from 'src/shared/components/alert-button/AlertButton';
import ButtonLink from 'src/shared/components/button-link/ButtonLink';

import styles from './MissingBlastSubmissionError.scss';

type Props = {
  hasSubmissionParameters: boolean;
};

const MissingBlastSubmissionError = (props: Props) => {
  const viewedBlastSubmissions = useAppSelector(getViewedBlastSubmissions);
  const unviewedBlastSubmissions = useAppSelector(getUnviewedBlastSubmissions);
  const hasUnviewedBlastSubmissions = unviewedBlastSubmissions.length > 0;
  const hasViewedBlastSubmissions = viewedBlastSubmissions.length > 0;

  let buttonLink: string;

  if (hasUnviewedBlastSubmissions) {
    buttonLink = urlFor.blastUnviewedSubmissions();
  } else if (hasViewedBlastSubmissions) {
    buttonLink = urlFor.blastSubmissionsList();
  } else {
    buttonLink = urlFor.blastForm();
  }

  return (
    <div className={styles.container}>
      <AlertButton />
      <div>
        <ErrorMessage {...props} />
      </div>
      <ButtonLink to={buttonLink}>Continue</ButtonLink>
    </div>
  );
};

const ErrorMessage = (props: { hasSubmissionParameters: boolean }) => {
  return props.hasSubmissionParameters ? (
    <>
      <p className={styles.errorText}>
        The results for this submission are no longer available
      </p>
      <p>It may be possible to rerun this submission from your Jobs list</p>
    </>
  ) : (
    <>
      <p className={styles.errorText}>
        There are no results for this BLAST submission
      </p>
      <p>
        Any valid submissions can be found in your Unviewed jobs and Jobs lists
      </p>
    </>
  );
};

export default MissingBlastSubmissionError;
