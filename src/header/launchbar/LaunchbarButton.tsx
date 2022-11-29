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

import React, { useMemo, type FunctionComponent } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import classNames from 'classnames';

import useHeaderAnalytics from '../hooks/useHeaderAnalytics';

import ImageButton, {
  ImageButtonStatus
} from 'src/shared/components/image-button/ImageButton';

import { Status } from 'src/shared/types/status';

import styles from './Launchbar.scss';

export type LaunchbarButtonProps = {
  path: string;
  description: string;
  icon: FunctionComponent<unknown> | string;
  enabled: boolean;
  isActive?: boolean;
};

const LaunchbarButton: FunctionComponent<LaunchbarButtonProps> = (
  props: LaunchbarButtonProps
) => {
  const location = useLocation();

  const { trackLaunchbarAppChange } = useHeaderAnalytics();
  const isActive =
    'isActive' in props
      ? (props.isActive as boolean)
      : new RegExp(`^${props.path}`).test(location.pathname);
  const imageButtonStatus = getImageButtonStatus({
    isDisabled: !props.enabled,
    isActive
  });

  const imageButton = useMemo(
    () => (
      <ImageButton
        className={styles.launchbarButton}
        status={imageButtonStatus}
        description={props.description}
        image={props.icon}
      />
    ),
    [props.icon, props.description, imageButtonStatus]
  );

  const activeButtonClass = classNames(
    styles.launchbarButton,
    styles.launchbarButtonSelected
  );

  return props.enabled ? (
    <NavLink
      className={({ isActive }) =>
        isActive ? activeButtonClass : styles.launchbarButton
      }
      to={props.path}
      onClick={() => trackLaunchbarAppChange(props.description)}
    >
      {imageButton}
    </NavLink>
  ) : (
    imageButton
  );
};

const getImageButtonStatus = ({
  isDisabled,
  isActive
}: {
  isDisabled: boolean;
  isActive: boolean;
}): ImageButtonStatus => {
  if (isDisabled) {
    return Status.DISABLED;
  } else if (isActive) {
    return Status.SELECTED;
  } else {
    return Status.UNSELECTED;
  }
};

export default LaunchbarButton;
