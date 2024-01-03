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

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import defaultStyles from './RoundButton.module.css';

export enum RoundButtonStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISABLED = 'disabled'
}

type Props = {
  onClick: () => void;
  status?: RoundButtonStatus;
  classNames?: { [key in RoundButtonStatus]?: string };
  children: ReactNode;
};

const RoundButton = (props: Props) => {
  const { status: buttonStatus = RoundButtonStatus.INACTIVE } = props;
  const handleClick = () => {
    if (buttonStatus !== RoundButtonStatus.DISABLED) {
      props.onClick();
    }
  };

  const styles = props.classNames
    ? { ...defaultStyles, ...props.classNames }
    : defaultStyles;

  const className = classNames(defaultStyles.default, styles[buttonStatus]);

  return (
    <button className={className} onClick={handleClick}>
      {props.children}
    </button>
  );
};

export default RoundButton;
