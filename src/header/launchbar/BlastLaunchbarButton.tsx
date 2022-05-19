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

import { getUnviewedBlastSubmissions } from 'src/content/app/tools/blast/state/blast-results/blastResultsSelectors';

import LaunchbarButtonWithNotification from './LaunchbarIconWithNotification';
import { BlastIcon } from 'src/shared/components/app-icon';

import { JobStatus } from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

import styles from './Launchbar.scss';

const BlastLaunchbarButton = () => {
  const unviewedSubmissions = useAppSelector(getUnviewedBlastSubmissions);
  let isAnyJobRunning = false;

  isAnyJobRunning = unviewedSubmissions
    .flatMap((submission) =>
      submission.results.map((job) => job.status === 'RUNNING')
    )
    .some(Boolean);

  const buttonConfig = {
    path: '/blast',
    description: 'BLAST',
    icon: BlastIcon,
    enabled: true
  };

  const notificationConfig = {
    jobStatus: (isAnyJobRunning ? 'RUNNING' : 'FINISHED') as JobStatus,
    shouldShowNotification: Boolean(unviewedSubmissions.length)
  };

  return (
    <div className={styles.category}>
      <LaunchbarButtonWithNotification
        buttonConfig={buttonConfig}
        notificationConfig={notificationConfig}
      />
    </div>
  );
};

export default BlastLaunchbarButton;
