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

import classNames from 'classnames';
import type { DetailedHTMLProps, ButtonHTMLAttributes } from 'react';

import styles from './TabButton.module.css';

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  pressed: boolean;
};

/**
 * This component will likely only be used for navigation.
 * In contrast to our regular buttons, which are immediately released,
 * this one stays pressed when clicked.
 */

const TabButton = (props: Props) => {
  const {
    pressed,
    disabled,
    className: classNameFromProps,
    ...otherProps
  } = props;

  const buttonClasses = classNames(
    styles.button,
    {
      [styles.pressed]: pressed
    },
    classNameFromProps
  );

  return (
    <button
      className={buttonClasses}
      disabled={pressed || disabled}
      {...otherProps}
    />
  );
};

export default TabButton;
