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

import { useAppSelector } from 'src/store';
import * as urlFor from 'src/shared/helpers/urlHelper';

import {
  getViewedVepSubmissions,
  getUnviewedVepSubmissions
} from 'src/content/app/tools/vep/state/vep-submissions/vepSubmissionsSelectors';

import AlertButton from 'src/shared/components/alert-button/AlertButton';
import ButtonLink from 'src/shared/components/button-link/ButtonLink';

import styles from './VepSubmissionError.module.css';

type ErrorType = 'expired-submission' | 'missing-submission' | 'generic-error';

type Props = {
  type: ErrorType;
};

const VepSubmissionError = (props: Props) => {
  const viewedVepSubmissions = useAppSelector(getViewedVepSubmissions);
  const unviewedVepSubmissions = useAppSelector(getUnviewedVepSubmissions);
  const hasUnviewedVepSubmissions = unviewedVepSubmissions.length > 0;
  const hasViewedVepSubmissions = viewedVepSubmissions.length > 0;

  let buttonLink: string;

  if (hasUnviewedVepSubmissions) {
    buttonLink = urlFor.vepUnviewedSubmissionsList();
  } else if (hasViewedVepSubmissions) {
    buttonLink = urlFor.vepSubmissionsList();
  } else {
    buttonLink = urlFor.vepForm();
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

const ErrorMessage = (props: Props) => {
  if (props.type === 'expired-submission') {
    return <ExpiredSubmissionMessage />;
  } else if (props.type === 'missing-submission') {
    return <MissingSubmissionMessage />;
  } else {
    return <GenericErrorMessage />;
  }
};

const ExpiredSubmissionMessage = () => {
  return (
    <>
      <p className={styles.errorText}>
        The results for this submission are no longer available
      </p>
      <p>It may be possible to rerun this submission from your Jobs list</p>
    </>
  );
};

const MissingSubmissionMessage = () => {
  return (
    <>
      <p className={styles.errorText}>
        There are no results for this VEP submission
      </p>
      <p>
        Any valid submissions can be found in your Unviewed jobs and Jobs lists
      </p>
    </>
  );
};

const GenericErrorMessage = () => {
  return (
    <p className={styles.errorText}>Unable to display results at this time</p>
  );
};

export default VepSubmissionError;
