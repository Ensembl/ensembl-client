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

import React, { FunctionComponent } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import classNames from 'classnames';

import ImageButton, {
  ImageButtonStatus
} from 'src/shared/components/image-button/ImageButton';

import { Status } from 'src/shared/types/status';

import styles from './Launchbar.scss';

type LaunchbarButtonProps = {
  app: string;
  description: string;
  icon: FunctionComponent<unknown> | string;
  enabled: boolean;
};

const LaunchbarButton: FunctionComponent<LaunchbarButtonProps> = (
  props: LaunchbarButtonProps
) => {
  const location = useLocation();
  const pathTo = `/${props.app}`;
  const isActive = new RegExp(`^${pathTo}`).test(location.pathname);
  const imageButtonStatus = getImageButtonStatus({
    isDisabled: !props.enabled,
    isActive
  });

  const imageButton = (
    <ImageButton
      className={props.enabled ? '' : styles.launchbarButton}
      statusClasses={{
        [Status.UNSELECTED]: styles.launchbarButtonImage,
        [Status.SELECTED]: styles.launchbarButtonSelectedImage,
        [Status.DISABLED]: styles.launchbarButtonDisabledImage
      }}
      status={imageButtonStatus}
      description={props.description}
      image={props.icon}
    />
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
      to={pathTo}
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