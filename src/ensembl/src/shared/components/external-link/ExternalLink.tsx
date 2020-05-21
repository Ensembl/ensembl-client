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

import { ReactComponent as LinkIcon } from 'static/img/shared/external-link.svg';

import styles from './ExternalLink.scss';

export type ExternalLinkProps = {
  to: string;
  linkText: string;
  classNames?: {
    label?: string;
    icon?: string;
    link?: string;
  };
};

const ExternalLink = (props: ExternalLinkProps) => {
  const iconClass = classNames(styles.defaultIcon, props.classNames?.icon);

  const linkClass = classNames(styles.defaultLink, props.classNames?.link);

  return (
    <span className={styles.linkContainer}>
      <LinkIcon className={iconClass} />
      <a className={linkClass} href={props.to}>
        {props.linkText}
      </a>
    </span>
  );
};

export default ExternalLink;
