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

import styles from './Button.scss';

type Props = {
  onClick: () => void;
  isDisabled?: boolean;
  className?: string;
  children: ReactNode;
};

export const PrimaryButton = (props: Props) => {
  const className = classNames(
    styles.primaryButton,
    { [styles.primaryButtonDisabled]: props.isDisabled },
    props.className
  );
  return <Button {...props} className={className} />;
};

export const SecondaryButton = (props: Props) => (
  <Button
    {...props}
    className={classNames(styles.secondaryButton, props.className)}
  />
);

const Button = (props: Props) => {
  const handleClick = () => {
    if (!props.isDisabled) {
      props.onClick();
    }
  };

  return (
    <button
      className={classNames(styles.button, props.className)}
      onClick={handleClick}
      disabled={props.isDisabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
