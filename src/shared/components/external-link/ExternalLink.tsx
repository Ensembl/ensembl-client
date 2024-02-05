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

import React, { type ReactNode } from 'react';
import classNames from 'classnames';

import LinkIcon from 'static/icons/icon_xlink.svg';

import styles from './ExternalLink.module.css';

export type ExternalLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

const ExternalLink = (props: ExternalLinkProps) => {
  const componentClasses = classNames(styles.container, props.className);

  return (
    <span className={componentClasses}>
      <LinkIcon className={styles.icon} />
      <a
        className={styles.link}
        href={props.to}
        target="_blank"
        rel="nofollow noreferrer"
        onClick={props.onClick}
      >
        {props.children}
      </a>
    </span>
  );
};

export default ExternalLink;
