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

import React, { type ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

import Chevron, { type Direction } from '../chevron/Chevron';

import styles from './ChevronButton.scss';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  direction: Direction;
  animate?: boolean;
};

const ChevronButton = (props: Props) => {
  const {
    className,
    direction = 'down',
    animate = true,
    disabled,
    ...buttonProps
  } = props;

  const buttonClasses = classNames(
    styles.button,
    { [styles.chevronButtonDisabled]: disabled },
    className
  );

  return (
    <button className={buttonClasses} disabled={disabled} {...buttonProps}>
      <Chevron direction={direction} animate={animate} />
    </button>
  );
};

export default ChevronButton;
