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
import { NavLink, NavLinkProps } from 'react-router-dom';
import classNames from 'classnames';

import styles from './ButtonLink.scss';

/**
 * This is a link that looks like a button.
 * Using React-Router's Link component
 */

type Props = Omit<NavLinkProps, 'children'> & {
  isDisabled?: boolean;
  children: ReactNode;
};

const ButtonLink = (props: Props) => {
  const { className, isDisabled, children, ...otherProps } = props;

  const inactiveLinkClasses = classNames(
    styles.buttonLink,
    { [styles.buttonLinkDisabled]: isDisabled },
    className
  );

  const activeLinkClasses = classNames(
    styles.buttonLink,
    styles.buttonLinkActive,
    className
  );

  return isDisabled ? (
    <span className={inactiveLinkClasses}>{children}</span>
  ) : (
    <NavLink
      {...otherProps}
      className={({ isActive }) =>
        isActive ? activeLinkClasses : inactiveLinkClasses
      }
    >
      {children}
    </NavLink>
  );
};

export default ButtonLink;
