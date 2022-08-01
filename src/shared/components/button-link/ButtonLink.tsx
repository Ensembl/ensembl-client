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
  matchDescendantPaths?: boolean; // see explanation below; this is something we are unlikely to want
  children: ReactNode;
};

/**
 * The `matchDescendantPaths` in `ButtonLink`'s props determines
 * whether the `end` prop will be added to NavLink.
 *
 * According to ReactRouter documentation, the `end` prop
 * ensures that NavLink doesn't get marked as "active"
 * when its descendant paths are matched. For example,
 * <NavLink to="/" end>Home</NavLink> will only be active at the website root,
 * and not at any other url that starts with "/".
 */

const ButtonLink = (props: Props) => {
  const {
    className,
    isDisabled,
    matchDescendantPaths = false,
    children,
    ...otherProps
  } = props;

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
      end={!matchDescendantPaths}
    >
      {children}
    </NavLink>
  );
};

export default ButtonLink;
