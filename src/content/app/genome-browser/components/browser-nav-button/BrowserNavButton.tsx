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

import React, { memo } from 'react';
import classNames from 'classnames';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import NavigateLeftIcon from 'static/icons/navigate-left.svg';
import NavigateRightIcon from 'static/icons/navigate-right.svg';
import ZoomInIcon from 'static/icons/icon_plus_circle.svg';
import ZoomOutIcon from 'static/icons/icon_minus_circle.svg';

import { Status } from 'src/shared/types/status';

import styles from './BrowserNavButton.scss';

const buttonNameToIconMap = {
  moveLeft: NavigateLeftIcon,
  moveRight: NavigateRightIcon,
  zoomIn: ZoomInIcon,
  zoomOut: ZoomOutIcon
};

export type BrowserNavButtonName = keyof typeof buttonNameToIconMap;

type Props = {
  name: BrowserNavButtonName;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

export const BrowserNavButton = (props: Props) => {
  const { name, description, disabled, className, onClick } = props;

  const buttonStatus = disabled ? Status.DISABLED : Status.DEFAULT;

  return (
    <ImageButton
      status={buttonStatus}
      description={description}
      className={classNames(styles.browserNavButton, className)}
      onClick={onClick}
      image={buttonNameToIconMap[name]}
    />
  );
};

export default memo(BrowserNavButton);
