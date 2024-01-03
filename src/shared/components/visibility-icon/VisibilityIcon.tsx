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

import ImageButton, {
  ImageButtonStatus
} from 'src/shared/components/image-button/ImageButton';

import Eye from 'static/icons/icon_eye.svg';
import EyePartial from 'static/icons/icon_eye_slashed.svg';

import { Status } from 'src/shared/types/status';

import styles from './VisibilityIcon.module.css';

type VisibilityIconStatus =
  | Status.SELECTED
  | Status.UNSELECTED
  | Status.PARTIALLY_SELECTED;

type VisibilityIconProps = {
  status: VisibilityIconStatus;
  description?: string;
  onClick: () => void;
};

export const VisibilityIcon = (props: VisibilityIconProps) => {
  const { status } = props;
  const isPartiallySelected = status === Status.PARTIALLY_SELECTED;
  const imageButtonStatus = isPartiallySelected
    ? Status.DEFAULT
    : (status as ImageButtonStatus);
  const eyeIcon = isPartiallySelected ? EyePartial : Eye;

  const elementClasses = classNames(styles.visibilityIcon, {
    [styles.visibilityIconPartiallySelected]: isPartiallySelected
  });

  return (
    <ImageButton
      status={imageButtonStatus}
      image={eyeIcon}
      description={props.description}
      className={elementClasses}
      onClick={props.onClick}
    />
  );
};

export default VisibilityIcon;
