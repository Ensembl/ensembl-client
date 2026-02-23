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

import { getUnviewedVepSubmissions } from 'src/content/app/tools/vep/state/vep-submissions/vepSubmissionsSelectors';

import useLastVisitedPath from './useLastVisitedPath';

import LaunchbarButtonWithNotification from './LaunchbarButtonWithNotification';
import { VepIcon } from 'src/shared/components/app-icon';

import type { VepSubmissionWithoutInputFile } from 'src/content/app/tools/vep/types/vepSubmission';

const VEP_APP_ROOT_PATH = '/vep';

/**
 * Similarly to BlastLaunchbarButton, this button will show a dot
 * to indicate presence of running or unviewed jobs.
 */
const VepLaunchbarButton = () => {
  const unviewedVepSubmissions = useAppSelector(getUnviewedVepSubmissions);
  const lastVisitedPath = useLastVisitedPath({ rootPath: VEP_APP_ROOT_PATH });

  const notification = getNotification(unviewedVepSubmissions);

  // TODO: add the code to enable notifications after submissions have been enabled
  return (
    <LaunchbarButtonWithNotification
      path={lastVisitedPath}
      description="VEP"
      icon={VepIcon}
      notification={notification}
    />
  );
};

const unfinishedSubmissionStatuses: VepSubmissionWithoutInputFile['status'][] =
  ['SUBMITTING', 'SUBMITTED', 'RUNNING'];

const getNotification = (submissions: VepSubmissionWithoutInputFile[]) => {
  let hasUnfinishedJobs = false;
  let hasViewableJobs = false;

  for (const submission of submissions) {
    if (unfinishedSubmissionStatuses.includes(submission.status)) {
      hasUnfinishedJobs = true;
    } else if (submission.status === 'SUCCEEDED') {
      hasViewableJobs = true;
    }
  }

  return hasUnfinishedJobs ? 'red' : hasViewableJobs ? 'green' : null;
};

export default VepLaunchbarButton;
