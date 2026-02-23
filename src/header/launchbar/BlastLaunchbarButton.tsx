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

import { isSuccessfulBlastSubmission } from 'src/content/app/tools/blast/utils/blastSubmisionTypeNarrowing';

import { getUnviewedBlastSubmissions } from 'src/content/app/tools/blast/state/blast-results/blastResultsSelectors';

import useLastVisitedPath from './useLastVisitedPath';

import LaunchbarButtonWithNotification from './LaunchbarButtonWithNotification';
import { BlastIcon } from 'src/shared/components/app-icon';

const BLAST_APP_ROOT_PATH = '/blast';

const BlastLaunchbarButton = () => {
  const unviewedSubmissions = useAppSelector(getUnviewedBlastSubmissions);
  const blastAppPath = useLastVisitedPath({ rootPath: BLAST_APP_ROOT_PATH });

  const getNotification = () => {
    if (unviewedSubmissions.length > 0) {
      const isAnyJobRunning =
        unviewedSubmissions.filter(
          (submission) =>
            isSuccessfulBlastSubmission(submission) &&
            submission.results.some((job) => job.status === 'RUNNING')
        ).length > 0;

      return isAnyJobRunning ? 'red' : 'green';
    } else {
      return null;
    }
  };

  return (
    <LaunchbarButtonWithNotification
      path={blastAppPath}
      description="BLAST"
      icon={BlastIcon}
      notification={getNotification()}
    />
  );
};

export default BlastLaunchbarButton;
