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

import React, { type SVGProps } from 'react';
import classNames from 'classnames';

import ChevronDown from 'static/icons/icon_chevron.svg';

import styles from './Chevron.module.css';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type Props = SVGProps<SVGSVGElement> & {
  direction: Direction;
  animate?: boolean;
};

const Chevron = (props: Props) => {
  const {
    direction,
    animate,
    className: classNameFromProps,
    ...otherProps
  } = props;
  const isNonDefaultDirection = direction !== 'down';

  const chevronClasses = classNames(
    styles.chevron,
    { [styles[`chevron_${direction}`]]: isNonDefaultDirection },
    { [styles.chevron_animated]: animate },
    classNameFromProps
  );
  return <ChevronDown className={chevronClasses} {...otherProps} />;
};

export default Chevron;
