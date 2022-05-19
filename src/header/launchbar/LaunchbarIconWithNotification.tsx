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
import classNames from 'classnames';

import LaunchbarButton, { LaunchbarButtonProps } from './LaunchbarButton';

import { JobStatus } from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

import styles from './Launchbar.scss';

type LaunchbarButtonWithNotificationProps = {
  buttonConfig: LaunchbarButtonProps;
  notificationConfig: {
    jobStatus: JobStatus;
    shouldShowNotification: boolean;
  };
};

const LaunchbarButtonWithNotification = (
  props: LaunchbarButtonWithNotificationProps
) => {
  const { jobStatus, shouldShowNotification } = props.notificationConfig;

  const getStatusClass = () =>
    classNames(
      styles.jobStatus,
      jobStatus === 'RUNNING'
        ? styles.jobStatusRunning
        : styles.jobStatusFinished
    );

  const WrappedIcon = () => {
    const { icon: ToolsIcon } = props.buttonConfig;

    return (
      <div className={styles.toolsIconWrapper}>
        <ToolsIcon />
        {shouldShowNotification && <div className={getStatusClass()}></div>}
      </div>
    );
  };

  return <LaunchbarButton {...props.buttonConfig} icon={WrappedIcon} />;
};

export default LaunchbarButtonWithNotification;
