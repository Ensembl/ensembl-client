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

import { ReactComponent as ChevronDown } from 'static/icons/icon_chevron.svg';

import styles from './Chevron.scss';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type Props = {
  direction: Direction;
  animate: boolean;
  onClick?: () => void;
  classNames?: {
    wrapper?: string;
    svg?: string;
  };
};

const Chevron = (props: Props) => {
  const isNonDefaultDirection = props.direction !== 'down';
  const chevronClasses = classNames(
    styles.chevron,
    { [styles[`chevron_${props.direction}`]]: isNonDefaultDirection },
    { [styles.chevron_animated]: props.animate },
    props.classNames?.svg
  );

  const Wrapper = props.onClick
    ? 'button'
    : props.classNames?.wrapper
    ? 'span'
    : React.Fragment;

  const wrapperProps =
    Wrapper === React.Fragment
      ? {}
      : {
          onClick: props.onClick,
          className: props.classNames?.wrapper
        };

  return (
    <Wrapper {...wrapperProps}>
      <ChevronDown className={chevronClasses} />
    </Wrapper>
  );
};

Chevron.defaultProps = {
  animate: false
};

export default Chevron;
