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

import { useMemo } from 'react';
import classNames from 'classnames';

import LaunchbarButton, { LaunchbarButtonProps } from './LaunchbarButton';

import styles from './Launchbar.module.css';

type Notification = 'red' | 'green';

type LaunchbarButtonWithNotificationProps = LaunchbarButtonProps & {
  notification: Notification | null;
};

const LaunchbarButtonWithNotification = (
  props: LaunchbarButtonWithNotificationProps
) => {
  const notificationClasses = classNames(styles.notification, {
    [styles.notificationRed]: props.notification === 'red',
    [styles.notificationGreen]: props.notification === 'green'
  });

  const WrappedIcon = useMemo(
    () => () => {
      const { icon: Icon } = props;

      return (
        <div className={styles.toolsIconWrapper}>
          <Icon />
          {props.notification && <div className={notificationClasses}></div>}
        </div>
      );
    },
    [notificationClasses]
  );

  return <LaunchbarButton {...props} icon={WrappedIcon} />;
};

export default LaunchbarButtonWithNotification;
